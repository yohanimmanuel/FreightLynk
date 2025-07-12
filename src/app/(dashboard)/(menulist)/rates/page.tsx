'use client';

import RateTable from "@/app/components/forwarder/quotefinancing/RateTable";
import { useEffect, useState } from 'react';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const ClientUI = () => {
  return (
    <div>
      <h2>Client Rates</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const ForwarderUI = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Rate Management</h2>
      <RateTable />
    </div>
  );
};

const LogisticsProviderUI = () => {
  return (
    <div>
      <h2>Logistics Provider Rates</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const AdminUI = () => {
  return (
    <div>
      <h2>Admin Rates</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const RatesPage = () => {
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

export default RatesPage;