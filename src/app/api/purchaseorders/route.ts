import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// --- Purchase Orders CRUD ---
// NOTE: PO details endpoints (for /api/purchaseorders/[poId]/details) should be implemented in a subroute file: /src/app/api/purchaseorders/[poId]/details/route.ts for true RESTful API. The helpers below are for internal use only.

export async function GET(req: NextRequest) {
  try {
    const stmt = db.prepare('SELECT * FROM purchase_orders');
    const orders = stmt.all();
    return NextResponse.json(orders);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log('Received purchase order data:', data);

    // Insert into purchase_orders
    if (!data.id) data.id = `PO${Date.now()}`;
    // Convert exceptions to a comma-separated string (e.g., "buyer, seller")
    const exceptionsValue = Array.isArray(data.exceptions) 
      ? data.exceptions.join(', ')
      : (data.exceptions || '');
    
    // Validate all required fields before insert
    const values = [
      data.id,
      data.cargoReadyBy,
      data.mustArriveBy,
      data.buyer,
      data.seller,
      data.subjectedCarrier,
      data.status,
      data.progress,
      exceptionsValue  // Now a string, not an array
    ];
    console.log('Insert values:', values);
    if (values.some(v => v === undefined)) {
      console.error('Missing required field(s) in purchase order:', values);
      return NextResponse.json({ error: 'Missing required field(s)', values }, { status: 400 });
    }
    try {
      const sql = `
        INSERT INTO purchase_orders 
        (id, cargoReadyBy, mustArriveBy, buyer, seller, subjectedCarrier, status, progress, exceptions) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      console.log('Executing SQL:', sql);
      console.log('With values:', values);
      
      // Verify the number of placeholders matches the number of values
      const placeholderCount = (sql.match(/\?/g) || []).length;
      console.log(`Placeholders: ${placeholderCount}, Values: ${values.length}`);
      
      const insertPO = db.prepare(sql);
      const result = insertPO.run(...values);
      
      console.log('Insert result:', result);
      console.log('Inserted purchase order:', data.id);
      
      // Continue to insert PO details if any
      let insertedDetails = [];
      if (Array.isArray(data.details) && data.details.length > 0) {
        try {
          const insertDetail = db.prepare(`INSERT INTO po_details (poOrderNumber, productCode, productName, cargoReadyDate, mustArriveDate, transportMode, destination, requested, booked, currency, unitCost, uom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
          const insertMany = db.transaction((items: any[]) => {
            return items.map((d: any) => {
              console.log('Inserting PO detail:', d);
              return insertDetail.run(
                data.id,
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
          console.log(`Inserted ${insertedDetails.length} PO details for:`, data.id);
        } catch (detailsErr) {
          console.error('Error inserting PO details:', detailsErr);
          // Don't throw here, we'll include the error in the response
          return NextResponse.json(
            { 
              success: false, 
              error: 'Purchase order created but failed to insert details',
              details: (detailsErr as Error).message,
              poId: data.id
            }, 
            { status: 207 } // 207 Partial Content
          );
        }
      } else {
        console.log('No PO details to insert.');
      }
      
      return NextResponse.json({ 
        success: true, 
        id: data.id,
        detailsInserted: insertedDetails.length
      }, { status: 201 });
    } catch (error) {
      const err = error as Error & { code?: string };
      console.error('SQL Error:', err.message);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        stack: err.stack
      });
      return NextResponse.json(
        { 
          error: 'Failed to insert purchase order',
          details: err.message,
          code: err.code
        }, 
        { status: 500 }
      );
    }

  } catch (err: any) {
    console.error('POST error:', err);
    return NextResponse.json({ error: err, message: err.message, stack: err.stack }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const data = await req.json();
    const update = db.prepare(`UPDATE purchase_orders SET cargoReadyBy=?, mustArriveBy=?, buyer=?, seller=?, subjectedCarrier=?, status=?, progress=?, exceptions=? WHERE id=?`);
    const result = update.run(data.cargoReadyBy, data.mustArriveBy, data.buyer, data.seller, data.subjectedCarrier, data.status, data.progress, data.exceptions || '', id);
    if (result.changes === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams, pathname } = new URL(req.url);
    // Support both query parameter (?id=PO123) and URL path (/api/purchaseorders/PO123)
    let id = searchParams.get('id');
    if (!id) {
      // Extract ID from URL path if not in query params
      const pathParts = pathname.split('/');
      id = pathParts[pathParts.length - 1];
      if (id === 'purchaseorders') {
        id = null; // No ID in path either
      }
    }
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const del = db.prepare('DELETE FROM purchase_orders WHERE id=?');
    const result = del.run(id);
    if (result.changes === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    // Also delete all PO details for this PO
    db.prepare('DELETE FROM po_details WHERE poOrderNumber=?').run(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
