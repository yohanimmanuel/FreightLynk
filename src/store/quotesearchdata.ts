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
  lclRates: { perKg: number; perCbm: number; currency: string };
  ftlRates: {
    [truckType: string]: {
      price: number;
      currency: string;
    }
  };
  ltlRates: { perKg: number; perCbm: number; currency: string };
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
      '20GP': { price: 1200, currency: 'USD' },
      '40GP': { price: 1800, currency: 'USD' },
      '40HC': { price: 2000, currency: 'USD' }
    },
    lclRates: { perKg: 0.13, perCbm: 19.0, currency: 'USD' },
    ftlRates: {
      'Wingbox': { price: 500, currency: 'USD' },
      'Box Truck': { price: 400, currency: 'USD' },
      'Reefer': { price: 600, currency: 'USD' },
      'Flatbed': { price: 550, currency: 'USD' },
      'Lowbed': { price: 700, currency: 'USD' },
      'Container Chassis': { price: 480, currency: 'USD' }
    },
    ltlRates: { perKg: 0.18, perCbm: 22.0, currency: 'USD' },
    remark: '14DEM+14DET',
    validFrom: '2023-10-01',
    validUntil: '2023-12-05',
    price: 0, // Will be calculated dynamically
    currency: 'USD',
    detailCost: [
      { type: 'Ocean Freight', item: 'FCL', description: 'Container Cost', calculation: 'By container type', quantity: 0, currency: 'USD', price: 0, amount: 0 },
      { type: 'LCL Freight', item: 'LCL', description: 'Volumetric Pricing', calculation: 'By volume (cbm)', quantity: 0, currency: 'USD', price: 0, amount: 0 },
      { type: 'Road Freight', item: 'FTL', description: 'Truck Cost', calculation: 'By truck type', quantity: 0, currency: 'USD', price: 0, amount: 0 },
      { type: 'Road Freight', item: 'LTL', description: 'Volumetric Pricing', calculation: 'By volume (cbm)', quantity: 0, currency: 'USD', price: 0, amount: 0 },
      { type: 'Origin Charge', item: 'THC', description: 'Terminal Handling Charge', calculation: 'Per container/truck', quantity: 0, currency: 'USD', price: 0, amount: 0 },
      { type: 'Origin Charge', item: 'SEAL', description: 'Seal Fee Surcharge', calculation: 'Per container/truck', quantity: 0, currency: 'USD', price: 0, amount: 0 }
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
      '20GP': { price: 1250, currency: 'USD' },
      '40GP': { price: 1850, currency: 'USD' },
      '40HC': { price: 2050, currency: 'USD' }
    },
    lclRates: { perKg: 0.15, perCbm: 20.0, currency: 'USD' },
    ftlRates: {
      'Wingbox': { price: 520, currency: 'USD' },
      'Box Truck': { price: 410, currency: 'USD' },
      'Reefer': { price: 630, currency: 'USD' },
      'Flatbed': { price: 570, currency: 'USD' },
      'Lowbed': { price: 720, currency: 'USD' },
      'Container Chassis': { price: 495, currency: 'USD' }
    },
    ltlRates: { perKg: 0.20, perCbm: 23.0, currency: 'USD' },
    remark: '14DEM+30DET',
    validFrom: '2023-10-01',
    validUntil: '2023-12-05',
    price: 0,
    currency: 'USD',
    detailCost: [
      { type: 'Ocean Freight', item: 'FCL', description: 'Container Cost', calculation: 'By container type', quantity: 0, currency: 'USD', price: 0, amount: 0 },
      { type: 'LCL Freight', item: 'LCL', description: 'Volumetric Pricing', calculation: 'By volume (cbm)', quantity: 0, currency: 'USD', price: 0, amount: 0 },
      { type: 'Road Freight', item: 'FTL', description: 'Truck Cost', calculation: 'By truck type', quantity: 0, currency: 'USD', price: 0, amount: 0 },
      { type: 'Road Freight', item: 'LTL', description: 'Volumetric Pricing', calculation: 'By volume (cbm)', quantity: 0, currency: 'USD', price: 0, amount: 0 },
      { type: 'Origin Charge', item: 'THC', description: 'Terminal Handling Charge', calculation: 'Per container/truck', quantity: 0, currency: 'USD', price: 0, amount: 0 },
      { type: 'Origin Charge', item: 'SEAL', description: 'Seal Fee Surcharge', calculation: 'Per container/truck', quantity: 0, currency: 'USD', price: 0, amount: 0 }
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
      '20GP': { price: 1220, currency: 'USD' },
      '40GP': { price: 1820, currency: 'USD' },
      '40HC': { price: 2020, currency: 'USD' }
    },
    lclRates: { perKg: 0.14, perCbm: 18.5, currency: 'USD' },
    ftlRates: {
      'Wingbox': { price: 510, currency: 'USD' },
      'Box Truck': { price: 405, currency: 'USD' },
      'Reefer': { price: 620, currency: 'USD' },
      'Flatbed': { price: 560, currency: 'USD' },
      'Lowbed': { price: 710, currency: 'USD' },
      'Container Chassis': { price: 490, currency: 'USD' }
    },
    ltlRates: { perKg: 0.19, perCbm: 21.5, currency: 'USD' },
    remark: '12DEM+10DET',
    validFrom: '2023-10-01',
    validUntil: '2023-12-05',
    price: 0,
    currency: 'USD',
    detailCost: [
      { type: 'Ocean Freight', item: 'FCL', description: 'Container Cost', calculation: 'By container type', quantity: 0, currency: 'USD', price: 0, amount: 0 },
      { type: 'LCL Freight', item: 'LCL', description: 'Volumetric Pricing', calculation: 'By volume (cbm)', quantity: 0, currency: 'USD', price: 0, amount: 0 },
      { type: 'Road Freight', item: 'FTL', description: 'Truck Cost', calculation: 'By truck type', quantity: 0, currency: 'USD', price: 0, amount: 0 },
      { type: 'Road Freight', item: 'LTL', description: 'Volumetric Pricing', calculation: 'By volume (cbm)', quantity: 0, currency: 'USD', price: 0, amount: 0 },
      { type: 'Origin Charge', item: 'THC', description: 'Terminal Handling Charge', calculation: 'Per container/truck', quantity: 0, currency: 'USD', price: 0, amount: 0 },
      { type: 'Origin Charge', item: 'SEAL', description: 'Seal Fee Surcharge', calculation: 'Per container/truck', quantity: 0, currency: 'USD', price: 0, amount: 0 }
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
