import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BillingStore = {
  selectedBilling: any | null;
  setSelectedBilling: (billing: any) => void;
  clearSelectedBilling: () => void;
};

export const useBillingStore = create<BillingStore>()(
  persist(
    (set) => ({
      selectedBilling: null,
      setSelectedBilling: (billing: any) => set({ selectedBilling: billing }),
      clearSelectedBilling: () => set({ selectedBilling: null }),
    }),
    { name: 'billing-storage' }
  )
); 