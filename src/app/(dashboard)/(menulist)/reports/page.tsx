'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const ClientUI = () => (
  <div>
    <h2>Client Reports</h2>
    <p>Coming Soon...</p>
  </div>
);

const ForwarderUI = () => (
  <div>
    <h2>Forwarder Reports</h2>
    <p>Coming Soon...</p>
  </div>
);

const LogisticsProviderUI = () => (
  <div>
    <h2>Logistics Provider Reports</h2>
    <p>Coming Soon...</p>
  </div>
);

const AdminUI = () => (
  <div>
    <h2>Admin Reports</h2>
    <p>Coming Soon...</p>
  </div>
);

const ReportsPage = () => {
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
      allowedRoles={[UserRole.ADMIN, UserRole.FORWARDER, UserRole.LOGISTICS_PROVIDER]}
    >
      {roleBasedUI}
    </ProtectedRoute>
  );
};

export default ReportsPage; 