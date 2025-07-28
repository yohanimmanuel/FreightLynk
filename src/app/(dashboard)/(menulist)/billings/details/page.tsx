'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import BillingDetailsPage from '@/app/components/clients/quotefinancing/BillingDetails';
import { useBillingStore } from '@/store/billingData';

const BillingDetailsUI = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const billingId = searchParams.get('id');
  const [isLoading, setIsLoading] = useState(true);
  
  const { billings, loadBillings, setSelectedBilling } = useBillingStore();

  useEffect(() => {
    if (billingId) {
      loadBillings().then(() => {
        const billing = billings.find(b => b.id === billingId);
        if (billing) {
          setSelectedBilling(billing);
        }
        setIsLoading(false);
      });
    }
  }, [billingId, loadBillings, billings, setSelectedBilling]);

  const handleBack = () => {
    router.push('/billings');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading billing details...</p>
        </div>
      </div>
    );
  }

  if (!billingId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No billing ID provided</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Billings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Billings</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
              Download Invoice
            </button>
            <button className="px-4 py-2 text-sm bg-[#007bff] text-white rounded-md hover:bg-blue-700 transition-colors">
              Pay Now
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <BillingDetailsPage billingId={billingId} onBack={handleBack} />
      </div>
    </div>
  );
};

export default BillingDetailsUI;