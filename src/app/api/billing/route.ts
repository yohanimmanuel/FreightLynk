import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserById } from '../auth/userDb';

// Helper function to get current user from request
const getCurrentUser = (req: NextRequest) => {
  const userId = req.cookies.get('auth_token')?.value;
  if (!userId) return null;
  return getUserById(userId);
};

// Create billing tables with user_id for data isolation
const ensureBillingTables = () => {
  // Create main billing table
  db.exec(`
    CREATE TABLE IF NOT EXISTS billing (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      booking_id TEXT NOT NULL,
      issuer TEXT NOT NULL,
      billing_date TEXT NOT NULL,
      due_date TEXT NOT NULL,
      invoice_number TEXT UNIQUE NOT NULL,
      payment_method TEXT,
      status TEXT DEFAULT 'Unpaid',
      amount_due REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      invoice_notes TEXT,
      payment_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(booking_id) REFERENCES bookings(id)
    );
  `);

  // Create billing charges table
  db.exec(`
    CREATE TABLE IF NOT EXISTS billing_charges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      billing_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      charge_type TEXT NOT NULL,
      description TEXT,
      amount REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(billing_id) REFERENCES billing(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Create payment history table
  db.exec(`
    CREATE TABLE IF NOT EXISTS payment_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      billing_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      payment_date TEXT NOT NULL,
      amount REAL NOT NULL,
      method TEXT NOT NULL,
      status TEXT DEFAULT 'Completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(billing_id) REFERENCES billing(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  console.log('Billing tables initialized successfully');
};

// Initialize tables
ensureBillingTables();

// Generate unique invoice number
const generateInvoiceNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `INV-${new Date().getFullYear()}-${String(random).padStart(3, '0')}`;
};

export async function GET(req: NextRequest) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      console.log('GET /api/billing - No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('GET /api/billing - User authenticated:', user.id);

    const { searchParams } = new URL(req.url);
    const billingId = searchParams.get('id');

    if (billingId) {
      // Get specific billing with related data
      const billing = db.prepare(`
        SELECT * FROM billing WHERE id = ? AND user_id = ?
      `).get(billingId, user.id);

      if (!billing) {
        return NextResponse.json({ error: 'Billing not found' }, { status: 404 });
      }

      // Get charges
      const charges = db.prepare(`
        SELECT * FROM billing_charges 
        WHERE billing_id = ? AND user_id = ?
        ORDER BY created_at ASC
      `).all(billingId, user.id);

      // Get payment history
      const paymentHistory = db.prepare(`
        SELECT * FROM payment_history 
        WHERE billing_id = ? AND user_id = ?
        ORDER BY payment_date DESC
      `).all(billingId, user.id);

      return NextResponse.json({
        ...billing,
        charges,
        paymentHistory
      });
    } else {
      // Get all billings for user
      const billings = db.prepare(`
        SELECT b.*, 
               bk.fl_number as booking_fl_number,
               bk.shipment_name
        FROM billing b
        LEFT JOIN bookings bk ON b.booking_id = bk.id
        WHERE b.user_id = ?
        ORDER BY b.created_at DESC
      `).all(user.id);

      // Get charges for all billings
      const allCharges = db.prepare(`
        SELECT billing_id, charge_type, description, amount, created_at
        FROM billing_charges 
        WHERE user_id = ?
        ORDER BY billing_id, created_at ASC
      `).all(user.id);

      // Group charges by billing_id
      const chargesByBilling = allCharges.reduce((acc: Record<string, any[]>, charge: any) => {
        if (!acc[charge.billing_id]) {
          acc[charge.billing_id] = [];
        }
        acc[charge.billing_id].push(charge);
        return acc;
      }, {} as Record<string, any[]>);

      // Get payment history for all billings
      const allPaymentHistory = db.prepare(`
        SELECT billing_id, payment_date, amount, method, status, created_at
        FROM payment_history 
        WHERE user_id = ?
        ORDER BY billing_id, payment_date DESC
      `).all(user.id);

      // Group payment history by billing_id
      const paymentHistoryByBilling = allPaymentHistory.reduce((acc: Record<string, any[]>, payment: any) => {
        if (!acc[payment.billing_id]) {
          acc[payment.billing_id] = [];
        }
        acc[payment.billing_id].push(payment);
        return acc;
      }, {} as Record<string, any[]>);

      // Combine billings with their charges and payment history
      const billingsWithDetails = billings.map((billing: any) => ({
        ...billing,
        charges: chargesByBilling[billing.id] || [],
        paymentHistory: paymentHistoryByBilling[billing.id] || []
      }));

      return NextResponse.json(billingsWithDetails);
    }
  } catch (err: any) {
    console.error('GET billing error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      console.log('POST /api/billing - No user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    console.log(`Creating billing for user ${user.id}:`, data);

    // Generate billing ID and invoice number
    const billingId = data.id || `BILL-${Date.now()}`;
    const invoiceNumber = data.invoiceNumber || generateInvoiceNumber();

    // Insert billing
    const insertBilling = db.prepare(`
      INSERT INTO billing (
        id, user_id, booking_id, issuer, billing_date, due_date, invoice_number,
        payment_method, status, amount_due, currency, invoice_notes, payment_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertBilling.run(
      billingId,
      user.id,
      data.bookingId,
      data.issuer,
      data.billingDate,
      data.dueDate,
      invoiceNumber,
      data.paymentMethod,
      data.status || 'Unpaid',
      data.amountDue,
      data.currency || 'USD',
      data.invoiceNotes,
      data.paymentDate
    );

    // Insert charges
    if (Array.isArray(data.charges) && data.charges.length > 0) {
      const insertCharge = db.prepare(`
        INSERT INTO billing_charges (billing_id, user_id, charge_type, description, amount)
        VALUES (?, ?, ?, ?, ?)
      `);

      const transaction = db.transaction((charges: any[]) => {
        charges.forEach(charge => {
          insertCharge.run(
            billingId,
            user.id,
            charge.type,
            charge.description,
            charge.amount
          );
        });
      });

      transaction(data.charges);
      console.log(`Inserted ${data.charges.length} charges for billing ${billingId}`);
    }

    // Insert payment history if provided
    if (Array.isArray(data.paymentHistory) && data.paymentHistory.length > 0) {
      const insertPayment = db.prepare(`
        INSERT INTO payment_history (billing_id, user_id, payment_date, amount, method, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      const transaction = db.transaction((payments: any[]) => {
        payments.forEach(payment => {
          insertPayment.run(
            billingId,
            user.id,
            payment.date,
            payment.amount,
            payment.method,
            payment.status
          );
        });
      });

      transaction(data.paymentHistory);
      console.log(`Inserted ${data.paymentHistory.length} payment records for billing ${billingId}`);
    }

    console.log(`Created billing ${billingId} with invoice number ${invoiceNumber} for user ${user.id}`);

    return NextResponse.json({
      success: true,
      id: billingId,
      invoiceNumber: invoiceNumber
    }, { status: 201 });

  } catch (err: any) {
    console.error('POST billing error:', err);
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
    const billingId = searchParams.get('id');
    if (!billingId) {
      return NextResponse.json({ error: 'Missing billing ID' }, { status: 400 });
    }

    const data = await req.json();
    console.log(`Updating billing ${billingId} for user ${user.id}`);

    // Update billing
    const updateBilling = db.prepare(`
      UPDATE billing SET
        issuer = ?, billing_date = ?, due_date = ?, payment_method = ?,
        status = ?, amount_due = ?, currency = ?, invoice_notes = ?, payment_date = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `);

    const result = updateBilling.run(
      data.issuer,
      data.billingDate,
      data.dueDate,
      data.paymentMethod,
      data.status,
      data.amountDue,
      data.currency,
      data.invoiceNotes,
      data.paymentDate,
      billingId,
      user.id
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Billing not found or access denied' }, { status: 404 });
    }

    // Update charges if provided
    if (Array.isArray(data.charges)) {
      // Delete existing charges
      db.prepare('DELETE FROM billing_charges WHERE billing_id = ? AND user_id = ?').run(billingId, user.id);

      // Insert new charges
      if (data.charges.length > 0) {
        const insertCharge = db.prepare(`
          INSERT INTO billing_charges (billing_id, user_id, charge_type, description, amount)
          VALUES (?, ?, ?, ?, ?)
        `);

        const transaction = db.transaction((charges: any[]) => {
          charges.forEach(charge => {
            insertCharge.run(
              billingId,
              user.id,
              charge.type,
              charge.description,
              charge.amount
            );
          });
        });

        transaction(data.charges);
      }
    }

    console.log(`Updated billing ${billingId} for user ${user.id}`);
    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('PUT billing error:', err);
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
    const billingId = searchParams.get('id');
    if (!billingId) {
      return NextResponse.json({ error: 'Missing billing ID' }, { status: 400 });
    }

    // Delete billing (cascading will delete charges and payment history)
    const result = db.prepare('DELETE FROM billing WHERE id = ? AND user_id = ?').run(billingId, user.id);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Billing not found or access denied' }, { status: 404 });
    }

    console.log(`Deleted billing ${billingId} for user ${user.id}`);
    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('DELETE billing error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 