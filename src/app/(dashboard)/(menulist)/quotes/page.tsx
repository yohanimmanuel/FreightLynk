'use client';

import QuoteTable from "@/app/components/forwarder/quotefinancing/QuoteTable";
import RateTable from "@/app/components/forwarder/quotefinancing/RateTable";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const ClientUI = () => {
  return (
    <div>
      <h2>Client Quotes</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const ForwarderUI = () => {
  const router = useRouter();
  
  const handleViewAll = () => {
    router.push('/quotes/rates');
  };

  const handleSearchQuote = () => {
    router.push('/quotes/search');
  };

  return (
   <div>
      {/* Header and Rate Table Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-2 md:px-4">
        <div className="md:col-span-2 col-span-1">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-2 py-2 mb-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Your Quotes</h1>
                <p className="text-sm text-gray-600 mt-1">Review your freight quotes</p>
              </div>
              <button
                onClick={handleSearchQuote}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#007bff] rounded-lg hover:bg-blue-700"
              >
                Search quote
              </button>
            </div>
          </div>
          <QuoteTable />
        </div>
        <div className="md:col-span-1 col-span-1 p-0 md:p-2 mt-4 md:mt-0">
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
      <h2>Logistics Provider Quotes</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const AdminUI = () => {
  return (
    <div>
      <h2>Admin Quotes</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const QuotesPage = () => {
  const { user } = useAuthStore();
  const [roleBasedUI, setRoleBasedUI] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    if (!user) return;

    switch (user.role) {
      case UserRole.ADMIN:
        setRoleBasedUI(<AdminUI />);
        break;
      case UserRole.CLIENT:
        setRoleBasedUI(<ClientUI />);
        break;
      case UserRole.FORWARDER:
        setRoleBasedUI(<ForwarderUI />);
        break;
      case UserRole.LOGISTICS_PROVIDER:
        setRoleBasedUI(<LogisticsProviderUI />);
        break;
      default:
        setRoleBasedUI(<div>Access denied</div>);
    }
  }, [user]);

  return (
    <ProtectedRoute 
      allowedRoles={[UserRole.ADMIN, UserRole.CLIENT, UserRole.FORWARDER, UserRole.LOGISTICS_PROVIDER]} 
    >
      {roleBasedUI}
    </ProtectedRoute>
  );
};

export default QuotesPage;