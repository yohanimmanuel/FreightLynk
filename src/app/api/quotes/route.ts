import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserById } from '../auth/userDb';

// Helper function to get current user from request
const getCurrentUser = (req: NextRequest) => {
  const userId = req.cookies.get('auth_token')?.value;
  console.log('getCurrentUser: auth_token from cookie:', userId);
  if (!userId) {
    console.log('getCurrentUser: No auth_token found in cookies');
    return null;
  }
  const user = getUserById(userId);
  console.log('getCurrentUser: Found user:', user ? { id: user.id, username: user.username } : null);
  return user;
};

// Create quotes table based on the actual Quote interface from forwarderquote.ts
const ensureQuotesTable = () => {
  // Check if table exists first
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='quotes'
  `).get();
  
  if (!tableExists) {
    console.log('Quotes table does not exist, creating it...');
    // Create quotes table matching the Quote interface
    db.exec(`
      CREATE TABLE quotes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        lane TEXT,
        mode TEXT NOT NULL,
        mode_label TEXT,
        containertype TEXT, -- JSON string for array or string
        currency TEXT DEFAULT 'USD',
        base_rate REAL DEFAULT 0,
        price TEXT,
        transit_time TEXT,
        provider TEXT,
        validity TEXT,
        status TEXT DEFAULT 'draft',
        origin TEXT,
        destination TEXT,
        incoterms TEXT,
        remark TEXT,
        service_type TEXT,
        transit_port TEXT,
        client TEXT,
        is_tariff BOOLEAN DEFAULT 0,
        profit TEXT,
        created_by TEXT,
        created_date TEXT,
        notes TEXT,
        details TEXT, -- JSON string for array or string
        truck_type TEXT, -- JSON string for array or string
        weight_volume TEXT, -- JSON string for array or string
        additional_cost REAL DEFAULT 0,
        additional_cost_description TEXT,
        total_amount REAL DEFAULT 0,
        final_total_amount REAL DEFAULT 0,
        
        -- QuoteParty fields for 'from'
        from_company TEXT,
        from_address TEXT,
        from_phone TEXT,
        from_prepared_by TEXT,
        from_mobile TEXT,
        from_email TEXT,
        
        -- QuoteParty fields for 'to'
        to_company TEXT,
        to_address TEXT,
        to_phone TEXT,
        to_contact TEXT,
        
        -- QuoteLineItem array as JSON
        table_rows TEXT, -- JSON string of QuoteLineItem[]
        
        -- QuoteAdditionalInfo as JSON
        additional_info TEXT, -- JSON string of QuoteAdditionalInfo
        
        company_branch TEXT,
        company_name TEXT,
        company_logo TEXT,
        shipment_type TEXT,
        shipment_type_description TEXT,
        valid_until TEXT,
        origin_airport TEXT,
        destination_airport TEXT,
        
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      );
      
      -- Create indexes for better performance
      CREATE INDEX idx_quotes_user_id ON quotes(user_id);
      CREATE INDEX idx_quotes_mode ON quotes(mode);
      CREATE INDEX idx_quotes_origin_destination ON quotes(origin, destination);
      CREATE INDEX idx_quotes_created_at ON quotes(created_at);
      CREATE INDEX idx_quotes_status ON quotes(status);
    `);
    console.log('Created quotes table');
  } else {
    console.log('Quotes table already exists');
  }
};

const generateQuoteId = () => {
  return `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to check for duplicate quotes
const checkForDuplicateQuote = (quoteData: any, userId: string) => {
  // Check for recent quotes (within last 5 minutes) with similar data
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  
  // Only check for duplicates if we have the essential fields
  const mode = quoteData.mode || quoteData.Mode;
  const origin = quoteData.origin || quoteData.Origin;
  const destination = quoteData.destination || quoteData.Destination;
  
  if (!mode || !origin || !destination) {
    return null; // Skip duplicate check if essential fields are missing
  }
  
  const existingQuote = db.prepare(`
    SELECT id, created_at FROM quotes 
    WHERE user_id = ? 
    AND mode = ? 
    AND origin = ? 
    AND destination = ? 
    AND created_at > ?
    ORDER BY created_at DESC 
    LIMIT 1
  `).get(
    userId,
    mode,
    origin,
    destination,
    fiveMinutesAgo
  );
  
  return existingQuote;
};

export async function GET(req: NextRequest) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    ensureQuotesTable();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const mode = searchParams.get('mode');
    const status = searchParams.get('status');

    if (id) {
      // Get single quote
      const quote = db.prepare(`
        SELECT * FROM quotes WHERE id = ? AND user_id = ?
      `).get(id, user.id);

      if (!quote) {
        return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
      }

      // Parse JSON fields
      const parsedQuote = {
        ...quote,
        containertype: (quote as any).containertype ? JSON.parse((quote as any).containertype) : null,
        details: (quote as any).details ? JSON.parse((quote as any).details) : null,
        truckType: (quote as any).truck_type ? JSON.parse((quote as any).truck_type) : null,
        weightVolume: (quote as any).weight_volume ? JSON.parse((quote as any).weight_volume) : null,
        tableRows: (quote as any).table_rows ? JSON.parse((quote as any).table_rows) : [],
        additionalInfo: (quote as any).additional_info ? JSON.parse((quote as any).additional_info) : {},
        // Map database fields to interface fields
        from: {
          company: (quote as any).from_company || '',
          address: (quote as any).from_address || '',
          phone: (quote as any).from_phone || '',
          preparedBy: (quote as any).from_prepared_by || '',
          mobile: (quote as any).from_mobile || '',
          email: (quote as any).from_email || '',
        },
        to: {
          company: (quote as any).to_company || '',
          address: (quote as any).to_address || '',
          phone: (quote as any).to_phone || '',
          contact: (quote as any).to_contact || '',
        },
        baseRate: (quote as any).base_rate || 0,
        additionalCost: (quote as any).additional_cost || 0,
        totalAmount: (quote as any).total_amount || 0,
        finalTotalAmount: (quote as any).final_total_amount || 0,
        serviceType: (quote as any).service_type,
        transitTime: (quote as any).transit_time,
        transitPort: (quote as any).transit_port,
        createdDate: (quote as any).created_date,
        validUntil: (quote as any).valid_until,
        originAirport: (quote as any).origin_airport,
        destinationAirport: (quote as any).destination_airport,
        companyBranch: (quote as any).company_branch,
        companyName: (quote as any).company_name,
        companyLogo: (quote as any).company_logo,
        shipmentType: (quote as any).shipment_type,
        shipmentTypeDescription: (quote as any).shipment_type_description,
      };

      return NextResponse.json(parsedQuote);
    } else {
      // Get multiple quotes with optional filtering
      let query = 'SELECT * FROM quotes WHERE user_id = ?';
      const params = [user.id];

      if (mode) {
        query += ' AND mode = ?';
        params.push(mode);
      }

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      query += ' ORDER BY created_at DESC';

      const quotes = db.prepare(query).all(...params);

      // Parse JSON fields for each quote
      const parsedQuotes = quotes.map((quote: any) => ({
        ...quote,
        containertype: quote.containertype ? JSON.parse(quote.containertype) : null,
        details: quote.details ? JSON.parse(quote.details) : null,
        truckType: quote.truck_type ? JSON.parse(quote.truck_type) : null,
        weightVolume: quote.weight_volume ? JSON.parse(quote.weight_volume) : null,
        tableRows: quote.table_rows ? JSON.parse(quote.table_rows) : [],
        additionalInfo: quote.additional_info ? JSON.parse(quote.additional_info) : {},
        from: {
          company: quote.from_company || '',
          address: quote.from_address || '',
          phone: quote.from_phone || '',
          preparedBy: quote.from_prepared_by || '',
          mobile: quote.from_mobile || '',
          email: quote.from_email || '',
        },
        to: {
          company: quote.to_company || '',
          address: quote.to_address || '',
          phone: quote.to_phone || '',
          contact: quote.to_contact || '',
        },
        baseRate: quote.base_rate || 0,
        additionalCost: quote.additional_cost || 0,
        totalAmount: quote.total_amount || 0,
        finalTotalAmount: quote.final_total_amount || 0,
        serviceType: quote.service_type,
        transitTime: quote.transit_time,
        transitPort: quote.transit_port,
        createdDate: quote.created_date,
        validUntil: quote.valid_until,
        originAirport: quote.origin_airport,
        destinationAirport: quote.destination_airport,
        companyBranch: quote.company_branch,
        companyName: quote.company_name,
        companyLogo: quote.company_logo,
        shipmentType: quote.shipment_type,
        shipmentTypeDescription: quote.shipment_type_description,
      }));

      return NextResponse.json(parsedQuotes);
    }
  } catch (error) {
    console.error('Error in GET /api/quotes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let user = getCurrentUser(req);
    
    // For testing purposes, create a default user if none exists
    if (!user) {
      console.log('POST /api/quotes: No user found, creating test user');
      const { addUser } = await import('../auth/userDb');
      const testUserId = 'test-user-12345'; // Use consistent ID for testing
      try {
        // Check if test user already exists
        const existingUser = getUserById(testUserId);
        if (!existingUser) {
          addUser({
            id: testUserId,
            username: 'testuser',
            password: 'testpass',
            role: 'forwarder',
            fullName: 'Test User',
            companyName: 'Test Company'
          });
        }
        user = { id: testUserId, username: 'testuser', role: 'forwarder' } as any;
        console.log('POST /api/quotes: Using test user:', user!.id);
      } catch (error) {
        console.error('POST /api/quotes: Failed to create test user:', error);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Ensure user exists at this point
    if (!user) {
      console.error('POST /api/quotes: Still no user after creation attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Type assertion to ensure user is not null
    const currentUser = user as { id: string; username: string; role: string };

    ensureQuotesTable();

    const quoteData = await req.json();
    // Use provided ID if it exists, otherwise generate new one
    const quoteId = quoteData.id || generateQuoteId();
    
    console.log('POST /api/quotes: ID handling:', {
      providedId: quoteData.id,
      generatedId: generateQuoteId(),
      finalId: quoteId,
      hasProvidedId: !!quoteData.id
    });

    // Check if quote with this ID already exists
    const existingQuote = db.prepare('SELECT id FROM quotes WHERE id = ?').get(quoteId);
    if (existingQuote) {
      console.log('POST /api/quotes: Quote with ID already exists, updating it:', quoteId);
      
      // Update the existing quote instead of creating a new one
      const result = db.prepare(`
        UPDATE quotes SET
          lane = ?, mode = ?, mode_label = ?, containertype = ?, currency = ?, base_rate = ?,
          price = ?, transit_time = ?, provider = ?, validity = ?, status = ?, origin = ?,
          destination = ?, incoterms = ?, remark = ?, service_type = ?, transit_port = ?,
          client = ?, is_tariff = ?, profit = ?, created_by = ?, created_date = ?, notes = ?,
          details = ?, truck_type = ?, weight_volume = ?, additional_cost = ?, additional_cost_description = ?,
          total_amount = ?, final_total_amount = ?, from_company = ?, from_address = ?, from_phone = ?,
          from_prepared_by = ?, from_mobile = ?, from_email = ?, to_company = ?, to_address = ?,
          to_phone = ?, to_contact = ?, table_rows = ?, additional_info = ?, company_branch = ?,
          company_name = ?, company_logo = ?, shipment_type = ?, shipment_type_description = ?,
          valid_until = ?, origin_airport = ?, destination_airport = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        quoteData.lane || quoteData.Lane || null,
        quoteData.mode || quoteData.Mode || null,
        quoteData.modeLabel || quoteData.mode_label || quoteData.ModeLabel || null,
        quoteData.containertype ? JSON.stringify(quoteData.containertype) : null,
        quoteData.currency || quoteData.Currency || 'USD',
        quoteData.baseRate || quoteData.base_rate || quoteData.BaseRate || 0,
        quoteData.price || quoteData.Price || null,
        quoteData.transitTime || quoteData.transit_time || quoteData.TransitTime || null,
        quoteData.provider || quoteData.Provider || null,
        quoteData.validity || quoteData.Validity || null,
        quoteData.status || quoteData.Status || 'draft',
        quoteData.origin || quoteData.Origin || null,
        quoteData.destination || quoteData.Destination || null,
        quoteData.incoterms || quoteData.Incoterms || null,
        quoteData.remark || quoteData.Remark || null,
        quoteData.serviceType || quoteData.service_type || quoteData.ServiceType || null,
        quoteData.transitPort || quoteData.transit_port || quoteData.TransitPort || null,
        quoteData.client || quoteData.Client || null,
        quoteData.isTariff ? 1 : 0,
        quoteData.profit || quoteData.Profit || null,
        quoteData.createdBy || quoteData.created_by || quoteData.CreatedBy || null,
        quoteData.createdDate || quoteData.created_date || quoteData.CreatedDate || null,
        quoteData.notes || quoteData.Notes || null,
        quoteData.details ? JSON.stringify(quoteData.details) : null,
        quoteData.truckType ? JSON.stringify(quoteData.truckType) : null,
        quoteData.weightVolume ? JSON.stringify(quoteData.weightVolume) : null,
        quoteData.additionalCost || quoteData.additional_cost || quoteData.AdditionalCost || 0,
        quoteData.additionalCostDescription || quoteData.additional_cost_description || quoteData.AdditionalCostDescription || null,
        quoteData.totalAmount || quoteData.total_amount || quoteData.TotalAmount || 0,
        quoteData.finalTotalAmount || quoteData.final_total_amount || quoteData.FinalTotalAmount || 0,
        quoteData.from?.company || quoteData.From?.company || null,
        quoteData.from?.address || quoteData.From?.address || null,
        quoteData.from?.phone || quoteData.From?.phone || null,
        quoteData.from?.preparedBy || quoteData.from?.prepared_by || quoteData.From?.preparedBy || null,
        quoteData.from?.mobile || quoteData.From?.mobile || null,
        quoteData.from?.email || quoteData.From?.email || null,
        quoteData.to?.company || quoteData.To?.company || null,
        quoteData.to?.address || quoteData.To?.address || null,
        quoteData.to?.phone || quoteData.To?.phone || null,
        quoteData.to?.contact || quoteData.To?.contact || null,
        quoteData.tableRows ? JSON.stringify(quoteData.tableRows) : null,
        quoteData.additionalInfo ? JSON.stringify(quoteData.additionalInfo) : null,
        quoteData.companyBranch || quoteData.company_branch || quoteData.CompanyBranch || null,
        quoteData.companyName || quoteData.company_name || quoteData.CompanyName || null,
        quoteData.companyLogo || quoteData.company_logo || quoteData.CompanyLogo || null,
        quoteData.shipmentType || quoteData.shipment_type || quoteData.ShipmentType || null,
        quoteData.shipmentTypeDescription || quoteData.shipment_type_description || quoteData.ShipmentTypeDescription || null,
        quoteData.validUntil || quoteData.valid_until || quoteData.ValidUntil || null,
        quoteData.originAirport || quoteData.origin_airport || quoteData.OriginAirport || null,
        quoteData.destinationAirport || quoteData.destination_airport || quoteData.DestinationAirport || null,
        quoteId
      );
      
      console.log('POST /api/quotes: Quote updated successfully', { quoteId, result });
      return NextResponse.json({ 
        success: true, 
        id: quoteId,
        message: 'Quote updated successfully' 
      });
    }

    console.log('POST /api/quotes: Creating quote', { quoteId, userId: currentUser.id });
    console.log('POST /api/quotes: Quote data received:', JSON.stringify(quoteData, null, 2));
    console.log('POST /api/quotes: Weight/Volume data check:', {
      weightVolume: quoteData.weightVolume,
      weightVolumeType: typeof quoteData.weightVolume,
      weightVolumeLength: Array.isArray(quoteData.weightVolume) ? quoteData.weightVolume.length : 'not array'
    });

    // Validate required fields
    if (!quoteData.mode) {
      console.error('POST /api/quotes: Mode is required', { quoteData });
      return NextResponse.json({ error: 'Mode is required' }, { status: 400 });
    }

         // Check for duplicate quotes
     const duplicate = checkForDuplicateQuote(quoteData, currentUser.id);
     if (duplicate) {
       console.warn('POST /api/quotes: Duplicate quote detected. Returning existing quote.', {
         existingQuoteId: (duplicate as any).id,
         existingQuoteCreatedAt: (duplicate as any).created_at,
         newQuoteId: quoteId,
       });
       return NextResponse.json({
         success: true,
         id: (duplicate as any).id,
         message: 'Duplicate quote found. Returning existing quote.',
       });
     }

    // Insert quote into database
    try {
      const result = db.prepare(`
        INSERT INTO quotes (
          id, user_id, lane, mode, mode_label, containertype, currency, base_rate, price,
          transit_time, provider, validity, status, origin, destination, incoterms, remark,
          service_type, transit_port, client, is_tariff, profit, created_by, created_date,
          notes, details, truck_type, weight_volume, additional_cost, additional_cost_description,
          total_amount, final_total_amount, from_company, from_address, from_phone, from_prepared_by,
          from_mobile, from_email, to_company, to_address, to_phone, to_contact, table_rows,
          additional_info, company_branch, company_name, company_logo, shipment_type,
          shipment_type_description, valid_until, origin_airport, destination_airport
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
      quoteId,
      currentUser.id,
      quoteData.lane || quoteData.Lane || null,
      quoteData.mode || quoteData.Mode || null,
      quoteData.modeLabel || quoteData.mode_label || quoteData.ModeLabel || null,
      quoteData.containertype ? JSON.stringify(quoteData.containertype) : null,
      quoteData.currency || quoteData.Currency || 'USD',
      quoteData.baseRate || quoteData.base_rate || quoteData.BaseRate || 0,
      quoteData.price || quoteData.Price || null,
      quoteData.transitTime || quoteData.transit_time || quoteData.TransitTime || null,
      quoteData.provider || quoteData.Provider || null,
      quoteData.validity || quoteData.Validity || null,
      quoteData.status || quoteData.Status || 'draft',
      quoteData.origin || quoteData.Origin || null,
      quoteData.destination || quoteData.Destination || null,
      quoteData.incoterms || quoteData.Incoterms || null,
      quoteData.remark || quoteData.Remark || null,
      quoteData.serviceType || quoteData.service_type || quoteData.ServiceType || null,
      quoteData.transitPort || quoteData.transit_port || quoteData.TransitPort || null,
      quoteData.client || quoteData.Client || null,
      quoteData.isTariff ? 1 : 0,
      quoteData.profit || quoteData.Profit || null,
      quoteData.createdBy || quoteData.created_by || quoteData.CreatedBy || null,
      quoteData.createdDate || quoteData.created_date || quoteData.CreatedDate || null,
      quoteData.notes || quoteData.Notes || null,
      quoteData.details ? JSON.stringify(quoteData.details) : null,
      quoteData.truckType ? JSON.stringify(quoteData.truckType) : null,
      quoteData.weightVolume ? JSON.stringify(quoteData.weightVolume) : null,
      quoteData.additionalCost || quoteData.additional_cost || quoteData.AdditionalCost || 0,
      quoteData.additionalCostDescription || quoteData.additional_cost_description || quoteData.AdditionalCostDescription || null,
      quoteData.totalAmount || quoteData.total_amount || quoteData.TotalAmount || 0,
      quoteData.finalTotalAmount || quoteData.final_total_amount || quoteData.FinalTotalAmount || 0,
      quoteData.from?.company || quoteData.From?.company || null,
      quoteData.from?.address || quoteData.From?.address || null,
      quoteData.from?.phone || quoteData.From?.phone || null,
      quoteData.from?.preparedBy || quoteData.from?.prepared_by || quoteData.From?.preparedBy || null,
      quoteData.from?.mobile || quoteData.From?.mobile || null,
      quoteData.from?.email || quoteData.From?.email || null,
      quoteData.to?.company || quoteData.To?.company || null,
      quoteData.to?.address || quoteData.To?.address || null,
      quoteData.to?.phone || quoteData.To?.phone || null,
      quoteData.to?.contact || quoteData.To?.contact || null,
      quoteData.tableRows ? JSON.stringify(quoteData.tableRows) : null,
      quoteData.additionalInfo ? JSON.stringify(quoteData.additionalInfo) : null,
      quoteData.companyBranch || quoteData.company_branch || quoteData.CompanyBranch || null,
      quoteData.companyName || quoteData.company_name || quoteData.CompanyName || null,
      quoteData.companyLogo || quoteData.company_logo || quoteData.CompanyLogo || null,
      quoteData.shipmentType || quoteData.shipment_type || quoteData.ShipmentType || null,
      quoteData.shipmentTypeDescription || quoteData.shipment_type_description || quoteData.ShipmentTypeDescription || null,
      quoteData.validUntil || quoteData.valid_until || quoteData.ValidUntil || null,
      quoteData.originAirport || quoteData.origin_airport || quoteData.OriginAirport || null,
      quoteData.destinationAirport || quoteData.destination_airport || quoteData.DestinationAirport || null
    );

    console.log('POST /api/quotes: Quote created successfully', { quoteId, userId: currentUser.id, result });
    } catch (dbError) {
      console.error('POST /api/quotes: Database insertion error:', dbError);
      return NextResponse.json({ error: 'Failed to create quote in database' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      id: quoteId,
      message: 'Quote created successfully' 
    });
  } catch (error) {
    console.error('Error in POST /api/quotes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    let user = getCurrentUser(req);
    
    // For testing purposes, create a default user if none exists
    if (!user) {
      console.log('PUT /api/quotes: No user found, creating test user');
      const { addUser } = await import('../auth/userDb');
      const testUserId = 'test-user-12345'; // Use consistent ID for testing
      try {
        // Check if test user already exists
        const existingUser = getUserById(testUserId);
        if (!existingUser) {
          addUser({
            id: testUserId,
            username: 'testuser',
            password: 'testpass',
            role: 'forwarder',
            fullName: 'Test User',
            companyName: 'Test Company'
          });
        }
        user = { id: testUserId, username: 'testuser', role: 'forwarder' } as any;
        console.log('PUT /api/quotes: Using test user:', user!.id);
      } catch (error) {
        console.error('PUT /api/quotes: Failed to create test user:', error);
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Ensure user exists at this point
    if (!user) {
      console.error('PUT /api/quotes: Still no user after creation attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Type assertion to ensure user is not null
    const currentUser = user as { id: string; username: string; role: string };

    ensureQuotesTable();

    const quoteData = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    console.log('PUT /api/quotes: Updating quote', { id, userId: currentUser.id });
    console.log('PUT /api/quotes: Quote data received:', JSON.stringify(quoteData, null, 2));
    console.log('PUT /api/quotes: Additional cost fields:', {
      additionalCost: quoteData.additionalCost,
      additionalCostDescription: quoteData.additionalCostDescription,
      totalAmount: quoteData.totalAmount,
      finalTotalAmount: quoteData.finalTotalAmount
    });
     console.log('PUT /api/quotes: Weight/Volume data check:', {
       weightVolume: quoteData.weightVolume,
       weightVolumeType: typeof quoteData.weightVolume,
       weightVolumeLength: Array.isArray(quoteData.weightVolume) ? quoteData.weightVolume.length : 'not array'
     });

    if (!id) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
    }

    // Check if quote exists and belongs to user
    const existingQuote = db.prepare(`
      SELECT id FROM quotes WHERE id = ? AND user_id = ?
    `).get(id, currentUser.id);

    if (!existingQuote) {
      console.error('PUT /api/quotes: Quote not found', { id, userId: currentUser.id });
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Update quote
    const result = db.prepare(`
      UPDATE quotes SET
        lane = ?, mode = ?, mode_label = ?, containertype = ?, currency = ?, base_rate = ?,
        price = ?, transit_time = ?, provider = ?, validity = ?, status = ?, origin = ?,
        destination = ?, incoterms = ?, remark = ?, service_type = ?, transit_port = ?,
        client = ?, is_tariff = ?, profit = ?, created_by = ?, created_date = ?, notes = ?,
        details = ?, truck_type = ?, weight_volume = ?, additional_cost = ?, additional_cost_description = ?,
        total_amount = ?, final_total_amount = ?, from_company = ?, from_address = ?, from_phone = ?,
        from_prepared_by = ?, from_mobile = ?, from_email = ?, to_company = ?, to_address = ?,
        to_phone = ?, to_contact = ?, table_rows = ?, additional_info = ?, company_branch = ?,
        company_name = ?, company_logo = ?, shipment_type = ?, shipment_type_description = ?,
        valid_until = ?, origin_airport = ?, destination_airport = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(
      quoteData.lane || quoteData.Lane || null,
      quoteData.mode || quoteData.Mode || null,
      quoteData.modeLabel || quoteData.mode_label || quoteData.ModeLabel || null,
      quoteData.containertype ? JSON.stringify(quoteData.containertype) : null,
      quoteData.currency || quoteData.Currency || 'USD',
      quoteData.baseRate || quoteData.base_rate || quoteData.BaseRate || 0,
      quoteData.price || quoteData.Price || null,
      quoteData.transitTime || quoteData.transit_time || quoteData.TransitTime || null,
      quoteData.provider || quoteData.Provider || null,
      quoteData.validity || quoteData.Validity || null,
      quoteData.status || quoteData.Status || 'draft',
      quoteData.origin || quoteData.Origin || null,
      quoteData.destination || quoteData.Destination || null,
      quoteData.incoterms || quoteData.Incoterms || null,
      quoteData.remark || quoteData.Remark || null,
      quoteData.serviceType || quoteData.service_type || quoteData.ServiceType || null,
      quoteData.transitPort || quoteData.transit_port || quoteData.TransitPort || null,
      quoteData.client || quoteData.Client || null,
      quoteData.isTariff ? 1 : 0,
      quoteData.profit || quoteData.Profit || null,
      quoteData.createdBy || quoteData.created_by || quoteData.CreatedBy || null,
      quoteData.createdDate || quoteData.created_date || quoteData.CreatedDate || null,
      quoteData.notes || quoteData.Notes || null,
      quoteData.details ? JSON.stringify(quoteData.details) : null,
      quoteData.truckType ? JSON.stringify(quoteData.truckType) : null,
      quoteData.weightVolume ? JSON.stringify(quoteData.weightVolume) : null,
      quoteData.additionalCost || quoteData.additional_cost || quoteData.AdditionalCost || 0,
      quoteData.additionalCostDescription || quoteData.additional_cost_description || quoteData.AdditionalCostDescription || null,
      quoteData.totalAmount || quoteData.total_amount || quoteData.TotalAmount || 0,
      quoteData.finalTotalAmount || quoteData.final_total_amount || quoteData.FinalTotalAmount || 0,
      quoteData.from?.company || quoteData.From?.company || null,
      quoteData.from?.address || quoteData.From?.address || null,
      quoteData.from?.phone || quoteData.From?.phone || null,
      quoteData.from?.preparedBy || quoteData.from?.prepared_by || quoteData.From?.preparedBy || null,
      quoteData.from?.mobile || quoteData.From?.mobile || null,
      quoteData.from?.email || quoteData.From?.email || null,
      quoteData.to?.company || quoteData.To?.company || null,
      quoteData.to?.address || quoteData.To?.address || null,
      quoteData.to?.phone || quoteData.To?.phone || null,
      quoteData.to?.contact || quoteData.To?.contact || null,
      quoteData.tableRows ? JSON.stringify(quoteData.tableRows) : null,
      quoteData.additionalInfo ? JSON.stringify(quoteData.additionalInfo) : null,
      quoteData.companyBranch || quoteData.company_branch || quoteData.CompanyBranch || null,
      quoteData.companyName || quoteData.company_name || quoteData.CompanyName || null,
      quoteData.companyLogo || quoteData.company_logo || quoteData.CompanyLogo || null,
      quoteData.shipmentType || quoteData.shipment_type || quoteData.ShipmentType || null,
      quoteData.shipmentTypeDescription || quoteData.shipment_type_description || quoteData.ShipmentTypeDescription || null,
      quoteData.validUntil || quoteData.valid_until || quoteData.ValidUntil || null,
      quoteData.originAirport || quoteData.origin_airport || quoteData.OriginAirport || null,
      quoteData.destinationAirport || quoteData.destination_airport || quoteData.DestinationAirport || null,
      id,
      currentUser.id
    );

         console.log('PUT /api/quotes: Quote updated successfully', { id, userId: currentUser.id, result });
     
     return NextResponse.json({ 
       success: true, 
       message: 'Quote updated successfully' 
     });
  } catch (error) {
    console.error('Error in PUT /api/quotes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    ensureQuotesTable();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
    }

    // Check if quote exists and belongs to user
    const existingQuote = db.prepare(`
      SELECT id FROM quotes WHERE id = ? AND user_id = ?
    `).get(id, user.id);

    if (!existingQuote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Delete quote
    db.prepare(`
      DELETE FROM quotes WHERE id = ? AND user_id = ?
    `).run(id, user.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Quote deleted successfully' 
    });
  } catch (error) {
    console.error('Error in DELETE /api/quotes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 