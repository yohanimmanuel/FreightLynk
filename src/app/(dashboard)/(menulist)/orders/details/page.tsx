'use client';
import { useRouter } from 'next/navigation';
import PODetails, { POData, POItem } from "@/app/components/purchasesorders/PODetails";
import { PurchaseOrder, PODetail } from "@/app/components/purchasesorders/POManagementTable";
import { useEffect, useState } from 'react';

const ClientDetailsUI = () => {
  const router = useRouter();
  const [poData, setPoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const formatDateForDisplay = (inputDate: string): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [year, month, day] = inputDate.split('-');
    return `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
  };

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

  const transformItem = (item: PODetail): POItem => {
    const cleanCurrency = (value: string) => 
      value ? parseFloat(value.replace('$', '').replace(',', '')) : 0;

    return {
      id: `item-${item.id}`,
      lineNumber: item.id,
      productSKU: item.productCode || '',
      productName: item.productName || '',
      crd: item.cargoReadyDate || '',
      mabd: item.mustArriveDate || '',
      mode: (item.transportMode as 'Sea' | 'Air' | 'Road' | 'Rail') || '',
      destination: item.destination || '',
      currency: (item.currency?.replace('$', '') as 'USD' | 'CNY' | 'EUR' | 'IDR' | 'JPY' | 'GBP') || '',
      unitCost: cleanCurrency(item.unitCost),
      uom: (item.uom as 'PC' | 'KG' | 'CBM' | 'LBS' | 'TON') || '',
      requestedQty: item.requested || 0,
      bookedQty: 0,
      bookingProgress: 0  
    };
  };

  useEffect(() => {
    const storedData = sessionStorage.getItem('currentPO');
    if (!storedData) {
      router.push('/orders');
      return;
    }

    try {
      const data = JSON.parse(storedData);
      setPoData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error parsing PO data:', error);
      router.push('/orders');
    }
  }, [router]);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!poData) {
    return <div className="p-4">Error: No PO data found</div>;
  }


  const transformedData: POData = {
    poNumber: poData.id,
    cargoReadyBy: poData.cargoReadyBy,
    mustArriveBy: poData.mustArriveBy,
    buyer: poData.buyer,
    seller: poData.seller,
    subjectedCarrier: poData.subjectedCarrier,
    status: poData.status as 'Open' | 'Closed' | 'Pending',
    progress: poData.progress,
    exceptions: poData.exceptions === '--' ? [] : [poData.exceptions],
    items: poData.items.map(transformItem) // This will transform all items automatically
  };

  const handleSave = async (updatedData: POData) => {
    try {
      const transformedItems: PODetail[] = updatedData.items.map((item, index) => ({
        id: parseInt(item.id.replace('item-', '')) || index + 1,
        poOrderNumber: parseInt(poData.id.replace('PO', '')),
        productCode: item.productSKU,
        productName: item.productName,
        cargoReadyDate: item.crd ? formatDateForDisplay(item.crd) : '--',
        mustArriveDate: item.mabd ? formatDateForDisplay(item.mabd) : '--',
        transportMode: item.mode,
        destination: item.destination,
        currency: `$${item.currency}`,
        unitCost: `$${typeof item.unitCost === 'number' ? item.unitCost.toFixed(2) : '0.00'}`,
        uom: item.uom,
        requested: typeof item.requestedQty === 'number' ? item.requestedQty : parseInt(item.requestedQty?.toString() || '0'),
        booked: item.bookedQty
      }));

      const updatedPO = {
        ...poData,
        cargoReadyBy: formatDateForDisplay(updatedData.cargoReadyBy),
        mustArriveBy: formatDateForDisplay(updatedData.mustArriveBy),
        buyer: updatedData.buyer,
        seller: updatedData.seller,
        subjectedCarrier: updatedData.subjectedCarrier,
        status: updatedData.status,
        progress: updatedData.progress,
        exceptions: updatedData.exceptions.join(', ') || '--',
        items: transformedItems
      };

      console.log('Saving updated PO:', updatedPO);
      
      // Here you would save to your backend
      // await savePurchaseOrder(updatedPO);
      
      sessionStorage.removeItem('currentPO');
      router.push('/orders');
    } catch (error) {
      console.error('Failed to save PO:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const handleCancel = () => {
    sessionStorage.removeItem('currentPO');
    router.push('/orders');
  };

  return (
    <PODetails
      poData={transformedData}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};

const ForwarderDetailsUI = () => {

  return (
    <div>
      <h2>Forwarder Invoice Interface</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const LogisticsDetailsUI = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Logistics Provider Order Details</h2>
      <p className="text-gray-600">Coming Soon...</p>
    </div>
  );
};

const AdminDetailsUI = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin Order Details</h2>
      <p className="text-gray-600">Coming Soon...</p>
    </div>
  );
};

const OrderDetailsPage = () => {
  const userType: string = 'client'; // Change to: 'client', 'forwarder', 'logistics', 'admin'
  
  if (userType === 'client') return <ClientDetailsUI />;
  if (userType === 'forwarder') return <ForwarderDetailsUI />;
  if (userType === 'logistics') return <LogisticsDetailsUI />;
  if (userType === 'admin') return <AdminDetailsUI />;
  
  return <div className="p-4">Access denied</div>;
};

export default OrderDetailsPage;