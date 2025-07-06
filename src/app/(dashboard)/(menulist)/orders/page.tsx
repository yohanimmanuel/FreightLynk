'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import POManagementTable from "@/app/components/clients/purchasesorders/POManagementTable";
import { Download, Plus, Upload } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { usePOStore } from '@/store/poStore';

const ClientUI = () => {
  const router = useRouter();
  const purchaseOrders = usePOStore(state => state.purchaseOrders);
  const poDetails = usePOStore(state => state.poDetails);

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
    const po = purchaseOrders.find(o => o.id === poId);
    if (!po) {
      console.error('PO not found:', poId);
      return;
    }

    const poNumber = parseInt(poId.replace('PO', ''));
    const poItems = poDetails.filter(item => item.poOrderNumber === poNumber);

    const poWithFormattedDates = {
      ...po,
      cargoReadyBy: formatDateForInput(po.cargoReadyBy),
      mustArriveBy: formatDateForInput(po.mustArriveBy),
      items: poItems
    };

    sessionStorage.setItem('currentPO', JSON.stringify(poWithFormattedDates));
    router.push('/orders/details');
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
           <Upload className="w-4 h-4" />
           Import CSV
          </button>
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
    </div>
  );
};

const LogisticsProviderUI = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Logistics Provider Invoice Interface</h2>
      <p className="text-gray-600">Coming Soon...</p>
    </div>
  );
};

const AdminUI = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Invoice Interface</h2>
      <p className="text-gray-600">Coming Soon...</p>
    </div>
  );
};

const OrdersPage = () => {
  const userType: string = 'client'; // Change to: 'client', 'forwarder', 'logistics', 'admin'
  
  if (userType === 'client') return <ClientUI />;
  if (userType === 'forwarder') return <ForwarderUI />;
  if (userType === 'logistics') return <LogisticsProviderUI />;
  if (userType === 'admin') return <AdminUI />;
  
  return <div className="p-4">Access denied</div>;
};

export default OrdersPage;