import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket } from "socket.io";
import { parse as parseCookieHeader } from "cookie";
import { COOKIE_NAME } from "@shared/const";
import {
  createBidRecord,
  getBidsByVehicle,
  getUserByOpenId,
  getVehicleById,
  updateVehicle,
  upsertUser,
} from "./db";
import { sdk } from "./_core/sdk";

declare module "socket.io" {
  interface SocketData {
    authenticatedUser?: {
      id: number;
      name: string | null;
      email: string | null;
    };
  }
}

type AuthenticatedSocketUser = {
  id: number;
  name: string | null;
  email: string | null;
};

type PlaceBidPayload = {
  vehicleId: number;
  amount: number;
};

async function resolveAuthenticatedUser(socket: Socket): Promise<AuthenticatedSocketUser | null> {
  if (socket.data.authenticatedUser) {
    return socket.data.authenticatedUser;
  }

  const cookies: Record<string, string> = socket.handshake.headers.cookie
    ? parseCookieHeader(socket.handshake.headers.cookie)
    : {};
  const sessionCookie = cookies[COOKIE_NAME];

  if (!sessionCookie) {
    return null;
  }

  try {
    const session = await sdk.verifySession(sessionCookie);
    if (!session) {
      return null;
    }

    let user = await getUserByOpenId(session.openId);

    if (!user) {
      try {
        const remoteUser = await sdk.getUserInfoWithJwt(sessionCookie);
        await upsertUser({
          openId: remoteUser.openId,
          name: remoteUser.name || null,
          email: remoteUser.email ?? null,
          loginMethod: remoteUser.loginMethod ?? null,
          lastSignedIn: new Date(),
        });
        user = await getUserByOpenId(session.openId);
      } catch (syncError) {
        console.error("[Socket.IO] Failed to sync authenticated user:", syncError);
        return null;
      }
    }

    if (!user) {
      return null;
    }

    const authenticatedUser: AuthenticatedSocketUser = {
      id: user.id,
      name: user.name ?? null,
      email: user.email ?? null,
    };

    socket.data.authenticatedUser = authenticatedUser;
    return authenticatedUser;
  } catch (error) {
    console.error("[Socket.IO] Failed to resolve authenticated user:", error);
    return null;
  }
}

export function setupSocketIO(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Armazenar lances ativos em memória
  const activeBids = new Map<number, { userId: number; userName: string; amount: number; timestamp: Date }[]>();

  io.on("connection", async (socket) => {
    console.log(`[Socket.IO] Cliente conectado: ${socket.id}`);

    // Autenticar usuário usando cookie de sessão
    const authenticatedUser = await resolveAuthenticatedUser(socket);

    if (!authenticatedUser) {
      console.warn(
        `[Socket.IO] Cliente não autenticado conectado ao socket de lances: ${socket.id}`
      );
    }

    // Entrar em uma sala de leilão específica
    socket.on("join-auction", async (vehicleId: number) => {
      const numericVehicleId = Number(vehicleId);

      if (!Number.isInteger(numericVehicleId) || numericVehicleId <= 0) {
        console.warn(
          `[Socket.IO] Cliente ${socket.id} tentou entrar em um leilão com ID inválido: ${vehicleId}`
        );
        return;
      }

      socket.join(`auction-${numericVehicleId}`);
      console.log(`[Socket.IO] Cliente ${socket.id} entrou no leilão ${numericVehicleId}`);

      // Enviar histórico de lances para o cliente
      let bids = activeBids.get(numericVehicleId);

      if (!bids) {
        const persisted = await getBidsByVehicle(numericVehicleId, 100);
        bids = persisted.map((bid) => ({
          userId: bid.userId,
          userName: bid.userName || bid.userEmail || `Usuário #${bid.userId}`,
          amount: bid.amount,
          timestamp: bid.createdAt,
        }));
        activeBids.set(numericVehicleId, bids);
      }

      socket.emit("bid-history", bids);
    });

    // Sair de uma sala de leilão
    socket.on("leave-auction", (vehicleId: number) => {
      const numericVehicleId = Number(vehicleId);

      if (!Number.isInteger(numericVehicleId) || numericVehicleId <= 0) {
        return;
      }

      socket.leave(`auction-${numericVehicleId}`);
      console.log(`[Socket.IO] Cliente ${socket.id} saiu do leilão ${numericVehicleId}`);
    });

    // Receber novo lance
    socket.on("place-bid", async (data: PlaceBidPayload) => {
      const { vehicleId, amount } = data;

      const numericVehicleId = Number(vehicleId);
      if (!Number.isInteger(numericVehicleId) || numericVehicleId <= 0) {
        socket.emit("bid-error", { message: "Selecione um leilão válido para enviar lances" });
        return;
      }

      const authenticatedUser = await resolveAuthenticatedUser(socket);
      if (!authenticatedUser) {
        socket.emit("bid-error", { message: "Você precisa estar autenticado para enviar lances" });
        return;
      }

      const numericUserId = authenticatedUser.id;
      const displayName = authenticatedUser.name || authenticatedUser.email || `Usuário #${numericUserId}`;

      // Validar lance (deve ser maior que o lance atual, sem restrição de incremento mínimo)
      let currentBids = activeBids.get(numericVehicleId) || [];
      let highestBid = 0;

      if (currentBids.length === 0) {
        const persisted = await getBidsByVehicle(numericVehicleId, 100);
        if (persisted.length > 0) {
          currentBids = persisted.map((bid) => ({
            userId: bid.userId,
            userName: bid.userName || bid.userEmail || `Usuário #${bid.userId}`,
            amount: bid.amount,
            timestamp: bid.createdAt,
          }));
          activeBids.set(numericVehicleId, currentBids);
        }
      }

      if (currentBids.length > 0) {
        highestBid = Math.max(...currentBids.map(b => b.amount));
      } else {
        // Se não houver lances, buscar o currentBid do veículo
        const vehicle = await getVehicleById(numericVehicleId);
        if (vehicle) {
          highestBid = vehicle.currentBid;
        }
      }

      // Permitir qualquer lance maior que o atual (sem incremento mínimo)
      if (amount <= highestBid) {
        socket.emit("bid-error", { message: "Seu lance deve ser maior que o lance atual" });
        return;
      }

      // Validar que o lance não seja negativo ou zero
      if (amount <= 0) {
        socket.emit("bid-error", { message: "Digite um valor válido" });
        return;
      }

      // Adicionar lance
      const newBid = {
        userId: numericUserId,
        userName: displayName,
        amount,
        timestamp: new Date()
      };

      if (!activeBids.has(numericVehicleId)) {
        activeBids.set(numericVehicleId, []);
      }
      activeBids.get(numericVehicleId)!.push(newBid);

      try {
        await createBidRecord({
          userId: numericUserId,
          vehicleId: numericVehicleId,
          amount,
        });
      } catch (error) {
        console.error("[Socket.IO] Failed to persist bid:", error);
      }

      try {
        await updateVehicle(numericVehicleId, { currentBid: amount });
      } catch (error) {
        console.error("[Socket.IO] Failed to update vehicle bid:", error);
      }

      // Notificar todos os usuários na sala
      io.to(`auction-${numericVehicleId}`).emit("new-bid", {
        vehicleId: numericVehicleId,
        bid: newBid,
        totalBids: activeBids.get(numericVehicleId)!.length
      });

      console.log(`[Socket.IO] Novo lance: R$ ${amount} no veículo ${numericVehicleId} por ${newBid.userName}`);
    });

    // Desconexão
    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
}
