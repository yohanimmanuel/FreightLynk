import React, { useState, useEffect, useRef } from 'react';
import { useQuoteSearchStore, QuoteSearchResult } from '../../../../store/quotesearchdata';
import { useAuthStore } from '../../../../store/authStore';
import { Edit, Send, Plus, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuoteRateStore } from '../../../../store/forwarderquote';
import { partnerDirectory } from '../../../../store/partnerCompanyData';
import QuoteInvoiceHeader from './QuoteInvoiceHeader';
import QuoteInvoiceDetails from './QuoteInvoiceDetails';
import QuoteInvoiceDetail from './QuoteInvoiceTableDetail';

// Utility to generate a unique Quote ID
function generateQuoteId() {
  const now = new Date();
  return `QT-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

// Utility to format date as YYYY-MM-DD
function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
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

  // Add local editTableRows state
  const [editTableRows, setEditTableRows] = useState<Array<any>>(quote.tableRows ? JSON.parse(JSON.stringify(quote.tableRows)) : []);

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
    
    const updatedTableRows = [...editTableRows, newRow];
    setEditTableRows(updatedTableRows);
  };

  const removeTableRow = (index: number) => {
    const updatedTableRows = editTableRows.filter((_: any, i: number) => i !== index);
    setEditTableRows(updatedTableRows);
  };

  const updateTableRow = (index: number, field: string, value: any) => {
    const updatedTableRows = [...editTableRows];
    updatedTableRows[index] = { ...updatedTableRows[index], [field]: value };
    
    // Recalculate amount if qty or baseRate changed
    if (field === 'qty' || field === 'baseRate') {
      const qty = field === 'qty' ? value : updatedTableRows[index].qty;
      const baseRate = field === 'baseRate' ? value : updatedTableRows[index].baseRate;
      updatedTableRows[index].amount = qty * baseRate;
    }
    
    setEditTableRows(updatedTableRows);
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
  // 1. Fix edit state initialization in handleEdit
  const handleEdit = () => {
    setEditFrom({
      company: quote.from?.company || user?.companyName || 'Demo Company (FreightLynk LLC)',
      address: quote.from?.address || '1000 20th Street NW, Suite 400, Washington D.C. 20036',
      phone: quote.from?.phone || '(028) 1208 281055',
      preparedBy: quote.from?.preparedBy || user?.fullName || 'Demo User',
      mobile: quote.from?.mobile || '(028) 1208 281055',
      email: quote.from?.email || user?.email || 'demo123@gmail.com',
    });
    setEditTo(quote.to || { company: '', address: '', phone: '', contact: '' });
    setEditRemark(quote.remark || '');
    setEditAdditionalInfo({ ...quote.additionalInfo });
    setEditQuote({
      origin: quote.origin || '',
      destination: quote.destination || '',
      transitPort: quote.transitPort || '',
      serviceType: quote.serviceType || '',
      mode: quote.mode || '',
      transitTime: quote.transitTime || '',
      validUntil: quote.validUntil || '',
      provider: quote.provider || '',
    });
    setEditTableRows(quote.tableRows ? JSON.parse(JSON.stringify(quote.tableRows)) : []);
    setOriginalState({
      from: { ...editFrom },
      to: { ...editTo },
      remark: editRemark,
      additionalInfo: { ...editAdditionalInfo },
      tableRows: quote.tableRows ? JSON.parse(JSON.stringify(quote.tableRows)) : [],
    });
    setIsEditing(true);
  };
  const handleCancel = () => {
    if (originalState) {
      setEditFrom(originalState.from);
      setEditTo(originalState.to);
      setEditRemark(originalState.remark);
      setEditAdditionalInfo(originalState.additionalInfo);
      setEditTableRows(originalState.tableRows ? JSON.parse(JSON.stringify(originalState.tableRows)) : []);
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
    const containerTypes = Array.from(new Set((editTableRows || []).map((row: any) => row.item).filter(Boolean)));
    const truckTypes = Array.from(new Set((editTableRows || []).map((row: any) => row.truckType).filter(Boolean)));
    const weightVolumes = Array.from(new Set((editTableRows || []).map((row: any) => row.weightVolume).filter(Boolean)));
    const details = [
      ...containerTypes,
      ...truckTypes,
      ...weightVolumes
    ].filter(Boolean).join(', ');
    const totalAmount = (editTableRows || []).reduce((sum: number, row: any) => sum + (typeof row.amount === 'number' ? row.amount : 0), 0);
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
    let weightVolumeBadge = '';
    if (isManualQuotation && (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL'))) {
      const desc = tableRows[0]?.description || '';
      // Try to extract 'X kg' and 'Y cbm' from the description
      const weightMatch = desc.match(/(\d+(?:\.\d+)?)\s*kg/i);
      const volumeMatch = desc.match(/(\d+(?:\.\d+)?)\s*cbm/i);
      if (weightMatch) weightVolumeBadge = `${weightMatch[1]} kg`;
      if (volumeMatch) weightVolumeBadge = `${weightVolumeBadge} / ${volumeMatch[1]} cbm`;
    } else {
    const weight = editAdditionalInfo.lclWeight || quote.lclWeight || '';
    const volume = editAdditionalInfo.lclVolume || quote.lclVolume || '';
    if (weight && volume) {
      weightVolumeBadge = `${weight} kg / ${volume} cbm`;
    } else if (weight) {
      weightVolumeBadge = `${weight} kg`;
    } else if (volume) {
      weightVolumeBadge = `${volume} cbm`;
      }
    }

    // Create details badges based on mode
    let detailsBadges = [];
    if (isManualQuotation && (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL'))) {
      // Manual quoting: show only the description of the first table row as the badge
      const descBadge = tableRows[0]?.description?.trim();
      detailsBadges = descBadge ? [descBadge] : [];
    } else if (mode.includes('SEA') && mode.includes('FCL')) {
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

    // For manual quoting and LCL/AIR/LTL, extract lclWeight/lclVolume from first table row description
    let lclWeight = '';
    let lclVolume = '';
    if (isManualQuotation && (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL'))) {
      const desc = tableRows[0]?.description || '';
      // Try to extract 'X kg' and 'Y cbm' from the description
      const weightMatch = desc.match(/(\d+(?:\.\d+)?)\s*kg/i);
      const volumeMatch = desc.match(/(\d+(?:\.\d+)?)\s*cbm/i);
      if (weightMatch) lclWeight = weightMatch[1];
      if (volumeMatch) lclVolume = volumeMatch[1];
    } else {
      lclWeight = editAdditionalInfo.lclWeight || quote.lclWeight || '';
      lclVolume = editAdditionalInfo.lclVolume || quote.lclVolume || '';
    }

    // After extracting lclWeight and lclVolume, recompute detailsBadges for manual quoting LCL/AIR/LTL
    if (isManualQuotation && (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL'))) {
      let badge = '';
      if (lclWeight && lclVolume) badge = `${lclWeight} kg / ${lclVolume} cbm`;
      else if (lclWeight) badge = `${lclWeight} kg`;
      else if (lclVolume) badge = `${lclVolume} cbm`;
      detailsBadges = badge ? [badge] : [];
    }

    // Parse lclWeight and lclVolume from the first row's description
    let lclWeightParsed = '';
    let lclVolumeParsed = '';
    if (editTableRows.length > 0 && editTableRows[0].description) {
      const desc = editTableRows[0].description;
      const weightMatch = desc.match(/(\d+(?:\.\d+)?)\s*kg/i);
      const volumeMatch = desc.match(/(\d+(?:\.\d+)?)\s*cbm/i);
      if (weightMatch) lclWeightParsed = weightMatch[1];
      if (volumeMatch) lclVolumeParsed = volumeMatch[1];
    }
    let badge = '';
    if (lclWeightParsed && lclVolumeParsed) badge = `${lclWeightParsed} kg / ${lclVolumeParsed} cbm`;
    else if (lclWeightParsed) badge = `${lclWeightParsed} kg`;
    else if (lclVolumeParsed) badge = `${lclVolumeParsed} cbm`;

    // Unified badge logic for all modes
    let detailsField: string[] = [];
    let truckTypeField: string[] = [];
    let containerTypeField: string[] = [];
    let weightVolumeField: string[] = [];
    if (mode.includes('SEA') && mode.includes('FCL')) {
      detailsField = [...containerTypeBadges];
      containerTypeField = [...containerTypeBadges];
      truckTypeField = [];
      weightVolumeField = [];
    } else if (mode.includes('LAND') && mode.includes('FTL')) {
      detailsField = [...truckTypeBadges];
      truckTypeField = [...truckTypeBadges];
      containerTypeField = [];
      weightVolumeField = [];
    } else if (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL')) {
      detailsField = weightVolumeBadge ? [weightVolumeBadge] : [];
      weightVolumeField = weightVolumeBadge ? [weightVolumeBadge] : [];
      containerTypeField = [];
      truckTypeField = [];
    } else {
      detailsField = containerTypeBadges.length > 0 ? [...containerTypeBadges] : (weightVolumeBadge ? [weightVolumeBadge] : []);
      containerTypeField = containerTypeBadges.length > 0 ? [...containerTypeBadges] : [];
      truckTypeField = truckTypeBadges.length > 0 ? [...truckTypeBadges] : [];
      weightVolumeField = weightVolumeBadge ? [weightVolumeBadge] : [];
    }

    // Debug log to confirm fields
    console.log('QUOTE SAVE DEBUG:', {
      id: quote.id,
      mode,
      detailsField,
      truckTypeField,
      containerTypeField,
      weightVolumeField
    });

    const updatedQuote = {
      ...quote, // spread first
      provider: editQuote.provider || '', // then override
      from: { ...safeFrom },
      to: { ...safeTo },
      remark: editRemark,
      additionalInfo: cleanedAdditionalInfo,
      shipmentType: cleanedAdditionalInfo.shipmentType || quote.shipmentType || '',
      shipmentTypeDescription,
      // Use parsed lclWeight and lclVolume
      lclWeight: lclWeightParsed,
      lclVolume: lclVolumeParsed,
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
      modeLabel: editQuote.mode || selectedQuoteDetails?.modeLabel || quote.modeLabel || quote.mode || '',
      // Use only the new fields
      details: detailsField,
      containertype: containerTypeField,
      truckType: truckTypeField,
      weightVolume: weightVolumeField,
      status: quote.status || 'draft',
      price: finalTotalAmount?.toString() || quote.price || '',
      createdBy: user?.fullName || quote.createdBy || '',
      incoterms: cleanedAdditionalInfo.incoterm || quote.incoterms || '',
      notes: cleanedAdditionalInfo.note || quote.notes || '',
      tableRows: editTableRows,
    };
    setCurrentDraftQuote(updatedQuote);
    // Only call addQuote(updatedQuote) in the submit handler, not here.
    setIsEditing(false);
    setSelectedQuoteDetails(updatedQuote);
    // Fix: update quotes array directly if setQuotes does not accept a function
    const prevQuotes = quotes || [];
    const idx = prevQuotes.findIndex((q: any) => q.id === updatedQuote.id);
    if (idx !== -1) {
      const newQuotes = [...prevQuotes];
      newQuotes[idx] = updatedQuote;
      setQuotes(newQuotes);
    } else {
      setQuotes([updatedQuote, ...prevQuotes]);
    }
  };

  // 2. Fix state reset on quote change
  useEffect(() => {
    setEditFrom({
      company: quote.from?.company || user?.companyName || 'Demo Company (FreightLynk LLC)',
      address: quote.from?.address || '1000 20th Street NW, Suite 400, Washington D.C. 20036',
      phone: quote.from?.phone || '(028) 1208 281055',
      preparedBy: quote.from?.preparedBy || user?.fullName || 'Demo User',
      mobile: quote.from?.mobile || '(028) 1208 281055',
      email: quote.from?.email || user?.email || 'demo123@gmail.com',
    });
    setEditTo(quote.to || { company: '', address: '', phone: '', contact: '' });
    setEditRemark(quote.remark || '');
    setEditAdditionalInfo({ ...quote.additionalInfo });
    setEditQuote({
      origin: quote.origin || '',
      destination: quote.destination || '',
      transitPort: quote.transitPort || '',
      serviceType: quote.serviceType || '',
      mode: quote.mode || '',
      transitTime: quote.transitTime || '',
      validUntil: quote.validUntil || '',
      provider: quote.provider || '',
    });
  }, [quote?.id]);

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
      mode: quote.mode || quote.modeLabel || '',
      modeLabel: quote.modeLabel || quote.mode || '',
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
                  // Build the updated quote object directly
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
                  const isOther = editAdditionalInfo.shipmentType === 'Other';
                  const shipmentTypeDescription = isOther ? editAdditionalInfo.shipmentTypeDescription : '';
                  const cleanedAdditionalInfo = {
                    ...editAdditionalInfo,
                    shipmentTypeDescription,
                  };
                  let tableRows = quote.tableRows;
                  if (!Array.isArray(tableRows) || typeof tableRows[0] !== 'object') {
                    tableRows = Array.isArray(selectedQuoteDetails?.tableRows) && typeof selectedQuoteDetails.tableRows[0] === 'object'
                      ? selectedQuoteDetails.tableRows
                      : [];
                  }
                  const containerTypes = Array.from(new Set((tableRows || []).map((row: any) => row.item).filter(Boolean)));
                  const truckTypes = Array.from(new Set((tableRows || []).map((row: any) => row.truckType).filter(Boolean)));
                  const weightVolumes = Array.from(new Set((tableRows || []).map((row: any) => row.weightVolume).filter(Boolean)));
                  const details = [
                    ...containerTypes,
                    ...truckTypes,
                    ...weightVolumes
                  ].filter(Boolean).join(', ');
                  const totalAmount = (tableRows || []).reduce((sum: number, row: any) => sum + (typeof row.amount === 'number' ? row.amount : 0), 0);
                  const finalTotalAmount = totalAmount + (isManualQuotation ? additionalCost : 0);
                  function getTypeQuantityString(rows: any[], typeKey: string) {
                    const counts: Record<string, number> = {};
                    rows.forEach(row => {
                      const type = row[typeKey];
                      if (type && type !== 'Volume' && type !== 'Weight') {
                        const existingCount = counts[type] || 0;
                        const rowQty = Number(row.qty) || 1;
                        counts[type] = existingCount + rowQty;
                      }
                    });
                    return Object.entries(counts).map(([type, qty]) => `${qty} x ${type}`);
                  }
                  const modeLabel = selectedQuoteDetails?.modeLabel || quote.mode || '';
                  const mode = modeLabel.toUpperCase();
                  const containerTypeBadges = getTypeQuantityString(tableRows, 'item');
                  const truckTypeBadges = getTypeQuantityString(tableRows, 'truckType');
                  let weightVolumeBadge = '';
                  if (isManualQuotation && (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL'))) {
                    const desc = tableRows[0]?.description || '';
                    // Try to extract 'X kg' and 'Y cbm' from the description
                    const weightMatch = desc.match(/(\d+(?:\.\d+)?)\s*kg/i);
                    const volumeMatch = desc.match(/(\d+(?:\.\d+)?)\s*cbm/i);
                    if (weightMatch) weightVolumeBadge = `${weightMatch[1]} kg`;
                    if (volumeMatch) weightVolumeBadge = `${weightVolumeBadge} / ${volumeMatch[1]} cbm`;
                  } else {
                  const weight = editAdditionalInfo.lclWeight || quote.lclWeight || '';
                  const volume = editAdditionalInfo.lclVolume || quote.lclVolume || '';
                  if (weight && volume) {
                    weightVolumeBadge = `${weight} kg / ${volume} cbm`;
                  } else if (weight) {
                    weightVolumeBadge = `${weight} kg`;
                  } else if (volume) {
                    weightVolumeBadge = `${volume} cbm`;
                    }
                  }
                  let detailsBadges = [];
                  if (mode.includes('SEA') && mode.includes('FCL')) {
                    detailsBadges = [...containerTypeBadges];
                  } else if (mode.includes('LAND') && mode.includes('FTL')) {
                    detailsBadges = [...truckTypeBadges];
                  } else if (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL')) {
                    detailsBadges = weightVolumeBadge ? [weightVolumeBadge] : [];
                  } else {
                    if (mode.includes('SEA') && mode.includes('FCL')) {
                      detailsBadges = [...containerTypeBadges];
                    } else if (mode.includes('LAND') && mode.includes('FTL')) {
                      detailsBadges = [...truckTypeBadges];
                    } else if (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL')) {
                      detailsBadges = weightVolumeBadge ? [weightVolumeBadge] : [];
                    } else {
                      detailsBadges = containerTypeBadges.length > 0 ? [...containerTypeBadges] : (weightVolumeBadge ? [weightVolumeBadge] : []);
                    }
                  }
                  const updatedQuote = {
                    ...quote, // spread first
                    provider: editQuote.provider || selectedQuoteDetails?.provider || quote.provider || '', // then override
                    from: { ...safeFrom },
                    to: { ...safeTo },
                    remark: editRemark,
                    additionalInfo: cleanedAdditionalInfo,
                    shipmentType: cleanedAdditionalInfo.shipmentType || quote.shipmentType || '',
                    shipmentTypeDescription,
                    lclWeight: isManualQuotation && (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL')) ? (tableRows[0]?.description?.match(/(\d+(?:\.\d+)?)\s*kg/i)?.[1] || '') : editAdditionalInfo.lclWeight || quote.lclWeight || '',
                    lclVolume: isManualQuotation && (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL')) ? (tableRows[0]?.description?.match(/(\d+(?:\.\d+)?)\s*cbm/i)?.[1] || '') : editAdditionalInfo.lclVolume || quote.lclVolume || '',
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
                    modeLabel: editQuote.mode || selectedQuoteDetails?.modeLabel || quote.modeLabel || quote.mode || '',
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
                  addQuote(updatedQuote);
                  // Fix: update quotes array directly if setQuotes does not accept a function
                  const prevQuotes = quotes || [];
                  const idx = prevQuotes.findIndex((q: any) => q.id === updatedQuote.id);
                  if (idx !== -1) {
                    const newQuotes = [...prevQuotes];
                    newQuotes[idx] = updatedQuote;
                    setQuotes(newQuotes);
                  } else {
                    setQuotes([updatedQuote, ...prevQuotes]);
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
        <QuoteInvoiceHeader
          isEditing={isEditing}
          editFrom={editFrom}
          setEditFrom={setEditFrom}
          editTo={editTo}
          setEditTo={setEditTo}
          editQuote={editQuote}
          setEditQuote={setEditQuote}
          quote={quote}
          user={user}
          createdOn={createdOn}
          isManualQuotation={isManualQuotation}
          editRemark={editRemark}
          setEditRemark={setEditRemark}
        />
        {/* Details */}
        <QuoteInvoiceDetails
          isEditing={isEditing}
          isManualQuotation={isManualQuotation}
          quote={quote}
          editQuote={editQuote}
          setEditQuote={setEditQuote}
          editAdditionalInfo={editAdditionalInfo}
          setEditAdditionalInfo={setEditAdditionalInfo}
          editRemark={editRemark}
          setEditRemark={setEditRemark}
          shipmentTypeDescription={quote.shipmentTypeDescription}
          user={user}
        />
        {/* Table */}
        <QuoteInvoiceDetail
          isEditing={isEditing}
          isManualQuotation={isManualQuotation}
          tableRows={isEditing ? editTableRows : (selectedQuoteDetails?.tableRows || [])}
          addTableRow={addTableRow}
          removeTableRow={removeTableRow}
          updateTableRow={updateTableRow}
          additionalCost={additionalCost}
          setAdditionalCost={setAdditionalCost}
          additionalCostDescription={additionalCostDescription}
          setAdditionalCostDescription={setAdditionalCostDescription}
          totalAmount={totalAmount}
          currency={currency}
          selectedQuoteDetails={selectedQuoteDetails}
          setSelectedQuoteDetails={setSelectedQuoteDetails}
          currentDraftQuote={currentDraftQuote}
          setCurrentDraftQuote={setCurrentDraftQuote}
        />
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


