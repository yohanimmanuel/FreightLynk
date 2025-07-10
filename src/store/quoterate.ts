import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Rate interface (single source of truth)
export interface Rate {
  id: number;
  lane: string;
  mode: 'ocean' | 'air' | 'road';
  shipmentType: string;
  weight: string;
  volume: string;
  containertype: string;
  currency: string;
  price: string;
  baseRate: number;
  originCity: string;
  destinationCity: string;
  transitTime: string;
  carrier: string;
  surcharges: string;
  incoterm: string;
  validFrom: string;
  validTo: string;
  notes: string;
  status: string;
  ratePerCbmKg?: string;
  // Add legacy/optional fields for compatibility
  weightMin?: string;
  weightMax?: string;
  weightUnit?: string;
  volumeMin?: string;
  volumeMax?: string;
  volumeUnit?: string;
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
    lane: 'Asia → North America',
    mode: 'ocean',
    shipmentType: 'FCL',
    containertype: '40ft',
    weight: '120 kg - 400 kg',
    volume: '12 cbm - 20 cbm',
    currency: 'USD',
    price: '$2,100 - $2,800',
    baseRate: 2100,
    originCity: 'Shanghai',
    destinationCity: 'Los Angeles',
    transitTime: '18-22 days',
    carrier: 'COSCO Shipping',
    surcharges: 'BAF: $150, CAF: $200',
    incoterm: 'FOB',
    validFrom: '2024-06-01',
    validTo: '2024-07-31',
    notes: 'Peak season surcharge may apply',
    status: 'draft',
    ratePerCbmKg: '100',
  },
  {
    id: 2,
    lane: 'Europe → Asia',
    mode: 'ocean',
    shipmentType: 'FCL',
    containertype: '40ft',
    weight: '120 kg - 400 kg',
    volume: '12 cbm - 20 cbm',
    currency: 'USD',
    price: '$1,650 - $2,200',
    baseRate: 1650,
    originCity: 'Hamburg',
    destinationCity: 'Singapore',
    transitTime: '25-30 days',
    carrier: 'Maersk Line',
    surcharges: 'THC: $100, DOC: $50',
    incoterm: 'CIF',
    validFrom: '2024-05-15',
    validTo: '2024-06-30',
    notes: 'Express service available',
    status: 'draft',
    ratePerCbmKg: '100',
  },
  {
    id: 3,
    lane: 'Asia → Europe',
    mode: 'air',
    shipmentType: 'LCL',
    containertype: '40ft',
    weight: '120 kg - 400 kg',
    volume: '12 cbm - 20 cbm',
    currency: 'USD',
    price: '$7,500 - $9,200',
    baseRate: 7500,
    originCity: 'Hong Kong',
    destinationCity: 'Frankfurt',
    transitTime: '2-3 days',
    carrier: 'Cathay Pacific Cargo',
    surcharges: 'FSC: $300, SSC: $150',
    incoterm: 'EXW',
    validFrom: '2024-06-01',
    validTo: '2024-07-15',
    notes: 'Temperature controlled available',
    status: 'draft',
    ratePerCbmKg: '100',
  },
];

// Generate quotes from rates data
const generateQuotesFromRates = (rates: Rate[]): Quote[] => {
  const currentYear = new Date().getFullYear();
  return rates.map((rate, index) => ({
    id: `QT-${currentYear}-${String(index + 1).padStart(4, '0')}`,
    lane: rate.lane,
    mode: rate.mode,
    containertype: rate.containertype,
    currency: rate.currency,
    baseRate: rate.baseRate,
    price: rate.price,
    transitTime: rate.transitTime,
    carrier: rate.carrier,
    validity: `Valid until ${rate.validTo}`,
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
