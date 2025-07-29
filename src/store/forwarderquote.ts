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

// Quote interface (simplified version of Rate)
export interface QuoteParty {
  company: string;
  address: string;
  phone: string;
  preparedBy?: string;
  mobile?: string;
  email?: string;
  contact?: string;
}

export interface QuoteLineItem {
  chargeType: string;
  item: string;
  description: string;
  calculation: string;
  qty: number;
  baseRate: number;
  currency: string;
  amount: number;
}

export interface QuoteAdditionalInfo {
  isTariff?: boolean | string;
  shipmentType?: string;
  companyBranch?: string;
  incoterms?: string;
  remark?: string;
  notes?: string;
  freightTerms?: string;
  commodities?: string;
  ofPriceFeedback?: string;
  transitTime?: string;
  cargoReadyDate?: string;
  validUntil?: string;
  etd?: string;
}

export interface Quote {
  id: string;
  lane: string;
  mode: 'ocean' | 'air' | 'road';
  modeLabel?: string;
  containertype: string | string[];
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
  details?: string | string[];
  truckType?: string | string[];
  weightVolume?: string | string[];

  /**
   * Invoice-level additional cost entered manually by user (e.g. documentation fee).
   * Included in finalTotalAmount calculations.
   */
  additionalCost?: number;
  /** Optional description of the additional cost */
  additionalCostDescription?: string;

  /** Sum of all line-item amounts (without additionalCost). */
  totalAmount?: number;
  /** totalAmount + additionalCost, used for display and list tables */
  finalTotalAmount?: number;

  // Expanded fields for invoice
  from: QuoteParty;
  to: QuoteParty;
  tableRows: QuoteLineItem[];
  additionalInfo: QuoteAdditionalInfo;
  companyBranch?: string;
  companyName?: string;
  companyLogo?: string; // URL or base64
  shipmentType?: string;
  shipmentTypeDescription?: string;
  validUntil?: string;
  originAirport?: string;
  destinationAirport?: string;
}


// Mock forwarder quotes for QuoteRequest integration
export const mockForwarderQuotes: any[] = [
  {
    id: 'QR-1001',
    customer: 'Acme Electronics',
    provider: 'Global Forwarders Ltd',
    details: '1x40ft High Cube Container, 20,000 kg',
    origin: 'Shenzhen, CN',
    destination: 'Los Angeles, US',
    attachment: 'invoice-1001.pdf',
    status: 'Quoted',
    incoterms: 'FOB',
    createdBy: 'John Doe',
    createdOn: '2025-07-20',
    mode: 'FCL',
    notes: 'Handle with care. Fragile items.',
    commodities: 'Consumer Electronics (Laptops, Tablets)',
    expectedDelivery: '2025-08-05',
    cargoReadyDate: '2025-07-25'
  },
  {
    id: 'QR-1002',
    customer: 'Beta Textiles',
    provider: 'Oceanic Logistics',
    details: '2x20ft Standard Containers, 16,000 kg total',
    origin: 'Ho Chi Minh City, VN',
    destination: 'Hamburg, DE',
    attachment: 'packinglist-2002.pdf',
    status: 'Pending',
    incoterms: 'CIF',
    createdBy: 'Jane Smith',
    createdOn: '2025-07-18',
    mode: 'FCL',
    notes: 'Urgent shipment for seasonal demand.',
    commodities: 'Cotton Textile Rolls',
    expectedDelivery: '2025-08-10',
    cargoReadyDate: '2025-07-22'
  },
  {
    id: 'QR-1003',
    customer: 'Delta Auto Parts',
    provider: 'SkyTrans Express',
    details: '1 air pallet, 1,200 kg, 2.5 CBM',
    origin: 'Nagoya, JP',
    destination: 'Chicago, US',
    attachment: 'specsheet-3003.pdf',
    status: 'Accepted',
    incoterms: 'EXW',
    createdBy: 'Carlos Ruiz',
    createdOn: '2025-07-15',
    mode: 'Air',
    notes: 'Deliver ASAP. Customer waiting.',
    commodities: 'Automotive Engine Parts',
    expectedDelivery: '2025-07-24',
    cargoReadyDate: '2025-07-16'
  }
];

// Zustand store interface
export interface QuoteRateStore {
  rates: Rate[];
  quotes: Quote[];
  selectedRate: Rate | null;
  selectedQuote: Quote | null;
  currentDraftQuote: Quote | null;
  
  // Rate actions
  setRates: (rates: Rate[]) => void;
  addRate: (rate: Rate) => Promise<void>;
  addRates: (rates: Rate[]) => Promise<Rate[]>;
  updateRate: (updatedRate: Rate) => Promise<void>;
  deleteRate: (id: number) => Promise<void>;
  loadRates: (mode?: string) => Promise<void>;
  setSelectedRate: (rate: Rate | null) => void;
  
  // Quote actions
  setQuotes: (quotes: Quote[]) => void;
  addQuote: (quote: Quote) => void;
  updateQuote: (updatedQuote: Quote) => void;
  deleteQuote: (id: string) => void;
  setSelectedQuote: (quote: Quote | null) => void;
  setCurrentDraftQuote: (quote: Quote | null) => void;
  updateCurrentDraftQuote: (updates: Partial<Quote>) => void;
  clearCurrentDraftQuote: () => void;
  
  // Utility actions
  generateQuotesFromRates: () => void;
  updateQuotesFromRates: () => void;
}

// Create the store
export const useQuoteRateStore = create<QuoteRateStore>()((set, get) => ({
  rates: [],
  quotes: [],
  selectedRate: null,
  selectedQuote: null,
  currentDraftQuote: null,
  
  // Rate actions with API integration
  setRates: (rates: Rate[]) => set({ rates }),
  
  addRate: async (rate: Rate) => {
    try {
      const result = await ratesApi.createRate(rate);
      if (result.success && result.id) {
        const newRate = { ...rate, id: result.id };
        set((state) => ({ rates: [...state.rates, newRate] }));
      }
    } catch (error) {
      console.error('Error adding rate:', error);
      throw error;
    }
  },

  // Bulk add rates for import functionality
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
  
  // Load rates from API
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
  
  // Quote actions (keeping existing functionality)
  setQuotes: (quotes: Quote[]) => set({ quotes }),
  addQuote: (quote: Quote) => set((state) => {
    const existingIndex = state.quotes.findIndex(q => q.id === quote.id);
    let updatedQuotes;
    if (existingIndex !== -1) {
      // Update existing quote
      updatedQuotes = [...state.quotes];
      updatedQuotes[existingIndex] = quote;
    } else {
      // Add new quote
      updatedQuotes = [...state.quotes, quote];
    }
    return { quotes: updatedQuotes };
  }),
  updateQuote: (updatedQuote: Quote) => set((state) => ({
    quotes: state.quotes.map(quote => quote.id === updatedQuote.id ? updatedQuote : quote)
  })),
  deleteQuote: (id: string) => set((state) => ({
    quotes: state.quotes.filter(quote => quote.id !== id)
  })),
  setSelectedQuote: (quote: Quote | null) => set({ selectedQuote: quote }),
  setCurrentDraftQuote: (quote: Quote | null) => set({ currentDraftQuote: quote }),
  updateCurrentDraftQuote: (updates: Partial<Quote>) => set(state => ({ currentDraftQuote: { ...state.currentDraftQuote, ...updates } as Quote }) as Partial<QuoteRateStore>),
  clearCurrentDraftQuote: () => set({ currentDraftQuote: null }),
  generateQuotesFromRates: () => set({ quotes: [] }),
  updateQuotesFromRates: () => set({ quotes: [] }),
}));
