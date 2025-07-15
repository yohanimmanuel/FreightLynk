import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Quote, useQuoteRateStore } from './forwarderquote';

// Define the search result interface
export interface QuoteSearchResult {
  id: number;
  carrier: string;
  logo: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  transitTime: string;
  validity: string;
  rates: {
    [containerType: string]: {
      price: number;
      currency: string;
    }
  };
  remark: string;
  validFrom: string;
  validUntil: string;
  price: number;
  currency: string;
  detailCost: Array<{
    type: string;
    item: string;
    description: string;
    calculation: string;
    quantity: number;
    currency: string;
    price: number;
    amount: number;
  }>;
}

interface PriceRange {
  min: string;
  max: string;
}

// Function to convert search result to quote format
export const convertToQuote = (
  searchResult: QuoteSearchResult, 
  containerType: string, 
  priceRange?: PriceRange
): Quote => {
  const currentYear = new Date().getFullYear();
  const rateInfo = searchResult.rates[containerType];
  
  if (!rateInfo) {
    throw new Error(`Container type ${containerType} not found in search result`);
  }
  
  // Use custom price range if provided, otherwise use the base price
  let priceDisplay: string;
  
  if (priceRange && priceRange.min && priceRange.max) {
    priceDisplay = `${parseFloat(priceRange.min).toFixed(2)} - ${parseFloat(priceRange.max).toFixed(2)}`;
  } else {
    // Calculate price range from all container types
    const prices = Object.values(searchResult.rates).map(rate => rate.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    priceDisplay = minPrice === maxPrice 
      ? `${minPrice.toFixed(2)}` 
      : `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`;
  }

  return {
    id: `QT-${currentYear}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    lane: `${searchResult.origin.toUpperCase()} → ${searchResult.destination.toUpperCase()}`,
    mode: 'ocean', // Default to ocean, can be updated based on actual data
    containertype: containerType,
    currency: rateInfo.currency,
    baseRate: rateInfo.price,
    price: priceDisplay,
    transitTime: searchResult.transitTime,
    carrier: searchResult.carrier.toUpperCase(),
    validity: `Valid until ${searchResult.validity}`,
    status: 'draft'
  };
};

// Mock search results data
const mockSearchResults: QuoteSearchResult[] = [
  {
    id: 1,
    carrier: 'MAERSK',
    logo: '/maersk.png',
    origin: 'KEELUNG, TAIPEI',
    destination: 'LOS ANGELES, US',
    departure: '10-10-2023',
    arrival: '10-30-2023',
    transitTime: '25 days',
    validity: '12-05-2023',
    rates: {
      '20GP': { price: 1635.32, currency: 'USD' },
      '40GP': { price: 1840.00, currency: 'USD' },
      '40HC': { price: 2062.25, currency: 'USD' }
    },
    remark: '14DEM+14DET',
    validFrom: '2023-10-01',
    validUntil: '2023-12-05',
    price: 1635.32,
    currency: 'USD',
    detailCost: [
      { type: 'Ocean Freight', item: 'Ocean Freight (20\'DC)', description: 'Container Cost', calculation: 'By Container type (20\'DC)', quantity: 1, currency: 'USD', price: 1320, amount: 1320 },
      { type: 'Origin Charge', item: 'THC (20\'DC)', description: 'Terminal Handling Charge', calculation: 'By Container type (20\'DC)', quantity: 1, currency: 'USD', price: 600, amount: 600 },
      { type: 'Origin Charge', item: 'SEAL', description: 'Seal Fee Surcharge', calculation: 'By Containers count', quantity: 1, currency: 'USD', price: 12, amount: 12 }
    ]
  },
  {
    id: 2,
    carrier: 'EVERGREEN',
    logo: '/evergreen.svg',
    origin: 'KEELUNG, TAIPEI',
    destination: 'LOS ANGELES, US',
    departure: '10-10-2023',
    arrival: '10-30-2023',
    transitTime: '25 days',
    validity: '12-05-2023',
    rates: {
      '20GP': { price: 1781.53, currency: 'USD' },
      '40GP': { price: 1985.00, currency: 'USD' },
      '40HC': { price: 2108.25, currency: 'USD' }
    },
    remark: '14DEM+30DET',
    validFrom: '2023-10-01',
    validUntil: '2023-12-05',
    price: 1781.53,
    currency: 'USD',
    detailCost: [
      { type: 'Ocean Freight', item: 'Ocean Freight (20\'DC)', description: '', calculation: 'By Container type (20\'DC)', quantity: 1, currency: 'USD', price: 1400, amount: 1400 },
      { type: 'Origin Charge', item: 'THC (20\'DC)', description: 'Terminal Handling Charge', calculation: 'By Container type (20\'DC)', quantity: 1, currency: 'USD', price: 650, amount: 650 },
      { type: 'Origin Charge', item: 'SEAL', description: 'Seal Fee Surcharge', calculation: 'By Containers count', quantity: 1, currency: 'USD', price: 15, amount: 15 }
    ]
  },
  {
    id: 3,
    carrier: 'HAPAG-LLOYD',
    logo: '/hapaglloyd.svg',
    origin: 'KEELUNG, TAIPEI',
    destination: 'LOS ANGELES, US',
    departure: '10-10-2023',
    arrival: '10-30-2023',
    transitTime: '24 days',
    validity: '12-05-2023',
    rates: {
      '20GP': { price: 1701.53, currency: 'USD' },
      '40GP': { price: 2005.00, currency: 'USD' },
      '40HC': { price: 2108.25, currency: 'USD' }
    },
    remark: '12DEM+10DET',
    validFrom: '2023-10-01',
    validUntil: '2023-12-05',
    price: 1701.53,
    currency: 'USD',
    detailCost: [
      { type: 'Ocean Freight', item: 'Ocean Freight (20\'DC)', description: '', calculation: 'By Container type (20\'DC)', quantity: 1, currency: 'USD', price: 1350, amount: 1350 },
      { type: 'Origin Charge', item: 'THC (20\'DC)', description: 'Terminal Handling Charge', calculation: 'By Container type (20\'DC)', quantity: 1, currency: 'USD', price: 620, amount: 620 },
      { type: 'Origin Charge', item: 'SEAL', description: 'Seal Fee Surcharge', calculation: 'By Containers count', quantity: 1, currency: 'USD', price: 10, amount: 10 }
    ]
  }
];

// Store interface
interface QuoteSearchStore {
  searchResults: QuoteSearchResult[];
  setSearchResults: (results: QuoteSearchResult[]) => void;
  addToQuoteTable: (searchResultId: number, containerType: string, priceRange?: PriceRange) => string | null;
  createQuotesFromSelection: (selections: {id: number, containerType: string, priceRange?: PriceRange}[]) => string[];
}

// Create the store
export const useQuoteSearchStore = create<QuoteSearchStore>()(
  persist(
    (set, get) => ({
      searchResults: mockSearchResults,
      setSearchResults: (results: QuoteSearchResult[]) => set({ searchResults: results }),
      
      // Add a single search result as a quote to the quote table
      addToQuoteTable: (searchResultId: number, containerType: string, priceRange?: PriceRange) => {
        const { searchResults } = get();
        const searchResult = searchResults.find(result => result.id === searchResultId);
        
        if (searchResult) {
          try {
            const newQuote = convertToQuote(searchResult, containerType, priceRange);
            const quoteStore = useQuoteRateStore.getState();
            quoteStore.addQuote(newQuote);
            return newQuote.id;
          } catch (error) {
            console.error('Error adding quote:', error);
          }
        }
        return null;
      },
      
      // Create multiple quotes from selections
      createQuotesFromSelection: (selections: {id: number, containerType: string, priceRange?: PriceRange}[]) => {
        const createdQuoteIds = selections
          .map(selection => get().addToQuoteTable(selection.id, selection.containerType, selection.priceRange))
          .filter((id): id is string => id !== null);
        
        return createdQuoteIds;
      }
    }),
    {
      name: 'quote-search-storage'
    }
  )
);
