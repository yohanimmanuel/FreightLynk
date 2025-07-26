'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import PODetails from "@/app/components/clients/purchasesorders/PODetails";
import { POData, POItem, PurchaseOrder, PODetail } from '@/store/poStore';
import { useEffect, useState } from 'react';
import { usePOStore } from '@/store/poStore';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const ClientDetailsUI = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [poData, setPOData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPurchaseOrders = usePOStore(state => state.fetchPurchaseOrders);
  const fetchPODetails = usePOStore(state => state.fetchPODetails);
  const purchaseOrders = usePOStore(state => state.purchaseOrders);
  const poDetails = usePOStore(state => state.poDetails);

  const parseUnitCost = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9.-]/g, '');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Get PO ID from URL and fetch fresh data
  useEffect(() => {
    const poId = searchParams.get('poId');
    console.log('Page mounted - PO ID from URL:', poId);
    
    if (!poId) {
      console.error('No PO ID provided in URL');
      router.push('/orders');
      return;
    }

    const loadPOData = async () => {
      try {
        setLoading(true);
        
        // Fetch fresh data from database
        console.log('Fetching fresh PO data from database...');
        await fetchPurchaseOrders();
        await fetchPODetails(poId);
        
        setLoading(false);
    } catch (error) {
        console.error('Error loading PO data:', error);
        setLoading(false);
    }
  }; 

    loadPOData();
  }, [searchParams]);

  // Transform database data to UI format when data is loaded
  useEffect(() => {
    const poId = searchParams.get('poId');
    if (!poId || loading) return;

    console.log('Transforming data for PO:', poId);
    console.log('Available POs:', purchaseOrders.map(p => p.id));
    console.log('Available details:', poDetails.length);

    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) {
      console.error('PO not found:', poId);
      return;
    }

    const relevantDetails = poDetails.filter(detail => detail.poOrderNumber === poId);
    console.log('Relevant details for', poId, ':', relevantDetails);

    const transformedItems = relevantDetails.map((detail, idx) => ({
          id: idx + 1,
          lineNumber: idx + 1,
      productSKU: detail.productCode || '',
      productName: detail.productName || '',
      crd: detail.cargoReadyDate || '',
      mabd: detail.mustArriveDate || '',
      mode: (detail.transportMode as 'Sea' | 'Air' | 'Road' | 'Rail') || 'Sea',
      destination: detail.destination || '',
      currency: (detail.currency?.replace('$', '') as 'USD' | 'CNY' | 'EUR' | 'IDR' | 'JPY' | 'GBP' | 'AUD') || 'USD',
      unitCost: parseUnitCost(detail.unitCost),
      uom: (detail.uom as 'PC' | 'KG' | 'CBM' | 'LBS' | 'TON') || 'PC',
      requestedQty: detail.requested || 0,
      bookedQty: detail.booked || 0,
          bookingProgress: 0
    }));

    const poData = {
      poNumber: po.id,
      cargoReadyBy: po.cargoReadyBy || '',
      mustArriveBy: po.mustArriveBy || '',
      buyer: po.buyer,
      seller: po.seller,
      subjectedCarrier: po.subjectedCarrier,
      status: po.status,
      progress: po.progress,
      exceptions: Array.isArray(po.exceptions) ? po.exceptions : [po.exceptions || ''],
      items: transformedItems
    };

    console.log('Final transformed PO data:', poData);
    setPOData(poData);
  }, [purchaseOrders, poDetails, loading, searchParams]);

  const handleSave = async (updatedData: any) => {
    try {
      console.log('Saving updated PO data:', updatedData);
      
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
        exceptions: updatedData.exceptions[0] || ''
      };

      console.log('Updating PO:', updatedPO);

      // Update PO details
      const updatedPODetails: PODetail[] = updatedData.items.map((item: any) => ({
        id: item.id,
        poOrderNumber: updatedData.poNumber,
        productCode: item.productSKU,
        productName: item.productName,
        cargoReadyDate: item.crd,
        mustArriveDate: item.mabd,
        transportMode: item.mode,
        destination: item.destination,
        currency: item.currency,
        unitCost: parseUnitCost(item.unitCost),
        uom: item.uom,
        requested: Number(item.requestedQty),
        booked: Number(item.bookedQty) || 0
      }));

      console.log('Updating PO details:', updatedPODetails);

      // Save to database
      await usePOStore.getState().updatePurchaseOrder(updatedPO.id, updatedPO);
      await usePOStore.getState().upsertPODetails(updatedData.poNumber, updatedPODetails);

      console.log('Save completed - checking return destination');
      
      // Check if user came from booking creation flow
      const returnToBookingCreation = sessionStorage.getItem('returnToBookingCreation');
      if (returnToBookingCreation === 'true') {
        sessionStorage.removeItem('returnToBookingCreation');
        router.push('/bookings/create');
      } else {
        router.push('/orders');
      }
      
    } catch (error) {
      console.error('Error saving PO:', error);
      alert('Failed to save purchase order. Please try again.');
    }
  };

  const handleCancel = () => {
    // Check if user came from booking creation flow
    const returnToBookingCreation = sessionStorage.getItem('returnToBookingCreation');
    if (returnToBookingCreation === 'true') {
      sessionStorage.removeItem('returnToBookingCreation');
      router.push('/bookings/create');
    } else {
      router.push('/orders');
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!poData) {
    return <div className="p-4">Purchase order not found.</div>;
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.CLIENT, UserRole.ADMIN]}>
      <div className="">
    <PODetails
      poData={poData}
      onSave={handleSave}
      onCancel={handleCancel}
    />
    </div>
    </ProtectedRoute>
  );
};

export default ClientDetailsUI;