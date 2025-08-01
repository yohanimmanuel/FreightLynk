import { create } from 'zustand';
import { 
  fetchQuoteRequests, 
  createQuoteRequest, 
  updateQuoteRequest, 
  deleteQuoteRequest,
  formatBookingToQuoteRequest,
  formatQuoteRequestForDisplay,
  type QuoteRequest,
  type QuoteRequestFilters
} from '@/utils/quoteRequestApi';

export interface QuoteRequestStore {
  // State
  quoteRequests: QuoteRequest[];
  isLoading: boolean;
  error: string | null;
  selectedQuoteRequest: QuoteRequest | null;
  
  // Actions
  loadQuoteRequests: (filters?: QuoteRequestFilters) => Promise<void>;
  createNewQuoteRequest: (quoteRequest: Partial<QuoteRequest>) => Promise<{ success: boolean; id: string; message: string }>;
  updateExistingQuoteRequest: (id: string, updates: Partial<QuoteRequest>) => Promise<void>;
  deleteExistingQuoteRequest: (id: string) => Promise<void>;
  setSelectedQuoteRequest: (quoteRequest: QuoteRequest | null) => void;
  clearError: () => void;
  refreshQuoteRequests: (filters?: QuoteRequestFilters) => Promise<void>;
}

export const useQuoteRequestStore = create<QuoteRequestStore>((set, get) => ({
  // State
  quoteRequests: [],
  isLoading: false,
  error: null,
  selectedQuoteRequest: null,
  
  // Actions
  loadQuoteRequests: async (filters: QuoteRequestFilters = {}) => {
    console.log('loadQuoteRequests called with filters:', filters);
    set({ isLoading: true, error: null });
    try {
      const quoteRequests = await fetchQuoteRequests(filters);
      console.log('Raw quote requests from API:', quoteRequests);
      set({ quoteRequests, isLoading: false });
    } catch (error: any) {
      console.error('Failed to load quote requests:', error);
      set({ error: error.message || 'Failed to load quote requests', isLoading: false });
    }
  },
  
  createNewQuoteRequest: async (quoteRequest: Partial<QuoteRequest>) => {
    console.log('createNewQuoteRequest called with:', quoteRequest);
    set({ isLoading: true, error: null });
    try {
      const result = await createQuoteRequest(quoteRequest);
      console.log('Quote request created successfully:', result);
      
      // Refresh quote requests after creation
      await get().loadQuoteRequests();
      console.log('Quote requests refreshed after creation');
      
      set({ isLoading: false });
      return result;
    } catch (error: any) {
      console.error('Failed to create quote request:', error);
      set({ error: error.message || 'Failed to create quote request', isLoading: false });
      throw error;
    }
  },
  
  updateExistingQuoteRequest: async (id: string, updates: Partial<QuoteRequest>) => {
    set({ isLoading: true, error: null });
    try {
      await updateQuoteRequest(id, updates);
      await get().loadQuoteRequests();
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Failed to update quote request:', error);
      set({ error: error.message || 'Failed to update quote request', isLoading: false });
      throw error;
    }
  },
  
  deleteExistingQuoteRequest: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteQuoteRequest(id);
      await get().loadQuoteRequests();
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Failed to delete quote request:', error);
      set({ error: error.message || 'Failed to delete quote request', isLoading: false });
      throw error;
    }
  },
  
  setSelectedQuoteRequest: (quoteRequest: QuoteRequest | null) => set({ selectedQuoteRequest: quoteRequest }),
  
  clearError: () => set({ error: null }),
  
  refreshQuoteRequests: async (filters: QuoteRequestFilters = {}) => {
    await get().loadQuoteRequests(filters);
  },
})); 