import Database from 'better-sqlite3';
import path from 'path';
import { mkdirSync, existsSync } from 'fs';

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

export default db;
