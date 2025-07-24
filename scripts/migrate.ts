import path from 'path';
import { mkdirSync, existsSync } from 'fs';
import Database from 'better-sqlite3';

// Database file will be created in the .data directory
const dbPath = path.join(process.cwd(), '.data', 'freightlynk.db');

// Create the .data directory if it doesn't exist
const dataDir = path.join(process.cwd(), '.data');
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

// Initialize the database
const db = new Database(dbPath);

// Run migrations
const runMigrations = () => {
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      fullName TEXT,
      companyName TEXT,
      role TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add any additional tables or migrations here
  // db.exec(`
  //   CREATE TABLE IF NOT EXISTS ...
  // `);

  console.log('Database migrations completed successfully');
};

// Run the migrations
try {
  runMigrations();
  process.exit(0);
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}
