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

export const purchaseOrdersData: PurchaseOrder[] = [
  {
    id: 'PO3400',
    exceptions: 'Missed cargo ready date',
    cargoReadyBy: 'Aug 30, 2019',
    mustArriveBy: 'Oct 1, 2019',
    buyer: 'Studio Apparel',
    seller: 'Forward Supply Co',
    subjectedCarrier: 'Maersk Line',
    progress: '1/2 lines booked',
    status: 'Open'
  },
  {
    id: 'PO1000',
    exceptions: 'Missed cargo ready date',
    cargoReadyBy: 'Jan 28, 2021',
    mustArriveBy: 'Feb 12, 2021',
    buyer: 'Studio Apparel',
    seller: 'Forward Supply Co',
    subjectedCarrier: 'DHL Express',
    progress: '0/7 lines booked',
    status: 'Open'
  },
  {
    id: 'PO1057',
    exceptions: 'Missed cargo ready date',
    cargoReadyBy: 'Feb 21, 2021',
    mustArriveBy: 'Apr 15, 2021',
    buyer: 'Studio Apparel',
    seller: 'Forward Supply Co',
    subjectedCarrier: 'COSCO Shipping',
    progress: '0/7 lines booked',
    status: 'Open'
  },
  {
    id: 'PO1055',
    exceptions: '--',
    cargoReadyBy: 'Mar 12, 2021',
    mustArriveBy: 'Apr 15, 2021',
    buyer: 'Studio Apparel',
    seller: 'Forward Supply Co',
    subjectedCarrier: 'FedEx',
    progress: '1/7 lines booked',
    status: 'Open'
  },
  {
    id: 'PO1003',
    exceptions: 'Booking approval required',
    cargoReadyBy: 'Mar 12, 2021',
    mustArriveBy: 'Apr 15, 2021',
    buyer: 'Studio Apparel',
    seller: 'Forward Supply Co',
    subjectedCarrier: 'DB Schenker',
    progress: '1/7 lines booked',
    status: 'Open'
  },
  {
    id: 'PO2883',
    exceptions: 'Booking approval required',
    cargoReadyBy: 'Mar 12, 2021',
    mustArriveBy: 'Apr 15, 2021',
    buyer: 'Studio Apparel',
    seller: 'Forward Supply Co',
    subjectedCarrier: 'DB Schenker',
    progress: '1/7 lines booked',
    status: 'Open'
  }
];

export const poDetailsData: PODetail[] = [
  {
    id: 1,
    poOrderNumber: 3400,
    productCode: 'F-ACS-LTH-BELT-BLCK',
    productName: "Women's Leather Belt",
    cargoReadyDate: 'Aug 30, 2019',
    mustArriveDate: 'Oct 1, 2019',
    transportMode: 'Sea',
    destination: 'Los Angeles Warehouse',
    currency: 'USD',
    unitCost: '$15.00',
    uom: 'PC',
    requested: 200
  },
  {
    id: 2,
    poOrderNumber: 1000,
    productCode: 'F-BTDN-TOP-SILK',
    productName: "Women's Silk Shirt",
    cargoReadyDate: 'Jan 28, 2021',
    mustArriveDate: 'Feb 12, 2021',
    transportMode: 'Sea',
    destination: 'Los Angeles Warehouse',
    currency: 'USD',
    unitCost: '$20.00',
    uom: 'PC',
    requested: 300
  },
  {
    id: 3,
    poOrderNumber: 1057,
    productCode: 'F-BTM-DNM-BOYF-LTBLUE',
    productName: "Women's Boyfriend Jean - Lt Blue",
    cargoReadyDate: 'Feb 21, 2021',
    mustArriveDate: 'Apr 15, 2021',
    transportMode: 'Sea',
    destination: 'Los Angeles Warehouse',
    currency: 'AUD',
    unitCost: '$16.00',
    uom: 'PC',
    requested: 250
  },
  {
    id: 4,
    poOrderNumber: 1055,
    productCode: 'F-DRS-CTTN-MUSC-BLK',
    productName: "Women's Muscle Tank Dress",
    cargoReadyDate: 'Mar 12, 2021',
    mustArriveDate: 'Apr 15, 2021',
    transportMode: 'Sea',
    destination: 'Los Angeles Warehouse',
    currency: 'SGD',
    unitCost: '$12.00',
    uom: 'PC',
    requested: 400
  }
]; 