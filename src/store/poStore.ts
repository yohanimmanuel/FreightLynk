import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as purchaseOrderApi from '@/utils/purchaseOrderApi';

// --- Type Definitions ---
export interface POItem {
  id: number;
  lineNumber: number;
  productSKU: string;
  productName: string;
  crd: string;
  mabd: string;
  mode: 'Sea' | 'Air' | 'Road' | 'Rail' | '';
  destination: string;
  currency: 'USD' | 'CNY' | 'EUR' | 'IDR' | 'JPY' | 'GBP' | 'AUD' | '';
  unitCost: number | '';
  uom: 'PC' | 'KG' | 'CBM' | 'LBS' | 'TON' | '';
  requestedQty: number | '';
  bookedQty: number;
  bookingProgress: number;
}

export interface POData {
  poNumber: string;
  cargoReadyBy: string;
  mustArriveBy: string;
  buyer: string;
  seller: string;
  subjectedCarrier: string;
  status: 'Open' | 'Closed' | 'Pending';
  progress: string;
  exceptions: string[];
  items: POItem[];
}

export interface PurchaseOrder {
  id: string;
  buyer: string;
  seller: string;
  status: 'Open' | 'Closed' | 'Pending';
  cargoReadyBy: string;
  mustArriveBy: string;
  subjectedCarrier: string;
  progress: string;
  exceptions: string[];
}

export interface PODetail {
  id: number;
  poOrderNumber: string;
  productCode: string;
  productName: string;
  cargoReadyDate: string;
  mustArriveDate: string;
  transportMode: string;
  destination: string;
  requested: number;
  booked: number;
  currency: string;
  unitCost: number;
  uom: string;
}

// --- Zustand Store ---
interface POState {
  purchaseOrders: PurchaseOrder[];
  poDetails: PODetail[];
  setPurchaseOrders: (orders: PurchaseOrder[]) => void;
  setPODetails: (details: PODetail[]) => void;
  fetchPurchaseOrders: () => Promise<void>;
  fetchPODetails: (poId: string) => Promise<void>;
  createPurchaseOrder: (po: Partial<PurchaseOrder>) => Promise<void>;
  updatePurchaseOrder: (poId: string, po: Partial<PurchaseOrder>) => Promise<void>;
  deletePurchaseOrder: (poId: string) => Promise<void>;
  upsertPODetails: (poId: string, details: PODetail[]) => Promise<void>;
  clearCache: () => void;
}

export const usePOStore = create<POState>()(
  persist(
    (set, get) => ({
      purchaseOrders: [],
      poDetails: [],
      setPurchaseOrders: (orders) => set({ purchaseOrders: orders }),
      setPODetails: (details) => set({ poDetails: details }),
      fetchPurchaseOrders: async () => {
        const orders = await purchaseOrderApi.fetchPurchaseOrders();
        set({ purchaseOrders: orders });
      },
      fetchPODetails: async (poId: string) => {
        const details = await purchaseOrderApi.fetchPODetails(poId);
        set((state) => ({
          poDetails: [
            ...state.poDetails.filter(detail => detail.poOrderNumber !== poId),
            ...details
          ]
        }));
      },
      createPurchaseOrder: async (po) => {
        await purchaseOrderApi.createPurchaseOrder(po);
        await get().fetchPurchaseOrders();
      },
      updatePurchaseOrder: async (poId, po) => {
        await purchaseOrderApi.updatePurchaseOrder(poId, po);
        await get().fetchPurchaseOrders();
      },
      deletePurchaseOrder: async (poId) => {
        await purchaseOrderApi.deletePurchaseOrder(poId);
        await get().fetchPurchaseOrders();
      },
      upsertPODetails: async (poId, details) => {
        try {
          console.log('upsertPODetails: Starting update for', poId, 'with', details.length, 'items');
          
          // Wait for API call to complete
          await purchaseOrderApi.upsertPODetails(poId, details);
          console.log('upsertPODetails: API call completed for', poId);
          
          // Don't automatically refetch - let the UI handle updates
          console.log('upsertPODetails: Update completed for', poId);
          
        } catch (error) {
          console.error('upsertPODetails: Error updating', poId, error);
          throw error;
        }
      },
      clearCache: () => {
        set({ purchaseOrders: [], poDetails: [] });
        console.log('Cache cleared.');
      },
    }),
    {
      name: 'po-storage',
    }
  )
);