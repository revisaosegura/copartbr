import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const placeBid = mutation({
  args: {
    auctionId: v.id("auctions"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const auction = await ctx.db.get(args.auctionId);
    if (!auction) throw new Error("Auction not found");

    if (auction.status !== "live") {
      throw new Error("Auction is not live");
    }

    if (args.amount <= auction.currentBid) {
      throw new Error("Bid must be higher than current bid");
    }

    if (args.amount < auction.currentBid + auction.bidIncrement) {
      throw new Error(`Minimum bid is $${auction.currentBid + auction.bidIncrement}`);
    }

    const now = Date.now();
    if (now > auction.endTime) {
      throw new Error("Auction has ended");
    }

    // Mark previous winning bids as not winning
    const previousBids = await ctx.db
      .query("bids")
      .withIndex("by_auction", (q) => q.eq("auctionId", args.auctionId))
      .filter((q) => q.eq(q.field("isWinning"), true))
      .collect();

    for (const bid of previousBids) {
      await ctx.db.patch(bid._id, { isWinning: false });
    }

    // Place new bid
    await ctx.db.insert("bids", {
      auctionId: args.auctionId,
      bidderId: userId,
      amount: args.amount,
      timestamp: now,
      isWinning: true,
    });

    // Update auction
    await ctx.db.patch(args.auctionId, {
      currentBid: args.amount,
      totalBids: auction.totalBids + 1,
    });

    return { success: true };
  },
});

export const getLiveAuctions = query({
  args: {},
  handler: async (ctx) => {
    const auctions = await ctx.db
      .query("auctions")
      .withIndex("by_status", (q) => q.eq("status", "live"))
      .order("asc")
      .take(10);

    return Promise.all(
      auctions.map(async (auction) => {
        const vehicle = await ctx.db.get(auction.vehicleId);
        if (!vehicle) return null;

        const imageUrls = await Promise.all(
          vehicle.images.slice(0, 1).map(async (imageId) => {
            const url = await ctx.storage.getUrl(imageId);
            return url;
          })
        );

        const timeLeft = Math.max(0, auction.endTime - Date.now());

        return {
          ...auction,
          vehicle: {
            ...vehicle,
            imageUrls,
          },
          timeLeft,
        };
      })
    ).then(items => items.filter(Boolean));
  },
});

export const getBidHistory = query({
  args: { auctionId: v.id("auctions") },
  handler: async (ctx, args) => {
    const bids = await ctx.db
      .query("bids")
      .withIndex("by_auction", (q) => q.eq("auctionId", args.auctionId))
      .order("desc")
      .take(20);

    return Promise.all(
      bids.map(async (bid) => {
        const bidder = await ctx.db.get(bid.bidderId);
        return {
          ...bid,
          bidderName: bidder?.name || bidder?.email || "Anonymous",
        };
      })
    );
  },
});
