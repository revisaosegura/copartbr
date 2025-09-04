import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const searchVehicles = query({
  args: {
    searchTerm: v.optional(v.string()),
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    yearFrom: v.optional(v.number()),
    yearTo: v.optional(v.number()),
    location: v.optional(v.string()),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results;

    if (args.searchTerm) {
      results = await ctx.db
        .query("vehicles")
        .withSearchIndex("search_vehicles", (q) =>
          q.search("model", args.searchTerm!)
        )
        .collect();
    } else {
      results = await ctx.db.query("vehicles").collect();
    }

    // Apply filters
    if (args.make) {
      results = results.filter(v => v.make.toLowerCase().includes(args.make!.toLowerCase()));
    }
    if (args.model) {
      results = results.filter(v => v.model.toLowerCase().includes(args.model!.toLowerCase()));
    }
    if (args.yearFrom) {
      results = results.filter(v => v.year >= args.yearFrom!);
    }
    if (args.yearTo) {
      results = results.filter(v => v.year <= args.yearTo!);
    }
    if (args.location) {
      results = results.filter(v => v.location.toLowerCase().includes(args.location!.toLowerCase()));
    }
    if (args.status) {
      results = results.filter(v => v.status === args.status);
    }

    // Add images URLs
    const vehiclesWithImages = await Promise.all(
      results.slice(0, args.limit || 50).map(async (vehicle) => ({
        ...vehicle,
        imageUrls: await Promise.all(
          vehicle.images.map(async (imageId) => await ctx.storage.getUrl(imageId))
        ),
      }))
    );

    return vehiclesWithImages;
  },
});

export const getVehicleById = query({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    const vehicle = await ctx.db.get(args.id);
    if (!vehicle) return null;

    const imageUrls = await Promise.all(
      vehicle.images.map(async (imageId) => await ctx.storage.getUrl(imageId))
    );

    const bids = await ctx.db
      .query("bids")
      .withIndex("by_vehicle", (q) => q.eq("vehicleId", args.id))
      .order("desc")
      .take(10);

    return {
      ...vehicle,
      imageUrls,
      recentBids: bids,
    };
  },
});

export const placeBid = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Você precisa estar logado para fazer lances");
    }

    const vehicle = await ctx.db.get(args.vehicleId);
    if (!vehicle) {
      throw new Error("Veículo não encontrado");
    }

    if (vehicle.status === 'sold') {
      throw new Error("Este veículo já foi vendido");
    }

    if (args.amount <= vehicle.currentBid) {
      throw new Error("O lance deve ser maior que o lance atual");
    }

    // Mark previous bids as not winning
    const previousBids = await ctx.db
      .query("bids")
      .withIndex("by_vehicle", (q) => q.eq("vehicleId", args.vehicleId))
      .collect();

    for (const bid of previousBids) {
      await ctx.db.patch(bid._id, { isWinning: false });
    }

    // Create new bid
    const bidId = await ctx.db.insert("bids", {
      vehicleId: args.vehicleId,
      userId,
      amount: args.amount,
      timestamp: Date.now(),
      isWinning: true,
    });

    // Update vehicle current bid
    await ctx.db.patch(args.vehicleId, { currentBid: args.amount });

    return bidId;
  },
});

export const addToWatchlist = mutation({
  args: { vehicleId: v.id("vehicles") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Você precisa estar logado");
    }

    const existing = await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("vehicleId"), args.vehicleId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false; // Removed from watchlist
    } else {
      await ctx.db.insert("watchlist", {
        userId,
        vehicleId: args.vehicleId,
      });
      return true; // Added to watchlist
    }
  },
});

export const getWatchlist = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const watchlistItems = await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const vehicles = await Promise.all(
      watchlistItems.map(async (item) => {
        const vehicle = await ctx.db.get(item.vehicleId);
        if (!vehicle) return null;
        
        const imageUrls = await Promise.all(
          vehicle.images.slice(0, 1).map(async (imageId) => await ctx.storage.getUrl(imageId))
        );

        return {
          ...vehicle,
          imageUrls,
        };
      })
    );

    return vehicles.filter(Boolean);
  },
});

export const getFeaturedVehicles = query({
  args: {},
  handler: async (ctx) => {
    const vehicles = await ctx.db
      .query("vehicles")
      .withIndex("by_status", (q) => q.eq("status", "upcoming"))
      .order("desc")
      .take(8);

    const vehiclesWithImages = await Promise.all(
      vehicles.map(async (vehicle) => ({
        ...vehicle,
        imageUrls: await Promise.all(
          vehicle.images.slice(0, 1).map(async (imageId) => await ctx.storage.getUrl(imageId))
        ),
      }))
    );

    return vehiclesWithImages;
  },
});

export const getVehicleStats = query({
  args: {},
  handler: async (ctx) => {
    const totalVehicles = await ctx.db.query("vehicles").collect();
    const liveAuctions = await ctx.db
      .query("vehicles")
      .withIndex("by_status", (q) => q.eq("status", "live"))
      .collect();
    const upcomingAuctions = await ctx.db
      .query("vehicles")
      .withIndex("by_status", (q) => q.eq("status", "upcoming"))
      .collect();

    return {
      total: totalVehicles.length,
      live: liveAuctions.length,
      upcoming: upcomingAuctions.length,
    };
  },
});
