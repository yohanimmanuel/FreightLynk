import React, { useState, useEffect, useRef } from 'react';
import { useQuoteSearchStore, QuoteSearchResult } from '../../../../store/quotesearchdata';
import { useAuthStore } from '../../../../store/authStore';
import { Edit, Send, Plus, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuoteRateStore } from '../../../../store/forwarderquote';
import { partnerDirectory } from '../../../../store/partnerCompanyData';

// Utility to generate a unique Quote ID
function generateQuoteId() {
  const now = new Date();
  return `QT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Utility to format date as YYYY-MM-DD
function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

// Helper to format quote for table badge columns
function formatQuoteForTable(
  quote: any,
  user: any,
  selectedQuoteDetails: any,
  editAdditionalInfo: any,
  editFrom: any,
  editTo: any,
  editRemark: any,
  totalAmount: any
) {
  function getTypeQuantityString(rows: any, typeKey: any) {
    const counts: Record<string, number> = {};
    rows.forEach((row: any) => {
      const type = row[typeKey];
      // Only process actual container types and truck types, not weight/volume items
      if (type && type !== 'Volume' && type !== 'Weight') {
        // Ensure we're counting unique types properly
        const existingCount = counts[type] || 0;
        const rowQty = Number(row.qty) || 1;
        counts[type] = existingCount + rowQty;
      }
    });
    return Object.entries(counts).map(([type, qty]) => `${qty} x ${type}`);
  }
  
  let tableRows = quote.tableRows;
  if (!Array.isArray(tableRows) || typeof tableRows[0] !== 'object') {
    tableRows = Array.isArray(selectedQuoteDetails?.tableRows) && typeof selectedQuoteDetails.tableRows[0] === 'object'
      ? selectedQuoteDetails.tableRows
      : [];
  }
  
  // Get mode to determine proper formatting - use multiple sources to detect mode
  const modeLabel = quote.modeLabel || quote.mode || '';
  const mode = modeLabel.toUpperCase();
  
  // Format container types for FCL
  const containerTypeBadges = getTypeQuantityString(tableRows, 'item');
  
  // Format truck types for FTL
  const truckTypeBadges = getTypeQuantityString(tableRows, 'truckType');
  
  // Format weight/volume for LCL, AIR, LTL
  const weight = editAdditionalInfo?.lclWeight || quote.lclWeight || '';
  const volume = editAdditionalInfo?.lclVolume || quote.lclVolume || '';
  let weightVolumeBadge = '';
  if (weight && volume) {
    weightVolumeBadge = `${weight} kg / ${volume} cbm`;
  } else if (weight) {
    weightVolumeBadge = `${weight} kg`;
  } else if (volume) {
    weightVolumeBadge = `${volume} cbm`;
  }
  
  // Create details badges based on mode
  let detailsBadges = [];
  if (mode.includes('SEA') && mode.includes('FCL')) {
    detailsBadges = [...containerTypeBadges];
  } else if (mode.includes('LAND') && mode.includes('FTL')) {
    detailsBadges = [...truckTypeBadges];
  } else if (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL')) {
    detailsBadges = weightVolumeBadge ? [weightVolumeBadge] : [];
  } else {
    // For 'ALL' tab, show only the mode-specific information (no mixing)
    if (mode.includes('SEA') && mode.includes('FCL')) {
      detailsBadges = [...containerTypeBadges];
    } else if (mode.includes('LAND') && mode.includes('FTL')) {
      detailsBadges = [...truckTypeBadges];
    } else if (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL')) {
      detailsBadges = weightVolumeBadge ? [weightVolumeBadge] : [];
    } else {
      // Fallback: show container types if available, otherwise weight/volume
      detailsBadges = containerTypeBadges.length > 0 ? [...containerTypeBadges] : (weightVolumeBadge ? [weightVolumeBadge] : []);
    }
  }
  
  return {
    ...quote,
    from: editFrom ? { ...editFrom } : quote.from,
    to: editTo ? { ...editTo } : quote.to,
    remark: editRemark !== undefined ? editRemark : quote.remark,
    containertype: containerTypeBadges,
    truckType: truckTypeBadges,
    weightVolume: weightVolumeBadge ? [weightVolumeBadge] : [],
    details: detailsBadges,
    price: totalAmount !== undefined ? totalAmount?.toString() : quote.price,
    tableRows,
  };
}

const QuoteInvoice = ({ isManualQuotation = false }: { isManualQuotation?: boolean }) => {
  const { selectedQuoteDetails, additionalInfo, shipmentType, shipmentTypeDescription, setSelectedQuoteDetails } = useQuoteSearchStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const quote = selectedQuoteDetails;
  const addQuote = useQuoteRateStore(state => state.addQuote);
  const quotes = useQuoteRateStore(state => state.quotes);
  const setQuotes = useQuoteRateStore(state => state.setQuotes);
  const currentDraftQuote = useQuoteRateStore(state => state.currentDraftQuote);
  const setCurrentDraftQuote = useQuoteRateStore(state => state.setCurrentDraftQuote);
  // If no quote is selected, show a message
  if (!quote) return <div className="text-center text-gray-500 py-12">No quote selected. Please select a quote from the search results.</div>;

  // --- Edit mode state ---
  const [isEditing, setIsEditing] = useState(isManualQuotation);
  const [editFrom, setEditFrom] = useState({
    company: user?.companyName || 'Demo Company (FreightLynk LLC)',
    address: '1000 20th Street NW, Suite 400, Washington D.C. 20036',
    phone: '(028) 1208 281055',
    preparedBy: user?.fullName || 'Demo User',
    mobile: '(028) 1208 281055',
    email: user?.email || 'demo123@gmail.com',
  });
  const [editTo, setEditTo] = useState({
    company: '',
    address: '',
    phone: '',
    contact: '',
  });
  const [editRemark, setEditRemark] = useState(quote.remark);
  const [editAdditionalInfo, setEditAdditionalInfo] = useState({ ...quote.additionalInfo });
  const [originalState, setOriginalState] = useState<any>(null);
  const [loadingDraft, setLoadingDraft] = useState(true);

  // Additional state for manual quotations
  const [additionalCost, setAdditionalCost] = useState(0);
  const [additionalCostDescription, setAdditionalCostDescription] = useState('');

  // State for editable quote fields
  const [editQuote, setEditQuote] = useState({
    origin: quote.origin || '',
    destination: quote.destination || '',
    transitPort: quote.transitPort || '',
    serviceType: quote.serviceType || '',
    mode: quote.mode || '',
    transitTime: quote.transitTime || '',
    validUntil: quote.validUntil || '',
    provider: quote.provider || '',
  });

  // Functions for manual quotation table management
  const addTableRow = () => {
    const newRow = {
      chargeType: '',
      item: '',
      description: '',
      calculation: '',
      qty: 1,
      baseRate: 0,
      currency: 'USD',
      amount: 0,
    };
    
    const updatedTableRows = [...tableRows, newRow];
    setSelectedQuoteDetails({
      ...selectedQuoteDetails,
      tableRows: updatedTableRows,
    });
  };

  const removeTableRow = (index: number) => {
    const updatedTableRows = tableRows.filter((_: any, i: number) => i !== index);
    setSelectedQuoteDetails({
      ...selectedQuoteDetails,
      tableRows: updatedTableRows,
    });
  };

  const updateTableRow = (index: number, field: string, value: any) => {
    const updatedTableRows = [...tableRows];
    updatedTableRows[index] = { ...updatedTableRows[index], [field]: value };
    
    // Recalculate amount if qty or baseRate changed
    if (field === 'qty' || field === 'baseRate') {
      const qty = field === 'qty' ? value : updatedTableRows[index].qty;
      const baseRate = field === 'baseRate' ? value : updatedTableRows[index].baseRate;
      updatedTableRows[index].amount = qty * baseRate;
    }
    
    setSelectedQuoteDetails({
      ...selectedQuoteDetails,
      tableRows: updatedTableRows,
    });
  };

  // Centralized empty form state for invoice
  const emptyFormState = {
    from: { company: '', address: '', phone: '', preparedBy: '', mobile: '', email: '' },
    to: { company: '', address: '', phone: '', contact: '' },
    remark: '',
    // Add all other fields you use in the invoice form here, initialized to '' or default
  };
  const [formState, setFormState] = useState(emptyFormState);

  // On mount, check for selected client/contact in localStorage and update To details
  useEffect(() => {
    const clientId = localStorage.getItem('selectedClientId');
    const contactId = localStorage.getItem('selectedContactId');
    if (clientId && contactId) {
      const client = partnerDirectory.find(c => c.id === Number(clientId));
      const contact = client?.contactPersons.find(p => p.id === Number(contactId));
      if (client && contact) {
        setEditTo({
          company: client.name,
          address: client.address,
          phone: client.phone,
          contact: contact.name,
        });
      }
    }
  }, []);

  // On mount, initialize edit fields from quote, but always use defaults if missing
  useEffect(() => {
    setEditFrom({
      company: quote.from?.company || user?.companyName || 'Demo Company (FreightLynk LLC)',
      address: quote.from?.address || '1000 20th Street NW, Suite 400, Washington D.C. 20036',
      phone: quote.from?.phone || '(028) 1208 281055',
      preparedBy: quote.from?.preparedBy || user?.fullName || 'Demo User',
      mobile: quote.from?.mobile || '(028) 1208 281055',
      email: quote.from?.email || user?.email || 'demo123@gmail.com',
    });
    setEditTo(quote.to || editTo);
    setEditRemark(quote.remark || '');
    setEditAdditionalInfo({ ...quote.additionalInfo });
  }, [quote]);

  // Initialize table with default row for manual quotations
  useEffect(() => {
    if (isManualQuotation && (!selectedQuoteDetails?.tableRows || selectedQuoteDetails.tableRows.length === 0)) {
      const defaultRow = {
        chargeType: '',
        item: '',
        description: '',
        calculation: '',
        qty: 1,
        baseRate: 0,
        currency: 'USD',
        amount: 0,
      };
      setSelectedQuoteDetails({
        ...selectedQuoteDetails,
        tableRows: [defaultRow],
      });
    }
  }, [isManualQuotation, selectedQuoteDetails]);

  // Generate quoteId ONCE for both invoice and table, using draft if available
  const [quoteId] = useState(() => currentDraftQuote?.id || (typeof quote.id === 'string' ? quote.id : generateQuoteId()));
  const hasAddedQuote = useRef<string | null>(null);

  // --- Handlers ---
  const handleEdit = () => {
    setOriginalState({
      from: { ...editFrom },
      to: { ...editTo },
      remark: editRemark,
      additionalInfo: { ...editAdditionalInfo },
    });
    setIsEditing(true);
  };
  const handleCancel = () => {
    if (originalState) {
      setEditFrom(originalState.from);
      setEditTo(originalState.to);
      setEditRemark(originalState.remark);
      setEditAdditionalInfo(originalState.additionalInfo);
    }
    setIsEditing(false);
  };
  // In handleSave, do not allow empty 'from' fields; always use defaults if missing
  const handleSave = () => {
    const safeFrom = {
      company: editFrom.company || user?.companyName || 'Demo Company (FreightLynk LLC)',
      address: editFrom.address || '1000 20th Street NW, Suite 400, Washington D.C. 20036',
      phone: editFrom.phone || '(028) 1208 281055',
      preparedBy: editFrom.preparedBy || user?.fullName || 'Demo User',
      mobile: editFrom.mobile || '(028) 1208 281055',
      email: editFrom.email || user?.email || 'demo123@gmail.com',
    };
    const safeTo = {
      company: editTo.company || '',
      address: editTo.address || '',
      phone: editTo.phone || '',
      contact: editTo.contact || '',
    };
    // Always clear shipmentTypeDescription if not 'Other', set both top-level and in additionalInfo
    const isOther = editAdditionalInfo.shipmentType === 'Other';
    const shipmentTypeDescription = isOther ? editAdditionalInfo.shipmentTypeDescription : '';
    const cleanedAdditionalInfo = {
      ...editAdditionalInfo,
      shipmentTypeDescription,
    };
    // Compute details and other table fields
    const containerTypes = Array.from(new Set((quote.tableRows || []).map((row: any) => row.item).filter(Boolean)));
    const truckTypes = Array.from(new Set((quote.tableRows || []).map((row: any) => row.truckType).filter(Boolean)));
    const weightVolumes = Array.from(new Set((quote.tableRows || []).map((row: any) => row.weightVolume).filter(Boolean)));
    const details = [
      ...containerTypes,
      ...truckTypes,
      ...weightVolumes
    ].filter(Boolean).join(', ');
    const totalAmount = (quote.tableRows || []).reduce((sum: number, row: any) => sum + (typeof row.amount === 'number' ? row.amount : 0), 0);
    const finalTotalAmount = totalAmount + (isManualQuotation ? additionalCost : 0);
    // Compute container/truck type as 'qty x type' and weight/volume as 'weight kg / volume cbm'
    function getTypeQuantityString(rows: any[], typeKey: string) {
      const counts: Record<string, number> = {};
      rows.forEach(row => {
        const type = row[typeKey];
        // Only process actual container types and truck types, not weight/volume items
        if (type && type !== 'Volume' && type !== 'Weight') {
          // Ensure we're counting unique types properly
          const existingCount = counts[type] || 0;
          const rowQty = Number(row.qty) || 1;
          counts[type] = existingCount + rowQty;
        }
      });
      return Object.entries(counts).map(([type, qty]) => `${qty} x ${type}`);
    }
    // Ensure tableRows is always an array of objects
    let tableRows = quote.tableRows;
    if (!Array.isArray(tableRows) || typeof tableRows[0] !== 'object') {
      tableRows = Array.isArray(selectedQuoteDetails?.tableRows) && typeof selectedQuoteDetails.tableRows[0] === 'object'
        ? selectedQuoteDetails.tableRows
        : [];
    }
    
    // Get mode to determine proper formatting - use multiple sources to detect mode
    const modeLabel = selectedQuoteDetails?.modeLabel || quote.mode || '';
    const mode = modeLabel.toUpperCase();
    
    // Format container types for FCL
    const containerTypeBadges = getTypeQuantityString(tableRows, 'item');
    
    // Format truck types for FTL
    const truckTypeBadges = getTypeQuantityString(tableRows, 'truckType');
    
    // Weight/volume badge for LCL, AIR, LTL
    const weight = editAdditionalInfo.lclWeight || quote.lclWeight || '';
    const volume = editAdditionalInfo.lclVolume || quote.lclVolume || '';
    let weightVolumeBadge = '';
    if (weight && volume) {
      weightVolumeBadge = `${weight} kg / ${volume} cbm`;
    } else if (weight) {
      weightVolumeBadge = `${weight} kg`;
    } else if (volume) {
      weightVolumeBadge = `${volume} cbm`;
    }

    // Create details badges based on mode
    let detailsBadges = [];
    if (mode.includes('SEA') && mode.includes('FCL')) {
      detailsBadges = [...containerTypeBadges];
    } else if (mode.includes('LAND') && mode.includes('FTL')) {
      detailsBadges = [...truckTypeBadges];
    } else if (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL')) {
      detailsBadges = weightVolumeBadge ? [weightVolumeBadge] : [];
    } else {
      // For 'ALL' tab, show only the mode-specific information (no mixing)
      if (mode.includes('SEA') && mode.includes('FCL')) {
        detailsBadges = [...containerTypeBadges];
      } else if (mode.includes('LAND') && mode.includes('FTL')) {
        detailsBadges = [...truckTypeBadges];
      } else if (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL')) {
        detailsBadges = weightVolumeBadge ? [weightVolumeBadge] : [];
      } else {
        // Fallback: show container types if available, otherwise weight/volume
        detailsBadges = containerTypeBadges.length > 0 ? [...containerTypeBadges] : (weightVolumeBadge ? [weightVolumeBadge] : []);
      }
    }

    const updatedQuote = {
      ...quote,
      from: { ...safeFrom },
      to: { ...safeTo },
      remark: editRemark,
      additionalInfo: cleanedAdditionalInfo,
      shipmentType: cleanedAdditionalInfo.shipmentType || quote.shipmentType || '',
      shipmentTypeDescription,
      // Preserve weight/volume data
      lclWeight: editAdditionalInfo.lclWeight || quote.lclWeight || '',
      lclVolume: editAdditionalInfo.lclVolume || quote.lclVolume || '',
      // Update quote fields from editQuote state
      origin: editQuote.origin,
      destination: editQuote.destination,
      transitPort: editQuote.transitPort,
      serviceType: editQuote.serviceType,
      transitTime: editQuote.transitTime,
      validUntil: editQuote.validUntil,
      mode: (() => {
        const m = (selectedQuoteDetails?.modeLabel || quote.mode || '').toUpperCase();
        if (m.includes('SEA') && m.includes('FCL')) return 'SEA FCL';
        if (m.includes('SEA') && m.includes('LCL')) return 'SEA LCL';
        if (m.includes('AIR') && m.includes('LCL')) return 'AIR LCL';
        if (m.includes('AIR')) return 'AIR';
        if (m.includes('LAND') && m.includes('FTL')) return 'LAND FTL';
        if (m.includes('LAND') && m.includes('LTL')) return 'LAND LTL';
        return m;
      })(),
      details: detailsBadges,
      isTariff: cleanedAdditionalInfo.isTariff ?? quote.isTariff ?? false,
      client: safeTo.company || quote.client || '',
      containertype: containerTypeBadges,
      truckType: truckTypeBadges,
      weightVolume: weightVolumeBadge ? [weightVolumeBadge] : [],
      status: quote.status || 'draft',
      price: finalTotalAmount?.toString() || quote.price || '',
      createdBy: user?.fullName || quote.createdBy || '',
      incoterms: cleanedAdditionalInfo.incoterm || quote.incoterms || '',
      notes: cleanedAdditionalInfo.note || quote.notes || '',
      tableRows: tableRows,
    };
    setCurrentDraftQuote(updatedQuote);
    addQuote(updatedQuote);
    setIsEditing(false);
    setSelectedQuoteDetails(updatedQuote);
  };

  // Reset form state after submission or when starting a new quote
  useEffect(() => {
    if (!currentDraftQuote) {
      setFormState(emptyFormState);
    }
  }, [currentDraftQuote]);

  // Use tableRows from selectedQuoteDetails for the quote table
  const tableRows = selectedQuoteDetails?.tableRows || [];

  // Build details from tableRows
  const containerTypes = Array.from(new Set(tableRows.map((row: any) => row.item).filter(Boolean)));
  const truckTypes = Array.from(new Set(tableRows.map((row: any) => row.truckType).filter(Boolean)));
  const weightVolumes = Array.from(new Set(tableRows.map((row: any) => row.weightVolume).filter(Boolean)));
  const details = [
    ...containerTypes,
    ...truckTypes,
    ...weightVolumes
  ].filter(Boolean).join(', ');

  const totalAmount = tableRows.reduce((sum: number, row: any) => sum + (typeof row.amount === 'number' ? row.amount : 0), 0);
  const currency = tableRows[0]?.currency || quote.currency;

  // Dates
  const createdOn = formatDate(new Date());

  // Extract additional info fields - prioritize quote's own additionalInfo over global store
  const quoteAdditionalInfo = quote.additionalInfo || {};
  const globalAdditionalInfo = additionalInfo || {};
  
  // For existing quotes, use the quote's additionalInfo; for new quotes, use global store
  const isExistingQuote = quotes.some(q => q.id === quote.id);
  const effectiveAdditionalInfo = isExistingQuote ? quoteAdditionalInfo : globalAdditionalInfo;

  // Auto-map and send main invoice data to QuoteTable on mount or when quote changes
  useEffect(() => {
    if (!quote) return;
    if (hasAddedQuote.current === quoteId) return;
    if (!editTo.company || editTo.company === 'Sample Client Company') return;
    
    // Helper functions to calculate type/quantity strings
    function getTypeQuantityString(rows: any[], typeKey: string) {
      const counts: Record<string, number> = {};
      rows.forEach(row => {
        const type = row[typeKey];
        // Only process actual container types and truck types, not weight/volume items
        if (type && type !== 'Volume' && type !== 'Weight') {
          // Ensure we're counting unique types properly
          const existingCount = counts[type] || 0;
          const rowQty = Number(row.qty) || 1;
          counts[type] = existingCount + rowQty;
        }
      });
      return Object.entries(counts).map(([type, qty]) => `${qty} x ${type}`);
    }

    // Get mode to determine proper formatting
    const modeLabel = quote.modeLabel || quote.mode || '';
    const mode = modeLabel.toUpperCase();
    
    // Compute values for each mode
    const fclContainerTypes = getTypeQuantityString(tableRows, 'item');
    const ftlTruckTypes = getTypeQuantityString(tableRows, 'truckType');
    
    // For LCL/AIR/LTL, show both weight and volume if present
    const weight = effectiveAdditionalInfo.lclWeight || selectedQuoteDetails?.lclWeight || quote.lclWeight || '';
    const volume = effectiveAdditionalInfo.lclVolume || selectedQuoteDetails?.lclVolume || quote.lclVolume || '';
    let lclWeightVolume = '';
    if (weight && volume) {
      lclWeightVolume = `${weight} kg / ${volume} cbm`;
    } else if (weight) {
      lclWeightVolume = `${weight} kg`;
    } else if (volume) {
      lclWeightVolume = `${volume} cbm`;
    }

    // Create details field for ALL tab based on mode
    let detailsField = [];
    if (mode.includes('SEA') && mode.includes('FCL')) {
      detailsField = [...fclContainerTypes];
    } else if (mode.includes('LAND') && mode.includes('FTL')) {
      detailsField = [...ftlTruckTypes];
    } else if (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL')) {
      detailsField = lclWeightVolume ? [lclWeightVolume] : [];
    } else {
      // For 'ALL' tab, show only the mode-specific information (no mixing)
      if (mode.includes('SEA') && mode.includes('FCL')) {
        detailsField = [...fclContainerTypes];
      } else if (mode.includes('LAND') && mode.includes('FTL')) {
        detailsField = [...ftlTruckTypes];
      } else if (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL')) {
        detailsField = lclWeightVolume ? [lclWeightVolume] : [];
      } else {
        // Fallback: show container types if available, otherwise weight/volume
        detailsField = fclContainerTypes.length > 0 ? [...fclContainerTypes] : (lclWeightVolume ? [lclWeightVolume] : []);
      }
    }

    const mappedQuote = {
      id: quoteId,
      lane: `${quote.origin} - ${quote.destination}`,
      mode: (() => {
        // Use the detected mode from the quote
        if (modeLabel) {
          const detectedMode = modeLabel.toUpperCase();
          if (detectedMode.includes('SEA') && detectedMode.includes('FCL')) return 'SEA FCL';
          if (detectedMode.includes('SEA') && detectedMode.includes('LCL')) return 'SEA LCL';
          if (detectedMode.includes('AIR')) return 'AIR LCL';
          if (detectedMode.includes('LAND') && detectedMode.includes('FTL')) return 'LAND FTL';
          if (detectedMode.includes('LAND') && detectedMode.includes('LTL')) return 'LAND LTL';
          return detectedMode;
        }
        
        // Fallback logic if modeLabel is not available
        const fallbackLabel = (quote.mode || '').toUpperCase();
        if (fallbackLabel.includes('SEA') && fallbackLabel.includes('FCL')) return 'SEA FCL';
        if (fallbackLabel.includes('SEA') && fallbackLabel.includes('LCL')) return 'SEA LCL';
        if (fallbackLabel.includes('AIR')) return 'AIR LCL';
        if (fallbackLabel.includes('LAND') && fallbackLabel.includes('FTL')) return 'LAND FTL';
        if (fallbackLabel.includes('LAND') && fallbackLabel.includes('LTL')) return 'LAND LTL';
        return fallbackLabel || 'FCL';
      })() as import('../../../../store/forwarderquote').Quote['mode'],
      containertype: fclContainerTypes, // All container types and quantities for FCL
      truckType: ftlTruckTypes,        // All truck types and quantities for FTL
      weightVolume: lclWeightVolume ? [lclWeightVolume] : [],   // Weight/volume for LCL, AIR, LTL
      currency: quote.currency || '',
      baseRate: Number(quote.tableRows?.[0]?.baseRate) || 0,
      price: totalAmount?.toString() || '',
      transitTime: quote.transitTime || '',
      provider: quote.provider || '',
      validity: quote.validUntil || '',
      status: 'draft' as 'draft',
      origin: quote.origin || '',
      destination: quote.destination || '',
      incoterms: effectiveAdditionalInfo.incoterm || quote.incoterms || '',
      remark: quote.remark || '',
      serviceType: quote.serviceType || '',
      transitPort: quote.transitPort || '',
      client: editTo.company || quote.client || '',
      isTariff: effectiveAdditionalInfo.isTariff ?? quote.isTariff ?? false,
      profit: quote.profit || '',
      createdBy: quote.createdBy || '',
      createdDate: quote.createdDate || '',
      notes: effectiveAdditionalInfo.note || quote.notes || '',
      details: detailsField || quote.details || [],
      // Preserve weight/volume data
      lclWeight: effectiveAdditionalInfo.lclWeight || selectedQuoteDetails?.lclWeight || quote.lclWeight || '',
      lclVolume: effectiveAdditionalInfo.lclVolume || selectedQuoteDetails?.lclVolume || quote.lclVolume || '',
      // Expanded fields for invoice:
      from: quote.from || {
        company: user?.companyName || '',
        address: '', phone: '', preparedBy: user?.fullName || '', mobile: '', email: user?.email || '', contact: ''
      },
      to: quote.to || {
        company: editTo.company || '', address: editTo.address || '', phone: editTo.phone || '', contact: editTo.contact || ''
      },
      tableRows: quote.tableRows || [],
      additionalInfo: effectiveAdditionalInfo,
      companyBranch: quote.companyBranch || '',
      companyName: quote.companyName || user?.companyName || '',
      companyLogo: quote.companyLogo || quote.logo || '',
      shipmentType: shipmentType || quote.shipmentType || '',
      shipmentTypeDescription: shipmentTypeDescription || quote.shipmentTypeDescription || '',
      validUntil: quote.validUntil || '',
      originAirport: quote.originAirport || '',
      destinationAirport: quote.destinationAirport || ''
    };

    setCurrentDraftQuote(mappedQuote);
    hasAddedQuote.current = quoteId;
  }, [quoteId, quote, editTo.company]);

  // On final submission (e.g., when user clicks submit/finalize):
  // addQuote(currentDraftQuote); clearCurrentDraftQuote();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!currentDraftQuote) {
      setLoadingDraft(true);
      timeout = setTimeout(() => {
        if (!currentDraftQuote) {
          router.replace('/quotes/list');
        }
      }, 1000); // Wait 1 second for draft to be set
    } else {
      setLoadingDraft(false);
    }
    return () => clearTimeout(timeout);
  }, [currentDraftQuote]);

  const isAlreadySubmitted = quotes.some(q => q.id === currentDraftQuote?.id);

  if (loadingDraft) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        <span className="ml-4 text-gray-500 text-lg">Loading invoice...</span>
      </div>
    );
  }

  return (
    <>
      {/* Button Row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {!isEditing ? (
            <>
            <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center gap-2" onClick={handleEdit}>
              <Edit className="w-4 h-4" /> Edit
            </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#FFA726] text-white font-medium hover:bg-[#fb8c00] transition-colors flex items-center gap-2"
                onClick={() => {
                  if (!isAlreadySubmitted && currentDraftQuote) {
                    const formattedQuote = formatQuoteForTable(
                      currentDraftQuote,
                      user,
                      selectedQuoteDetails,
                      editAdditionalInfo,
                      editFrom,
                      editTo,
                      editRemark,
                      totalAmount
                    );
                    addQuote(formattedQuote);
                  }
                  router.push('/quotes/list');
                }}
                title={isAlreadySubmitted ? 'This quote has already been submitted.' : 'Submit this quote'}
              >
                Submit
              </button>
              <button className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" /> Send
              </button>
            </>
          ) : (
            <>
              <button className="px-4 py-2 rounded-lg bg-[#007bff] text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2" onClick={handleSave}>
                Save
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center gap-2" onClick={handleCancel}>
                Cancel
              </button>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-[#007bff] text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Shipment
          </button>
          <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-8 mt-8">
        {/* Header */}
        <div className="flex flex-row justify-between items-start border-b pb-6 mb-6 gap-6">
          {/* Left: From/To stacked */}
          <div className="flex flex-col gap-6 flex-1 max-w-2xl">
            <div className="flex flex-col gap-3">
              <div className="font-semibold text-gray-900 text-md mb-1">From:</div>
              {!isEditing ? (
                <>
                  <div className="text-xs text-gray-700 font-bold">{editFrom.company}</div>
                  <div className="text-xs text-gray-700">Address: {editFrom.address}</div>
                  <div className="text-xs text-gray-700">Phone: {editFrom.phone}</div>
                  <div className="text-xs text-gray-700">Prepared By: {editFrom.preparedBy}</div>
                  <div className="text-xs text-gray-700">Mobile: {editFrom.mobile}</div>
                  <div className="text-xs text-gray-700">Email: {editFrom.email}</div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-xs text-gray-500 w-28">Company Name</label>
                    <input className="text-xs text-gray-700 font-bold border rounded px-2 py-1 flex-1" value={editFrom.company} onChange={e => setEditFrom(f => ({ ...f, company: e.target.value }))} />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-xs text-gray-500 w-28">Address</label>
                    <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editFrom.address} onChange={e => setEditFrom(f => ({ ...f, address: e.target.value }))} />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-xs text-gray-500 w-28">Phone</label>
                    <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editFrom.phone} onChange={e => setEditFrom(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-xs text-gray-500 w-28">Prepared By</label>
                    <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editFrom.preparedBy} onChange={e => setEditFrom(f => ({ ...f, preparedBy: e.target.value }))} />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-xs text-gray-500 w-28">Mobile</label>
                    <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editFrom.mobile} onChange={e => setEditFrom(f => ({ ...f, mobile: e.target.value }))} />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-xs text-gray-500 w-28">Email</label>
                    <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editFrom.email} onChange={e => setEditFrom(f => ({ ...f, email: e.target.value }))} />
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <div className="font-semibold text-gray-900 text-md mb-1">To:</div>
              {!isEditing ? (
                <>
                  <div className="text-xs text-gray-700 font-bold">{editTo.company}</div>
                  <div className="text-xs text-gray-700">Address: {editTo.address}</div>
                  <div className="text-xs text-gray-700">Phone: {editTo.phone}</div>
                  <div className="text-xs text-gray-700">Contact Person: {editTo.contact}</div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-xs text-gray-500 w-28">Company Name</label>
                    <input className="text-xs text-gray-700 font-bold border rounded px-2 py-1 flex-1" value={editTo.company} onChange={e => setEditTo(t => ({ ...t, company: e.target.value }))} />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-xs text-gray-500 w-28">Address</label>
                    <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editTo.address} onChange={e => setEditTo(t => ({ ...t, address: e.target.value }))} />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-xs text-gray-500 w-28">Phone</label>
                    <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editTo.phone} onChange={e => setEditTo(t => ({ ...t, phone: e.target.value }))} />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-xs text-gray-500 w-28">Contact Person</label>
                    <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editTo.contact} onChange={e => setEditTo(t => ({ ...t, contact: e.target.value }))} />
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Right: Logo and Quotation */}
          <div className="flex flex-col gap-3 items-end">
            <div className="p-8 border border-gray-200 rounded-lg shadow-xs flex flex-col items-center justify-center w-full mt-8">
              {quote.companyLogo ? (
                <img src={quote.companyLogo} alt="Logo" className="w-32 h-16 object-contain mx-auto" />
              ) : quote.logo ? (
              <img src={quote.logo} alt="Logo" className="w-32 h-16 object-contain mx-auto" />
              ) : (
                <div className="w-32 h-16 flex items-center justify-center text-gray-400 text-xs">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-1 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-xs">Logo</span>
                    </div>
                    <span className="text-gray-500 text-xs">Logo</span>
                  </div>
                </div>
              )}
            </div>
            <div className="text-3xl text-gray-900 font-semibold uppercase mt-2 text-right w-full">Quotation</div>
            {isEditing ? (
              <div className="w-full flex flex-col items-end mt-2">
                <label className="text-xs text-gray-500 mb-1">Provider</label>
                <input
                  className="border border-gray-700 rounded px-2 py-1 text-xs text-gray-900 w-50 text-right"
                  value={editQuote.provider}
                  onChange={e => setEditQuote(prev => ({ ...prev, provider: e.target.value }))}
                  placeholder="e.g. MAERSK"
                />
              </div>
            ) : (
              <div className="w-full flex flex-col items-end mt-2">
                <span className="text-xs text-gray-700 font-semibold">{editQuote.provider || '-'}</span>
              </div>
            )}
            <div className="text-md text-gray-700 font-semibold mt-1 text-right w-full">{quote.provider}</div>
            <div className="text-xs text-gray-600 text-right w-full">Created on: <span className="font-medium text-gray-900">{createdOn}</span></div>
            <div className="text-xs text-gray-600 text-right w-full">Valid until: {!isEditing && !isManualQuotation ? (
              <span className="font-medium text-gray-900">{quote.validUntil}</span>
            ) : (
              <input
                type="date"
                className="border rounded px-2 py-1 text-xs"
                value={editQuote.validUntil}
                onChange={e => setEditQuote(prev => ({ ...prev, validUntil: e.target.value }))}
              />
            )}
            </div>
            <div className="text-xs text-gray-600 text-right w-full">Quote ID: <span className="font-medium text-gray-900">{quote.id}</span></div>
          </div>
        </div>

        {/* Combined Quote Details Section with border-b divider */}
        <div className="mb-8">
          <div className="font-semibold text-gray-900 mb-2 text-md">Quote Details</div>
          <div className="bg-white rounded-lg border p-4">
            {/* Location Details with border-b */}
            <div className="pb-4 mb-4 border-b">
              <div className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wider mb-2">Location Details</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-900">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Origin:</span>
                  {!isEditing && !isManualQuotation ? (
                    <span className="font-semibold">{quote.origin}</span>
                  ) : (
                    <input
                      className="border rounded px-2 py-1 text-xs w-32"
                      value={editQuote.origin}
                      onChange={e => setEditQuote(prev => ({ ...prev, origin: e.target.value }))}
                      placeholder="e.g. Singapore"
                    />
                  )}
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Destination:</span>
                  {!isEditing && !isManualQuotation ? (
                    <span className="font-semibold">{quote.destination}</span>
                  ) : (
                    <input
                      className="border rounded px-2 py-1 text-xs w-32"
                      value={editQuote.destination}
                      onChange={e => setEditQuote(prev => ({ ...prev, destination: e.target.value }))}
                      placeholder="e.g. Los Angeles"
                    />
                  )}
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Port of Loading:</span>
                  {!isEditing && !isManualQuotation ? (
                    <span className="font-semibold">{quote.origin}</span>
                  ) : (
                    <input
                      className="border rounded px-2 py-1 text-xs w-32"
                      value={editQuote.origin}
                      onChange={e => setEditQuote(prev => ({ ...prev, origin: e.target.value }))}
                      placeholder="e.g. Singapore Port"
                    />
                  )}
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Port of Discharge:</span>
                  {!isEditing && !isManualQuotation ? (
                    <span className="font-semibold">{quote.destination}</span>
                  ) : (
                    <input
                      className="border rounded px-2 py-1 text-xs w-32"
                      value={editQuote.destination}
                      onChange={e => setEditQuote(prev => ({ ...prev, destination: e.target.value }))}
                      placeholder="e.g. Los Angeles Port"
                    />
                  )}
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Port of Delivery:</span>
                  {!isEditing && !isManualQuotation ? (
                    <span className="font-semibold">{quote.destination}</span>
                  ) : (
                    <input
                      className="border rounded px-2 py-1 text-xs w-32"
                      value={editQuote.destination}
                      onChange={e => setEditQuote(prev => ({ ...prev, destination: e.target.value }))}
                      placeholder="e.g. Los Angeles Port"
                    />
                  )}
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Transit Port:</span>
                  {!isEditing && !isManualQuotation ? (
                    <span className="font-semibold">{quote.transitPort || '-'}</span>
                  ) : (
                    <input
                      className="border rounded px-2 py-1 text-xs w-32"
                      value={editQuote.transitPort}
                      onChange={e => setEditQuote(prev => ({ ...prev, transitPort: e.target.value }))}
                      placeholder="e.g. Yokohama"
                    />
                  )}
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Location Type:</span>
                  {!isEditing && !isManualQuotation ? (
                    <span className="font-semibold">{quote.serviceType || '-'}</span>
                  ) : (
                    <input
                      className="border rounded px-2 py-1 text-xs w-32"
                      value={editQuote.serviceType}
                      onChange={e => setEditQuote(prev => ({ ...prev, serviceType: e.target.value }))}
                      placeholder="e.g. Port to Port"
                    />
                  )}
                </div>
              </div>
            </div>
            {/* Additional Information */}
            <div>
              <div className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wider">Additional Information</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-900">
                {/* Shipment Type */}
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">Shipment Type:</span>
                  {!isEditing ? (
                    <span className="font-semibold">{quote.shipmentType || '-'}</span>
                  ) : (
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={editAdditionalInfo.shipmentType || quote.shipmentType || ''}
                      onChange={e => {
                        const value = e.target.value;
                        setEditAdditionalInfo((info: any) => ({
                          ...info,
                          shipmentType: value,
                          shipmentTypeDescription: value === 'Other' ? info.shipmentTypeDescription : '',
                        }));
                      }}
                    >
                      <option value="">Select</option>
                      <option value="Export">Export</option>
                      <option value="Import">Import</option>
                      <option value="Domestic">Domestic</option>
                      <option value="Other">Other</option>
                    </select>
                  )}
                </div>
                {/* Description (if Other) */}
                {((!isEditing && (quote.shipmentType === 'Other')) || (isEditing && (editAdditionalInfo.shipmentType === 'Other'))) && (
                  <div className="flex justify-between text-xs items-center">
                    <span className="text-gray-500">Description:</span>
                    {!isEditing ? (
                      <span className="font-semibold">{quote.shipmentTypeDescription || '-'}</span>
                    ) : (
                      <input
                        className="border rounded px-2 py-1 text-xs"
                        value={editAdditionalInfo.shipmentTypeDescription || ''}
                        onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, shipmentTypeDescription: e.target.value }))}
                      />
                    )}
                  </div>
                )}
                {/* Mode (read-only) */}
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">Mode:</span>
                  {!isEditing && !isManualQuotation ? (
                    <span className="font-semibold">{quote.mode || quote.additionalInfo?.shipmentMode || quote.modeLabel || '-'}</span>
                  ) : (
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={editQuote.mode}
                      onChange={e => {
                        const newModeLabel = e.target.value;
                        let newModeType: 'ocean' | 'air' | 'road' = 'ocean';
                        if (newModeLabel.includes('AIR')) newModeType = 'air';
                        else if (newModeLabel.includes('LAND')) newModeType = 'road';
                        else newModeType = 'ocean';
                        setEditQuote(prev => ({ ...prev, mode: newModeLabel }));
                        setSelectedQuoteDetails((details: any) => ({ ...details, mode: newModeType, modeLabel: newModeLabel }));
                        setCurrentDraftQuote({
                          ...currentDraftQuote,
                          mode: newModeType,
                          id: currentDraftQuote?.id || '',
                          lane: currentDraftQuote?.lane || '',
                          containertype: currentDraftQuote?.containertype || [],
                          currency: currentDraftQuote?.currency || 'USD',
                          baseRate: typeof currentDraftQuote?.baseRate === 'number' ? currentDraftQuote.baseRate : 0,
                          price: currentDraftQuote?.price || '',
                          transitTime: currentDraftQuote?.transitTime || '',
                          provider: currentDraftQuote?.provider || '',
                          validity: currentDraftQuote?.validity || '',
                          status: currentDraftQuote?.status || 'draft',
                          origin: currentDraftQuote?.origin || '',
                          destination: currentDraftQuote?.destination || '',
                          incoterms: currentDraftQuote?.incoterms || '',
                          remark: currentDraftQuote?.remark || '',
                          from: currentDraftQuote?.from || { company: '', address: '', phone: '', preparedBy: '', mobile: '', email: '' },
                          to: currentDraftQuote?.to || { company: '', address: '', phone: '', contact: '' },
                          tableRows: currentDraftQuote?.tableRows || [],
                          additionalInfo: currentDraftQuote?.additionalInfo || { shipmentType: '', cargoReadyDate: '', etd: '', incoterms: '', freightTerms: '', ofPriceFeedback: '', notes: '', companyBranch: '', commodities: '', isTariff: false },
                          // Do NOT reset any other fields
                        });
                      }}
                    >
                      <option value="">Select</option>
                      <option value="SEA FCL">SEA FCL</option>
                      <option value="SEA LCL">SEA LCL</option>
                      <option value="AIR LCL">AIR LCL</option>
                      <option value="LAND FTL">LAND FTL</option>
                      <option value="LAND LTL">LAND LTL</option>
                    </select>
                  )}
                </div>
                {/* Transit Time */}
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">Transit Time:</span>
                  {!isEditing && !isManualQuotation ? (
                    <span className="font-semibold">{quote.transitTime || '-'}</span>
                  ) : (
                    <input
                      className="border rounded px-2 py-1 text-xs"
                      value={editQuote.transitTime}
                      onChange={e => setEditQuote(prev => ({ ...prev, transitTime: e.target.value }))}
                      placeholder="e.g. 25 days"
                    />
                  )}
                </div>
                {/* Remark */}
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">Remark:</span>
                  {!isEditing ? (
                    <span className="font-semibold">{editRemark}</span>
                  ) : (
                    <input
                      className="border rounded px-2 py-1 text-xs"
                      value={editRemark || ''}
                      onChange={e => setEditRemark(e.target.value)}
                    />
                  )}
                </div>
                {/* Cargo Ready Date */}
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">Cargo Ready Date:</span>
                  {!isEditing ? (
                    <span className="font-semibold">{editAdditionalInfo.cargoReadyDate || '-'}</span>
                  ) : (
                    <input
                      type="date"
                      className="border rounded px-2 py-1 text-xs"
                      value={editAdditionalInfo.cargoReadyDate || ''}
                      onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, cargoReadyDate: e.target.value }))}
                    />
                  )}
                </div>
                {/* ETD */}
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">ETD:</span>
                  {!isEditing ? (
                    <span className="font-semibold">{editAdditionalInfo.etd || '-'}</span>
                  ) : (
                    <input
                      type="date"
                      className="border rounded px-2 py-1 text-xs"
                      value={editAdditionalInfo.etd || ''}
                      onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, etd: e.target.value }))}
                    />
                  )}
                </div>
                {/* Incoterms */}
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">Incoterms:</span>
                  {!isEditing ? (
                    <span className="font-semibold">{editAdditionalInfo.incoterm || '-'}</span>
                  ) : (
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={editAdditionalInfo.incoterm || ''}
                      onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, incoterm: e.target.value }))}
                    >
                      <option value="">Select</option>
                      <option value="FOB">FOB</option>
                      <option value="CIF">CIF</option>
                      <option value="EXW">EXW</option>
                      <option value="DAP">DAP</option>
                      <option value="DDP">DDP</option>
                    </select>
                  )}
                </div>
                {/* Freight Terms */}
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">Freight Terms:</span>
                  {!isEditing ? (
                    <span className="font-semibold">{editAdditionalInfo.freightTerm || '-'}</span>
                  ) : (
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={editAdditionalInfo.freightTerm || ''}
                      onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, freightTerm: e.target.value }))}
                    >
                      <option value="">Select</option>
                      <option value="Prepaid">Prepaid</option>
                      <option value="Collect">Collect</option>
                      <option value="Third Party">Third Party</option>
                    </select>
                  )}
                </div>
                {/* OF Price Feedback */}
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">OF Price Feedback:</span>
                  {!isEditing ? (
                    <span className="font-semibold">{editAdditionalInfo.ofPriceFeedback || '-'}</span>
                  ) : (
                    <input
                      className="border rounded px-2 py-1 text-xs"
                      value={editAdditionalInfo.ofPriceFeedback || ''}
                      onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, ofPriceFeedback: e.target.value }))}
                    />
                  )}
                </div>
                {/* Note */}
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">Note:</span>
                  {!isEditing ? (
                    <span className="font-semibold">{editAdditionalInfo.note || '-'}</span>
                  ) : (
                    <input
                      className="border rounded px-2 py-1 text-xs"
                      value={editAdditionalInfo.note || ''}
                      onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, note: e.target.value }))}
                    />
                  )}
                </div>
                {/* Company Branch */}
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">Company Branch:</span>
                  {!isEditing ? (
                    <span className="font-semibold">{editAdditionalInfo.companyBranch || '-'}</span>
                  ) : (
                    <input
                      className="border rounded px-2 py-1 text-xs"
                      value={editAdditionalInfo.companyBranch || ''}
                      onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, companyBranch: e.target.value }))}
                    />
                  )}
                </div>
                {/* Commodities */}
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">Commodities:</span>
                  {!isEditing ? (
                    <span className="font-semibold">{editAdditionalInfo.commodities || '-'}</span>
                  ) : (
                    <input
                      className="border rounded px-2 py-1 text-xs"
                      value={editAdditionalInfo.commodities || ''}
                      onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, commodities: e.target.value }))}
                    />
                  )}
                </div>
                {/* Is Tariff */}
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">Is Tariff:</span>
                  {!isEditing ? (
                    <span className="font-semibold">{editAdditionalInfo.isTariff === true || editAdditionalInfo.isTariff === 'Yes' ? 'Yes' : 'No'}</span>
                  ) : (
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={editAdditionalInfo.isTariff === true || editAdditionalInfo.isTariff === 'Yes' ? 'Yes' : 'No'}
                      onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, isTariff: e.target.value === 'Yes' ? true : false }))}
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Details Table - Redesigned with border and new columns */}
        <div className="mt-8 bg-white">
          <div className="font-semibold text-gray-900 mb-2 text-md">Quote detail</div>
          {(isManualQuotation || isEditing) && (
            <div className="mb-4 flex justify-between items-center">
              <button
                onClick={addTableRow}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Row
              </button>
            </div>
          )}
          <div className="overflow-x-auto rounded-lg px-0 pb-2 border border-gray-200 rounded-lg">
            <table className="min-w-full text-xs text-left border-0">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Charge Type</th>
                  <th className="px-4 py-3 font-semibold">Item Name</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Calculated by</th>
                  <th className="px-4 py-3 font-semibold text-right">Quantity</th>
                  <th className="px-4 py-3 font-semibold text-right">Price</th>
                  <th className="px-4 py-3 font-semibold text-right">Currency</th>
                  <th className="px-4 py-3 font-semibold text-right">Amount</th>
                  {(isManualQuotation || isEditing) && <th className="px-4 py-3 font-semibold text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="text-gray-900">
                {tableRows.map((row: any, idx: number) => (
                  <tr key={row.item + idx} className="border-b border-gray-200">
                    <td className="px-4 py-3">
                      {(isManualQuotation || isEditing) ? (
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1 text-xs"
                          value={row.chargeType || ''}
                          onChange={(e) => updateTableRow(idx, 'chargeType', e.target.value)}
                        />
                      ) : (
                        row.chargeType
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {(isManualQuotation || isEditing) ? (
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1 text-xs"
                          value={row.item || ''}
                          onChange={(e) => updateTableRow(idx, 'item', e.target.value)}
                        />
                      ) : (
                        row.item
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {(isManualQuotation || isEditing) ? (
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1 text-xs"
                          value={row.description || ''}
                          onChange={(e) => updateTableRow(idx, 'description', e.target.value)}
                        />
                      ) : (
                        row.description
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {(isManualQuotation || isEditing) ? (
                        <input
                          type="text"
                          className="w-full border rounded px-2 py-1 text-xs"
                          value={row.calculation || ''}
                          onChange={(e) => updateTableRow(idx, 'calculation', e.target.value)}
                        />
                      ) : (
                        row.calculation
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {(isManualQuotation || isEditing) ? (
                        <input
                          type="number"
                          className="w-20 border rounded px-2 py-1 text-xs text-right"
                          value={row.qty || 1}
                          onChange={(e) => updateTableRow(idx, 'qty', parseFloat(e.target.value) || 0)}
                        />
                      ) : (
                        row.qty
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {(isManualQuotation || isEditing) ? (
                        <input
                          type="number"
                          step="0.01"
                          className="w-20 border rounded px-2 py-1 text-xs text-right"
                          value={row.baseRate || 0}
                          onChange={(e) => updateTableRow(idx, 'baseRate', parseFloat(e.target.value) || 0)}
                        />
                      ) : (
                        row.baseRate
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {(isManualQuotation || isEditing) ? (
                        <select
                          className="w-20 border rounded px-2 py-1 text-xs text-right"
                          value={row.currency || 'USD'}
                          onChange={(e) => {
                            const newCurrency = e.target.value;
                            // Update currency for all rows
                            const updatedTableRows = tableRows.map((r: any) => ({ ...r, currency: newCurrency }));
                            setSelectedQuoteDetails({
                              ...selectedQuoteDetails,
                              tableRows: updatedTableRows,
                              currency: newCurrency,
                            });
                            setCurrentDraftQuote({
                              ...currentDraftQuote,
                              currency: newCurrency,
                              id: currentDraftQuote?.id || '',
                              lane: currentDraftQuote?.lane || '',
                              mode: currentDraftQuote?.mode || 'ocean',
                              containertype: currentDraftQuote?.containertype || [],
                              truckType: currentDraftQuote?.truckType || [],
                              weightVolume: currentDraftQuote?.weightVolume || [],
                              baseRate: typeof currentDraftQuote?.baseRate === 'number' ? currentDraftQuote.baseRate : 0,
                              price: currentDraftQuote?.price || '',
                              transitTime: currentDraftQuote?.transitTime || '',
                              provider: currentDraftQuote?.provider || '',
                              validity: currentDraftQuote?.validity || '',
                              status: currentDraftQuote?.status || 'draft',
                              origin: currentDraftQuote?.origin || '',
                              destination: currentDraftQuote?.destination || '',
                              transitPort: currentDraftQuote?.transitPort || '',
                              serviceType: currentDraftQuote?.serviceType || '',
                              incoterms: currentDraftQuote?.incoterms || '',
                              remark: currentDraftQuote?.remark || '',
                              from: currentDraftQuote?.from || { company: '', address: '', phone: '', preparedBy: '', mobile: '', email: '' },
                              to: currentDraftQuote?.to || { company: '', address: '', phone: '', contact: '' },
                              tableRows: currentDraftQuote?.tableRows || [],
                              additionalInfo: currentDraftQuote?.additionalInfo || { shipmentType: '', cargoReadyDate: '', etd: '', incoterms: '', freightTerms: '', ofPriceFeedback: '', notes: '', companyBranch: '', commodities: '', isTariff: false },
                            });
                          }}
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="SGD">SGD</option>
                        </select>
                      ) : (
                        row.currency
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {(row.qty * row.baseRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    {(isManualQuotation || isEditing) && (
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => removeTableRow(idx)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Additional Cost Section for Manual Quotations */}
            {(isManualQuotation || isEditing) && (
              <div className="mt-4 px-4 py-3 border-t border-gray-200">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm font-medium text-gray-700">Additional Cost:</span>
                  <input
                    type="number"
                    step="0.01"
                    className="w-32 border rounded px-2 py-1 text-xs"
                    placeholder="0.00"
                    value={additionalCost}
                    onChange={(e) => setAdditionalCost(parseFloat(e.target.value) || 0)}
                  />
                  <input
                    type="text"
                    className="flex-1 border rounded px-2 py-1 text-xs"
                    placeholder="Description (optional)"
                    value={additionalCostDescription}
                    onChange={(e) => setAdditionalCostDescription(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {/* Subtotal and Total Rows */}
            <div className="flex flex-col items-end mt-2 px-4 text-sm">
              <div className="flex w-full justify-end mb-2">
                <div className="w-32 text-right font-semibold text-gray-700">SUB-TOTAL :</div>
                <div className="w-16 text-right font-semibold text-gray-700">{currency}</div>
                <div className="w-24 text-right font-semibold text-gray-900">{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
              </div>
              {(isManualQuotation || isEditing) && additionalCost > 0 && (
                <div className="flex w-full justify-end mb-2">
                  <div className="w-32 text-right font-semibold text-gray-700">ADDITIONAL :</div>
                  <div className="w-16 text-right font-semibold text-gray-700">{currency}</div>
                  <div className="w-24 text-right font-semibold text-gray-900">{additionalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              )}
              <div className="flex w-full justify-end border-t border-gray-200 pt-2">
                <div className="w-32 text-right font-bold text-gray-900">TOTAL :</div>
                <div className="w-16 text-right font-bold text-gray-900">{currency}</div>
                <div className="w-24 text-right font-bold text-gray-900">{(totalAmount + additionalCost).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Invoice Footer */}
        <div className="mt-8 text-center text-xs text-gray-500 border-t pt-4">
          <div>&copy; {new Date().getFullYear()} FreightLynk. All rights reserved.</div>
          <div className="mt-2">Terms & Conditions: All rates are subject to change without prior notice. Quotation is valid until the date specified above. Please refer to our website for full terms.</div>
          <div className="mt-2">Payment is due within 14 days of invoice date unless otherwise agreed in writing. Late payments may incur additional charges.</div>
          <div className="mt-2">For questions or support, contact us at support@freightlynk.com.</div>
        </div>
      </div>
    </>
  );
};

export default QuoteInvoice;


