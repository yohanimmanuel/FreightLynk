'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import QuoteInvoice from '@/app/components/forwarder/quotefinancing/Quoteinvoice';
import { useSearchParams } from 'next/navigation';
import { useQuoteStore } from '@/store/forwarderquote';
import { useQuoteSearchStore } from '@/store/quotesearchdata';
import { getQuote } from '@/utils/quotesApi';

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
  const quotes = useQuoteStore(state => state.quotes);
  const setSelectedQuoteDetails = useQuoteSearchStore(state => state.setSelectedQuoteDetails);
  const setQuotes = useQuoteStore(state => state.setQuotes);

  useEffect(() => {
    if (!id) return;
    
    // First try to find quote in local store
    let quote = quotes.find(q => String(q.id) === String(id));
    
    if (quote) {
      console.log('Found quote in local store:', quote.id);
      setSelectedQuoteDetails(quote);
    } else {
      // If not found in local store, fetch specific quote from database
      console.log('Quote not found in local store, fetching from database...');
      getQuote(id).then((fetchedQuote) => {
        console.log('Fetched quote from database:', fetchedQuote.id);
        // Update the quotes array with the fetched quote
        setQuotes([fetchedQuote, ...quotes]);
        setSelectedQuoteDetails(fetchedQuote);
      }).catch(error => {
        console.error('Error fetching quote from database:', error);
      });
    }
  }, [id, setSelectedQuoteDetails, setQuotes]); // Removed 'quotes' from dependency array to prevent re-running when quotes array changes

  // Separate effect to update selectedQuoteDetails when quotes array changes
  useEffect(() => {
    if (!id) return;
    
    const updatedQuote = quotes.find(q => String(q.id) === String(id));
    if (updatedQuote) {
      console.log('Quote updated in store, updating selectedQuoteDetails:', updatedQuote.id);
      setSelectedQuoteDetails(updatedQuote);
    }
  }, [quotes, id, setSelectedQuoteDetails]);

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