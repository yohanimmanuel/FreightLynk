import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PurchaseOrder, PODetail } from './poMockData';
import { purchaseOrdersData, poDetailsData } from './poMockData';

interface POState {
  purchaseOrders: PurchaseOrder[];
  poDetails: PODetail[];
  setPurchaseOrders: (orders: PurchaseOrder[]) => void;
  setPODetails: (details: PODetail[]) => void;
}

export const usePOStore = create<POState>()(
  persist(
    (set) => ({
      purchaseOrders: purchaseOrdersData,
      poDetails: poDetailsData,
      setPurchaseOrders: (orders) => set({ purchaseOrders: orders }),
      setPODetails: (details) => set({ poDetails: details }),
    }),
    {
      name: 'po-storage', // unique name for localStorage key
      // Optional: You can specify which parts of the state to persist
      // partialize: (state) => ({ purchaseOrders: state.purchaseOrders, poDetails: state.poDetails }),
    }
  )
); 