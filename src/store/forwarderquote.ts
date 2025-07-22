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
  setCurrentDraftQuote: (quote: Quote | null) => void;
  updateCurrentDraftQuote: (updates: Partial<Quote>) => void;
  clearCurrentDraftQuote: () => void;
  
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
      currentDraftQuote: null,
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
      addQuote: (quote) => set((state) => {
        const existingIndex = state.quotes.findIndex(q => q.id === quote.id);
        if (existingIndex !== -1) {
          // Update existing quote
          const updatedQuotes = [...state.quotes];
          updatedQuotes[existingIndex] = quote;
          return { quotes: updatedQuotes };
        } else {
          // Add new quote
          return { quotes: [...state.quotes, quote] };
        }
      }),
      updateQuote: (updatedQuote) => set((state) => ({
        quotes: state.quotes.map(quote => quote.id === updatedQuote.id ? updatedQuote : quote)
        })),
      deleteQuote: (id) => set((state) => ({
          quotes: state.quotes.filter(quote => quote.id !== id)
        })),
      setSelectedQuote: (quote) => set({ selectedQuote: quote }),
      setCurrentDraftQuote: (quote) => set({ currentDraftQuote: quote }),
      updateCurrentDraftQuote: (updates) => set(state => ({ currentDraftQuote: { ...state.currentDraftQuote, ...updates } as Quote }) as Partial<QuoteRateStore>),
      clearCurrentDraftQuote: () => set({ currentDraftQuote: null }),
      generateQuotesFromRates: () => set({ quotes: [] }),
      updateQuotesFromRates: () => set({ quotes: [] }),
    }),
    {
      name: 'quote-rate-storage'
    }
  )
);
