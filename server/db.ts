import { eq, desc, sql, and, gte, isNotNull, inArray, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  vehicles,
  priceHistory,
  syncLogs,
  siteSettings,
  siteStats,
  notifications,
  InsertVehicle,
  InsertPriceHistory,
  InsertSyncLog,
  InsertSiteSetting,
  InsertSiteStats,
  InsertNotification,
  bids,
  InsertBid,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import {
  computePseudoViews,
  getFallbackUpcomingAuctions,
  getFallbackVehicleById,
  getFallbackVehicles,
} from "./fallbackVehicles";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Vehicle functions
export async function getAllVehicles() {
  const db = await getDb();
  if (!db) {
    const fallbackVehicles = await getFallbackVehicles();
    return fallbackVehicles
      .filter(vehicle => vehicle.active === 1)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  return await db.select().from(vehicles).where(eq(vehicles.active, 1)).orderBy(desc(vehicles.createdAt));
}

export async function getVehicleById(id: number) {
  const db = await getDb();
  if (!db) return await getFallbackVehicleById(id);
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getFeaturedVehicles(limit: number = 4) {
  const db = await getDb();
  if (!db) {
    const fallbackVehicles = await getFallbackVehicles();
    return fallbackVehicles
      .filter(vehicle => vehicle.active === 1 && vehicle.featured === 1)
      .slice(0, limit);
  }
  return await db.select().from(vehicles)
    .where(sql`${vehicles.featured} = 1 AND ${vehicles.active} = 1`)
    .limit(limit);
}

export async function createVehicle(vehicle: InsertVehicle) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(vehicles).values(vehicle);
  return result;
}

export async function updateVehicle(id: number, data: Partial<InsertVehicle>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(vehicles).set(data).where(eq(vehicles.id, id));
}

export async function deleteVehicle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(vehicles).set({ active: 0 }).where(eq(vehicles.id, id));
}

// Bid functions
export async function createBidRecord(bid: InsertBid) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create bid: database not available");
    return;
  }

  try {
    await db.insert(bids).values(bid);
  } catch (error) {
    console.error("[Database] Failed to create bid record:", error);
    throw error;
  }
}

export async function getBidsByVehicle(vehicleId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get bids: database not available");
    return [];
  }

  try {
    const results = await db
      .select({
        id: bids.id,
        userId: bids.userId,
        vehicleId: bids.vehicleId,
        amount: bids.amount,
        status: bids.status,
        createdAt: bids.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(bids)
      .leftJoin(users, eq(bids.userId, users.id))
      .where(eq(bids.vehicleId, vehicleId))
      .orderBy(asc(bids.createdAt))
      .limit(limit);

    return results;
  } catch (error) {
    console.error("[Database] Error fetching bids by vehicle:", error);
    return [];
  }
}

export async function getRecentBids(limit: number = 50) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get recent bids: database not available");
    return [];
  }

  try {
    const results = await db
      .select({
        id: bids.id,
        userId: bids.userId,
        vehicleId: bids.vehicleId,
        amount: bids.amount,
        status: bids.status,
        createdAt: bids.createdAt,
        userName: users.name,
        userEmail: users.email,
        vehicleTitle: vehicles.title,
        vehicleLotNumber: vehicles.lotNumber,
      })
      .from(bids)
      .leftJoin(users, eq(bids.userId, users.id))
      .leftJoin(vehicles, eq(bids.vehicleId, vehicles.id))
      .orderBy(desc(bids.createdAt))
      .limit(limit);

    return results;
  } catch (error) {
    console.error("[Database] Error fetching recent bids:", error);
    return [];
  }
}

// Price history functions
export async function createPriceHistory(history: InsertPriceHistory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(priceHistory).values(history);
}

export async function getPriceHistoryByVehicle(vehicleId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(priceHistory)
    .where(eq(priceHistory.vehicleId, vehicleId))
    .orderBy(desc(priceHistory.changedAt));
}

// Sync logs functions
export async function createSyncLog(log: InsertSyncLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(syncLogs).values(log);
}

export async function getRecentSyncLogs(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(syncLogs)
    .orderBy(desc(syncLogs.createdAt))
    .limit(limit);
}

// Site settings functions
export async function getSetting(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertSetting(setting: InsertSiteSetting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(siteSettings).values(setting).onDuplicateKeyUpdate({
    set: { value: setting.value, updatedAt: new Date() },
  });
}

export async function getAllSettings() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(siteSettings);
}

// Site stats functions
export async function getTodayStats() {
  const db = await getDb();
  if (!db) return undefined;
  const today = new Date().toISOString().split('T')[0];
  const result = await db.select().from(siteStats).where(eq(siteStats.date, today)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertTodayStats(stats: Partial<InsertSiteStats>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const today = new Date().toISOString().split('T')[0];
  
  const existing = await getTodayStats();
  if (existing) {
    await db.update(siteStats).set(stats).where(eq(siteStats.date, today));
  } else {
    await db.insert(siteStats).values({ date: today, ...stats });
  }
}

export async function getStatsLast30Days() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(siteStats)
    .orderBy(desc(siteStats.date))
    .limit(30);
}

// Dashboard statistics
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) {
    const fallbackVehicles = await getFallbackVehicles();
    const activeVehicles = fallbackVehicles.filter(vehicle => vehicle.active === 1);
    const featuredVehicles = activeVehicles.filter(vehicle => vehicle.featured === 1);

    return {
      totalVehicles: fallbackVehicles.length,
      activeVehicles: activeVehicles.length,
      featuredVehicles: featuredVehicles.length,
      todayViews: 0,
      todayVisitors: 0,
    };
  }

  const [totalVehiclesResult] = await db.select({ count: sql<number>`count(*)` })
    .from(vehicles);
  
  const [activeVehiclesResult] = await db.select({ count: sql<number>`count(*)` })
    .from(vehicles)
    .where(eq(vehicles.active, 1));
  
  const [featuredVehiclesResult] = await db.select({ count: sql<number>`count(*)` })
    .from(vehicles)
    .where(sql`${vehicles.featured} = 1 AND ${vehicles.active} = 1`);

  const todayStats = await getTodayStats();

  return {
    totalVehicles: Number(totalVehiclesResult?.count || 0),
    activeVehicles: Number(activeVehiclesResult?.count || 0),
    featuredVehicles: Number(featuredVehiclesResult?.count || 0),
    todayViews: todayStats?.pageViews || 0,
    todayVisitors: todayStats?.uniqueVisitors || 0,
  };
}

// Sync logs
export async function getSyncLogs(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(syncLogs)
    .orderBy(desc(syncLogs.createdAt))
    .limit(limit);
}

// Search and filter functions
export async function searchVehicles(query: string, limit: number = 10) {
  const db = await getDb();
  if (!db) {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.length === 0) {
      return [];
    }

    const fallbackVehicles = await getFallbackVehicles();
    return fallbackVehicles
      .filter(vehicle => {
        if (vehicle.active !== 1) return false;
        const fields = [
          vehicle.title,
          vehicle.brand,
          vehicle.model,
          vehicle.lotNumber,
          vehicle.description,
          vehicle.location,
        ];

        return fields.some(value => value?.toLowerCase().includes(normalizedQuery));
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, limit);
  }

  const searchTerm = `%${query}%`;

  return await db.select().from(vehicles)
    .where(sql`
      ${vehicles.active} = 1 AND (
        ${vehicles.title} LIKE ${searchTerm} OR
        ${vehicles.brand} LIKE ${searchTerm} OR
        ${vehicles.model} LIKE ${searchTerm} OR
        ${vehicles.lotNumber} LIKE ${searchTerm} OR
        ${vehicles.description} LIKE ${searchTerm}
      )
    `)
    .orderBy(desc(vehicles.createdAt))
    .limit(limit);
}

export async function getFilteredVehicles(filters: {
  brands?: string[];
  years?: number[];
  conditions?: string[];
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) {
    const safeFilters = filters ?? {};
    const fallbackVehicles = await getFallbackVehicles();
    const activeVehicles = fallbackVehicles.filter(vehicle => vehicle.active === 1);

    const brandSet = safeFilters.brands?.length
      ? new Set(safeFilters.brands.map(brand => brand.toLowerCase()))
      : null;
    const yearSet = safeFilters.years?.length ? new Set(safeFilters.years) : null;
    const conditionSet = safeFilters.conditions?.length
      ? new Set(safeFilters.conditions.map(condition => condition.toLowerCase()))
      : null;

    const filteredVehicles = activeVehicles.filter(vehicle => {
      if (brandSet && (!vehicle.brand || !brandSet.has(vehicle.brand.toLowerCase()))) {
        return false;
      }

      if (yearSet && (!vehicle.year || !yearSet.has(vehicle.year))) {
        return false;
      }

      if (conditionSet && (!vehicle.condition || !conditionSet.has(vehicle.condition.toLowerCase()))) {
        return false;
      }

      return true;
    });

    const limit = safeFilters.limit ?? 20;
    const offset = safeFilters.offset ?? 0;

    const sortedVehicles = filteredVehicles.sort((a, b) => {
      const featuredDiff = (b.featured ?? 0) - (a.featured ?? 0);
      if (featuredDiff !== 0) {
        return featuredDiff;
      }
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    const items = sortedVehicles.slice(offset, offset + limit);

    return { items, total: filteredVehicles.length };
  }

  const clauses = [eq(vehicles.active, 1)];

  if (filters.brands && filters.brands.length > 0) {
    clauses.push(inArray(vehicles.brand, filters.brands));
  }

  if (filters.years && filters.years.length > 0) {
    clauses.push(inArray(vehicles.year, filters.years));
  }

  if (filters.conditions && filters.conditions.length > 0) {
    clauses.push(inArray(vehicles.condition, filters.conditions));
  }

  const whereClause = clauses.length > 1 ? and(...clauses) : clauses[0];
  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(vehicles)
      .where(whereClause)
      .orderBy(desc(vehicles.featured), desc(vehicles.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(vehicles)
      .where(whereClause),
  ]);

  const total = Number(totalResult[0]?.count ?? 0);

  return { items, total };
}

export async function getUpcomingAuctions(limit: number = 8) {
  const db = await getDb();
  if (!db) {
    return await getFallbackUpcomingAuctions(limit);
  }

  const now = new Date();

  const rawVehicles = await db
    .select({
      id: vehicles.id,
      location: vehicles.location,
      auctionDate: vehicles.auctionDate,
      auctionTime: vehicles.auctionTime,
    })
    .from(vehicles)
    .where(
      and(
        eq(vehicles.active, 1),
        isNotNull(vehicles.auctionDate),
        gte(vehicles.auctionDate, now)
      )
    )
    .orderBy(vehicles.auctionDate)
    .limit(limit * 5);

  type AuctionGroup = {
    key: string;
    auctionDate: Date;
    location: string | null;
    vehicleCount: number;
    auctionTimes: Set<string>;
  };

  const groups = new Map<string, AuctionGroup>();

  for (const item of rawVehicles) {
    if (!item.auctionDate) continue;
    const location = item.location ?? "Localização não informada";
    const dateKey = `${item.auctionDate.toISOString().split("T")[0]}|${location}`;
    let group = groups.get(dateKey);
    if (!group) {
      group = {
        key: dateKey,
        auctionDate: item.auctionDate,
        location,
        vehicleCount: 0,
        auctionTimes: new Set<string>(),
      };
      groups.set(dateKey, group);
    }

    if (item.auctionDate < group.auctionDate) {
      group.auctionDate = item.auctionDate;
    }

    group.vehicleCount += 1;

    if (item.auctionTime) {
      group.auctionTimes.add(item.auctionTime);
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

export async function getVehicleCount() {
  const db = await getDb();
  if (!db) {
    const fallbackVehicles = await getFallbackVehicles();
    return fallbackVehicles.filter(vehicle => vehicle.active === 1).length;
  }

  const [result] = await db.select({ count: sql<number>`count(*)` })
    .from(vehicles)
    .where(eq(vehicles.active, 1));
  
  return Number(result?.count || 0);
}


// Notification functions
export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(notifications).values(notification);
}

export async function getUserNotifications(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadNotificationsCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const [result] = await db.select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(sql`${notifications.userId} = ${userId} AND ${notifications.read} = 0`);
  
  return Number(result?.count || 0);
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ read: 1 }).where(eq(notifications.id, id));
}

export async function markAllNotificationsAsRead(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ read: 1 }).where(eq(notifications.userId, userId));
}

// Get all users (admin only)
export async function getAllUsers() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get users: database not available");
    return [];
  }

  try {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    return allUsers;
  } catch (error) {
    console.error("[Database] Error fetching users:", error);
    return [];
  }
}

// Get user count
export async function getUserCount() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user count: database not available");
    return 0;
  }

  try {
    const result = await db.select({ count: sql<number>`count(*)` }).from(users);
    return result[0]?.count || 0;
  } catch (error) {
    console.error("[Database] Error counting users:", error);
    return 0;
  }
}

// Analytics: User growth over time
export async function getUserGrowthStats(days: number = 30) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user growth stats: database not available");
    return [];
  }

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await db
      .select({
        date: sql<string>`DATE(createdAt) as date`,
        count: sql<number>`COUNT(*) as count`,
      })
      .from(users)
      .where(sql`${users.createdAt} >= ${startDate}`)
      .groupBy(sql`date`)
      .orderBy(sql`date`);

    return result;
  } catch (error) {
    console.error("[Database] Error fetching user growth stats:", error);
    return [];
  }
}

// Analytics: Most viewed vehicles
export async function getMostViewedVehicles(limit: number = 10) {
  const db = await getDb();
  if (!db) {
    const fallbackVehicles = await getFallbackVehicles();
    return fallbackVehicles
      .filter(vehicle => vehicle.active === 1)
      .sort((a, b) => b.currentBid - a.currentBid)
      .slice(0, limit)
      .map((vehicle, index) => ({
        ...vehicle,
        views: computePseudoViews(vehicle, index),
      }));
  }

  try {
    // Since we don't have a views table yet, we'll return top vehicles by currentBid as placeholder
    const result = await db
      .select()
      .from(vehicles)
      .orderBy(desc(vehicles.currentBid))
      .limit(limit);

    return result.map(v => ({
      ...v,
      views: Math.floor(Math.random() * 1000) + 100, // Placeholder views
    }));
  } catch (error) {
    console.error("[Database] Error fetching most viewed vehicles:", error);
    return [];
  }
}

// Analytics: Bid statistics
export async function getBidStatistics() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get bid statistics: database not available");
    return {
      totalBids: 0,
      vehiclesWithBids: 0,
      totalBidValue: 0,
      averageBidValue: 0,
      topBiddedVehicles: [],
    };
  }

  try {
    const [totalBidsResult, vehiclesWithBidsResult, totalValueResult] = await Promise.all([
      db.select({ count: sql<number>`COUNT(*)` }).from(bids),
      db.select({ count: sql<number>`COUNT(DISTINCT ${bids.vehicleId})` }).from(bids),
      db.select({ sum: sql<number>`COALESCE(SUM(${bids.amount}), 0)` }).from(bids),
    ]);

    const totalBids = Number(totalBidsResult?.[0]?.count || 0);
    const vehiclesWithBids = Number(vehiclesWithBidsResult?.[0]?.count || 0);
    const totalBidValue = Number(totalValueResult?.[0]?.sum || 0);
    const averageBidValue = totalBids > 0 ? Math.round(totalBidValue / totalBids) : 0;

    const topBiddedVehiclesRaw = await db
      .select({
        id: vehicles.id,
        title: vehicles.title,
        lotNumber: vehicles.lotNumber,
        highestBid: sql<number>`MAX(${bids.amount})`,
      })
      .from(bids)
      .innerJoin(vehicles, eq(bids.vehicleId, vehicles.id))
      .groupBy(vehicles.id, vehicles.title, vehicles.lotNumber);

    const topBiddedVehicles = topBiddedVehiclesRaw
      .map(vehicle => ({
        ...vehicle,
        highestBid: Number(vehicle.highestBid || 0),
      }))
      .sort((a, b) => b.highestBid - a.highestBid)
      .slice(0, 5);

    return {
      totalBids,
      vehiclesWithBids,
      totalBidValue,
      averageBidValue,
      topBiddedVehicles,
    };
  } catch (error) {
    console.error("[Database] Error fetching bid statistics:", error);
    return {
      totalBids: 0,
      vehiclesWithBids: 0,
      totalBidValue: 0,
      averageBidValue: 0,
      topBiddedVehicles: [],
    };
  }
}
