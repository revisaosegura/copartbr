import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    status: v.optional(v.string()),
    search: v.optional(v.string()),
    make: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let vehicles;

    if (args.search) {
      vehicles = await ctx.db
        .query("vehicles")
        .withSearchIndex("search_vehicles", (q) => {
          let searchQuery = q.search("description", args.search!);
          if (args.make) {
            searchQuery = searchQuery.eq("make", args.make);
          }
          if (args.status) {
            searchQuery = searchQuery.eq("status", args.status);
          }
          return searchQuery;
        })
        .take(args.limit || 20);
    } else if (args.status) {
      vehicles = await ctx.db
        .query("vehicles")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(args.limit || 20);
    } else {
      vehicles = await ctx.db
        .query("vehicles")
        .order("desc")
        .take(args.limit || 20);
    }

    return Promise.all(
      vehicles.map(async (vehicle) => {
        const imageUrls = await Promise.all(
          vehicle.images.map(async (imageId) => {
            const url = await ctx.storage.getUrl(imageId);
            return url;
          })
        );

        // Get current auction info
        const auction = await ctx.db
          .query("auctions")
          .withIndex("by_vehicle", (q) => q.eq("vehicleId", vehicle._id))
          .first();

        return {
          ...vehicle,
          imageUrls,
          auction,
        };
      })
    );
  },
});

export const getById = query({
  args: { id: v.id("vehicles") },
  handler: async (ctx, args) => {
    const vehicle = await ctx.db.get(args.id);
    if (!vehicle) return null;

    const imageUrls = await Promise.all(
      vehicle.images.map(async (imageId) => {
        const url = await ctx.storage.getUrl(imageId);
        return url;
      })
    );

    const auction = await ctx.db
      .query("auctions")
      .withIndex("by_vehicle", (q) => q.eq("vehicleId", vehicle._id))
      .first();

    const recentBids = auction ? await ctx.db
      .query("bids")
      .withIndex("by_auction", (q) => q.eq("auctionId", auction._id))
      .order("desc")
      .take(10) : [];

    return {
      ...vehicle,
      imageUrls,
      auction,
      recentBids,
    };
  },
});

export const addToWatchlist = mutation({
  args: { vehicleId: v.id("vehicles") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("watchlist")
      .withIndex("by_user_vehicle", (q) => 
        q.eq("userId", userId).eq("vehicleId", args.vehicleId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { added: false };
    } else {
      await ctx.db.insert("watchlist", {
        userId,
        vehicleId: args.vehicleId,
      });
      return { added: true };
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

    return Promise.all(
      watchlistItems.map(async (item) => {
        const vehicle = await ctx.db.get(item.vehicleId);
        if (!vehicle) return null;

        const imageUrls = await Promise.all(
          vehicle.images.slice(0, 1).map(async (imageId) => {
            const url = await ctx.storage.getUrl(imageId);
            return url;
          })
        );

        const auction = await ctx.db
          .query("auctions")
          .withIndex("by_vehicle", (q) => q.eq("vehicleId", vehicle._id))
          .first();

        return {
          ...vehicle,
          imageUrls,
          auction,
        };
      })
    ).then(items => items.filter(Boolean));
  },
});
