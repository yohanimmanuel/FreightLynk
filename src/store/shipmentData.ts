export interface ShipmentData {
  id: string;
  goods: string;
  carrier?: string;
  origin: string;
  destination: string;
  bookingDate?: string;
  estimatedDeparture?: string;
  estimatedArrival: string;
  status: 'In Transit' | 'Delayed' | 'Delivered' | 'Pending' | 'Cancelled';
  trackingId?: string;
  transportMode: 'Air' | 'Sea' | 'Road' | 'Rail';
  incoterms?: string;
  serviceType?: string;
  containerType?: string;
  lastUpdate?: string;
}

export const mockData: ShipmentData[] = [
  {
    id: 'FL-001',
    goods: 'Electronics Components',
    carrier: 'Maersk Line',
    origin: 'Shanghai, China',
    destination: 'Los Angeles, USA',
    bookingDate: '2025-06-10',
    estimatedDeparture: '2025-06-15',
    estimatedArrival: '2025-06-28',
    status: 'In Transit',
    trackingId: 'MAEU123456789',
    transportMode: 'Sea',
    incoterms: 'FOB',
    serviceType: 'FCL',
    containerType: '40ft HC',
    lastUpdate: '2025-06-18 10:30'
  },
  {
    id: 'FL-002',
    goods: 'Automotive Parts',
    carrier: 'DHL Express',
    origin: 'Frankfurt, Germany',
    destination: 'Detroit, USA',
    bookingDate: '2025-06-12',
    estimatedDeparture: '2025-06-13',
    estimatedArrival: '2025-06-19',
    status: 'Delayed',
    trackingId: 'DHL987654321',
    transportMode: 'Air',
    incoterms: 'CIF',
    serviceType: 'Express',
    containerType: 'N/A',
    lastUpdate: '2025-06-18 14:15'
  },
  {
    id: 'FL-003',
    goods: 'Textile Materials',
    carrier: 'COSCO Shipping',
    origin: 'Mumbai, India',
    destination: 'Hamburg, Germany',
    bookingDate: '2025-06-05',
    estimatedDeparture: '2025-06-08',
    estimatedArrival: '2025-06-25',
    status: 'In Transit',
    trackingId: 'COSU456789123',
    transportMode: 'Sea',
    incoterms: 'EXW',
    serviceType: 'LCL',
    containerType: '20ft',
    lastUpdate: '2025-06-18 08:45'
  },
  {
    id: 'FL-004',
    goods: 'Medical Equipment',
    carrier: 'FedEx',
    origin: 'Tokyo, Japan',
    destination: 'Sydney, Australia',
    bookingDate: '2025-06-14',
    estimatedDeparture: '2025-06-15',
    estimatedArrival: '2025-06-17',
    status: 'Delivered',
    trackingId: 'FDX789123456',
    transportMode: 'Air',
    incoterms: 'DDP',
    serviceType: 'Priority',
    containerType: 'N/A',
    lastUpdate: '2025-06-17 16:20'
  },
  {
    id: 'FL-005',
    goods: 'Construction Materials',
    carrier: 'DB Schenker',
    origin: 'Rotterdam, Netherlands',
    destination: 'Warsaw, Poland',
    bookingDate: '2025-06-11',
    estimatedDeparture: '2025-06-16',
    estimatedArrival: '2025-06-20',
    status: 'Pending',
    trackingId: 'DBS321654987',
    transportMode: 'Road',
    incoterms: 'DAP',
    serviceType: 'Standard',
    containerType: 'Trailer',
    lastUpdate: '2025-06-18 12:00'
  },
  {
    id: 'FL-006',
    goods: 'Food Products',
    carrier: 'Hapag-Lloyd',
    origin: 'Buenos Aires, Argentina',
    destination: 'Barcelona, Spain',
    bookingDate: '2025-06-08',
    estimatedDeparture: '2025-06-12',
    estimatedArrival: '2025-06-30',
    status: 'In Transit',
    trackingId: 'HLCU987654321',
    transportMode: 'Sea',
    incoterms: 'CFR',
    serviceType: 'FCL',
    containerType: '20ft Reefer',
    lastUpdate: '2025-06-18 16:45'
  },
  {
    id: 'FL-007',
    goods: 'Machinery Parts',
    carrier: 'UPS',
    origin: 'Chicago, USA',
    destination: 'Toronto, Canada',
    bookingDate: '2025-06-16',
    estimatedDeparture: '2025-06-17',
    estimatedArrival: '2025-06-18',
    status: 'In Transit',
    trackingId: 'UPS123789456',
    transportMode: 'Road',
    incoterms: 'DAP',
    serviceType: 'Ground',
    containerType: 'Truck',
    lastUpdate: '2025-06-18 09:30'
  },
  {
    id: 'FL-008',
    goods: 'Raw Materials',
    carrier: 'Canadian National Railway',
    origin: 'Vancouver, Canada',
    destination: 'Calgary, Canada',
    bookingDate: '2025-06-13',
    estimatedDeparture: '2025-06-15',
    estimatedArrival: '2025-06-19',
    status: 'Delayed',
    trackingId: 'CNR456123789',
    transportMode: 'Rail',
    incoterms: 'EXW',
    serviceType: 'Standard',
    containerType: 'Rail Car',
    lastUpdate: '2025-06-18 11:20'
  }
];
