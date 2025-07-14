import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Quote interface (simplified for client usage)
export interface ClientQuote {
  id: string;
  lane: string;
  mode: 'ocean' | 'air' | 'road';
  containertype: string;
  currency: string;
  baseRate: number;
  price: string;
  transitTime: string;
  carrier: string;
  validity: string;
  status: 'sent' | 'draft' | 'requested' | 'expired' | 'accepted' | 'rejected';
}

// Zustand store interface for client quotes
export interface ClientQuoteStore {
  quotes: ClientQuote[];
  selectedQuote: ClientQuote | null;

  setQuotes: (quotes: ClientQuote[]) => void;
  setSelectedQuote: (quote: ClientQuote | null) => void;
  updateQuoteStatus: (id: string, status: 'accepted' | 'rejected') => void;
}

export const useClientQuoteStore = create<ClientQuoteStore>()(
  persist(
    (set, get) => ({
      quotes: [],
      selectedQuote: null,
      setQuotes: (quotes: ClientQuote[]) => set({ quotes }),
      setSelectedQuote: (quote: ClientQuote | null) => set({ selectedQuote: quote }),
      updateQuoteStatus: (id: string, status: 'accepted' | 'rejected') =>
        set((state) => ({
          quotes: state.quotes.map(quote =>
            quote.id === id ? { ...quote, status } : quote
          )
        })),
    }),
    {
      name: 'client-quote-storage'
    }
  )
);
