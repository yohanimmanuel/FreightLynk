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
    origin: 'SINGAPORE, SINGAPORE',
    destination: 'LOS ANGELES, US',
    departure: '2025-08-10',
    arrival: '2025-09-04',
    transitTime: '25 days',
    validity: '2025-11-01',
    rates: {
      '20DC': { price: 1200, currency: 'USD' },
      '40DC': { price: 1800, currency: 'USD' },
      '40HC': { price: 2000, currency: 'USD' },
      '45HC': { price: 2200, currency: 'USD' },
      '20RF': { price: 2500, currency: 'USD' },
      '40RF': { price: 3200, currency: 'USD' },
      '20OT': { price: 2100, currency: 'USD' },
      '40OT': { price: 2900, currency: 'USD' },
      '20FR': { price: 2300, currency: 'USD' },
      '40FR': { price: 3100, currency: 'USD' },
      '20Tank': { price: 2600, currency: 'USD' },
      '40Tank': { price: 3400, currency: 'USD' },
      'FOOCDC': { price: 2700, currency: 'USD' },
      'FOOCHC': { price: 3500, currency: 'USD' }
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
    validFrom: '2025-08-01',
    validUntil: '2025-11-01',
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
    origin: 'JAKARTA, INDONESIA',
    destination: 'KUALA LUMPUR, MALAYSIA',
    departure: '2025-08-10',
    arrival: '2025-09-04',
    transitTime: '25 days',
    validity: '2025-11-01',
    rates: {
      '20DC': { price: 1250, currency: 'USD' },
      '40DC': { price: 1850, currency: 'USD' },
      '40HC': { price: 2050, currency: 'USD' },
      '45HC': { price: 2250, currency: 'USD' },
      '20RF': { price: 2550, currency: 'USD' },
      '40RF': { price: 3250, currency: 'USD' },
      '20OT': { price: 2150, currency: 'USD' },
      '40OT': { price: 2950, currency: 'USD' },
      '20FR': { price: 2350, currency: 'USD' },
      '40FR': { price: 3150, currency: 'USD' },
      '20Tank': { price: 2650, currency: 'USD' },
      '40Tank': { price: 3450, currency: 'USD' },
      'FOOCDC': { price: 2750, currency: 'USD' },
      'FOOCHC': { price: 3550, currency: 'USD' }
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
    validFrom: '2025-08-01',
    validUntil: '2025-11-01',
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
    departure: '2025-08-10',
    arrival: '2025-09-03',
    transitTime: '24 days',
    validity: '2025-11-01',
    rates: {
      '20DC': { price: 1220, currency: 'USD' },
      '40DC': { price: 1820, currency: 'USD' },
      '40HC': { price: 2020, currency: 'USD' },
      '45HC': { price: 2220, currency: 'USD' },
      '20RF': { price: 2520, currency: 'USD' },
      '40RF': { price: 3220, currency: 'USD' },
      '20OT': { price: 2120, currency: 'USD' },
      '40OT': { price: 2920, currency: 'USD' },
      '20FR': { price: 2320, currency: 'USD' },
      '40FR': { price: 3120, currency: 'USD' },
      '20Tank': { price: 2620, currency: 'USD' },
      '40Tank': { price: 3420, currency: 'USD' },
      'FOOCDC': { price: 2720, currency: 'USD' },
      'FOOCHC': { price: 3520, currency: 'USD' }
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
    validFrom: '2025-08-01',
    validUntil: '2025-11-01',
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
  selectedQuoteId: number | null;
  setSelectedQuoteId: (id: number | null) => void;
  // New fields for unified quote flow
  searchCriteria: any;
  setSearchCriteria: (criteria: any) => void;
  additionalInfo: any;
  setAdditionalInfo: (info: any) => void;
  selectedQuoteDetails: any;
  setSelectedQuoteDetails: (details: any) => void;
  // Shipment type selection for Export/Import/Domestic/Other
  shipmentType: string;
  setShipmentType: (type: string) => void;
  shipmentTypeDescription: string;
  setShipmentTypeDescription: (desc: string) => void;
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
      },
      selectedQuoteId: null,
      setSelectedQuoteId: (id: number | null) => set({ selectedQuoteId: id }),
      // New state and actions
      searchCriteria: {},
      setSearchCriteria: (criteria: any) => set({ searchCriteria: criteria }),
      additionalInfo: {},
      setAdditionalInfo: (info: any) => set({ additionalInfo: info }),
      selectedQuoteDetails: {},
      setSelectedQuoteDetails: (details: any) => set({ selectedQuoteDetails: details }),
      // Shipment type state and actions
      shipmentType: 'Export',
      setShipmentType: (type: string) => set({ shipmentType: type }),
      shipmentTypeDescription: '',
      setShipmentTypeDescription: (desc: string) => set({ shipmentTypeDescription: desc }),
    }),
    {
      name: 'quote-search-storage'
    }
  )
);
