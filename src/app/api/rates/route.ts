import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserById } from '../auth/userDb';

// Helper function to get current user from request
const getCurrentUser = (req: NextRequest) => {
  const userId = req.cookies.get('auth_token')?.value;
  if (!userId) return null;
  return getUserById(userId);
};

// Create rates table with user_id for data isolation
const ensureRatesTable = () => {
  // Drop existing table to ensure correct schema
  try {
    db.exec('DROP TABLE IF EXISTS rates');
    console.log('Dropped existing rates table');
  } catch (error) {
    console.log('No existing rates table to drop');
  }

  // Create main rates table with all possible fields
  db.exec(`
    CREATE TABLE rates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      mode TEXT NOT NULL,
      provider TEXT,
      agent TEXT,
      origin TEXT,
      destination TEXT,
      currency TEXT,
      transitTime TEXT,
      portOfDischarge TEXT,
      transitPort TEXT,
      remark TEXT,
      commodity TEXT,
      createdBy TEXT,
      validFrom TEXT,
      validTo TEXT,
      createdOn TEXT,
      type TEXT,
      createType TEXT,
      service TEXT,
      serviceCode TEXT,
      note TEXT,
      contract TEXT,
      frequency TEXT,
      status TEXT DEFAULT 'active',
      ocean20dc TEXT,
      ocean40dc TEXT,
      ocean40hc TEXT,
      ocean45hc TEXT,
      ocean20rf TEXT,
      ocean40rf TEXT,
      ocean20tank TEXT,
      ocean40tank TEXT,
      ocean20fr TEXT,
      ocean40fr TEXT,
      ocean20ot TEXT,
      ocean40ot TEXT,
      price TEXT,
      baseRate TEXT,
      minCharge TEXT,
      originAirport TEXT,
      destinationAirport TEXT,
      airline TEXT,
      rate45 TEXT,
      rate100 TEXT,
      rate300 TEXT,
      rate500 TEXT,
      rate1000 TEXT,
      truckType TEXT,
      rate TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  console.log('Rates table initialized successfully');
};

// Initialize table
ensureRatesTable();

export async function GET(req: NextRequest) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      console.log('GET /api/rates - No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('GET /api/rates - User authenticated:', user.id);

    const { searchParams } = new URL(req.url);
    const rateId = searchParams.get('id');
    const mode = searchParams.get('mode');

    if (rateId) {
      // Get specific rate
      const rate = db.prepare(`
        SELECT * FROM rates WHERE id = ? AND user_id = ?
      `).get(rateId, user.id);

      if (!rate) {
        return NextResponse.json({ error: 'Rate not found' }, { status: 404 });
      }

      return NextResponse.json(rate);
    } else {
      // Get all rates for user, optionally filtered by mode
      let query = `
        SELECT * FROM rates WHERE user_id = ?
      `;
      let params = [user.id];

      if (mode) {
        query += ` AND mode = ?`;
        params.push(mode);
      }

      query += ` ORDER BY created_at DESC`;

      const rates = db.prepare(query).all(...params);

      console.log(`Retrieved ${rates.length} rates for user ${user.id}`);
      return NextResponse.json(rates);
    }
  } catch (err: any) {
    console.error('GET rates error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      console.log('POST /api/rates - No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    console.log(`Creating rate for user ${user.id}:`, data);

    // Validate required fields
    if (!data.mode) {
      return NextResponse.json({ error: 'Mode is required' }, { status: 400 });
    }



    // Insert rate
    const insertRate = db.prepare(`
      INSERT INTO rates (
        user_id, mode, provider, agent, origin, destination, currency, transitTime,
        portOfDischarge, transitPort, remark, commodity, createdBy, validFrom, validTo,
        createdOn, type, createType, service, serviceCode, note, contract, frequency, status,
        ocean20dc, ocean40dc, ocean40hc, ocean45hc, ocean20rf, ocean40rf, ocean20tank, ocean40tank,
        ocean20fr, ocean40fr, ocean20ot, ocean40ot, price, baseRate, minCharge,
        originAirport, destinationAirport, airline, rate45, rate100, rate300, rate500, rate1000,
        truckType, rate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertRate.run(
      user.id,                    // 1
      data.mode,                  // 2
      data.provider || '',        // 3
      data.agent || '',           // 4
      data.origin || '',          // 5
      data.destination || '',     // 6
      data.currency || '',        // 7
      data.transitTime || '',     // 8
      data.portOfDischarge || '', // 9
      data.transitPort || '',     // 10
      data.remark || '',          // 11
      data.commodity || '',       // 12
      data.createdBy || '',       // 13
      data.validFrom || '',       // 14
      data.validTo || '',         // 15
      data.createdOn || '',       // 16
      data.type || '',            // 17
      data.createType || '',      // 18
      data.service || '',         // 19
      data.serviceCode || '',     // 20
      data.note || '',            // 21
      data.contract || '',        // 22
      data.frequency || '',       // 23
      data.status || 'active',    // 24
      // FCL fields
      data.ocean20dc || '',       // 25
      data.ocean40dc || '',       // 26
      data.ocean40hc || '',       // 27
      data.ocean45hc || '',       // 28
      data.ocean20rf || '',       // 29
      data.ocean40rf || '',       // 30
      data.ocean20tank || '',     // 31
      data.ocean40tank || '',     // 32
      data.ocean20fr || '',       // 33
      data.ocean40fr || '',       // 34
      data.ocean20ot || '',       // 35
      data.ocean40ot || '',       // 36
      // LCL fields
      data.price || '',           // 37
      data.baseRate || '',        // 38
      data.minCharge || '',       // 39
      // AIR fields
      data.originAirport || '',   // 40
      data.destinationAirport || '', // 41
      data.airline || '',         // 42
      data.rate45 || '',          // 43
      data.rate100 || '',         // 44
      data.rate300 || '',         // 45
      data.rate500 || '',         // 46
      data.rate1000 || '',        // 47
      // FTL/LTL fields
      data.truckType || '',       // 48
      data.rate || ''             // 49
    );

    const rateId = result.lastInsertRowid;

    console.log(`Created rate ${rateId} for user ${user.id}`);

    return NextResponse.json({
      success: true,
      id: rateId
    }, { status: 201 });

  } catch (err: any) {
    console.error('POST rate error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const rateId = searchParams.get('id');
    if (!rateId) {
      return NextResponse.json({ error: 'Missing rate ID' }, { status: 400 });
    }

    const data = await req.json();
    console.log(`Updating rate ${rateId} for user ${user.id}`);

    // Update rate
    const updateRate = db.prepare(`
      UPDATE rates SET
        mode = ?, provider = ?, agent = ?, origin = ?, destination = ?, currency = ?,
        transitTime = ?, portOfDischarge = ?, transitPort = ?, remark = ?, commodity = ?,
        createdBy = ?, validFrom = ?, validTo = ?, createdOn = ?, type = ?, createType = ?,
        service = ?, serviceCode = ?, note = ?, contract = ?, frequency = ?, status = ?,
        ocean20dc = ?, ocean40dc = ?, ocean40hc = ?, ocean45hc = ?, ocean20rf = ?, ocean40rf = ?,
        ocean20tank = ?, ocean40tank = ?, ocean20fr = ?, ocean40fr = ?, ocean20ot = ?, ocean40ot = ?,
        price = ?, baseRate = ?, minCharge = ?, originAirport = ?, destinationAirport = ?,
        airline = ?, rate45 = ?, rate100 = ?, rate300 = ?, rate500 = ?, rate1000 = ?,
        truckType = ?, rate = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `);

    const result = updateRate.run(
      data.mode || '',
      data.provider || '',
      data.agent || '',
      data.origin || '',
      data.destination || '',
      data.currency || '',
      data.transitTime || '',
      data.portOfDischarge || '',
      data.transitPort || '',
      data.remark || '',
      data.commodity || '',
      data.createdBy || '',
      data.validFrom || '',
      data.validTo || '',
      data.createdOn || '',
      data.type || '',
      data.createType || '',
      data.service || '',
      data.serviceCode || '',
      data.note || '',
      data.contract || '',
      data.frequency || '',
      data.status || 'active',
      // FCL fields
      data.ocean20dc || '',
      data.ocean40dc || '',
      data.ocean40hc || '',
      data.ocean45hc || '',
      data.ocean20rf || '',
      data.ocean40rf || '',
      data.ocean20tank || '',
      data.ocean40tank || '',
      data.ocean20fr || '',
      data.ocean40fr || '',
      data.ocean20ot || '',
      data.ocean40ot || '',
      // LCL fields
      data.price || '',
      data.baseRate || '',
      data.minCharge || '',
      // AIR fields
      data.originAirport || '',
      data.destinationAirport || '',
      data.airline || '',
      data.rate45 || '',
      data.rate100 || '',
      data.rate300 || '',
      data.rate500 || '',
      data.rate1000 || '',
      // FTL/LTL fields
      data.truckType || '',
      data.rate || '',
      rateId,
      user.id
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Rate not found or access denied' }, { status: 404 });
    }

    console.log(`Updated rate ${rateId} for user ${user.id}`);
    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('PUT rate error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const rateId = searchParams.get('id');
    if (!rateId) {
      return NextResponse.json({ error: 'Missing rate ID' }, { status: 400 });
    }

    // Delete rate
    const deleteRate = db.prepare('DELETE FROM rates WHERE id = ? AND user_id = ?');
    const result = deleteRate.run(rateId, user.id);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Rate not found or access denied' }, { status: 404 });
    }

    console.log(`Deleted rate ${rateId} for user ${user.id}`);
    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('DELETE rate error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 