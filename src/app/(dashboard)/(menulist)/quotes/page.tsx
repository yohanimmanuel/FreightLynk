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
    <div className="h-screen grid grid-cols-3 gap-3 px-4">
      <div className="col-span-2">
        <QuoteTable />
      </div>
      <div className="col-span-1">
        <RateTable 
          view="summary" 
          onViewAll={handleViewAll} 
        />
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