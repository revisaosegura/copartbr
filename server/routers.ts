import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getDashboardStats, getRecentSyncLogs, getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle, getAllSettings, upsertSetting } from "./db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { NOT_ADMIN_ERR_MSG } from "@shared/const";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Admin panel routers
  admin: router({
    // Dashboard statistics
    stats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
      }
      return await getDashboardStats();
    }),

    // Sync logs
    syncLogs: protectedProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
        }
        return await getRecentSyncLogs(input?.limit);
      }),

    // Vehicle management
    vehicles: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
        }
        return await getAllVehicles();
      }),

      getById: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
          }
          return await getVehicleById(input.id);
        }),

      create: protectedProcedure
        .input(z.object({
          lotNumber: z.string(),
          title: z.string(),
          brand: z.string().optional(),
          model: z.string().optional(),
          year: z.number().optional(),
          currentBid: z.number(),
          location: z.string().optional(),
          image: z.string().optional(),
          description: z.string().optional(),
          mileage: z.number().optional(),
          fuel: z.string().optional(),
          transmission: z.string().optional(),
          color: z.string().optional(),
          condition: z.string().optional(),
          featured: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
          }
          return await createVehicle(input);
        }),

      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          data: z.object({
            lotNumber: z.string().optional(),
            title: z.string().optional(),
            brand: z.string().optional(),
            model: z.string().optional(),
            year: z.number().optional(),
            currentBid: z.number().optional(),
            location: z.string().optional(),
            image: z.string().optional(),
            description: z.string().optional(),
            mileage: z.number().optional(),
            fuel: z.string().optional(),
            transmission: z.string().optional(),
            color: z.string().optional(),
            condition: z.string().optional(),
            featured: z.number().optional(),
          }),
        }))
        .mutation(async ({ ctx, input }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
          }
          await updateVehicle(input.id, input.data);
          return { success: true };
        }),

      delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
          }
          await deleteVehicle(input.id);
          return { success: true };
        }),
    }),

    // Settings management
    settings: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
        }
        return await getAllSettings();
      }),

      upsert: protectedProcedure
        .input(z.object({
          key: z.string(),
          value: z.string(),
          description: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
          }
          await upsertSetting(input);
          return { success: true };
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
