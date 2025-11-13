import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, vehicles, priceHistory, syncLogs, siteSettings, siteStats, notifications, InsertVehicle, InsertPriceHistory, InsertSyncLog, InsertSiteSetting, InsertSiteStats, InsertNotification } from "../drizzle/schema";
import { ENV } from './_core/env';

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
  if (!db) return [];
  return await db.select().from(vehicles).where(eq(vehicles.active, 1)).orderBy(desc(vehicles.createdAt));
}

export async function getVehicleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getFeaturedVehicles(limit: number = 4) {
  const db = await getDb();
  if (!db) return [];
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
  if (!db) return {
    totalVehicles: 0,
    activeVehicles: 0,
    featuredVehicles: 0,
    todayViews: 0,
    todayVisitors: 0,
  };

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
  if (!db) return [];
  
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
  brand?: string;
  year?: number;
  condition?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(vehicles.active, 1)];
  
  if (filters.brand) {
    conditions.push(eq(vehicles.brand, filters.brand));
  }
  
  if (filters.year) {
    conditions.push(eq(vehicles.year, filters.year));
  }
  
  if (filters.condition) {
    conditions.push(eq(vehicles.condition, filters.condition));
  }
  
  return await db.select().from(vehicles)
    .where(sql`${sql.join(conditions, sql` AND `)}`)
    .orderBy(desc(vehicles.createdAt))
    .limit(filters.limit || 20)
    .offset(filters.offset || 0);
}

export async function getVehicleCount() {
  const db = await getDb();
  if (!db) return 0;
  
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
