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
}

// Quote interface (simplified version of Rate)
export interface Quote {
  id: string; // QT-CurrentYear-4 generated numbers
  lane: string;
  mode: 'ocean' | 'air' | 'road';
  containertype: string;
  currency: string;
  baseRate: number;
  price: string;
  transitTime: string;
  carrier: string;
  validity: string;
  status: 'sent' | 'draft' | 'requested' | 'expired';
}

// Mock data for rates (single source of truth)
const mockRates: Rate[] = [
  {
    id: 1,
    provider: 'COSCO Shipping',
    origin: 'Shanghai',
    destination: 'Los Angeles',
    ocean40dc: '2100',
    currency: 'USD',
    validFrom: '2024-06-01',
    validTo: '2024-07-31',
    status: 'draft',
  },
  {
    id: 2,
    provider: 'Maersk Line',
    origin: 'Hamburg',
    destination: 'Singapore',
    ocean40dc: '1650',
    currency: 'USD',
    validFrom: '2024-05-15',
    validTo: '2024-06-30',
    status: 'draft',
  },
  {
    id: 3,
    provider: 'Cathay Pacific Cargo',
    originAirport: 'Hong Kong',
    destinationAirport: 'Frankfurt',
    rate100: '7500',
    currency: 'USD',
    validFrom: '2024-06-01',
    validTo: '2024-07-15',
    status: 'draft',
  },
];

// Generate quotes from rates data
const generateQuotesFromRates = (rates: Rate[]): Quote[] => {
  const currentYear = new Date().getFullYear();
  return rates.map((rate, index) => ({
    id: `QT-${currentYear}-${String(index + 1).padStart(4, '0')}`,
    // Use provider and origin-destination for lane
    lane: `${rate.provider || ''} ${rate.origin || rate.originAirport || ''} - ${rate.destination || rate.destinationAirport || ''}`.trim(),
    mode: rate.originAirport || rate.destinationAirport ? 'air' : (rate.truckType ? 'road' : 'ocean'),
    containertype: '', // No containertype field in new Rate
    currency: rate.currency || '',
    baseRate: rate.baseRate ? Number(rate.baseRate) : 0,
    price: rate.price || '',
    transitTime: rate.transitTime || '',
    carrier: rate.provider || '',
    validity: `Valid until ${rate.validTo || ''}`,
    status: 'draft' as const
  }));
};

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
      rates: mockRates,
      quotes: generateQuotesFromRates(mockRates),
      selectedRate: null,
      selectedQuote: null,
      
      // Rate actions
      setRates: (rates: Rate[]) => set({ rates }),
      addRate: (rate: Rate) => set((state) => ({ rates: [...state.rates, rate ]})),
      updateRate: (updatedRate: Rate) => 
        set((state) => ({
          rates: state.rates.map(rate => 
            rate.id === updatedRate.id ? updatedRate : rate
          )
        })),
      deleteRate: (id: number) => 
        set((state) => ({
          rates: state.rates.filter(rate => rate.id !== id)
        })),
      setSelectedRate: (rate: Rate | null) => set({ selectedRate: rate }),
      
      // Quote actions
      setQuotes: (quotes: Quote[]) => set({ quotes }),
      addQuote: (quote: Quote) => set((state) => ({ quotes: [...state.quotes, quote ]})),
      updateQuote: (updatedQuote: Quote) => 
        set((state) => ({
          quotes: state.quotes.map(quote => 
            quote.id === updatedQuote.id ? updatedQuote : quote
          )
        })),
      deleteQuote: (id: string) => 
        set((state) => ({
          quotes: state.quotes.filter(quote => quote.id !== id)
        })),
      setSelectedQuote: (quote: Quote | null) => set({ selectedQuote: quote }),
      
      // Utility actions
      generateQuotesFromRates: () => {
        const { rates } = get();
        const quotes = generateQuotesFromRates(rates);
        set({ quotes });
      },
      updateQuotesFromRates: () => {
        const { rates } = get();
        const quotes = generateQuotesFromRates(rates);
        set({ quotes });
      }
    }),
    {
      name: 'quote-rate-storage'
    }
  )
);
