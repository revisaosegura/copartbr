import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createSampleVehicles = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    // Sample vehicle data
    const sampleVehicles = [
      {
        make: "Toyota",
        model: "Camry",
        year: 2020,
        vin: "4T1BF1FK5LU123456",
        mileage: 45000,
        condition: "Run and Drive",
        damage: "Front End",
        location: "Dallas, TX",
        lotNumber: "12345678",
        estimatedValue: 18000,
        saleDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
        images: [],
        description: "2020 Toyota Camry with front end damage. Vehicle runs and drives well. Clean interior, minor exterior damage.",
        engineType: "2.5L 4-Cylinder",
        transmission: "Automatic",
        fuelType: "Gasoline",
        color: "Silver",
        bodyStyle: "Sedan",
        status: "upcoming",
        sellerId: "user123" as any,
      },
      {
        make: "Honda",
        model: "Civic",
        year: 2019,
        vin: "19XFC2F59KE123456",
        mileage: 32000,
        condition: "Enhanced",
        damage: "Side",
        location: "Phoenix, AZ",
        lotNumber: "87654321",
        estimatedValue: 16500,
        saleDate: Date.now() + 5 * 24 * 60 * 60 * 1000,
        images: [],
        description: "2019 Honda Civic with side damage. Enhanced vehicle with good mechanical condition.",
        engineType: "1.5L Turbo",
        transmission: "CVT",
        fuelType: "Gasoline",
        color: "Blue",
        bodyStyle: "Sedan",
        status: "upcoming",
        sellerId: "user123" as any,
      },
      {
        make: "Ford",
        model: "F-150",
        year: 2021,
        vin: "1FTFW1E51MFA12345",
        mileage: 28000,
        condition: "Run and Drive",
        damage: "Rear End",
        location: "Houston, TX",
        lotNumber: "11223344",
        estimatedValue: 32000,
        saleDate: Date.now() + 3 * 24 * 60 * 60 * 1000,
        images: [],
        description: "2021 Ford F-150 pickup truck with rear end damage. Runs and drives excellent.",
        engineType: "3.5L V6",
        transmission: "10-Speed Automatic",
        fuelType: "Gasoline",
        color: "White",
        bodyStyle: "Pickup",
        status: "upcoming",
        sellerId: "user123" as any,
      },
      {
        make: "BMW",
        model: "3 Series",
        year: 2018,
        vin: "WBA8E1C51JA123456",
        mileage: 55000,
        condition: "Start/Run",
        damage: "All Over",
        location: "Los Angeles, CA",
        lotNumber: "99887766",
        estimatedValue: 22000,
        saleDate: Date.now() + 2 * 24 * 60 * 60 * 1000,
        images: [],
        description: "2018 BMW 3 Series with extensive damage. Vehicle starts and runs but needs significant repair.",
        engineType: "2.0L Turbo",
        transmission: "8-Speed Automatic",
        fuelType: "Gasoline",
        color: "Black",
        bodyStyle: "Sedan",
        status: "upcoming",
        sellerId: "user123" as any,
      },
    ];

    // Insert sample vehicles
    for (const vehicle of sampleVehicles) {
      const vehicleId = await ctx.db.insert("vehicles", vehicle);
      
      // Create corresponding auction
      await ctx.db.insert("auctions", {
        vehicleId,
        startingBid: Math.floor(vehicle.estimatedValue * 0.3),
        currentBid: Math.floor(vehicle.estimatedValue * 0.3),
        bidIncrement: 250,
        startTime: Date.now(),
        endTime: vehicle.saleDate,
        status: "upcoming",
        totalBids: 0,
      });
    }

    return { success: true, message: "Sample vehicles created" };
  },
});
