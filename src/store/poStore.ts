import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Type Definitions ---
export interface POItem {
  id: number;
  lineNumber: number;
  productSKU: string;
  productName: string;
  crd: string;
  mabd: string;
  mode: 'Sea' | 'Air' | 'Road' | 'Rail' | '';
  destination: string;
  currency: 'USD' | 'CNY' | 'EUR' | 'IDR' | 'JPY' | 'GBP' | 'AUD' | '';
  unitCost: number | '';
  uom: 'PC' | 'KG' | 'CBM' | 'LBS' | 'TON' | '';
  requestedQty: number | '';
  bookedQty: number;
  bookingProgress: number;
}

export interface POData {
  poNumber: string;
  cargoReadyBy: string;
  mustArriveBy: string;
  buyer: string;
  seller: string;
  subjectedCarrier: string;
  status: 'Open' | 'Closed' | 'Pending';
  progress: string;
  exceptions: string[];
  items: POItem[];
}

export interface PurchaseOrder {
  id: string;
  buyer: string;
  seller: string;
  status: 'Open' | 'Closed' | 'Pending';
  cargoReadyBy: string;
  mustArriveBy: string;
  subjectedCarrier: string;
  progress: string;
  exceptions: string[];
}

export interface PODetail {
  id: number;
  poOrderNumber: number;
  productCode: string;
  productName: string;
  cargoReadyDate: string;
  mustArriveDate: string;
  transportMode: string;
  destination: string;
  requested: number;
  booked: number;
  currency: string;
  unitCost: number;
  uom: string;
}

// --- Mock Data ---
export const purchaseOrdersData: PurchaseOrder[] = [
  {
    id: 'PO1001',
    buyer: 'Acme Corp',
    seller: 'Global Supplies',
    status: 'Open',
    cargoReadyBy: '2024-07-01',
    mustArriveBy: '2024-07-15',
    subjectedCarrier: 'Maersk',
    progress: '2/3 lines booked',
    exceptions: [],
  },
  {
    id: 'PO1002',
    buyer: 'Beta Inc',
    seller: 'Asia Exporters',
    status: 'Pending',
    cargoReadyBy: '2024-07-10',
    mustArriveBy: '2024-07-25',
    subjectedCarrier: 'CMA CGM',
    progress: '0/2 lines booked',
    exceptions: ['Delayed documentation'],
  },
];

export const poDetailsData: PODetail[] = [
  {
    id: 1,
    poOrderNumber: 1001,
    productCode: 'ELEC-001',
    productName: 'Electronic Widget',
    cargoReadyDate: '2024-07-01',
    mustArriveDate: '2024-07-15',
    transportMode: 'Sea',
    destination: 'Los Angeles',
    requested: 100,
    booked: 80,
    currency: 'USD',
    unitCost: 10,
    uom: 'PC',
  },
  {
    id: 2,
    poOrderNumber: 1001,
    productCode: 'ELEC-002',
    productName: 'Gadget Pro',
    cargoReadyDate: '2024-07-01',
    mustArriveDate: '2024-07-15',
    transportMode: 'Air',
    destination: 'San Francisco',
    requested: 50,
    booked: 50,
    currency: 'USD',
    unitCost: 20,
    uom: 'KG',
  },
  {
    id: 3,
    poOrderNumber: 1001,
    productCode: 'ELEC-003',
    productName: 'Widget Mini',
    cargoReadyDate: '2024-07-01',
    mustArriveDate: '2024-07-15',
    transportMode: 'Road',
    destination: 'San Diego',
    requested: 30,
    booked: 0,
    currency: 'USD',
    unitCost: 5,
    uom: 'CBM',
  },
  {
    id: 4,
    poOrderNumber: 1002,
    productCode: 'TEXT-001',
    productName: 'Textile Roll',
    cargoReadyDate: '2024-07-10',
    mustArriveDate: '2024-07-25',
    transportMode: 'Sea',
    destination: 'New York',
    requested: 200,
    booked: 0,
    currency: 'USD',
    unitCost: 2,
    uom: 'LBS',
  },
  {
    id: 5,
    poOrderNumber: 1002,
    productCode: 'TEXT-002',
    productName: 'Cotton Bale',
    cargoReadyDate: '2024-07-10',
    mustArriveDate: '2024-07-25',
    transportMode: 'Rail',
    destination: 'Chicago',
    requested: 100,
    booked: 0,
    currency: 'USD',
    unitCost: 3,
    uom: 'TON',
  },
];

// --- Zustand Store ---
interface POState {
  purchaseOrders: PurchaseOrder[];
  poDetails: PODetail[];
  setPurchaseOrders: (orders: PurchaseOrder[]) => void;
  setPODetails: (details: PODetail[]) => void;
}

export const usePOStore = create<POState>()(
  persist(
    (set) => ({
      purchaseOrders: purchaseOrdersData,
      poDetails: poDetailsData,
      setPurchaseOrders: (orders) => set({ purchaseOrders: orders }),
      setPODetails: (details) => set({ poDetails: details }),
    }),
    {
      name: 'po-storage',
    }
  )
); 