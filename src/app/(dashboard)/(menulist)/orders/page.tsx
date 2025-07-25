'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import POManagementTable from "@/app/components/clients/purchasesorders/POManagementTable";
import { Download, Plus, Upload } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { usePOStore } from '@/store/poStore';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const ClientUI = () => {
  const router = useRouter();
  const purchaseOrders = usePOStore(state => state.purchaseOrders);
  const poDetails = usePOStore(state => state.poDetails);
  const clearCache = usePOStore(state => state.clearCache);

  // Fetch fresh data on mount
  useEffect(() => {
    console.log('Orders page mounted - fetching fresh data');
    usePOStore.getState().fetchPurchaseOrders();
  }, []);

  const formatDateForInput = (displayDate: string): string => {
    if (!displayDate || displayDate === '--') return '';
    
    // If the date is already in YYYY-MM-DD format, return it as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(displayDate)) {
      return displayDate;
    }
    
    try {
      const date = new Date(displayDate);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', displayDate);
      return '';
    }
  };

  const handleEditOrder = (poId: string) => {
    console.log('Navigating to edit PO:', poId);
    // Navigate with URL parameter instead of sessionStorage
    router.push(`/orders/details?poId=${poId}`);
  };

  const handleCreateOrder = () => {
      router.push('/orders/create');
    };

  const handleCreateBooking = (bookingData: {
    poId: string;
    selectedItems: number[];
    bookedQuantities: Record<number, number>;
    }[]) => {
    // Clear the booking store and reset submission flag
    const bookingStore = useBookingStore.getState();
    bookingStore.clearBooking();
    bookingStore.setBookingSubmitted(false);
    // Debug log to confirm state is empty
    console.log('After clearBooking:', bookingStore.formData, bookingStore.selectedPOs, bookingStore.bookingSubmitted);
    // Pre-fill with selected POs if any
    bookingStore.setSelectedPOs(bookingData);
    // Navigate to booking creation page
    router.push('/bookings/create');
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2 md:gap-0">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
         <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
          <button className="w-full md:w-auto flex items-center text-sm text-gray-900 gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-200">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button 
            onClick={handleCreateOrder}
            className="w-full md:w-auto flex items-center px-4 py-2 text-sm font-semibold text-white bg-[#007bff] rounded-md hover:bg-blue-700 transition-colors">
            <Plus size={16} className="mr-2" />
            Create Order
          </button>
         </div>
      </div>
      <POManagementTable
        onEditOrder={handleEditOrder}
        onCreateBooking={handleCreateBooking}
      />
    </div>
  );
};

const ForwarderUI = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Forwarder Purchase Orders</h2>
      <p className="text-gray-600">Coming Soon...</p>
    </div>
  );
};

const LogisticsProviderUI = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Logistics Provider Purchase Orders</h2>
      <p className="text-gray-600">Coming Soon...</p>
    </div>
  );
};

const AdminUI = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Purchase Orders</h2>
      <p className="text-gray-600">Coming Soon...</p>
    </div>
  );
};

const OrdersPage = () => {
  const { user } = useAuthStore();
  const [roleBasedUI, setRoleBasedUI] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    if (!user) return;

    switch (user.role) {
      case UserRole.ADMIN:
        setRoleBasedUI(<AdminUI />);
        break;
      case UserRole.CLIENT:
        setRoleBasedUI(<ClientUI />);
        break;
      case UserRole.FORWARDER:
        setRoleBasedUI(<ForwarderUI />);
        break;
      case UserRole.LOGISTICS_PROVIDER:
        setRoleBasedUI(<LogisticsProviderUI />);
        break;
      default:
        setRoleBasedUI(<div className="p-4">Access denied</div>);
    }
  }, [user]);

  return (
    <ProtectedRoute 
      allowedRoles={[UserRole.ADMIN, UserRole.CLIENT, UserRole.FORWARDER, UserRole.LOGISTICS_PROVIDER]} 
    >
      {roleBasedUI}
    </ProtectedRoute>
  );
};

export default OrdersPage;