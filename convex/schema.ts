import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  vehicles: defineTable({
    make: v.string(),
    model: v.string(),
    year: v.number(),
    vin: v.string(),
    mileage: v.number(),
    condition: v.string(), // "Run and Drive", "Start/Run", "Enhanced", "Stationary"
    damage: v.string(), // "Front End", "Side", "Rear End", "All Over", etc.
    location: v.string(),
    lotNumber: v.string(),
    estimatedValue: v.number(),
    saleDate: v.number(), // timestamp
    images: v.array(v.id("_storage")),
    description: v.string(),
    engineType: v.string(),
    transmission: v.string(),
    fuelType: v.string(),
    color: v.string(),
    bodyStyle: v.string(),
    status: v.string(), // "upcoming", "live", "sold", "unsold"
    sellerId: v.id("users"),
  })
    .index("by_status", ["status"])
    .index("by_sale_date", ["saleDate"])
    .index("by_make_model", ["make", "model"])
    .searchIndex("search_vehicles", {
      searchField: "description",
      filterFields: ["make", "model", "status"]
    }),

  auctions: defineTable({
    vehicleId: v.id("vehicles"),
    startingBid: v.number(),
    currentBid: v.number(),
    bidIncrement: v.number(),
    startTime: v.number(),
    endTime: v.number(),
    status: v.string(), // "upcoming", "live", "ended"
    winnerId: v.optional(v.id("users")),
    totalBids: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_vehicle", ["vehicleId"])
    .index("by_end_time", ["endTime"]),

  bids: defineTable({
    auctionId: v.id("auctions"),
    bidderId: v.id("users"),
    amount: v.number(),
    timestamp: v.number(),
    isWinning: v.boolean(),
  })
    .index("by_auction", ["auctionId"])
    .index("by_bidder", ["bidderId"])
    .index("by_auction_amount", ["auctionId", "amount"]),

  watchlist: defineTable({
    userId: v.id("users"),
    vehicleId: v.id("vehicles"),
  })
    .index("by_user", ["userId"])
    .index("by_vehicle", ["vehicleId"])
    .index("by_user_vehicle", ["userId", "vehicleId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
