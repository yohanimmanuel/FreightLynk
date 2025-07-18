'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import QuoteAdditionalInfo from '@/app/components/forwarder/quotefinancing/QuoteAdditionalInfo';
import QuoteInvoice from '@/app/components/forwarder/quotefinancing/Quoteinvoice';
import { useSearchParams } from 'next/navigation';
import { useQuoteRateStore } from '@/store/forwarderquote';
import { useQuoteSearchStore } from '@/store/quotesearchdata';

const ClientUI = () => {
  return (
    <div>
      <h2>Client Invoice Quote</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const ForwarderUI = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const quotes = useQuoteRateStore(state => state.quotes);
  const setSelectedQuoteDetails = useQuoteSearchStore(state => state.setSelectedQuoteDetails);

  useEffect(() => {
    if (!id) return;
    const quote = quotes.find(q => String(q.id) === String(id));
    if (quote) {
      setSelectedQuoteDetails(quote);
    }
  }, [id, quotes, setSelectedQuoteDetails]);

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