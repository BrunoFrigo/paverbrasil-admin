import bcryptjs from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { getDb } from './db';
import { users } from '../drizzle/schema';

const SALT_ROUNDS = 10;
const ADMIN_USERNAME = 'claudineifrigo';
const ADMIN_PASSWORD = 'paverbrasil2026';

/**
 * Hash a password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, SALT_ROUNDS);
}

/**
 * Compare a password with a hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash);
}

/**
 * Get user by username
 */
export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Authenticate user with username and password
 */
export async function authenticateUser(username: string, password: string) {
  const user = await getUserByUsername(username);
  if (!user || !user.passwordHash) {
    return null;
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    return null;
  }

  return user;
}

/**
 * Initialize admin user if it doesn't exist
 */
export async function initializeAdminUser() {
  const db = await getDb();
  if (!db) {
    console.warn('[Auth] Cannot initialize admin user: database not available');
    return;
  }

  try {
    const existingAdmin = await getUserByUsername(ADMIN_USERNAME);
    if (existingAdmin) {
      console.log('[Auth] Admin user already exists');
      return;
    }

    const passwordHash = await hashPassword(ADMIN_PASSWORD);
    await db.insert(users).values({
      openId: 'local-admin-user',
      username: ADMIN_USERNAME,
      passwordHash,
      name: 'Administrador PaverBrasil',
      email: 'admin@paverbrasil.com',
      role: 'admin',
      loginMethod: 'local',
      lastSignedIn: new Date(),
    });

    console.log('[Auth] Admin user initialized successfully');
  } catch (error) {
    console.error('[Auth] Failed to initialize admin user:', error);
  }
}
