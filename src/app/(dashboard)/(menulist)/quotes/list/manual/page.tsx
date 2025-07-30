'use client';

import React from 'react';
import QuoteInvoice from '../../../../../components/forwarder/quotefinancing/Quoteinvoice';
import { useQuoteSearchStore } from '../../../../../../store/quotesearchdata';
import { useQuoteStore } from '../../../../../../store/forwarderquote';

const ManualQuotationPage = () => {
  const { setSelectedQuoteDetails } = useQuoteSearchStore();
  const { setCurrentDraftQuote } = useQuoteStore();

  // Create a blank quote object for manual quotation
  React.useEffect(() => {
    const generateQuoteId = () => {
      return `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const blankQuote = {
      id: generateQuoteId(),
      lane: '',
      mode: 'ocean' as 'ocean' | 'air' | 'road',
      modeLabel: '',
      containertype: [],
      currency: 'USD',
      baseRate: 0,
      price: '0',
      transitTime: '',
      provider: '',
      validity: '',
      status: 'draft' as const,
      origin: '',
      destination: '',
      incoterms: '',
      remark: '',
      serviceType: '',
      transitPort: '',
      client: '',
      isTariff: false,
      profit: '0',
      createdBy: '',
      createdDate: formatDate(new Date()),
      notes: '',
      details: [],
      truckType: [],
      weightVolume: [],
      additionalCost: 0,
      additionalCostDescription: '',
      totalAmount: 0,
      finalTotalAmount: 0,
      from: {
        company: '',
        address: '',
        phone: '',
        preparedBy: '',
        mobile: '',
        email: '',
      },
      to: {
        company: '',
        address: '',
        phone: '',
        contact: '',
      },
      tableRows: [],
      additionalInfo: {
        shipmentType: '',
        cargoReadyDate: '',
        etd: '',
        incoterms: '',
        freightTerms: '',
        ofPriceFeedback: '',
        notes: '',
        companyBranch: '',
        commodities: '',
        isTariff: false,
      },
      companyBranch: '',
      companyName: '',
      companyLogo: '',
      shipmentType: '',
      shipmentTypeDescription: '',
      validUntil: '',
      originAirport: '',
      destinationAirport: '',
    };

    setSelectedQuoteDetails(blankQuote);
    setCurrentDraftQuote(blankQuote);
  }, [setSelectedQuoteDetails, setCurrentDraftQuote]);

  return (
    <div className="p-4">
      <QuoteInvoice isManualQuotation={true} />
    </div>
  );
};

export default ManualQuotationPage; 