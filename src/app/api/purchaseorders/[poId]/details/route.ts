import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ poId: string }> }) {
  try {
    const { poId } = await params;
    if (!poId) {
      return NextResponse.json({ error: 'Missing poId in URL' }, { status: 400 });
    }
    console.log(`PUT /details - Received request for poId: ${poId}`);
    
    const details = await req.json();
    console.log(`PUT /details - Received ${details.length} details:`, details);
    
    if (!Array.isArray(details)) {
      return NextResponse.json({ error: 'Request body must be an array of details' }, { status: 400 });
    }
    
    console.log(`PUT /details - Deleting existing details for poId: ${poId}`);
    // Remove all existing details for this PO
    const deleteResult = db.prepare('DELETE FROM po_details WHERE poOrderNumber = ?').run(poId);
    console.log(`PUT /details - Deleted ${deleteResult.changes} existing records`);
    
    // Insert new details
    const insertDetail = db.prepare(`INSERT INTO po_details (poOrderNumber, productCode, productName, cargoReadyDate, mustArriveDate, transportMode, destination, requested, booked, currency, unitCost, uom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const insertMany = db.transaction((items: any[]) => {
      return items.map((d: any, index: number) => {
        console.log(`PUT /details - Inserting item ${index + 1}:`, {
          poId,
          productCode: d.productCode,
          productName: d.productName,
          requested: d.requested
        });
        return insertDetail.run(
          poId,
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
    const insertResults = insertMany(details);
    console.log(`PUT /details - Inserted ${insertResults.length} new records`);
    
    // Return the updated details
    const updated = db.prepare('SELECT * FROM po_details WHERE poOrderNumber = ?').all(poId);
    console.log(`PUT /details - Final count in DB: ${updated.length} records`);
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('PUT /details - Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ poId: string }> }) {
  try {
    const { poId } = await params;
    if (!poId) {
      return NextResponse.json({ error: 'Missing poId in URL' }, { status: 400 });
    }
    console.log(`API: Searching for poOrderNumber = "${poId}" (string)`);
    const details = db.prepare('SELECT * FROM po_details WHERE poOrderNumber = ?').all(poId);
    console.log(`API: Found ${details.length} details:`, details.map((d: any) => ({ id: d.id, poOrderNumber: d.poOrderNumber, productCode: d.productCode })));
    return NextResponse.json(details);
  } catch (err: any) {
    console.error('GET /details - Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ poId: string }> }) {
  try {
    const { poId } = await params;
    if (!poId) {
      return NextResponse.json({ error: 'Missing poId in URL' }, { status: 400 });
    }
    db.prepare('DELETE FROM po_details WHERE poOrderNumber = ?').run(poId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 