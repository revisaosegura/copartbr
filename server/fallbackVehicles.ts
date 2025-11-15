import { fetchCopartInventory, transformCopartLot } from "./services/copart";
import type { InsertVehicle, Vehicle } from "../drizzle/schema";

const FALLBACK_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const FALLBACK_MAX_ITEMS = 200;
const FEATURED_COUNT = 12;

let cache: { timestamp: number; vehicles: Vehicle[] } | null = null;

function ensureDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
}

function generateStableId(lotNumber: string | null | undefined, index: number): number {
  if (lotNumber && lotNumber.trim().length > 0) {
    let hash = 0;
    for (let i = 0; i < lotNumber.length; i++) {
      hash = (hash * 31 + lotNumber.charCodeAt(i)) >>> 0;
    }
    if (hash !== 0) {
      return hash;
    }
  }
  // Ensure non-zero positive id even when lot number is missing
  return 1_000_000_000 + index;
}

function normalizeVehicle(data: InsertVehicle, index: number): Vehicle {
  const now = new Date();
  const createdAt = ensureDate((data as { createdAt?: unknown }).createdAt) ?? now;
  const updatedAt = ensureDate((data as { updatedAt?: unknown }).updatedAt) ?? createdAt;
  const auctionDate = ensureDate(data.auctionDate ?? null);

  return {
    id: generateStableId(data.lotNumber ?? null, index),
    lotNumber: data.lotNumber ?? `LOT-${index + 1}`,
    title: data.title ?? `Veículo ${index + 1}`,
    brand: data.brand ?? null,
    model: data.model ?? null,
    year: data.year ?? null,
    currentBid: data.currentBid ?? 0,
    location: data.location ?? null,
    image: data.image ?? null,
    description: data.description ?? null,
    mileage: data.mileage ?? null,
    fuel: data.fuel ?? null,
    transmission: data.transmission ?? null,
    color: data.color ?? null,
    condition: data.condition ?? null,
    auctionDate,
    auctionTime: data.auctionTime ?? null,
    saleStatus: data.saleStatus ?? null,
    featured: data.featured ?? 0,
    active: data.active ?? 1,
    createdAt,
    updatedAt,
  };
}

function markFeaturedVehicles(vehicles: Vehicle[]): Vehicle[] {
  if (vehicles.length === 0) {
    return vehicles;
  }

  const sortedByBid = [...vehicles].sort((a, b) => b.currentBid - a.currentBid);
  const featuredIds = new Set(sortedByBid.slice(0, FEATURED_COUNT).map(vehicle => vehicle.id));

  return vehicles.map(vehicle => ({
    ...vehicle,
    featured: featuredIds.has(vehicle.id) ? 1 : 0,
  }));
}

function cloneVehicles(vehicles: Vehicle[]): Vehicle[] {
  return vehicles.map(vehicle => ({ ...vehicle }));
}

export async function getFallbackVehicles(): Promise<Vehicle[]> {
  const now = Date.now();

  if (cache && now - cache.timestamp < FALLBACK_CACHE_TTL_MS) {
    return cloneVehicles(cache.vehicles);
  }

  try {
    const lots = await fetchCopartInventory({ maxItems: FALLBACK_MAX_ITEMS });
    const normalized = lots.map((lot, index) => normalizeVehicle(transformCopartLot(lot), index));
    const withFeatured = markFeaturedVehicles(normalized);

    cache = { timestamp: now, vehicles: withFeatured };
    return cloneVehicles(withFeatured);
  } catch (error) {
    console.error("[Fallback] Failed to load vehicles from Copart:", error);
    cache = { timestamp: now, vehicles: [] };
    return [];
  }
}

export async function getFallbackVehicleById(id: number): Promise<Vehicle | undefined> {
  const vehicles = await getFallbackVehicles();
  return vehicles.find(vehicle => vehicle.id === id);
}

export async function getFallbackVehiclesByLotNumber(lotNumber: string): Promise<Vehicle | undefined> {
  const vehicles = await getFallbackVehicles();
  const normalized = lotNumber.trim().toLowerCase();
  return vehicles.find(vehicle => vehicle.lotNumber?.toLowerCase() === normalized);
}

export async function getFallbackUpcomingAuctions(limit: number): Promise<Array<{
  id: string;
  location: string | null;
  auctionDate: Date;
  auctionTimes: string[];
  vehicleCount: number;
}>> {
  const vehicles = await getFallbackVehicles();
  const now = Date.now();

  type AuctionGroup = {
    key: string;
    auctionDate: Date;
    location: string | null;
    vehicleCount: number;
    auctionTimes: Set<string>;
  };

  const groups = new Map<string, AuctionGroup>();

  for (const vehicle of vehicles) {
    if (vehicle.active !== 1) continue;
    if (!vehicle.auctionDate) continue;
    if (vehicle.auctionDate.getTime() < now) continue;

    const location = vehicle.location ?? "Localização não informada";
    const dateKey = `${vehicle.auctionDate.toISOString().split("T")[0]}|${location}`;

    let group = groups.get(dateKey);
    if (!group) {
      group = {
        key: dateKey,
        auctionDate: vehicle.auctionDate,
        location,
        vehicleCount: 0,
        auctionTimes: new Set<string>(),
      };
      groups.set(dateKey, group);
    }

    if (vehicle.auctionDate < group.auctionDate) {
      group.auctionDate = vehicle.auctionDate;
    }

    group.vehicleCount += 1;

    if (vehicle.auctionTime) {
      group.auctionTimes.add(vehicle.auctionTime);
    }
  }

  return Array.from(groups.values())
    .sort((a, b) => a.auctionDate.getTime() - b.auctionDate.getTime())
    .slice(0, limit)
    .map(group => ({
      id: group.key,
      location: group.location,
      auctionDate: group.auctionDate,
      auctionTimes: Array.from(group.auctionTimes).sort(),
      vehicleCount: group.vehicleCount,
    }));
}

export function computePseudoViews(vehicle: Vehicle, index: number): number {
  const base = 150;
  const bidFactor = Math.max(1, Math.floor(vehicle.currentBid / 100_000));
  const hashSeed = vehicle.id % 997;
  return base + bidFactor * 25 + ((hashSeed + index * 53) % 750);
}
