import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserById } from '../../auth/userDb';

// Helper function to get current user from request
const getCurrentUser = (req: NextRequest) => {
  const userId = req.cookies.get('auth_token')?.value;
  if (!userId) return null;
  return getUserById(userId);
};

export async function GET(req: NextRequest) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
    }

    const milestones = db.prepare(`
      SELECT * FROM booking_milestones 
      WHERE booking_id = ? AND user_id = ? 
      ORDER BY order_index ASC, created_at ASC
    `).all(bookingId, user.id);

    return NextResponse.json(milestones);
  } catch (err: any) {
    console.error('GET milestones error:', err);
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
    const bookingId = searchParams.get('bookingId');

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
    }

    const { milestones } = await req.json();

    if (!Array.isArray(milestones)) {
      return NextResponse.json({ error: 'Milestones must be an array' }, { status: 400 });
    }

    // Delete existing milestones for this booking
    db.prepare('DELETE FROM booking_milestones WHERE booking_id = ? AND user_id = ?')
      .run(bookingId, user.id);

    // Insert new milestones
    const insertMilestone = db.prepare(`
      INSERT INTO booking_milestones (booking_id, user_id, step, description, location, milestone_date, completed, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((milestones: any[]) => {
      milestones.forEach((milestone, index) => {
        insertMilestone.run(
          bookingId,
          user.id,
          milestone.step,
          milestone.description || '',
          milestone.location || '',
          milestone.milestone_date || '',
          milestone.completed ? 1 : 0,
          milestone.order_index !== undefined ? milestone.order_index : index
        );
      });
    });

    transaction(milestones);

    console.log(`Updated ${milestones.length} milestones for booking ${bookingId}`);
    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('PUT milestones error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 