// billingData.ts - shared billing data and store for BillingTable and BillingDetails
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the billing data types
export interface BillingCharge {
  type: string;
  description: string;
  amount: number;
}

export interface PaymentHistory {
  date: string;
  amount: number;
  method: string;
  status: string;
}

export interface BillingItem {
  id: number;
  bookingId: string;
  issuer: string;
  billingDate: string;
  amountDue: number;
  status: string;
  invoiceNumber: string;
  dueDate: string;
  currency: string;
  paymentMethod: string;
  paymentDate: string | null;
  invoiceNotes: string;
  charges: BillingCharge[];
  paymentHistory: PaymentHistory[];
}

// Single mock data entry for design visualization
const mockBilling: BillingItem = {
  id: 1,
  bookingId: 'FL-42581',
  issuer: 'Maersk Line',
  billingDate: '2024-06-15',
  amountDue: 1250.00,
  status: 'Unpaid',
  invoiceNumber: 'INV-2024-001',
  dueDate: '2024-07-15',
  currency: 'USD',
  paymentMethod: 'Credit Card',
  paymentDate: null,
  invoiceNotes: 'Standard freight charges for container shipment from Shanghai to Los Angeles',
  charges: [
    { type: 'Freight Base Rate', description: 'Main transport cost', amount: 800.00 },
    { type: 'Fuel Surcharge', description: 'Fuel fluctuation fee', amount: 150.00 },
    { type: 'Handling Fee', description: 'Port/container handling', amount: 75.00 },
    { type: 'Documentation Fee', description: 'Admin and B/L docs', amount: 25.00 },
    { type: 'Insurance', description: 'Optional cargo protection', amount: 50.00 },
    { type: 'Customs Fee', description: 'Clearance service fee', amount: 150.00 }
  ],
  paymentHistory: []
};

// Zustand store
export interface BillingStore {
  billings: BillingItem[];
  selectedBilling: BillingItem | null;
  setSelectedBilling: (billing: BillingItem) => void;
  clearSelectedBilling: () => void;
  updateBilling: (updatedBilling: BillingItem) => void;
  addBilling: (newBilling: BillingItem) => void;
  deleteBilling: (id: number) => void;
  setBillings: (billings: BillingItem[]) => void;
}

// Create the store
export const useBillingStore = create<BillingStore>()(
  persist(
    (set) => ({
      billings: [mockBilling], // Initialize with single mock entry
      selectedBilling: null,
      setSelectedBilling: (billing: BillingItem) => set({ selectedBilling: billing }),
      clearSelectedBilling: () => set({ selectedBilling: null }),
      updateBilling: (updatedBilling: BillingItem) => 
        set((state) => ({
          billings: state.billings.map(billing => 
            billing.id === updatedBilling.id ? updatedBilling : billing
          )
        })),
      addBilling: (newBilling: BillingItem) => 
        set((state) => ({
          billings: [...state.billings, newBilling]
        })),
      deleteBilling: (id: number) => 
        set((state) => ({
          billings: state.billings.filter(billing => billing.id !== id)
        })),
      setBillings: (billings: BillingItem[]) => set({ billings })
    }),
    { 
      name: 'billing-storage'
    }
  )
);

