import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserById } from '../../../auth/users';

// Helper function to get current user from request
const getCurrentUser = (req: NextRequest) => {
  const userId = req.cookies.get('auth_token')?.value;
  if (!userId) return null;
  return getUserById(userId);
};

export async function PUT(req: NextRequest, { params }: { params: Promise<{ poId: string }> }) {
  try {
    const { poId } = await params;
    
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!poId) {
      return NextResponse.json({ error: 'Missing poId in URL' }, { status: 400 });
    }
    
    // Verify user owns this PO
    const poCheck = db.prepare('SELECT user_id FROM purchase_orders WHERE id = ?').get(poId) as any;
    if (!poCheck || poCheck.user_id !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    console.log(`PUT /details - User ${user.id} updating details for PO: ${poId}`);
    
    const details = await req.json();
    console.log(`PUT /details - Received ${details.length} details:`, details);
    
    if (!Array.isArray(details)) {
      return NextResponse.json({ error: 'Request body must be an array of details' }, { status: 400 });
    }
    
    console.log(`PUT /details - Deleting existing details for poId: ${poId}`);
    // Remove all existing details for this PO (that belong to this user)
    const deleteResult = db.prepare('DELETE FROM po_details WHERE poOrderNumber = ? AND user_id = ?').run(poId, user.id);
    console.log(`PUT /details - Deleted ${deleteResult.changes} existing records`);
    
    // Insert new details with user_id
    const insertDetail = db.prepare(`INSERT INTO po_details (poOrderNumber, user_id, productCode, productName, cargoReadyDate, mustArriveDate, transportMode, destination, requested, booked, currency, unitCost, uom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const insertMany = db.transaction((items: any[]) => {
      return items.map((d: any, index: number) => {
        console.log(`PUT /details - Inserting item ${index + 1}:`, {
          poId,
          userId: user.id,
          productCode: d.productCode,
          productName: d.productName,
          requested: d.requested
        });
        return insertDetail.run(
          poId,
          user.id, // Add user_id
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
    
    // Return the updated details (only for this user)
    const updated = db.prepare('SELECT * FROM po_details WHERE poOrderNumber = ? AND user_id = ?').all(poId, user.id);
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
    
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!poId) {
      return NextResponse.json({ error: 'Missing poId in URL' }, { status: 400 });
    }
    
    // Only return details for user's own POs
    const details = db.prepare('SELECT * FROM po_details WHERE poOrderNumber = ? AND user_id = ?').all(poId, user.id);
    console.log(`GET /api/purchaseorders/${poId}/details - returning ${details.length} details for user ${user.id}`);
    return NextResponse.json(details);
  } catch (err: any) {
    console.error('GET /details - Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ poId: string }> }) {
  try {
    const { poId } = await params;
    
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!poId) {
      return NextResponse.json({ error: 'Missing poId in URL' }, { status: 400 });
    }
    
    // Only delete details for user's own POs
    const deleteResult = db.prepare('DELETE FROM po_details WHERE poOrderNumber = ? AND user_id = ?').run(poId, user.id);
    console.log(`DELETE /details - Deleted ${deleteResult.changes} records for user ${user.id}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 