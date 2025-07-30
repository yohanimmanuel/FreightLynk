import { create } from 'zustand';
import { ratesApi } from '@/utils/ratesApi';

// Rate interface (single source of truth) - ONLY new standardized fields from STANDARD_FIELDS
export interface Rate {
  id: number;
  mode?: string;
  provider?: string;
  agent?: string;
  origin?: string;
  destination?: string;
  ocean20dc?: string;
  ocean40dc?: string;
  ocean40hc?: string;
  ocean45hc?: string;
  ocean20rf?: string;
  ocean40rf?: string;
  ocean20tank?: string;
  ocean40tank?: string;
  ocean20fr?: string;
  ocean40fr?: string;
  ocean20ot?: string;
  ocean40ot?: string;
  portOfDischarge?: string;
  transitPort?: string;
  remark?: string;
  commodity?: string;
  createdBy?: string;
  validFrom?: string;
  validTo?: string;
  createdOn?: string;
  type?: string;
  createType?: string;
  service?: string;
  serviceCode?: string;
  note?: string;
  contract?: string;
  frequency?: string;
  transitTime?: string;
  currency?: string;
  price?: string;
  baseRate?: string;
  minCharge?: string;
  originAirport?: string;
  destinationAirport?: string;
  airline?: string;
  rate45?: string;
  rate100?: string;
  rate300?: string;
  rate500?: string;
  rate1000?: string;
  truckType?: string;
  rate?: string;
  status?: string;
}

// Rate store interface
export interface RateStore {
  rates: Rate[];
  selectedRate: Rate | null;
  
  // Rate actions
  setRates: (rates: Rate[]) => void;
  addRate: (rate: Rate) => Promise<void>;
  addRates: (rates: Rate[]) => Promise<Rate[]>;
  updateRate: (updatedRate: Rate) => Promise<void>;
  deleteRate: (id: number) => Promise<void>;
  loadRates: (mode?: string) => Promise<void>;
  setSelectedRate: (rate: Rate | null) => void;
}

// Rate store implementation
export const useRateStore = create<RateStore>((set, get) => ({
  rates: [],
  selectedRate: null,

  // Rate actions
  setRates: (rates: Rate[]) => set({ rates }),
  
  addRate: async (rate: Rate) => {
    try {
      const result = await ratesApi.createRate(rate);
      if (result.success && result.id) {
        const newRate = { ...rate, id: result.id };
        set((state) => ({
          rates: [...state.rates, newRate]
        }));
      }
    } catch (error) {
      console.error('Error adding rate:', error);
      throw error;
    }
  },

  addRates: async (rates: Rate[]) => {
    try {
      const results = await Promise.allSettled(
        rates.map(rate => ratesApi.createRate(rate))
      );
      
      const successfulRates: Rate[] = [];
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success && result.value.id) {
          successfulRates.push({ ...rates[index], id: result.value.id });
        }
      });
      
      if (successfulRates.length > 0) {
        set((state) => ({ rates: [...state.rates, ...successfulRates] }));
      }
      
      return successfulRates;
    } catch (error) {
      console.error('Error adding rates:', error);
      throw error;
    }
  },

  updateRate: async (updatedRate: Rate) => {
    try {
      const result = await ratesApi.updateRate(updatedRate.id, updatedRate);
      if (result.success) {
        set((state) => ({
          rates: state.rates.map(rate => rate.id === updatedRate.id ? updatedRate : rate)
        }));
      }
    } catch (error) {
      console.error('Error updating rate:', error);
      throw error;
    }
  },

  deleteRate: async (id: number) => {
    try {
      const result = await ratesApi.deleteRate(id);
      if (result.success) {
        set((state) => ({
          rates: state.rates.filter(rate => rate.id !== id)
        }));
      }
    } catch (error) {
      console.error('Error deleting rate:', error);
      throw error;
    }
  },

  loadRates: async (mode?: string) => {
    try {
      const rates = await ratesApi.getRates(mode);
      set({ rates });
    } catch (error) {
      console.error('Error loading rates:', error);
      throw error;
    }
  },

  setSelectedRate: (rate: Rate | null) => set({ selectedRate: rate }),
}));
