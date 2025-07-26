import { create } from 'zustand';
import { fetchBookings, createBooking, updateBooking, deleteBooking, formatFormDataForAPI, formatBookingForDisplay, type Booking } from '@/utils/bookingApi';

export type BookingStore = {
  // Form data and state
  formData: any;
  selectedPOs: any[];
  tradeRole: 'shipper' | 'consignee';
  flNumber: string;
  bookingSubmitted: boolean;
  
  // Backend data
  bookings: Booking[];
  confirmedBookings: any[]; // Keep for backward compatibility with existing components
  isLoading: boolean;
  error: string | null;
  
  // Form actions
  setFormData: (data: any) => void;
  setSelectedPOs: (data: any[]) => void;
  setTradeRole: (role: 'shipper' | 'consignee') => void;
  setFlNumber: (fl: string) => void;
  setBookingSubmitted: (submitted: boolean) => void;
  clearBooking: () => void;
  
  // Backend actions
  loadBookings: () => Promise<void>;
  createNewBooking: (formData: any, selectedPOs: any[]) => Promise<{ success: boolean; id: string; flNumber: string }>;
  updateExistingBooking: (bookingId: string, data: any) => Promise<void>;
  deleteExistingBooking: (bookingId: string) => Promise<void>;
  setConfirmedBookings: (bookings: any[]) => void;
  refreshBookings: () => Promise<void>;
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
  truckType: '',
  truckQuantity: '',
  truckTypes: [],
  containerTypes: [],
};

export const useBookingStore = create<BookingStore>((set, get) => ({
  // Form data and state
  formData: { ...initialFormData },
  selectedPOs: [],
  tradeRole: 'shipper',
  flNumber: '',
  bookingSubmitted: false,
  
  // Backend data
  bookings: [],
  confirmedBookings: [],
  isLoading: false,
  error: null,
  
  // Form actions
  setFormData: (data: any) => set((state) => ({ formData: { ...state.formData, ...data } })),
  setSelectedPOs: (data: any[]) => set({ selectedPOs: data }),
  setTradeRole: (role: 'shipper' | 'consignee') => set({ tradeRole: role }),
  setFlNumber: (fl: string) => set({ flNumber: fl }),
  setBookingSubmitted: (submitted: boolean) => set({ bookingSubmitted: submitted }),
  clearBooking: () => set({ 
    formData: { ...initialFormData }, 
    selectedPOs: [], 
    tradeRole: 'shipper', 
    flNumber: '', 
    bookingSubmitted: false,
    error: null
  }),
  
  // Backend actions
  loadBookings: async () => {
    console.log('loadBookings called');
    set({ isLoading: true, error: null });
    try {
      const bookings = await fetchBookings();
      console.log('Raw bookings from API:', bookings);
      const confirmedBookings = bookings.map(formatBookingForDisplay);
      console.log('Formatted confirmedBookings:', confirmedBookings);
      set({ bookings, confirmedBookings, isLoading: false });
    } catch (error: any) {
      console.error('Failed to load bookings:', error);
      set({ error: error.message || 'Failed to load bookings', isLoading: false });
    }
  },
  
  createNewBooking: async (formData: any, selectedPOs: any[]) => {
    console.log('createNewBooking called with:', { formData, selectedPOs });
    set({ isLoading: true, error: null });
    try {
      const bookingData = formatFormDataForAPI(formData, selectedPOs);
      console.log('Formatted booking data:', bookingData);
      const result = await createBooking(bookingData);
      console.log('Booking created successfully:', result);
      
      // Refresh bookings after creation
      await get().loadBookings();
      console.log('Bookings refreshed after creation');
      
      set({ isLoading: false });
      return result;
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      set({ error: error.message || 'Failed to create booking', isLoading: false });
      throw error;
    }
  },
  
  updateExistingBooking: async (bookingId: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      await updateBooking(bookingId, data);
      await get().loadBookings();
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Failed to update booking:', error);
      set({ error: error.message || 'Failed to update booking', isLoading: false });
      throw error;
    }
  },
  
  deleteExistingBooking: async (bookingId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteBooking(bookingId);
      await get().loadBookings();
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Failed to delete booking:', error);
      set({ error: error.message || 'Failed to delete booking', isLoading: false });
      throw error;
    }
  },
  
  refreshBookings: async () => {
    await get().loadBookings();
  },
  
  // Keep for backward compatibility
  setConfirmedBookings: (bookings) => set({ confirmedBookings: bookings }),
}));
