'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import QuoteAdditionalInfo from '@/app/components/forwarder/quotefinancing/QuoteAdditionalInfo';
import QuoteInvoice from '@/app/components/forwarder/quotefinancing/Quoteinvoice';

const ClientUI = () => {
  return (
    <div>
      <h2>Client Invoice Quote</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const ForwarderUI = () => {
  return (
    <div className="p-4">
      <QuoteInvoice/>
    </div>
  );
};

const LogisticsProviderUI = () => {
  return (
    <div>
      <h2>Logistics Provider Invoice Quote</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const AdminUI = () => {
  return (
    <div>
      <h2>Admin Invoice Quote</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const InvoicePage = () => {
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

export default InvoicePage;