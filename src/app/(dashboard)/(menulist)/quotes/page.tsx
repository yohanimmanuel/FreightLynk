'use client';

import QuoteTable from "@/app/components/quotefinancing/QuoteTable";
import RateTable from "@/app/components/quotefinancing/RateTable";
import { useRouter } from 'next/navigation';

const ClientUI = () => {
  return (
    <div>
      <h2>Client</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const ForwarderUI = () => {
  const router = useRouter();
  
  const handleViewAll = () => {
    router.push('/quotes/rates');
  };
  return (
   <div>
      {/* Header and Rate Table Layout */}
      <div className="grid grid-cols-3 gap-3 px-4">
        <div className="col-span-2">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-2 py-2 mb-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Your Quotes</h1>
                <p className="text-sm text-gray-600 mt-1">Review your freight quotes</p>
              </div>
            </div>
          </div>
          <QuoteTable />
        </div>
        <div className="col-span-1 p-2">
          <RateTable 
            view="summary" 
            onViewAll={handleViewAll} 
          />
        </div>
      </div>
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

const QuotesUI = ({ userType }: { userType: string }) => {
  // Manually set userType for testing - change this value to test different UIs
  const testUserType: string = 'forwarder'; // Change to: 'client', 'forwarder', 'logistics', 'admin'
  
  if (testUserType === 'client') return <ClientUI />;
  if (testUserType === 'forwarder') return <ForwarderUI />;
  if (testUserType === 'logistics') return <LogisticsProviderUI />;
  if (testUserType === 'admin') return <AdminUI />;
  
  return <div>Access denied</div>;
};

export default QuotesUI;