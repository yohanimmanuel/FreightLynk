import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserById } from '../../auth/userDb';

// Helper function to get current user from request
const getCurrentUser = (req: NextRequest) => {
  const userId = req.cookies.get('auth_token')?.value;
  if (!userId) return null;
  return getUserById(userId);
};

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
    if (!poId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    
    const data = await req.json();
    
    // Only allow updating user's own POs
    const update = db.prepare(`UPDATE purchase_orders SET cargoReadyBy=?, mustArriveBy=?, buyer=?, seller=?, subjectedCarrier=?, status=?, progress=?, exceptions=?, updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?`);
    const result = update.run(
      data.cargoReadyBy, 
      data.mustArriveBy, 
      data.buyer, 
      data.seller, 
      data.subjectedCarrier, 
      data.status, 
      data.progress, 
      data.exceptions || '', 
      poId, 
      user.id
    );
    
    if (result.changes === 0) return NextResponse.json({ error: 'Not found or access denied' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('PUT error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { poId: string } }
) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const poId = params.poId;
    if (!poId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    
    // Only allow deleting user's own POs
    const del = db.prepare('DELETE FROM purchase_orders WHERE id=? AND user_id=?');
    const result = del.run(poId, user.id);
    
    if (result.changes === 0) return NextResponse.json({ error: 'Not found or access denied' }, { status: 404 });
    
    // Also delete all PO details for this PO (that belong to this user)
    db.prepare('DELETE FROM po_details WHERE poOrderNumber=? AND user_id=?').run(poId, user.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 