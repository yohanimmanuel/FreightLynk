import Database from 'better-sqlite3';
import path from 'path';
import { mkdirSync, existsSync } from 'fs';
import { User } from '@/app/api/auth/users';

// Database file will be created in the .data directory
const dbPath = path.join(process.cwd(), '.data', 'freightlynk.db');

// Create the .data directory if it doesn't exist
const dataDir = path.join(process.cwd(), '.data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Create a single shared connection
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 30000');

// Helper function to map database row to User type
const mapRowToUser = (row: any): User | undefined => {
  if (!row) return undefined;
  return {
    id: row.id,
    username: row.username,
    password: row.password,
    fullName: row.fullName || undefined,
    companyName: row.companyName || undefined,
    companyAddress: row.companyAddress || undefined,
    companyWebsite: row.companyWebsite || undefined,
    companySize: row.companySize || undefined,
    userType: row.userType || undefined,
    otherUserType: row.otherUserType || undefined,
    businessOperations: row.businessOperations || undefined,
    goodsTypes: row.goodsTypes || undefined,
    shippingFrequency: row.shippingFrequency || undefined,
    primaryRoutes: row.primaryRoutes || undefined,
    jobTitle: row.jobTitle || undefined,
    phone: row.phone || undefined,
    role: row.role as User['role'],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
};

// User related functions (use shared db)
export const addUser = (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { id: string }) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      fullName TEXT,
      companyName TEXT,
      companyAddress TEXT,
      companyWebsite TEXT,
      companySize TEXT,
      userType TEXT,
      otherUserType TEXT,
      businessOperations TEXT,
      goodsTypes TEXT,
      shippingFrequency TEXT,
      primaryRoutes TEXT,
      jobTitle TEXT,
      phone TEXT,
      role TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  const stmt = db.prepare(`
    INSERT INTO users (
      id, username, password, fullName, companyName, companyAddress, companyWebsite, companySize, userType, otherUserType, businessOperations, goodsTypes, shippingFrequency, primaryRoutes, jobTitle, phone, role
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    user.id,
    user.username,
    user.password,
    user.fullName || null,
    user.companyName || null,
    user.companyAddress || null,
    user.companyWebsite || null,
    user.companySize || null,
    user.userType || null,
    user.otherUserType || null,
    user.businessOperations || null,
    user.goodsTypes || null,
    user.shippingFrequency || null,
    user.primaryRoutes || null,
    user.jobTitle || null,
    user.phone || null,
    user.role
  );
  // Return the newly created user
  const newUser = findUserByUsername(user.username);
  if (!newUser) {
    throw new Error('Failed to create user');
  }
  return newUser;
};

export const findUserByUsername = (username: string): User | undefined => {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const row = stmt.get(username);
  return mapRowToUser(row);
};

export const validateUser = (username: string, password: string): User | undefined => {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?');
  const row = stmt.get(username, password);
  return mapRowToUser(row);
};

export const getUserById = (id: string): User | undefined => {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const row = stmt.get(id);
  return mapRowToUser(row);
};

export default db;
