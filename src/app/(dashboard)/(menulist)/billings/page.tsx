'use client';

import BillingTable from "@/app/components/clients/quotefinancing/BillingTable";
import { Download, Upload } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useBillingStore } from '../../../../store/billingStore';

const ClientUI = () => {
  const router = useRouter();
  const handleViewDetails = (item: any) => {
    useBillingStore.getState().setSelectedBilling(item);
    router.push('/billings/details');
  };
  return (
    <div className="px-2 py-2 md:px-4 md:py-4">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage your freight invoices and payments</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-3 gap-2 md:gap-0 w-full md:w-auto">
            <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors w-full md:w-auto">
              <Upload className="w-4 h-4" />
              <span>Import CSV</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors w-full md:w-auto">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>
      <BillingTable onViewDetails={handleViewDetails} />
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