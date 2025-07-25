import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ poId: string }> }) {
  try {
    const { poId } = await params;
    if (!poId) {
      return NextResponse.json({ error: 'Missing poId in URL' }, { status: 400 });
    }
    const stmt = db.prepare('SELECT * FROM purchase_orders WHERE id = ?');
    const order = stmt.get(poId);
    if (!order) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ poId: string }> }) {
  try {
    const { poId } = await params;
    if (!poId) {
      return NextResponse.json({ error: 'Missing poId in URL' }, { status: 400 });
    }
    const data = await req.json();
    const update = db.prepare(`UPDATE purchase_orders SET cargoReadyBy=?, mustArriveBy=?, buyer=?, seller=?, subjectedCarrier=?, status=?, progress=?, exceptions=? WHERE id=?`);
    const result = update.run(data.cargoReadyBy, data.mustArriveBy, data.buyer, data.seller, data.subjectedCarrier, data.status, data.progress, data.exceptions || '', poId);
    if (result.changes === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ poId: string }> }) {
  try {
    const { poId } = await params;
    if (!poId) {
      return NextResponse.json({ error: 'Missing poId in URL' }, { status: 400 });
    }
    
    // Use a transaction to ensure both deletions succeed or fail together
    const deleteTransaction = db.transaction(() => {
      // Delete PO details first to avoid foreign key constraint violation
      db.prepare('DELETE FROM po_details WHERE poOrderNumber = ?').run(poId);
      // Then delete the purchase order
      const result = db.prepare('DELETE FROM purchase_orders WHERE id = ?').run(poId);
      return result;
    });
    
    const result = deleteTransaction();
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Purchase order and all details deleted successfully' });
  } catch (err: any) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 