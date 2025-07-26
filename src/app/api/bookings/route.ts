import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserById } from '../auth/userDb';

// Helper function to get current user from request
const getCurrentUser = (req: NextRequest) => {
  const userId = req.cookies.get('auth_token')?.value;
  if (!userId) return null;
  return getUserById(userId);
};

// Create booking tables with user_id for data isolation
const ensureBookingTables = () => {
  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      fl_number TEXT UNIQUE NOT NULL,
      shipment_name TEXT,
      origin_location TEXT,
      origin_port TEXT,
      cargo_ready_date TEXT,
      destination_location TEXT,
      destination_port TEXT,
      target_delivery_date TEXT,
      weight TEXT,
      volume TEXT,
      additional_notes TEXT,
      product_name TEXT,
      hs_code TEXT,
      goods_description TEXT,
      sku_number TEXT,
      special_instructions TEXT,
      origin_customs BOOLEAN DEFAULT 0,
      origin_trucking BOOLEAN DEFAULT 0,
      destination_customs BOOLEAN DEFAULT 0,
      destination_trucking BOOLEAN DEFAULT 0,
      dangerous_goods BOOLEAN DEFAULT 0,
      require_shipment_tags BOOLEAN DEFAULT 0,
      shipper_value TEXT,
      consignee_value TEXT,
      transport_mode_value TEXT,
      shipment_type_value TEXT,
      container_type_value TEXT,
      incoterms_value TEXT,
      package_type_value TEXT,
      package_count TEXT,
      container_quantity TEXT,
      truck_type TEXT,
      truck_quantity TEXT,
      truck_types TEXT, -- JSON string of truck types array
      container_types TEXT, -- JSON string of container types array
      trade_role TEXT,
      status TEXT DEFAULT 'Booked',
      progress INTEGER DEFAULT 0,
      eta TEXT DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Add new columns if they don't exist (migration)
  try {
    db.exec(`ALTER TABLE bookings ADD COLUMN truck_types TEXT;`);
  } catch (error) {
    // Column already exists, ignore error
    console.log('truck_types column already exists');
  }

  try {
    db.exec(`ALTER TABLE bookings ADD COLUMN container_types TEXT;`);
  } catch (error) {
    // Column already exists, ignore error
    console.log('container_types column already exists');
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS booking_purchase_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id TEXT NOT NULL,
      po_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      selected_items TEXT, -- JSON string of selected items
      booked_quantities TEXT, -- JSON string of booked quantities
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY(po_id) REFERENCES purchase_orders(id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      UNIQUE(booking_id, po_id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS booking_milestones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      step TEXT NOT NULL,
      description TEXT,
      location TEXT,
      milestone_date TEXT,
      completed BOOLEAN DEFAULT 0,
      order_index INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS shipment_tracking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      shipment_id TEXT UNIQUE,
      status TEXT DEFAULT 'Pending',
      carrier TEXT,
      courier_name TEXT,
      courier_avatar TEXT,
      origin_city TEXT,
      origin_country TEXT,
      destination_city TEXT,
      destination_country TEXT,
      distance TEXT,
      delivery_time TEXT,
      arrival_date TEXT,
      arrival_time TEXT,
      current_location TEXT,
      progress_percentage INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  console.log('Booking tables initialized successfully');
};

// Initialize tables and ensure all columns exist
ensureBookingTables();

// Generate FL number
const generateFlNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `FL-${timestamp.toString().slice(-6)}${random}`;
};

export async function GET(req: NextRequest) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      console.log('GET /api/bookings - No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('GET /api/bookings - User authenticated:', user.id);

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('id');

    if (bookingId) {
      // Get specific booking with related data
      const booking = db.prepare(`
        SELECT * FROM bookings WHERE id = ? AND user_id = ?
      `).get(bookingId, user.id);

      if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }

      // Get related purchase orders
      const purchaseOrders = db.prepare(`
        SELECT bpo.*, po.cargoReadyBy, po.mustArriveBy, po.buyer, po.seller
        FROM booking_purchase_orders bpo
        LEFT JOIN purchase_orders po ON bpo.po_id = po.id
        WHERE bpo.booking_id = ? AND bpo.user_id = ?
      `).all(bookingId, user.id);

      // Get milestones
      const milestones = db.prepare(`
        SELECT * FROM booking_milestones 
        WHERE booking_id = ? AND user_id = ? 
        ORDER BY order_index ASC, created_at ASC
      `).all(bookingId, user.id);

      // Get shipment tracking
      const tracking = db.prepare(`
        SELECT * FROM shipment_tracking 
        WHERE booking_id = ? AND user_id = ?
      `).get(bookingId, user.id);

      return NextResponse.json({
        ...booking,
        truckTypes: (booking as any).truck_types ? JSON.parse((booking as any).truck_types) : [],
        containerTypes: (booking as any).container_types ? JSON.parse((booking as any).container_types) : [],
        purchaseOrders: purchaseOrders.map((po: any) => ({
          ...po,
          selectedItems: po.selected_items ? JSON.parse(po.selected_items) : [],
          bookedQuantities: po.booked_quantities ? JSON.parse(po.booked_quantities) : {}
        })),
        milestones,
        tracking
      });
    } else {
      // Get all bookings for user
      const bookings = db.prepare(`
        SELECT b.*, 
               GROUP_CONCAT(bpo.po_id) as po_numbers,
               st.status as shipment_status,
               st.progress_percentage
        FROM bookings b
        LEFT JOIN booking_purchase_orders bpo ON b.id = bpo.booking_id
        LEFT JOIN shipment_tracking st ON b.id = st.booking_id
        WHERE b.user_id = ?
        GROUP BY b.id
        ORDER BY b.created_at DESC
      `).all(user.id);

      const enrichedBookings = bookings.map((booking: any) => ({
        ...booking,
        poNumbers: booking.po_numbers ? booking.po_numbers.split(',') : [],
        truckTypes: booking.truck_types ? JSON.parse(booking.truck_types) : [],
        containerTypes: booking.container_types ? JSON.parse(booking.container_types) : [],
        status: booking.shipment_status || booking.status,
        progress: booking.progress_percentage || booking.progress || 0
      }));

      console.log(`Retrieved ${enrichedBookings.length} bookings for user ${user.id}`);
      console.log('GET /api/bookings - Raw bookings from DB:', bookings);
      console.log('GET /api/bookings - Enriched bookings:', enrichedBookings);
      return NextResponse.json(enrichedBookings);
    }
  } catch (err: any) {
    console.error('GET bookings error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      console.log('POST /api/bookings - No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    console.log(`Creating booking for user ${user.id}:`, data);
    console.log('POST /api/bookings - User authenticated:', user.id);

    // Generate booking ID and FL number
    const flNumber = data.flNumber || generateFlNumber();
    const bookingId = data.id || flNumber;

    // Insert booking
    const insertBooking = db.prepare(`
      INSERT INTO bookings (
        id, user_id, fl_number, shipment_name, origin_location, origin_port, 
        cargo_ready_date, destination_location, destination_port, target_delivery_date,
        weight, volume, additional_notes, product_name, hs_code, goods_description,
        sku_number, special_instructions, origin_customs, origin_trucking,
        destination_customs, destination_trucking, dangerous_goods, require_shipment_tags,
        shipper_value, consignee_value, transport_mode_value, shipment_type_value,
        container_type_value, incoterms_value, package_type_value, package_count,
        container_quantity, truck_type, truck_quantity, truck_types, container_types, trade_role, status, progress, eta
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertBooking.run(
      bookingId, user.id, flNumber,
      data.shipmentName || '',
      data.originLocation || '',
      data.originPort || '',
      data.cargoReadyDate || '',
      data.destinationLocation || '',
      data.destinationPort || '',
      data.targetDeliveryDate || '',
      data.weight || '',
      data.volume || '',
      data.additionalNotes || '',
      data.productName || '',
      data.hsCode || '',
      data.goodsDescription || '',
      data.skuNumber || '',
      data.specialInstructions || '',
      data.originCustoms ? 1 : 0,
      data.originTrucking ? 1 : 0,
      data.destinationCustoms ? 1 : 0,
      data.destinationTrucking ? 1 : 0,
      data.dangerousGoods ? 1 : 0,
      data.requireShipmentTags ? 1 : 0,
      data.shipperValue || '',
      data.consigneeValue || '',
      data.transportModeValue || '',
      data.shipmentTypeValue || '',
      data.containerTypeValue || '',
      data.incotermsValue || '',
      data.packageTypeValue || '',
      data.packageCount || '',
      data.containerQuantity || '',
      data.truckType || '',
      data.truckQuantity || '',
      JSON.stringify(data.truckTypes || []),
      JSON.stringify(data.containerTypes || []),
      data.tradeRole || 'shipper',
      data.status || 'Booked',
      data.progress || 0,
      data.targetDeliveryDate || ''
    );

    // Insert purchase order relationships
    if (Array.isArray(data.selectedPOs) && data.selectedPOs.length > 0) {
      const insertPO = db.prepare(`
        INSERT INTO booking_purchase_orders (booking_id, po_id, user_id, selected_items, booked_quantities)
        VALUES (?, ?, ?, ?, ?)
      `);

      const transaction = db.transaction((pos: any[]) => {
        pos.forEach(po => {
          insertPO.run(
            bookingId,
            po.poId,
            user.id,
            JSON.stringify(po.selectedItems || []),
            JSON.stringify(po.bookedQuantities || {})
          );
        });
      });

      transaction(data.selectedPOs);
      console.log(`Linked ${data.selectedPOs.length} POs to booking ${bookingId}`);
    }

    // Create initial milestones
    const initialMilestones = [
      { step: 'Booking Confirmed', description: 'Booking has been confirmed and submitted', completed: true, order: 0 },
      { step: 'Quote Requested', description: 'Waiting for freight quote from forwarder', completed: false, order: 1 },
      { step: 'Quote Approved', description: 'Freight quote approved and payment processed', completed: false, order: 2 },
      { step: 'Cargo Ready', description: 'Cargo ready for pickup/collection', completed: false, order: 3 },
      { step: 'In Transit', description: 'Shipment is in transit', completed: false, order: 4 },
      { step: 'Delivered', description: 'Shipment delivered to destination', completed: false, order: 5 }
    ];

    const insertMilestone = db.prepare(`
      INSERT INTO booking_milestones (booking_id, user_id, step, description, completed, order_index)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const milestoneTransaction = db.transaction((milestones: any[]) => {
      milestones.forEach(milestone => {
        insertMilestone.run(
          bookingId,
          user.id,
          milestone.step,
          milestone.description,
          milestone.completed ? 1 : 0,
          milestone.order
        );
      });
    });

    milestoneTransaction(initialMilestones);

    // Create initial shipment tracking record
    const insertTracking = db.prepare(`
      INSERT INTO shipment_tracking (
        booking_id, user_id, shipment_id, status, origin_city, origin_country,
        destination_city, destination_country, arrival_date, arrival_time, progress_percentage
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Parse origin and destination
    const originParts = (data.originPort || '').split(',').map((s: string) => s.trim());
    const destParts = (data.destinationPort || '').split(',').map((s: string) => s.trim());

    insertTracking.run(
      bookingId,
      user.id,
      flNumber, // Use FL number as shipment ID
      data.status || 'Booked',
      originParts[0] || '',
      originParts[1] || '',
      destParts[0] || '',
      destParts[1] || '',
      data.targetDeliveryDate || '',
      data.targetDeliveryDate || '',
      10 // Initial progress
    );

    console.log(`Created booking ${bookingId} with FL number ${flNumber} for user ${user.id}`);

    return NextResponse.json({
      success: true,
      id: bookingId,
      flNumber: flNumber
    }, { status: 201 });

  } catch (err: any) {
    console.error('POST booking error:', err);
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
    const bookingId = searchParams.get('id');
    if (!bookingId) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
    }

    const data = await req.json();
    console.log(`Updating booking ${bookingId} for user ${user.id}`);

    // Update booking
    const updateBooking = db.prepare(`
      UPDATE bookings SET
        shipment_name = ?, origin_location = ?, origin_port = ?, cargo_ready_date = ?,
        destination_location = ?, destination_port = ?, target_delivery_date = ?,
        weight = ?, volume = ?, additional_notes = ?, product_name = ?, hs_code = ?,
        goods_description = ?, sku_number = ?, special_instructions = ?,
        origin_customs = ?, origin_trucking = ?, destination_customs = ?, destination_trucking = ?,
        dangerous_goods = ?, require_shipment_tags = ?, shipper_value = ?, consignee_value = ?,
        transport_mode_value = ?, shipment_type_value = ?, container_type_value = ?,
        incoterms_value = ?, package_type_value = ?, package_count = ?, container_quantity = ?,
        truck_type = ?, truck_quantity = ?, trade_role = ?, status = ?, progress = ?, eta = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `);

    const result = updateBooking.run(
      data.shipmentName || '',
      data.originLocation || '',
      data.originPort || '',
      data.cargoReadyDate || '',
      data.destinationLocation || '',
      data.destinationPort || '',
      data.targetDeliveryDate || '',
      data.weight || '',
      data.volume || '',
      data.additionalNotes || '',
      data.productName || '',
      data.hsCode || '',
      data.goodsDescription || '',
      data.skuNumber || '',
      data.specialInstructions || '',
      data.originCustoms ? 1 : 0,
      data.originTrucking ? 1 : 0,
      data.destinationCustoms ? 1 : 0,
      data.destinationTrucking ? 1 : 0,
      data.dangerousGoods ? 1 : 0,
      data.requireShipmentTags ? 1 : 0,
      data.shipperValue || '',
      data.consigneeValue || '',
      data.transportModeValue || '',
      data.shipmentTypeValue || '',
      data.containerTypeValue || '',
      data.incotermsValue || '',
      data.packageTypeValue || '',
      data.packageCount || '',
      data.containerQuantity || '',
      data.truckType || '',
      data.truckQuantity || '',
      data.tradeRole || 'shipper',
      data.status || 'Booked',
      data.progress || 0,
      data.eta || '',
      bookingId,
      user.id
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Booking not found or access denied' }, { status: 404 });
    }

    console.log(`Updated booking ${bookingId} for user ${user.id}`);
    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('PUT booking error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('id');
    if (!bookingId) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
    }

    // Delete booking (cascades will handle related records)
    const deleteBooking = db.prepare('DELETE FROM bookings WHERE id = ? AND user_id = ?');
    const result = deleteBooking.run(bookingId, user.id);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Booking not found or access denied' }, { status: 404 });
    }

    console.log(`Deleted booking ${bookingId} for user ${user.id}`);
    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('DELETE booking error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 