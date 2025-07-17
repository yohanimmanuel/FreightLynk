import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Rate interface (single source of truth) - ONLY new standardized fields from STANDARD_FIELDS
export interface Rate {
  id: number;
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
  mode?: string; // Added for mode filtering in RateTable
}

// Quote interface (simplified version of Rate)
export interface Quote {
  id: string;
  lane: string;
  mode: 'ocean' | 'air' | 'road';
  containertype: string;
  currency: string;
  baseRate: number;
  price: string;
  transitTime: string;
  provider: string;
  validity: string;
  status: 'sent' | 'draft' | 'requested' | 'expired';
  origin: string;
  destination: string;
  incoterms: string;
  remark: string;
  serviceType?: string;
  transitPort?: string;
  client?: string;
  isTariff?: boolean;
  profit?: string;
  createdBy?: string;
  createdDate?: string;
  notes?: string;
  details?: string;
  truckType?: string;
  weightVolume?: string;
}

// Zustand store interface
export interface QuoteRateStore {
  rates: Rate[];
  quotes: Quote[];
  selectedRate: Rate | null;
  selectedQuote: Quote | null;
  
  // Rate actions
  setRates: (rates: Rate[]) => void;
  addRate: (rate: Rate) => void;
  updateRate: (updatedRate: Rate) => void;
  deleteRate: (id: number) => void;
  setSelectedRate: (rate: Rate | null) => void;
  
  // Quote actions
  setQuotes: (quotes: Quote[]) => void;
  addQuote: (quote: Quote) => void;
  updateQuote: (updatedQuote: Quote) => void;
  deleteQuote: (id: string) => void;
  setSelectedQuote: (quote: Quote | null) => void;
  
  // Utility actions
  generateQuotesFromRates: () => void;
  updateQuotesFromRates: () => void;
}

// Create the store
export const useQuoteRateStore = create<QuoteRateStore>()(
  persist(
    (set, get) => ({
      rates: [],
      quotes: [],
      selectedRate: null,
      selectedQuote: null,
      setRates: (rates) => set({ rates }),
      addRate: (rate) => set((state) => ({ rates: [...state.rates, rate] })),
      updateRate: (updatedRate) => set((state) => ({
        rates: state.rates.map(rate => rate.id === updatedRate.id ? updatedRate : rate)
      })),
      deleteRate: (id) => set((state) => ({
        rates: state.rates.filter(rate => rate.id !== id)
      })),
      setSelectedRate: (rate) => set({ selectedRate: rate }),
      setQuotes: (quotes) => set({ quotes }),
      addQuote: (quote) => set((state) => ({ quotes: [...state.quotes, quote] })),
      updateQuote: (updatedQuote) => set((state) => ({
        quotes: state.quotes.map(quote => quote.id === updatedQuote.id ? updatedQuote : quote)
      })),
      deleteQuote: (id) => set((state) => ({
        quotes: state.quotes.filter(quote => quote.id !== id)
      })),
      setSelectedQuote: (quote) => set({ selectedQuote: quote }),
      generateQuotesFromRates: () => set({ quotes: [] }),
      updateQuotesFromRates: () => set({ quotes: [] }),
    }),
    {
      name: 'quote-rate-storage'
    }
  )
);
