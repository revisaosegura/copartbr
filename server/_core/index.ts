import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { COOKIE_NAME } from "@shared/const";
import * as db from "../db";
import { ENV } from "./env";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Stripe webhook MUST be registered BEFORE express.json() to preserve raw body
  // Apenas registra se STRIPE_SECRET_KEY estiver configurado
  if (process.env.STRIPE_SECRET_KEY) {
    const { handleStripeWebhook } = await import("../stripe/webhook");
    app.post(
      "/api/stripe/webhook",
      express.raw({ type: "application/json" }),
      handleStripeWebhook
    );
    console.log("[Stripe] Webhook registrado em /api/stripe/webhook");
  } else {
    console.warn("[Stripe] STRIPE_SECRET_KEY não configurado - webhook desabilitado");
  }
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body ?? {};

    if (username !== "Copart" || password !== "Copart.2025") {
      return res
        .status(401)
        .json({ success: false, error: "Credenciais inválidas" });
    }

    const openId = "local-admin-copart";
    const adminName = "Administrador Copart";

    try {
      await db.upsertUser({
        openId,
        name: adminName,
        email: "admin@copartbr.com.br",
        loginMethod: "local",
        role: "admin",
        lastSignedIn: new Date(),
      });

      const token = await sdk.signSession({
        openId,
        appId: ENV.appId,
        name: adminName,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dias
      });

      return res.json({ success: true });
    } catch (error) {
      console.error("[Admin] Falha ao autenticar admin local:", error);
      return res
        .status(500)
        .json({ success: false, error: "Falha ao autenticar admin" });
    }
  });
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    
    // Configurar Socket.IO para lances em tempo real
    import('../socket').then(({ setupSocketIO }) => {
      setupSocketIO(server);
      console.log('[Socket.IO] Sistema de lances em tempo real inicializado');
    }).catch(error => {
      console.error('[Socket.IO] Erro ao inicializar:', error);
    });
    
    // Iniciar scheduler de sincronização automática
    import('../scheduler').then(({ setupVehicleSyncScheduler }) => {
      setupVehicleSyncScheduler();
    }).catch(error => {
      console.error('[Server] Erro ao iniciar scheduler:', error);
    });
  });
}

startServer().catch(console.error);
