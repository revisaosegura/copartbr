import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { getDashboardStats, getRecentSyncLogs, getAllVehicles, getVehicleById, createVehicle, updateVehicle, deleteVehicle, getAllSettings, upsertSetting, getUserNotifications, getUnreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead, createNotification, getAllUsers, getUserCount, getUserGrowthStats, getMostViewedVehicles, getBidStatistics } from "./db";
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

  // Public vehicle search
  vehicles: router({
    search: publicProcedure
      .input(z.object({
        query: z.string().min(1),
        limit: z.number().optional().default(10),
      }))
      .query(async ({ input }) => {
        const { searchVehicles } = await import('./db');
        return await searchVehicles(input.query, input.limit);
      }),

    list: publicProcedure
      .input(z.object({
        brands: z.array(z.string()).optional(),
        years: z.array(z.number()).optional(),
        conditions: z.array(z.string()).optional(),
        limit: z.number().optional().default(20),
        offset: z.number().optional().default(0),
      }).optional())
      .query(async ({ input }) => {
        const { getFilteredVehicles } = await import('./db');
        return await getFilteredVehicles(input ?? {});
      }),

    upcomingAuctions: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(50).optional() }).optional())
      .query(async ({ input }) => {
        const { getUpcomingAuctions } = await import('./db');
        return await getUpcomingAuctions(input?.limit);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getVehicleById(input.id);
      }),

    count: publicProcedure.query(async () => {
      const { getVehicleCount } = await import('./db');
      return await getVehicleCount();
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

    // Sync management
    sync: router({      syncNow: protectedProcedure
        .mutation(async ({ ctx }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
          }
          const { syncVehiclesFromCopart } = await import('./services/vehicleSync');
          const result = await syncVehiclesFromCopart();
          return result;
        }),

      getLogs: protectedProcedure
        .input(z.object({ limit: z.number().optional().default(50) }))
        .query(async ({ ctx, input }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
          }
          const { getSyncLogs } = await import('./db');
          return await getSyncLogs(input.limit);
        }),
    }),

    // User management
    users: router({      list: protectedProcedure.query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
        }
        return await getAllUsers();
      }),

      count: protectedProcedure.query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
        }
        return await getUserCount();
      }),
    }),

    // Analytics
    analytics: router({      userGrowth: protectedProcedure
        .input(z.object({ days: z.number().optional().default(30) }))
        .query(async ({ ctx, input }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
          }
          return await getUserGrowthStats(input.days);
        }),

      mostViewedVehicles: protectedProcedure
        .input(z.object({ limit: z.number().optional().default(10) }))
        .query(async ({ ctx, input }) => {
          if (ctx.user.role !== 'admin') {
            throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
          }
          return await getMostViewedVehicles(input.limit);
        }),

      bidStatistics: protectedProcedure.query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: NOT_ADMIN_ERR_MSG });
        }
        return await getBidStatistics();
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

  // Notifications
  notifications: router({
    getAll: protectedProcedure
      .input(z.object({ limit: z.number().optional().default(20) }))
      .query(async ({ ctx, input }) => {
        return await getUserNotifications(ctx.user.id, input.limit);
      }),

    getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
      return await getUnreadNotificationsCount(ctx.user.id);
    }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await markNotificationAsRead(input.id);
        return { success: true };
      }),

    markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
      await markAllNotificationsAsRead(ctx.user.id);
      return { success: true };
    }),

    create: protectedProcedure
      .input(z.object({
        userId: z.number(),
        type: z.enum(["new_bid", "price_change", "auction_reminder", "favorite_update", "system"]),
        title: z.string(),
        message: z.string(),
        vehicleId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await createNotification(input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
