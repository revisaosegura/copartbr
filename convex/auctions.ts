import { query } from "./_generated/server";
import { v } from "convex/values";

export const getUpcomingAuctions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("auctions")
      .withIndex("by_status", (q) => q.eq("status", "upcoming"))
      .order("asc")
      .take(10);
  },
});

export const getLiveAuctions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("auctions")
      .withIndex("by_status", (q) => q.eq("status", "live"))
      .collect();
  },
});
