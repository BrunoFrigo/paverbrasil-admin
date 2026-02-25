import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, clients, products, quotations, notes, settings } from "../drizzle/schema";
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

// Clientes queries
export async function getClients() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(clients);
  return result;
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createClient(data: any) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(clients).values(data);
  return result;
}

export async function updateClient(id: number, data: any) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.update(clients).set(data).where(eq(clients.id, id));
  return result;
}

export async function deleteClient(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.delete(clients).where(eq(clients.id, id));
  return result;
}

// Produtos queries
export async function getProducts() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(products);
  return result;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(data: any) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(products).values(data);
  return result;
}

export async function updateProduct(id: number, data: any) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.update(products).set(data).where(eq(products.id, id));
  return result;
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.delete(products).where(eq(products.id, id));
  return result;
}

// Quotations queries
export async function getQuotations() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(quotations);
  return result;
}

export async function getQuotationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(quotations).where(eq(quotations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createQuotation(data: any) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(quotations).values(data);
  return result;
}

export async function updateQuotation(id: number, data: any) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.update(quotations).set(data).where(eq(quotations.id, id));
  return result;
}

export async function deleteQuotation(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.delete(quotations).where(eq(quotations.id, id));
  return result;
}

// Notes queries
export async function getNotes() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(notes);
  return result;
}

export async function getNoteById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(notes).where(eq(notes.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createNote(data: any) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(notes).values(data);
  return result;
}

export async function updateNote(id: number, data: any) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.update(notes).set(data).where(eq(notes.id, id));
  return result;
}

export async function deleteNote(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.delete(notes).where(eq(notes.id, id));
  return result;
}

// Settings queries
export async function getSetting(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function setSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) return null;
  const existing = await getSetting(key);
  if (existing) {
    return db.update(settings).set({ value }).where(eq(settings.key, key));
  } else {
    return db.insert(settings).values({ key, value });
  }
}
