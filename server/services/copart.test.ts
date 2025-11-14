import { describe, expect, it } from "vitest";

import { transformCopartLot } from "./copart";

describe("transformCopartLot currency handling", () => {
  it("multiplies BRL values by 100 when bids are provided in reais", () => {
    const vehicle = transformCopartLot({
      lotNumber: "12345",
      currentBid: 150_000,
      currentBidCurrency: "BRL",
    });

    expect(vehicle.currentBid).toBe(15_000_000);
  });

  it("keeps values unchanged when metadata declares cents", () => {
    const vehicle = transformCopartLot({
      lotNumber: "67890",
      currentBid: 12_345,
      currentBidUnit: "centavos",
    });

    expect(vehicle.currentBid).toBe(12_345);
  });
});
