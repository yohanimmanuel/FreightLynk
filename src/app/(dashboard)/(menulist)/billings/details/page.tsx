'use client';

import BillingDetails from "@/app/components/clients/quotefinancing/BillingDetails";
import { useBillingStore } from '@/store/billingData';
import { Download, CreditCard } from 'lucide-react';

const ClientUI = () => {
  const selectedBilling = useBillingStore((state: any) => state.selectedBilling);

  if (!selectedBilling) return null;

  const handleDownloadInvoice = () => {
    console.log('Downloading invoice PDF for:', selectedBilling.bookingId);
    // PDF download logic will be implemented later
  };

  const handlePayNow = () => {
    console.log('Initiating payment for:', selectedBilling.bookingId);
    // Payment logic will be implemented later
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="bg-white mb-2">
        <div className="w-full">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
                  <p className="text-sm text-gray-600">{selectedBilling.bookingId}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Invoice</span>
              </button>
              {(selectedBilling.status === 'Unpaid' || selectedBilling.status === 'Overdue' || selectedBilling.status === 'Failed') && (
                <button
                  onClick={handlePayNow}
                  className="flex items-center space-x-2 px-4 py-2 text-sm bg-[#007bff] text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay Now</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <BillingDetails billingData={selectedBilling} onBack={() => {}} />
    </div>
  );
};

const ForwarderUI = () => {
  return (
    <div>
      <h2>Forwarder</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const LogisticsProviderUI = () => {
  return (
    <div>
      <h2>Logistics Provider Invoice Interface</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const AdminUI = () => {
  return (
    <div>
      <h2>Admin Invoice Interface</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const BillingsUI = ({ userType }: { userType: string }) => {
  // Manually set userType for testing - change this value to test different UIs
  const testUserType: string = 'client'; // Change to: 'client', 'forwarder', 'logistics', 'admin'
  
  if (testUserType === 'client') return <ClientUI />;
  if (testUserType === 'forwarder') return <ForwarderUI />;
  if (testUserType === 'logistics') return <LogisticsProviderUI />;
  if (testUserType === 'admin') return <AdminUI />;
  
  return <div>Access denied</div>;
};

export default BillingsUI;