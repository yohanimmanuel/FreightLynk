import axios from 'axios';

const API_BASE = '/api/bookings';

// Booking interfaces
export interface Booking {
  id: string;
  user_id: string;
  fl_number: string;
  shipment_name?: string;
  origin_location?: string;
  origin_port?: string;
  cargo_ready_date?: string;
  destination_location?: string;
  destination_port?: string;
  target_delivery_date?: string;
  weight?: string;
  volume?: string;
  additional_notes?: string;
  product_name?: string;
  hs_code?: string;
  goods_description?: string;
  sku_number?: string;
  special_instructions?: string;
  origin_customs?: boolean;
  origin_trucking?: boolean;
  destination_customs?: boolean;
  destination_trucking?: boolean;
  dangerous_goods?: boolean;
  require_shipment_tags?: boolean;
  shipper_value?: string;
  consignee_value?: string;
  transport_mode_value?: string;
  shipment_type_value?: string;
  container_type_value?: string;
  incoterms_value?: string;
  package_type_value?: string;
  package_count?: string;
  container_quantity?: string;
  truck_type?: string;
  truck_quantity?: string;
  truck_types?: any[];
  container_types?: any[];
  trade_role?: 'shipper' | 'consignee';
  status?: string;
  progress?: number;
  eta?: string;
  created_at?: string;
  updated_at?: string;
  
  // Related data
  purchaseOrders?: BookingPurchaseOrder[];
  milestones?: BookingMilestone[];
  tracking?: ShipmentTracking;
  poNumbers?: string[];
}

export interface BookingPurchaseOrder {
  id?: number;
  booking_id: string;
  po_id: string;
  user_id: string;
  selectedItems: any[];
  bookedQuantities: { [key: string]: number };
  created_at?: string;
}

export interface BookingMilestone {
  id?: number;
  booking_id: string;
  user_id: string;
  step: string;
  description?: string;
  location?: string;
  milestone_date?: string;
  completed: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface ShipmentTracking {
  id?: number;
  booking_id: string;
  user_id: string;
  shipment_id?: string;
  status?: string;
  carrier?: string;
  courier_name?: string;
  courier_avatar?: string;
  origin_city?: string;
  origin_country?: string;
  destination_city?: string;
  destination_country?: string;
  distance?: string;
  delivery_time?: string;
  arrival_date?: string;
  arrival_time?: string;
  current_location?: string;
  progress_percentage?: number;
  created_at?: string;
  updated_at?: string;
}

// Fetch all bookings for the current user
export async function fetchBookings(): Promise<Booking[]> {
  const res = await axios.get(API_BASE);
  return res.data;
}

// Fetch a specific booking with all related data
export async function fetchBookingById(bookingId: string): Promise<Booking> {
  const res = await axios.get(`${API_BASE}?id=${bookingId}`);
  return res.data;
}

// Create a new booking
export async function createBooking(booking: Partial<Booking>): Promise<{ success: boolean; id: string; flNumber: string }> {
  const res = await axios.post(API_BASE, booking);
  return res.data;
}

// Update an existing booking
export async function updateBooking(bookingId: string, booking: Partial<Booking>): Promise<{ success: boolean }> {
  const res = await axios.put(`${API_BASE}?id=${bookingId}`, booking);
  return res.data;
}

// Delete a booking
export async function deleteBooking(bookingId: string): Promise<{ success: boolean }> {
  const res = await axios.delete(`${API_BASE}?id=${bookingId}`);
  return res.data;
}

// Update booking status and progress
export async function updateBookingStatus(
  bookingId: string, 
  status: string, 
  progress?: number
): Promise<{ success: boolean }> {
  return updateBooking(bookingId, { status, progress });
}

// Add or update milestones for a booking
export async function updateBookingMilestones(
  bookingId: string, 
  milestones: Partial<BookingMilestone>[]
): Promise<{ success: boolean }> {
  const res = await axios.put(`${API_BASE}/milestones?bookingId=${bookingId}`, { milestones });
  return res.data;
}

// Update shipment tracking information
export async function updateShipmentTracking(
  bookingId: string, 
  tracking: Partial<ShipmentTracking>
): Promise<{ success: boolean }> {
  const res = await axios.put(`${API_BASE}/tracking?bookingId=${bookingId}`, tracking);
  return res.data;
}

// Helper function to format booking data for display
export function formatBookingForDisplay(booking: Booking) {
  return {
    id: booking.id,
    bookingId: booking.id,
    flNumber: booking.fl_number,
    shipmentName: booking.shipment_name,
    origin: booking.origin_port,
    destination: booking.destination_port,
    originPort: booking.origin_port,
    destinationPort: booking.destination_port,
    productName: booking.product_name,
    goodsDescription: booking.goods_description,
    weight: booking.weight,
    volume: booking.volume,
    pieces: booking.package_count,
    status: booking.status,
    eta: booking.target_delivery_date || booking.eta,
    progress: booking.progress,
    poNumber: booking.poNumbers?.join(', '),
    poNumbers: booking.poNumbers,
    shipper: booking.shipper_value,
    consignee: booking.consignee_value,
    incoterms: booking.incoterms_value,
    transportMode: booking.transport_mode_value,
    transportModeValue: booking.transport_mode_value,
    shipmentType: booking.shipment_type_value,
    shipmentTypeValue: booking.shipment_type_value,
    containerType: booking.container_type_value,
    containerTypeValue: booking.container_type_value,
    containerQuantity: booking.container_quantity,
    truckType: booking.truck_type,
    truckQuantity: booking.truck_quantity,
    truckTypes: booking.truck_types || [],
    containerTypes: booking.container_types || [],
    cargoReadyDate: booking.cargo_ready_date,
    targetDeliveryDate: booking.target_delivery_date,
    dangerousGoods: booking.dangerous_goods,
    hsCode: booking.hs_code,
    skuNumber: booking.sku_number,
    requireShipmentTags: booking.require_shipment_tags,
    originLocation: booking.origin_location,
    destinationLocation: booking.destination_location,
    packageType: booking.package_type_value,
    packageTypeValue: booking.package_type_value,
    packageCount: booking.package_count,
    additionalNotes: booking.additional_notes,
    specialInstructions: booking.special_instructions,
    originCustoms: booking.origin_customs,
    originTrucking: booking.origin_trucking,
    destinationCustoms: booking.destination_customs,
    destinationTrucking: booking.destination_trucking,
    tradeRole: booking.trade_role,
    createdAt: booking.created_at,
    updatedAt: booking.updated_at,
    // Related data
    selectedPOs: booking.purchaseOrders?.map(po => ({
      poId: po.po_id,
      selectedItems: po.selectedItems,
      bookedQuantities: po.bookedQuantities
    })) || [],
    milestones: booking.milestones || [],
    timeline: booking.milestones || [],
    tracking: booking.tracking
  };
}

// Helper function to convert form data to booking API format
export function formatFormDataForAPI(formData: any, selectedPOs: any[] = []) {
  return {
    shipmentName: formData.shipmentName,
    originLocation: formData.originLocation,
    originPort: formData.originPort,
    cargoReadyDate: formData.cargoReadyDate,
    destinationLocation: formData.destinationLocation,
    destinationPort: formData.destinationPort,
    targetDeliveryDate: formData.targetDeliveryDate,
    weight: formData.weight,
    volume: formData.volume,
    additionalNotes: formData.additionalNotes,
    productName: formData.productName,
    hsCode: formData.hsCode,
    goodsDescription: formData.goodsDescription,
    skuNumber: formData.skuNumber,
    specialInstructions: formData.specialInstructions,
    originCustoms: formData.originCustoms,
    originTrucking: formData.originTrucking,
    destinationCustoms: formData.destinationCustoms,
    destinationTrucking: formData.destinationTrucking,
    dangerousGoods: formData.dangerousGoods,
    requireShipmentTags: formData.requireShipmentTags,
    shipperValue: formData.shipperValue,
    consigneeValue: formData.consigneeValue,
    transportModeValue: formData.transportModeValue,
    shipmentTypeValue: formData.shipmentTypeValue,
    containerTypeValue: formData.containerTypeValue,
    incotermsValue: formData.incotermsValue,
    packageTypeValue: formData.packageTypeValue,
    packageCount: formData.packageCount,
    containerQuantity: formData.containerQuantity,
    truckType: formData.truckType,
    truckQuantity: formData.truckQuantity,
    truckTypes: formData.truckTypes || [],
    containerTypes: formData.containerTypes || [],
    tradeRole: formData.tradeRole,
    status: formData.status || 'Booked',
    progress: formData.progress || 0,
    eta: formData.eta || formData.targetDeliveryDate,
    selectedPOs: selectedPOs
  };
} 