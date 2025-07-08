'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import QuoteSearch from '@/app/components/forwarder/quotefinancing/QuoteSearch';

const ClientUI = () => {
  return (
    <div>
      <h2>Client Search Quote</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const ForwarderUI = () => {
  return (
    <div className="p-4">
      <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Quote</h1>
          <p className="text-gray-600 text-sm">Find the best freight rates for your shipments</p>
      </div>
      <QuoteSearch />
    </div>
  );
};

const LogisticsProviderUI = () => {
  return (
    <div>
      <h2>Logistics Provider Search Quote</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const AdminUI = () => {
  return (
    <div>
      <h2>Admin Search Quote</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const SearchQuotePage = () => {
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

export default SearchQuotePage;