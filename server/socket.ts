import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import { createNotification, getVehicleById } from "./db";

export function setupSocketIO(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Armazenar lances ativos em memória
  const activeBids = new Map<number, { userId: string; amount: number; timestamp: Date }[]>();

  io.on("connection", (socket) => {
    console.log(`[Socket.IO] Cliente conectado: ${socket.id}`);

    // Entrar em uma sala de leilão específica
    socket.on("join-auction", (vehicleId: number) => {
      socket.join(`auction-${vehicleId}`);
      console.log(`[Socket.IO] Cliente ${socket.id} entrou no leilão ${vehicleId}`);
      
      // Enviar histórico de lances para o cliente
      const bids = activeBids.get(vehicleId) || [];
      socket.emit("bid-history", bids);
    });

    // Sair de uma sala de leilão
    socket.on("leave-auction", (vehicleId: number) => {
      socket.leave(`auction-${vehicleId}`);
      console.log(`[Socket.IO] Cliente ${socket.id} saiu do leilão ${vehicleId}`);
    });

    // Receber novo lance
    socket.on("place-bid", async (data: { vehicleId: number; userId: string; amount: number; userName: string }) => {
      const { vehicleId, userId, amount, userName } = data;
      
      // Validar lance (deve ser maior que o lance atual, sem restrição de incremento mínimo)
      const currentBids = activeBids.get(vehicleId) || [];
      let highestBid = 0;
      
      if (currentBids.length > 0) {
        highestBid = Math.max(...currentBids.map(b => b.amount));
      } else {
        // Se não houver lances, buscar o currentBid do veículo
        const vehicle = await getVehicleById(vehicleId);
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
        userId,
        userName,
        amount,
        timestamp: new Date()
      };

      if (!activeBids.has(vehicleId)) {
        activeBids.set(vehicleId, []);
      }
      activeBids.get(vehicleId)!.push(newBid);

      // Notificar todos os usuários na sala
      io.to(`auction-${vehicleId}`).emit("new-bid", {
        vehicleId,
        bid: newBid,
        totalBids: activeBids.get(vehicleId)!.length
      });

      // Criar notificação para usuários interessados (exemplo: favoritos)
      // Nota: Em produção, buscar usuários que favoritaram este veículo
      // e criar notificação para cada um
      
      console.log(`[Socket.IO] Novo lance: R$ ${amount} no veículo ${vehicleId} por ${userName}`);
    });

    // Desconexão
    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Cliente desconectado: ${socket.id}`);
    });
  });

  return io;
}
