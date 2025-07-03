import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PurchaseOrder, PODetail } from '@/store/poMockData';
import { purchaseOrdersData, poDetailsData } from '@/store/poMockData';

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
      name: 'po-store', // name of the item in storage
    }
  )
); 