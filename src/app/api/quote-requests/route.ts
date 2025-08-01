import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserById } from '../auth/userDb';

const getCurrentUser = () => {
  // For development, always return a mock user
  return {
    id: 'demo-user',
    username: 'demo-user',
    role: 'forwarder'
  };
};

// Create quote_requests table with user_id for data isolation
const ensureQuoteRequestsTable = () => {
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS quote_requests (
      id TEXT PRIMARY KEY,
      request_id TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      forwarder_user_id TEXT,
      booking_id TEXT,
      customer_name TEXT,
      commodities TEXT,
      details TEXT,
      origin TEXT,
      destination TEXT,
      cargo_ready_date TEXT,
      target_delivery_date TEXT,
      attachment TEXT,
      status TEXT DEFAULT 'pending',
      incoterms TEXT,
      created_by TEXT,
      created_on TEXT,
      mode TEXT,
      notes TEXT,
      provider TEXT,
      transit_time TEXT,
      quoted_amount REAL,
      quoted_currency TEXT DEFAULT 'USD',
      quoted_valid_until TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add missing columns if they don't exist
  try {
    db.exec('ALTER TABLE quote_requests ADD COLUMN quoted_amount REAL;');
  } catch (error) {
    // Column already exists, ignore error
  }

  try {
    db.exec('ALTER TABLE quote_requests ADD COLUMN quoted_currency TEXT DEFAULT "USD";');
  } catch (error) {
    // Column already exists, ignore error
  }

  try {
    db.exec('ALTER TABLE quote_requests ADD COLUMN quoted_valid_until TEXT;');
  } catch (error) {
    // Column already exists, ignore error
  }
};

// Initialize table
ensureQuoteRequestsTable();

// Mock data for development
const mockQuoteRequests = [
  {
    id: 'qr-1',
    request_id: 'QR-1001',
    user_id: 'demo-user',
    forwarder_user_id: 'demo-user',
    customer_name: 'Acme Electronics',
    commodities: 'Consumer Electronics (Laptops, Tablets)',
    details: '1x40ft High Cube Container, 20,000 kg',
    origin: 'Shenzhen, CN',
    destination: 'Los Angeles, US',
    cargo_ready_date: '2025-07-25',
    target_delivery_date: '2025-08-05',
    attachment: 'invoice-1001.pdf',
    status: 'pending',
    incoterms: 'FOB',
    created_by: 'John Doe',
    created_on: '2025-07-20',
    mode: 'FCL',
    notes: 'Handle with care. Fragile items.',
    provider: 'Global Forwarders Ltd',
    transit_time: '12 days',
    quoted_amount: null,
    quoted_currency: 'USD',
    quoted_valid_until: null,
    created_at: '2025-07-20T10:00:00Z',
    updated_at: '2025-07-20T10:00:00Z'
  },
  {
    id: 'qr-2',
    request_id: 'QR-1002',
    user_id: 'demo-user',
    forwarder_user_id: 'demo-user',
    customer_name: 'Beta Textiles',
    commodities: 'Cotton Textile Rolls',
    details: '2x20ft Standard Containers, 16,000 kg total',
    origin: 'Ho Chi Minh City, VN',
    destination: 'Hamburg, DE',
    cargo_ready_date: '2025-07-22',
    target_delivery_date: '2025-08-10',
    attachment: 'packinglist-2002.pdf',
    status: 'quoted',
    incoterms: 'CIF',
    created_by: 'Jane Smith',
    created_on: '2025-07-18',
    mode: 'FCL',
    notes: 'Urgent shipment for seasonal demand.',
    provider: 'Oceanic Logistics',
    transit_time: '18 days',
    quoted_amount: 4500.00,
    quoted_currency: 'USD',
    quoted_valid_until: '2025-08-15',
    created_at: '2025-07-18T14:30:00Z',
    updated_at: '2025-07-22T09:15:00Z'
  },
  {
    id: 'qr-3',
    request_id: 'QR-1003',
    user_id: 'demo-user',
    forwarder_user_id: 'demo-user',
    customer_name: 'Delta Auto Parts',
    commodities: 'Automotive Engine Parts',
    details: '1 air pallet, 1,200 kg, 2.5 CBM',
    origin: 'Nagoya, JP',
    destination: 'Chicago, US',
    cargo_ready_date: '2025-07-16',
    target_delivery_date: '2025-07-24',
    attachment: 'specsheet-3003.pdf',
    status: 'accepted',
    incoterms: 'EXW',
    created_by: 'Carlos Ruiz',
    created_on: '2025-07-15',
    mode: 'AIR',
    notes: 'Deliver ASAP. Customer waiting.',
    provider: 'SkyTrans Express',
    transit_time: '3 days',
    quoted_amount: 2800.00,
    quoted_currency: 'USD',
    quoted_valid_until: '2025-07-30',
    created_at: '2025-07-15T11:20:00Z',
    updated_at: '2025-07-20T16:45:00Z'
  }
];

// Insert mock data if table is empty
let mockDataInserted = false;
const insertMockData = () => {
  if (mockDataInserted) return; // Prevent multiple insertions
  
  try {
    const count = db.prepare('SELECT COUNT(*) as count FROM quote_requests').get() as { count: number };
    if (count.count === 0) {
      const insert = db.prepare(`
        INSERT INTO quote_requests (
          id, request_id, user_id, forwarder_user_id, customer_name, commodities, 
          details, origin, destination, cargo_ready_date, target_delivery_date,
          attachment, status, incoterms, created_by, created_on, mode, notes,
          provider, transit_time, quoted_amount, quoted_currency, quoted_valid_until,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      mockQuoteRequests.forEach((request: any) => {
        insert.run(
          request.id, request.request_id, request.user_id, request.forwarder_user_id,
          request.customer_name, request.commodities, request.details, request.origin,
          request.destination, request.cargo_ready_date, request.target_delivery_date,
          request.attachment, request.status, request.incoterms, request.created_by,
          request.created_on, request.mode, request.notes, request.provider,
          request.transit_time, request.quoted_amount, request.quoted_currency,
          request.quoted_valid_until, request.created_at, request.updated_at
        );
      });
      console.log('Inserted mock quote requests data');
      mockDataInserted = true;
    }
  } catch (error) {
    console.error('Error inserting mock data:', error);
  }
};

// Initialize with mock data
insertMockData();

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'forwarder';
    const mode = searchParams.get('mode') || 'all';
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    let query = `
      SELECT * FROM quote_requests 
      WHERE 1=1
    `;
    const params: any[] = [];

    // Role-based filtering
    if (role === 'forwarder') {
      query += ` AND forwarder_user_id = ?`;
      params.push(user.id);
    } else if (role === 'client') {
      query += ` AND user_id = ?`;
      params.push(user.id);
    }

    // Mode filtering
    if (mode !== 'all') {
      query += ` AND mode = ?`;
      params.push(mode.toUpperCase());
    }

    // Status filtering
    if (status !== 'all') {
      query += ` AND status = ?`;
      params.push(status.toLowerCase());
    }

    // Search filtering
    if (search) {
      query += ` AND (
        customer_name LIKE ? OR 
        commodities LIKE ? OR 
        origin LIKE ? OR 
        destination LIKE ? OR
        request_id LIKE ?
      )`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ` ORDER BY created_at DESC`;

    const stmt = db.prepare(query);
    const quoteRequests = stmt.all(...params);

    return NextResponse.json(quoteRequests);
  } catch (error) {
    console.error('Error fetching quote requests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      request_id,
      forwarder_user_id,
      booking_id,
      customer_name,
      commodities,
      details,
      origin,
      destination,
      cargo_ready_date,
      target_delivery_date,
      attachment,
      incoterms,
      mode,
      notes
    } = body;

    const id = `qr-${Date.now()}`;
    const now = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO quote_requests (
        id, request_id, user_id, forwarder_user_id, booking_id, customer_name,
        commodities, details, origin, destination, cargo_ready_date, target_delivery_date,
        attachment, status, incoterms, created_by, created_on, mode, notes,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      id, request_id, user.id, forwarder_user_id, booking_id, customer_name,
      commodities, details, origin, destination, cargo_ready_date, target_delivery_date,
      attachment || 'No attached file', 'pending', incoterms, user.username,
      new Date().toLocaleDateString('en-CA'), mode, notes, now, now
    );

    return NextResponse.json({ 
      success: true, 
      id: result.lastInsertRowid,
      message: 'Quote request created successfully' 
    });
  } catch (error) {
    console.error('Error creating quote request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    const updateFields = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const updateValues = Object.values(updates);
    updateValues.push(new Date().toISOString()); // updated_at
    updateValues.push(id); // WHERE clause

    const update = db.prepare(`
      UPDATE quote_requests 
      SET ${updateFields}, updated_at = ? 
      WHERE id = ?
    `);

    const result = update.run(...updateValues);

    if (result.changes > 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'Quote request updated successfully' 
      });
    } else {
      return NextResponse.json({ error: 'Quote request not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating quote request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Quote request ID is required' }, { status: 400 });
    }

    const deleteStmt = db.prepare('DELETE FROM quote_requests WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes > 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'Quote request deleted successfully' 
      });
    } else {
      return NextResponse.json({ error: 'Quote request not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting quote request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 