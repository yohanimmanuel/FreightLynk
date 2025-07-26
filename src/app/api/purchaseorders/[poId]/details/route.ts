import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserById } from '../../../auth/userDb';

// Helper function to get current user from request
const getCurrentUser = (req: NextRequest) => {
  const userId = req.cookies.get('auth_token')?.value;
  if (!userId) return null;
  return getUserById(userId);
};

export async function GET(
  req: NextRequest,
  { params }: { params: { poId: string } }
) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const poId = params.poId;
    if (!poId) return NextResponse.json({ error: 'Missing poId' }, { status: 400 });

    // Get PO details for this user
    const stmt = db.prepare('SELECT * FROM po_details WHERE poOrderNumber = ? AND user_id = ?');
    const details = stmt.all(poId, user.id);
    
    return NextResponse.json(details);
  } catch (err: any) {
    console.error('GET details error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { poId: string } }
) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const poId = params.poId;
    if (!poId) return NextResponse.json({ error: 'Missing poId' }, { status: 400 });

    const details = await req.json();
    
    // Delete existing details for this PO (belonging to this user)
    db.prepare('DELETE FROM po_details WHERE poOrderNumber = ? AND user_id = ?').run(poId, user.id);
    
    // Insert new details
    if (details && details.length > 0) {
      const insertDetail = db.prepare(`
        INSERT INTO po_details 
        (poOrderNumber, user_id, productCode, productName, cargoReadyDate, mustArriveDate, transportMode, destination, requested, booked, currency, unitCost, uom, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `);
      
      const insertMany = db.transaction((items: any[]) => {
        return items.map((d: any) => {
          return insertDetail.run(
            poId,
            user.id,
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
      
      insertMany(details);
    }
    
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('PUT details error:', err);
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