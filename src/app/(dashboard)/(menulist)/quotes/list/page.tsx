'use client';

import QuoteTable from "@/app/components/forwarder/quotefinancing/QuoteTable";
import { useEffect, useState } from 'react';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const ClientUI = () => {
  return (
    <div className="p-4">
     {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Your Quotes</h1>
              <p className="text-sm text-gray-600 mt-2">Review your freight quotes</p>
          </div>
         </div>
      </div>
     <QuoteTable role="client" />
    </div>
  );
};

const ForwarderUI = () => {

  return (
   <div className="p-4">
     {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Your Quotes</h1>
              <p className="text-sm text-gray-600 mt-2">Review your freight quotes</p>
          </div>
         </div>
      </div>
     <QuoteTable role="forwarder" />
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