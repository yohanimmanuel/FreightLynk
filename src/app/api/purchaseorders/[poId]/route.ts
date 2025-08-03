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
    
    console.log('DELETE request for PO:', poId, 'by user:', user.id);
    
    // Test database connection and check table structure
    try {
      const testQuery = db.prepare('SELECT COUNT(*) as count FROM purchase_orders').get();
      console.log('Database connection test successful, total POs:', testQuery);
      
      // Check if tables exist
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as { name: string }[];
      console.log('Available tables:', tables.map(t => t.name));
      
      // Check PO details count
      const poDetailsCount = db.prepare('SELECT COUNT(*) as count FROM po_details').get();
      console.log('Total PO details:', poDetailsCount);
      
      // Check booking_purchase_orders count
      const bookingPOCount = db.prepare('SELECT COUNT(*) as count FROM booking_purchase_orders').get();
      console.log('Total booking_purchase_orders:', bookingPOCount);
      
    } catch (dbError) {
      console.error('Database connection test failed:', dbError);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    
    // Check if PO exists and belongs to user
    const checkPO = db.prepare('SELECT id FROM purchase_orders WHERE id=? AND user_id=?').get(poId, user.id);
    if (!checkPO) {
      console.log('PO not found or access denied:', poId);
      return NextResponse.json({ error: 'Not found or access denied' }, { status: 404 });
    }
    
    // Start a transaction
    const transaction = db.transaction(() => {
      // Delete booking_purchase_orders first (foreign key constraint)
      const deleteBookingPOs = db.prepare('DELETE FROM booking_purchase_orders WHERE po_id=? AND user_id=?');
      const bookingPOResult = deleteBookingPOs.run(poId, user.id);
      console.log('Deleted', bookingPOResult.changes, 'booking_purchase_orders');
      
      // Delete PO details (foreign key constraint)
      const deleteDetails = db.prepare('DELETE FROM po_details WHERE poOrderNumber=? AND user_id=?');
      const detailsResult = deleteDetails.run(poId, user.id);
      console.log('Deleted', detailsResult.changes, 'PO details');
      
      // Then delete the PO
      const deletePO = db.prepare('DELETE FROM purchase_orders WHERE id=? AND user_id=?');
      const poResult = deletePO.run(poId, user.id);
      console.log('Deleted', poResult.changes, 'PO');
      
      return { 
        bookingPOsDeleted: bookingPOResult.changes, 
        detailsDeleted: detailsResult.changes, 
        poDeleted: poResult.changes 
      };
    });
    
    const result = transaction();
    
    if (result.poDeleted === 0) {
      return NextResponse.json({ error: 'Failed to delete PO' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, deleted: result });
  } catch (err: any) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 