'use client';
import { useRouter } from 'next/navigation';
import PODetails from "@/app/components/clients/purchasesorders/PODetails";
import { POData, POItem, PurchaseOrder, PODetail } from '@/store/poStore';
import { useEffect, useState } from 'react';
import { usePOStore } from '@/store/poStore';

const ClientDetailsUI = () => {
  const router = useRouter();
  const [poData, setPOData] = useState<any>(null);
  const setPurchaseOrders = usePOStore(state => state.setPurchaseOrders);
  const setPODetails = usePOStore(state => state.setPODetails);
  const purchaseOrders = usePOStore(state => state.purchaseOrders);
  const poDetails = usePOStore(state => state.poDetails);

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
      id: Number(item.id),
      lineNumber: Number(item.id),
      productSKU: item.productCode || '',
      productName: item.productName || '',
      crd: item.cargoReadyDate || '',
      mabd: item.mustArriveDate || '',
      mode: (item.transportMode as 'Sea' | 'Air' | 'Road' | 'Rail') || '',
      destination: item.destination || '',
      currency: (item.currency?.replace('$', '') as 'USD' | 'CNY' | 'EUR' | 'IDR' | 'JPY' | 'GBP') || '',
      unitCost: parseUnitCost(item.unitCost),
      uom: (item.uom as 'PC' | 'KG' | 'CBM' | 'LBS' | 'TON') || '',
      requestedQty: item.requested || 0,
      bookedQty: 0,
      bookingProgress: 0  
    };
  };

  useEffect(() => {
    const storedPO = sessionStorage.getItem('currentPO');
    if (storedPO) {
      const parsedPO = JSON.parse(storedPO);
      console.log('Loading PO from sessionStorage:', parsedPO);
      console.log('Original date fields:', {
        cargoReadyBy: parsedPO.cargoReadyBy,
        mustArriveBy: parsedPO.mustArriveBy
      });
      
      setPOData({
        poNumber: parsedPO.id,
        cargoReadyBy: parsedPO.cargoReadyBy || '',
        mustArriveBy: parsedPO.mustArriveBy || '',
        buyer: parsedPO.buyer,
        seller: parsedPO.seller,
        subjectedCarrier: parsedPO.subjectedCarrier,
        status: parsedPO.status,
        progress: parsedPO.progress,
        exceptions: [parsedPO.exceptions],
        items: (parsedPO.items as any[]).map((item, idx) => ({
          id: idx + 1,
          lineNumber: idx + 1,
          productSKU: item.productCode,
          productName: item.productName,
          crd: item.cargoReadyDate || '',
          mabd: item.mustArriveDate || '',
          mode: item.transportMode,
          destination: item.destination,
          currency: typeof item.currency === 'string' ? item.currency : '',
          unitCost: parseUnitCost(item.unitCost),
          uom: typeof item.uom === 'string' ? item.uom : '',
          requestedQty: item.requested,
          bookedQty: 0,
          bookingProgress: 0
        }))
      });
    } else {
      router.push('/orders');
    }
  }, [router]);

  const handleSave = async (updatedData: any) => {
    try {
      console.log('Saving updated PO data:', updatedData);
      console.log('Date fields being saved:', {
        cargoReadyBy: updatedData.cargoReadyBy,
        mustArriveBy: updatedData.mustArriveBy
      });
      
      // Convert back to store format
      const poNumber = parseInt(updatedData.poNumber.replace('PO', ''));
      
      // Update purchase order
      const updatedPO: PurchaseOrder = {
        id: updatedData.poNumber,
        cargoReadyBy: updatedData.cargoReadyBy,
        mustArriveBy: updatedData.mustArriveBy,
        buyer: updatedData.buyer,
        seller: updatedData.seller,
        subjectedCarrier: updatedData.subjectedCarrier,
        status: updatedData.status,
        progress: updatedData.progress,
        exceptions: updatedData.exceptions[0]
      };

      console.log('Updated PO object for store:', updatedPO);

      // Update PO details
      const updatedPODetails: PODetail[] = updatedData.items.map((item: any) => ({
        id: item.id,
        poOrderNumber: poNumber,
        productCode: item.productSKU,
        productName: item.productName,
        cargoReadyDate: item.crd,
        mustArriveDate: item.mabd,
        transportMode: item.mode,
        destination: item.destination,
        currency: item.currency,
        unitCost: parseUnitCost(item.unitCost),
        uom: typeof item.uom === 'string' ? item.uom : '',
        requested: Number(item.requestedQty)
      }));

      // Update store
      setPurchaseOrders(purchaseOrders.map(po => 
        po.id === updatedPO.id ? updatedPO : po
      ));

      // Remove all existing items for this PO and add all items from the form
      const filteredPODetails = poDetails.filter(detail => detail.poOrderNumber !== poNumber);
      setPODetails([...filteredPODetails, ...updatedPODetails]);

      router.push('/orders');
    } catch (error) {
      console.error('Error saving PO:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push('/orders');
  };

  if (!poData) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <PODetails
      poData={poData}
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

// Helper to safely parse unitCost
function parseUnitCost(val: unknown): number {
  if (typeof val === 'string') {
    return Number((val as string).replace(/[^0-9.-]+/g, '') || 0);
  }
  if (typeof val === 'number') {
    return val;
  }
  return 0;
}

export default OrderDetailsPage;