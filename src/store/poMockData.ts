// poMockData.ts

export interface PurchaseOrder {
  id: string;
  exceptions: string;
  cargoReadyBy: string;
  mustArriveBy: string;
  buyer: string;
  seller: string;
  subjectedCarrier: string;
  progress: string;
  status: string;
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
  currency: string;
  unitCost: string;
  uom: string;
  requested: number;
}

export interface POSelection {
  poId: string;
  selectedItems: Set<number>; // Only explicitly checked items
  bookedQuantities: Record<number, number>; // All quantities (selected or not)
}

// Empty arrays instead of mock data
export const purchaseOrdersData: PurchaseOrder[] = [];
export const poDetailsData: PODetail[] = []; 