import { create } from 'zustand';
import { getQuotes, createQuote, updateQuote as updateQuoteApi, deleteQuote } from '@/utils/quotesApi';

// Quote interface and related types
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
  status: 'sent' | 'draft' | 'accepted' | 'rejected' | 'expired' | 'requested';
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

// Quote store interface
export interface QuoteStore {
  quotes: Quote[];
  selectedQuote: Quote | null;
  currentDraftQuote: Quote | null;
  
  // Quote actions
  setQuotes: (quotes: Quote[]) => void;
  addQuote: (quote: Quote) => Promise<void>;
  updateQuote: (updatedQuote: Quote) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  loadQuotes: (mode?: string, status?: string) => Promise<void>;
  setSelectedQuote: (quote: Quote | null) => void;
  setCurrentDraftQuote: (quote: Quote | null) => void;
  updateCurrentDraftQuote: (updates: Partial<Quote>) => void;
  clearCurrentDraftQuote: () => void;
}

// Quote store implementation
export const useQuoteStore = create<QuoteStore>((set, get) => ({
  quotes: [],
  selectedQuote: null,
  currentDraftQuote: null,

  // Quote actions
  setQuotes: (quotes: Quote[]) => set({ quotes }),
  
  addQuote: async (quote: Quote) => {
    try {
      console.log('Store addQuote: Starting to add quote:', quote.id);
      const result = await createQuote(quote);
      console.log('Store addQuote: API result:', result);
      
      if (result.success && result.id) {
        const newQuote = { ...quote, id: result.id };
        console.log('Store addQuote: New quote with API ID:', newQuote.id);
        
        set((state) => {
          const existingIndex = state.quotes.findIndex(q => q.id === newQuote.id);
          console.log('Store addQuote: Existing index:', existingIndex, 'Current quotes count:', state.quotes.length);
          
          let updatedQuotes;
          if (existingIndex !== -1) {
            console.log('Store addQuote: Updating existing quote at index:', existingIndex);
            updatedQuotes = [...state.quotes];
            updatedQuotes[existingIndex] = newQuote;
          } else {
            console.log('Store addQuote: Adding new quote to store');
            updatedQuotes = [...state.quotes, newQuote];
          }
          console.log('Store addQuote: Final quotes count:', updatedQuotes.length);
          return { quotes: updatedQuotes };
        });
      }
    } catch (error) {
      console.error('Error adding quote:', error);
      throw error;
    }
  },

  updateQuote: async (updatedQuote: Quote) => {
    try {
      const result = await updateQuoteApi(updatedQuote.id, updatedQuote);
      if (result.success) {
        set((state) => ({
          quotes: state.quotes.map(quote => quote.id === updatedQuote.id ? updatedQuote : quote)
        }));
      }
    } catch (error) {
      console.error('Error updating quote:', error);
      throw error;
    }
  },

  deleteQuote: async (id: string) => {
    try {
      const result = await deleteQuote(id);
      if (result.success) {
        set((state) => ({
          quotes: state.quotes.filter(quote => quote.id !== id)
        }));
      }
    } catch (error) {
      console.error('Error deleting quote:', error);
      throw error;
    }
  },

  loadQuotes: async (mode?: string, status?: string) => {
    try {
      const quotes = await getQuotes(mode, status);
      set({ quotes });
    } catch (error) {
      console.error('Error loading quotes:', error);
      throw error;
    }
  },

  setSelectedQuote: (quote: Quote | null) => set({ selectedQuote: quote }),
  setCurrentDraftQuote: (quote: Quote | null) => set({ currentDraftQuote: quote }),
  updateCurrentDraftQuote: (updates: Partial<Quote>) => set(state => ({ currentDraftQuote: { ...state.currentDraftQuote, ...updates } as Quote }) as Partial<QuoteStore>),
  clearCurrentDraftQuote: () => set({ currentDraftQuote: null }),
}));
