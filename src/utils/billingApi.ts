import axios from 'axios';

const API_BASE = '/api/billing';

// Billing interfaces
export interface BillingCharge {
  id?: number;
  billing_id?: string;
  user_id?: string;
  charge_type: string;
  description: string;
  amount: number;
  created_at?: string;
}

export interface PaymentHistory {
  id?: number;
  billing_id?: string;
  user_id?: string;
  payment_date: string;
  amount: number;
  method: string;
  status: string;
  created_at?: string;
}

export interface Billing {
  id: string;
  user_id?: string;
  booking_id: string;
  issuer: string;
  billing_date: string;
  due_date: string;
  invoice_number: string;
  payment_method?: string;
  status: string;
  amount_due: number;
  currency?: string;
  invoice_notes?: string;
  payment_date?: string;
  created_at?: string;
  updated_at?: string;
  
  // Related data
  charges?: BillingCharge[];
  paymentHistory?: PaymentHistory[];
  booking_fl_number?: string;
  shipment_name?: string;
}

// Fetch all billings
export async function fetchBillings(): Promise<Billing[]> {
  const res = await axios.get(API_BASE);
  return res.data;
}

// Fetch specific billing by ID
export async function fetchBilling(id: string): Promise<Billing> {
  const res = await axios.get(`${API_BASE}?id=${id}`);
  return res.data;
}

// Create new billing
export async function createBilling(billing: Omit<Billing, 'id' | 'invoice_number'>): Promise<{ success: boolean; id: string; invoiceNumber: string }> {
  const res = await axios.post(API_BASE, billing);
  return res.data;
}

// Update billing
export async function updateBilling(id: string, billing: Partial<Billing>): Promise<{ success: boolean }> {
  const res = await axios.put(`${API_BASE}?id=${id}`, billing);
  return res.data;
}

// Delete billing
export async function deleteBilling(id: string): Promise<{ success: boolean }> {
  const res = await axios.delete(`${API_BASE}?id=${id}`);
  return res.data;
}

// Format billing data for API
export const formatBillingForAPI = (billing: any): Omit<Billing, 'id' | 'invoice_number'> => {
  return {
    booking_id: billing.bookingId,
    issuer: billing.issuer,
    billing_date: billing.billingDate,
    due_date: billing.dueDate,
    payment_method: billing.paymentMethod,
    status: billing.status,
    amount_due: billing.amountDue,
    currency: billing.currency,
    invoice_notes: billing.invoiceNotes,
    payment_date: billing.paymentDate,
    charges: billing.charges?.map((charge: any) => ({
      charge_type: charge.type,
      description: charge.description,
      amount: charge.amount
    })),
    paymentHistory: billing.paymentHistory?.map((payment: any) => ({
      payment_date: payment.date,
      amount: payment.amount,
      method: payment.method,
      status: payment.status
    }))
  };
};

// Format billing data for display
export const formatBillingForDisplay = (billing: Billing): any => {
  return {
    id: billing.id,
    bookingId: billing.booking_id,
    issuer: billing.issuer,
    billingDate: billing.billing_date,
    dueDate: billing.due_date,
    invoiceNumber: billing.invoice_number,
    paymentMethod: billing.payment_method,
    status: billing.status,
    amountDue: billing.amount_due,
    currency: billing.currency,
    invoiceNotes: billing.invoice_notes,
    paymentDate: billing.payment_date,
    charges: billing.charges?.map(charge => ({
      type: charge.charge_type,
      description: charge.description,
      amount: charge.amount
    })),
    paymentHistory: billing.paymentHistory?.map(payment => ({
      date: payment.payment_date,
      amount: payment.amount,
      method: payment.method,
      status: payment.status
    }))
  };
}; 