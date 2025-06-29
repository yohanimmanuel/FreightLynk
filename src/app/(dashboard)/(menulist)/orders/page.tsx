'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import POManagementTable, {
  PurchaseOrder,
  PODetail,
  purchaseOrdersData,
  poDetailsData
} from "@/app/components/purchasesorders/POManagementTable";
import { Download, Plus, Upload } from 'lucide-react';


const ClientUI = () => {
  const router = useRouter();
  const [orders] = useState<PurchaseOrder[]>(purchaseOrdersData);

  const formatDateForInput = (displayDate: string): string => {
    if (!displayDate || displayDate === '--') return '';
    
    const months: Record<string, string> = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    
    try {
      const [month, day, year] = displayDate.replace(',', '').split(' ');
      return `${year}-${months[month]}-${day.padStart(2, '0')}`;
    } catch (error) {
      console.error('Error formatting date:', displayDate);
      return '';
    }
  };

  const handleEditOrder = (poId: string) => {
    const po = purchaseOrdersData.find(o => o.id === poId);
    if (!po) {
      console.error('PO not found:', poId);
      return;
    }

    const poNumber = parseInt(poId.replace('PO', ''));
    const poItems = poDetailsData.filter(item => item.poOrderNumber === poNumber);

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
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    router.push('/bookings/create');
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2 md:gap-0">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
         <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
          <button className="w-full md:w-auto flex items-center text-sm text-gray-900 gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-200">
           <Upload className="w-4 h-4" />
           Upload CSV
          </button>
          <button className="w-full md:w-auto flex items-center text-sm text-gray-900 gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-200">
            <Download className="w-4 h-4" />
            Download CSV
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
        purchaseOrders={orders}
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