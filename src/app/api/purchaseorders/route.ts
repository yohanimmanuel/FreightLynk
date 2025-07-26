import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserById } from '../auth/userDb';

// Helper function to get current user from request
const getCurrentUser = (req: NextRequest) => {
  const userId = req.cookies.get('auth_token')?.value;
  if (!userId) return null;
  return getUserById(userId);
};

// Create tables with user_id for data isolation
const ensureColumns = () => {
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS purchase_orders (
      id TEXT PRIMARY KEY,
      cargoReadyBy TEXT,
      mustArriveBy TEXT,
      buyer TEXT,
      seller TEXT,
      subjectedCarrier TEXT,
      status TEXT,
      progress TEXT,
      exceptions TEXT
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS po_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poOrderNumber TEXT,
      productCode TEXT,
      productName TEXT,
      cargoReadyDate TEXT,
      mustArriveDate TEXT,
      transportMode TEXT,
      destination TEXT,
      requested INTEGER,
      booked INTEGER,
      currency TEXT,
      unitCost REAL,
      uom TEXT,
      FOREIGN KEY(poOrderNumber) REFERENCES purchase_orders(id)
    );
  `);

  // Add missing columns if they don't exist
  try {
    db.exec('ALTER TABLE purchase_orders ADD COLUMN user_id TEXT');
    console.log('Added user_id column to purchase_orders');
  } catch (e) {
    // Column already exists
  }

  try {
    db.exec('ALTER TABLE purchase_orders ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
    console.log('Added created_at column to purchase_orders');
  } catch (e) {
    // Column already exists
  }

  try {
    db.exec('ALTER TABLE purchase_orders ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP');
    console.log('Added updated_at column to purchase_orders');
  } catch (e) {
    // Column already exists
  }

  try {
    db.exec('ALTER TABLE po_details ADD COLUMN user_id TEXT');
    console.log('Added user_id column to po_details');
  } catch (e) {
    // Column already exists
  }

  try {
    db.exec('ALTER TABLE po_details ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
    console.log('Added created_at column to po_details');
  } catch (e) {
    // Column already exists
  }
};

// Initialize tables and ensure all columns exist
ensureColumns();

export async function GET(req: NextRequest) {
  try {
    // Get current user from session/auth
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only return purchase orders for the current user
    const stmt = db.prepare('SELECT * FROM purchase_orders WHERE user_id = ? ORDER BY created_at DESC');
    const orders = stmt.all(user.id);
    console.log(`Retrieved ${orders.length} purchase orders for user ${user.id}`);
    return NextResponse.json(orders);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get current user from session/auth
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    console.log(`Creating purchase order for user ${user.id}:`, data);

    // Insert into purchase_orders with user_id
    if (!data.id) data.id = `PO${Date.now()}`;
    const exceptionsValue = Array.isArray(data.exceptions) 
      ? data.exceptions.join(', ')
      : (data.exceptions || '');
    
    const values = [
      data.id,
      user.id, // Add user_id
      data.cargoReadyBy,
      data.mustArriveBy,
      data.buyer,
      data.seller,
      data.subjectedCarrier,
      data.status,
      data.progress,
      exceptionsValue
    ];

    const sql = `
      INSERT INTO purchase_orders 
      (id, user_id, cargoReadyBy, mustArriveBy, buyer, seller, subjectedCarrier, status, progress, exceptions, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;
    
    const insertPO = db.prepare(sql);
    const result = insertPO.run(...values);
    
    console.log(`Created purchase order ${data.id} for user ${user.id}`);
    
    // Insert PO details with user_id
    let insertedDetails = [];
    if (Array.isArray(data.details) && data.details.length > 0) {
      const insertDetail = db.prepare(`
        INSERT INTO po_details 
        (poOrderNumber, user_id, productCode, productName, cargoReadyDate, mustArriveDate, transportMode, destination, requested, booked, currency, unitCost, uom, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      const insertMany = db.transaction((items: any[]) => {
        return items.map((d: any) => {
          return insertDetail.run(
            data.id,
            user.id, // Add user_id to details
            d.productCode,
            d.productName,
            d.cargoReadyDate,
            d.mustArriveDate,
            d.transportMode,
            d.destination,
            d.requested,
            d.booked,
            d.currency,
            d.unitCost,
            d.uom
          );
        });
      });
      insertedDetails = insertMany(data.details);
      console.log(`Inserted ${insertedDetails.length} PO details for user ${user.id}`);
    }
    
    return NextResponse.json({ 
      success: true, 
      id: data.id,
      detailsInserted: insertedDetails.length
    }, { status: 201 });

  } catch (err: any) {
    console.error('POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


