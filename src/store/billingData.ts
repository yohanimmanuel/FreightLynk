// billingData.ts - shared billing data and store for BillingTable and BillingDetails
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchBillings, createBilling, updateBilling, deleteBilling, formatBillingForAPI, formatBillingForDisplay, type Billing } from '@/utils/billingApi';

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
  // Backend data
  billings: Billing[];
  selectedBilling: Billing | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSelectedBilling: (billing: Billing) => void;
  clearSelectedBilling: () => void;
  loadBillings: () => Promise<void>;
  createNewBilling: (billingData: any) => Promise<{ success: boolean; id: string; invoiceNumber: string }>;
  updateExistingBilling: (id: string, billingData: any) => Promise<void>;
  deleteExistingBilling: (id: string) => Promise<void>;
  setBillings: (billings: Billing[]) => void;
  refreshBillings: () => Promise<void>;
}

// Create the store
export const useBillingStore = create<BillingStore>()(
  persist(
    (set, get) => ({
      billings: [],
      selectedBilling: null,
      isLoading: false,
      error: null,
      
      setSelectedBilling: (billing: Billing) => set({ selectedBilling: billing }),
      clearSelectedBilling: () => set({ selectedBilling: null }),
      
      loadBillings: async () => {
        set({ isLoading: true, error: null });
        try {
          const billings = await fetchBillings();
          set({ billings, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
      
      createNewBilling: async (billingData: any) => {
        set({ isLoading: true, error: null });
        try {
          const formattedData = formatBillingForAPI(billingData);
          const result = await createBilling(formattedData);
          await get().loadBillings(); // Refresh the list
          set({ isLoading: false });
          return result;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      updateExistingBilling: async (id: string, billingData: any) => {
        set({ isLoading: true, error: null });
        try {
          const formattedData = formatBillingForAPI(billingData);
          await updateBilling(id, formattedData);
          await get().loadBillings(); // Refresh the list
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      deleteExistingBilling: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          await deleteBilling(id);
          await get().loadBillings(); // Refresh the list
          set({ isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      setBillings: (billings: Billing[]) => set({ billings }),
      
      refreshBillings: async () => {
        await get().loadBillings();
      }
    }),
    { 
      name: 'billing-storage'
    }
  )
);

