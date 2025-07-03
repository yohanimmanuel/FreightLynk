import { create } from 'zustand';
import type { PurchaseOrder, PODetail } from './poMockData';
import { purchaseOrdersData, poDetailsData } from './poMockData';

interface POState {
  purchaseOrders: PurchaseOrder[];
  poDetails: PODetail[];
  setPurchaseOrders: (orders: PurchaseOrder[]) => void;
  setPODetails: (details: PODetail[]) => void;
}

export const usePOStore = create<POState>((set) => ({
  purchaseOrders: purchaseOrdersData,
  poDetails: poDetailsData,
  setPurchaseOrders: (orders) => set({ purchaseOrders: orders }),
  setPODetails: (details) => set({ poDetails: details }),
})); 