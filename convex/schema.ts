import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  vehicles: defineTable({
    lotNumber: v.string(),
    year: v.number(),
    make: v.string(),
    model: v.string(),
    bodyStyle: v.string(),
    engine: v.string(),
    transmission: v.string(),
    fuel: v.string(),
    odometer: v.number(),
    primaryDamage: v.string(),
    secondaryDamage: v.optional(v.string()),
    estimatedRetailValue: v.number(),
    currentBid: v.number(),
    saleDate: v.string(),
    saleTime: v.string(),
    location: v.string(),
    seller: v.string(),
    titleType: v.string(),
    keys: v.boolean(),
    images: v.array(v.id("_storage")),
    status: v.union(v.literal("upcoming"), v.literal("live"), v.literal("sold")),
    vin: v.string(),
    color: v.string(),
    condition: v.string(),
    grade: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_make_model", ["make", "model"])
    .index("by_sale_date", ["saleDate"])
    .searchIndex("search_vehicles", {
      searchField: "model",
      filterFields: ["make", "status", "location"]
    }),

  bids: defineTable({
    vehicleId: v.id("vehicles"),
    userId: v.id("users"),
    amount: v.number(),
    timestamp: v.number(),
    isWinning: v.boolean(),
  })
    .index("by_vehicle", ["vehicleId"])
    .index("by_user", ["userId"])
    .index("by_vehicle_amount", ["vehicleId", "amount"]),

  watchlist: defineTable({
    userId: v.id("users"),
    vehicleId: v.id("vehicles"),
  })
    .index("by_user", ["userId"])
    .index("by_vehicle", ["vehicleId"]),

  auctions: defineTable({
    name: v.string(),
    date: v.string(),
    time: v.string(),
    location: v.string(),
    status: v.union(v.literal("upcoming"), v.literal("live"), v.literal("completed")),
    vehicleCount: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_date", ["date"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
