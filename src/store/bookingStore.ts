import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BookingStore = {
  // ...other fields
  confirmedBookings: any[];
  setConfirmedBookings: (bookings: any[]) => void;
  formData: any;
  selectedPOs: any[];
  tradeRole: 'shipper' | 'consignee';
  flNumber: string;
  bookingSubmitted: boolean;
  setFormData: (data: any) => void;
  setSelectedPOs: (data: any[]) => void;
  setTradeRole: (role: 'shipper' | 'consignee') => void;
  setFlNumber: (fl: string) => void;
  setBookingSubmitted: (submitted: boolean) => void;
  clearBooking: () => void;
};

const initialFormData = {
  shipmentName: '',
  originLocation: '',
  originPort: '',
  cargoReadyDate: '',
  destinationLocation: '',
  destinationPort: '',
  targetDeliveryDate: '',
  weight: '',
  volume: '',
  additionalNotes: '',
  productName: '',
  hsCode: '',
  goodsDescription: '',
  poNumber: '',
  skuNumber: '',
  specialInstructions: '',
  originCustoms: false,
  originTrucking: false,
  destinationCustoms: false,
  destinationTrucking: false,
  dangerousGoods: false,
  requireShipmentTags: false,
  prefillValue: '',
  shipperValue: '',
  consigneeValue: '',
  transportModeValue: '',
  shipmentTypeValue: '',
  containerTypeValue: '',
  incotermsValue: '',
  packageTypeValue: '',
  packageCount: '',
  containerQuantity: '',
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      formData: { ...initialFormData },
      selectedPOs: [],
      tradeRole: 'shipper',
      flNumber: '',
      bookingSubmitted: false,
      confirmedBookings: [],
      setConfirmedBookings: (bookings) => set({ confirmedBookings: bookings }),
      setFormData: (data: any) => set((state) => ({ formData: { ...state.formData, ...data } })),
      setSelectedPOs: (data: any[]) => set({ selectedPOs: data }),
      setTradeRole: (role: 'shipper' | 'consignee') => set({ tradeRole: role }),
      setFlNumber: (fl: string) => set({ flNumber: fl }),
      setBookingSubmitted: (submitted: boolean) => set({ bookingSubmitted: submitted }),
      clearBooking: () => set({ formData: { ...initialFormData }, selectedPOs: [], tradeRole: 'shipper', flNumber: '', bookingSubmitted: false }),
    }),
    { name: 'booking-storage' }
  )
);
