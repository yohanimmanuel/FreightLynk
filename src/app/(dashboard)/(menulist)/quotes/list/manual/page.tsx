'use client';

import React from 'react';
import QuoteInvoice from '../../../../../components/forwarder/quotefinancing/Quoteinvoice';
import { useQuoteSearchStore } from '../../../../../../store/quotesearchdata';
import { useQuoteRateStore } from '../../../../../../store/forwarderquote';

const ManualQuotationPage = () => {
  const { setSelectedQuoteDetails } = useQuoteSearchStore();
  const { setCurrentDraftQuote } = useQuoteRateStore();

  // Create a blank quote object for manual quotation
  React.useEffect(() => {
    const generateQuoteId = () => {
      const now = new Date();
      return `QT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    };

    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const blankQuote = {
      id: generateQuoteId(),
      createdOn: formatDate(new Date()),
      validUntil: '',
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
      origin: '',
      destination: '',
      transitPort: '',
      serviceType: '',
      remark: '',
      additionalInfo: {
        shipmentType: '',
        shipmentTypeDescription: '',
        cargoReadyDate: '',
        etd: '',
        incoterm: '',
        freightTerm: '',
        ofPriceFeedback: '',
        note: '',
        companyBranch: '',
        commodities: '',
        isTariff: false,
      },
      tableRows: [],
      mode: 'ocean' as 'ocean' | 'air' | 'road',
      modeLabel: '',
      provider: '',
      currency: 'USD',
      price: '0',
      status: 'draft' as 'draft' | 'sent' | 'requested' | 'expired',
      createdBy: '',
      createdDate: formatDate(new Date()),
      incoterms: '',
      notes: '',
      details: [],
      containertype: [],
      truckType: [],
      weightVolume: [],
      isTariff: false,
      client: '',
      transitTime: '',
      validFrom: '',
      originAirport: '',
      destinationAirport: '',
      companyName: '',
      companyLogo: '',
      shipmentType: '',
      shipmentTypeDescription: '',
      profit: '',
      lane: '',
      baseRate: 0,
      validity: '',
      logo: '',
      transportMode: '',
      cargoTab: '',
      fclQuantities: {},
      lclWeight: '',
      lclVolume: '',
      searchParams: {},
      cargoLabel: '',
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