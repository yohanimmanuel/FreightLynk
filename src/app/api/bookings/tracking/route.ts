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

    const tracking = db.prepare(`
      SELECT * FROM shipment_tracking 
      WHERE booking_id = ? AND user_id = ?
    `).get(bookingId, user.id);

    return NextResponse.json(tracking || {});
  } catch (err: any) {
    console.error('GET tracking error:', err);
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

    const trackingData = await req.json();

    // Check if tracking record exists
    const existing = db.prepare(`
      SELECT id FROM shipment_tracking 
      WHERE booking_id = ? AND user_id = ?
    `).get(bookingId, user.id);

    if (existing) {
      // Update existing tracking
      const updateTracking = db.prepare(`
        UPDATE shipment_tracking SET
          status = ?, carrier = ?, courier_name = ?, courier_avatar = ?,
          origin_city = ?, origin_country = ?, destination_city = ?, destination_country = ?,
          distance = ?, delivery_time = ?, arrival_date = ?, arrival_time = ?,
          current_location = ?, progress_percentage = ?, updated_at = CURRENT_TIMESTAMP
        WHERE booking_id = ? AND user_id = ?
      `);

      updateTracking.run(
        trackingData.status || '',
        trackingData.carrier || '',
        trackingData.courier_name || '',
        trackingData.courier_avatar || '',
        trackingData.origin_city || '',
        trackingData.origin_country || '',
        trackingData.destination_city || '',
        trackingData.destination_country || '',
        trackingData.distance || '',
        trackingData.delivery_time || '',
        trackingData.arrival_date || '',
        trackingData.arrival_time || '',
        trackingData.current_location || '',
        trackingData.progress_percentage || 0,
        bookingId,
        user.id
      );
    } else {
      // Create new tracking record
      const insertTracking = db.prepare(`
        INSERT INTO shipment_tracking (
          booking_id, user_id, shipment_id, status, carrier, courier_name, courier_avatar,
          origin_city, origin_country, destination_city, destination_country,
          distance, delivery_time, arrival_date, arrival_time, current_location, progress_percentage
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertTracking.run(
        bookingId,
        user.id,
        trackingData.shipment_id || '',
        trackingData.status || '',
        trackingData.carrier || '',
        trackingData.courier_name || '',
        trackingData.courier_avatar || '',
        trackingData.origin_city || '',
        trackingData.origin_country || '',
        trackingData.destination_city || '',
        trackingData.destination_country || '',
        trackingData.distance || '',
        trackingData.delivery_time || '',
        trackingData.arrival_date || '',
        trackingData.arrival_time || '',
        trackingData.current_location || '',
        trackingData.progress_percentage || 0
      );
    }

    console.log(`Updated tracking for booking ${bookingId}`);
    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('PUT tracking error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 