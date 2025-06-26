'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import POManagementTable, {
  PurchaseOrder,
  PODetail,
  purchaseOrdersData,
  poDetailsData
} from "@/app/components/purchasesorders/POManagementTable";

const ClientUI = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Client Portal</h2>
      <p className="text-gray-600">Purchase order tracking coming soon...</p>
    </div>
  );
};

const ForwarderUI = () => {
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

  return (
    <div className="p-4">
      <POManagementTable
        purchaseOrders={orders}
        onEditOrder={handleEditOrder}
        onCreateOrder={handleCreateOrder}
        view= "full"
      />
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
  const userType: string = 'forwarder'; // Change to: 'client', 'forwarder', 'logistics', 'admin'
  
  if (userType === 'client') return <ClientUI />;
  if (userType === 'forwarder') return <ForwarderUI />;
  if (userType === 'logistics') return <LogisticsProviderUI />;
  if (userType === 'admin') return <AdminUI />;
  
  return <div className="p-4">Access denied</div>;
};

export default OrdersPage;