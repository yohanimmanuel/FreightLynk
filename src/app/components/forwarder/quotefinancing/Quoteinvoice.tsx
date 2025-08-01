import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useQuoteSearchStore, QuoteSearchResult } from '../../../../store/quotesearchdata';
import { useAuthStore } from '../../../../store/authStore';
import { Edit, Send, Plus, Download, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuoteStore } from '../../../../store/forwarderquote';
import { partnerDirectory } from '../../../../store/partnerCompanyData';
import QuoteInvoiceHeader from './QuoteInvoiceHeader';
import QuoteInvoiceDetails from './QuoteInvoiceDetails';
import QuoteInvoiceDetail from './QuoteInvoiceTableDetail';
import { useInvoiceSend } from './useInvoiceSend';

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
  // --- Invoice Send Confirmation Logic ---
  const {
    showSendConfirm,
    invoiceSent,
    toCompany,
    openSendConfirm,
    confirmSend,
    cancelSend,
  } = useInvoiceSend();
  const { selectedQuoteDetails, additionalInfo, shipmentType, shipmentTypeDescription, setSelectedQuoteDetails } = useQuoteSearchStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const quote = selectedQuoteDetails;
  
  // Get user data - use actual user if available, otherwise use demo data
  const effectiveUser = user || {
    id: 'demo-user',
    email: 'demo123@gmail.com',
    fullName: 'Demo User',
    companyName: 'Demo Company (FreightLynk LLC)',
    companyAddress: '1000 20th Street NW, Suite 400, Washington D.C. 20036',
    phone: '(028) 1208 281055',
    role: 'role123'
  };
  
  // Debug: Log quote changes
  useEffect(() => {
    console.log('QuoteInvoice: Quote object changed', {
      quoteId: quote?.id,
      isManualQuotation,
      quoteObject: quote
    });
  }, [quote?.id, isManualQuotation]);
  const addQuote = useQuoteStore(state => state.addQuote);
  const quotes = useQuoteStore(state => state.quotes);
  const setQuotes = useQuoteStore(state => state.setQuotes);
  const currentDraftQuote = useQuoteStore(state => state.currentDraftQuote);
  const setCurrentDraftQuote = useQuoteStore(state => state.setCurrentDraftQuote);
  const updateQuote = useQuoteStore(state => state.updateQuote);
  // If no quote is selected, show a message
  if (!quote) return <div className="text-center text-gray-500 py-12">No quote selected. Please select a quote from the search results.</div>;

  // --- Edit mode state ---
  const [isEditing, setIsEditing] = useState(isManualQuotation);
  const [editFrom, setEditFrom] = useState({
    company: effectiveUser?.companyName || 'Demo Company (FreightLynk LLC)',
    address: effectiveUser?.companyAddress || '1000 20th Street NW, Suite 400, Washington D.C. 20036',
    phone: effectiveUser?.phone || '(028) 1208 281055',
    preparedBy: effectiveUser?.fullName || 'Demo User',
    mobile: effectiveUser?.phone || '(028) 1208 281055',
    email: effectiveUser?.email || 'demo123@gmail.com',
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
  const [additionalCost, setAdditionalCost] = useState(quote.additionalCost || 0);
  const [additionalCostDescription, setAdditionalCostDescription] = useState(quote.additionalCostDescription || '');

  // Sync all edit states with quote data whenever quote changes
  useEffect(() => {
    console.log('SYNCING EDIT STATES WITH QUOTE DATA:', {
      quoteId: quote?.id,
      quoteFrom: quote?.from,
      quoteTo: quote?.to,
      quoteRemark: quote?.remark,
      quoteAdditionalInfo: quote?.additionalInfo
    });
    
    // Sync editFrom with quote.from data
    if (quote?.from) {
      setEditFrom({
        company: quote.from.company || effectiveUser?.companyName || 'Demo Company (FreightLynk LLC)',
        address: quote.from.address || effectiveUser?.companyAddress || '1000 20th Street NW, Suite 400, Washington D.C. 20036',
        phone: quote.from.phone || effectiveUser?.phone || '(028) 1208 281055',
        preparedBy: quote.from.preparedBy || effectiveUser?.fullName || 'Demo User',
        mobile: quote.from.mobile || effectiveUser?.phone || '(028) 1208 281055',
        email: quote.from.email || effectiveUser?.email || 'demo123@gmail.com',
      });
    }
    
    // Sync editTo with quote.to data
    if (quote?.to) {
      setEditTo({
        company: quote.to.company || '',
        address: quote.to.address || '',
        phone: quote.to.phone || '',
        contact: quote.to.contact || '',
      });
    }
    
    // Sync editRemark with quote.remark
    setEditRemark(quote?.remark || '');
    
    // Sync editAdditionalInfo with quote.additionalInfo
    setEditAdditionalInfo({ ...quote?.additionalInfo });
    
    // Sync editQuote with quote data - but preserve user's mode selection if they're editing
    setEditQuote(prevEditQuote => {
      const newEditQuote = {
        origin: quote?.origin || '',
        destination: quote?.destination || '',
        transitPort: quote?.transitPort || '',
        serviceType: quote?.serviceType || '',
        mode: quote?.mode || '',
        modeLabel: quote?.modeLabel || quote?.mode || '',
        transitTime: quote?.transitTime || '',
        validUntil: quote?.validUntil || '',
        validFrom: quote?.validFrom || '',
        departure: quote?.departure || '',
        arrival: quote?.arrival || '',
        provider: quote?.provider || '',
        portOfLoading: quote?.portOfLoading || quote?.origin || '',
        portOfDischarge: quote?.portOfDischarge || quote?.destination || '',
      };
      
      // If user is actively editing and has made mode changes, preserve their selection
      if (isEditing && prevEditQuote.modeLabel && prevEditQuote.modeLabel !== (quote?.modeLabel || quote?.mode || '')) {
        console.log('PRESERVING USER MODE SELECTION:', {
          userSelection: prevEditQuote.modeLabel,
          quoteMode: quote?.modeLabel || quote?.mode || '',
          isEditing
        });
        newEditQuote.modeLabel = prevEditQuote.modeLabel;
        newEditQuote.mode = prevEditQuote.mode;
      }
      
      return newEditQuote;
    });
    
    // Sync additional cost fields
    setAdditionalCost(quote?.additionalCost || 0);
    setAdditionalCostDescription(quote?.additionalCostDescription || '');
    
    // Sync editTableRows with quote.tableRows - use structuredClone for better performance
    if (quote?.tableRows) {
      try {
        setEditTableRows(structuredClone(quote.tableRows));
      } catch (error) {
        // Fallback to JSON method if structuredClone is not available
        setEditTableRows(JSON.parse(JSON.stringify(quote.tableRows)));
      }
    }
    
  }, [quote?.id, effectiveUser, isEditing]); // Reduced dependencies to only essential ones

  // State for editable quote fields
  const [editQuote, setEditQuote] = useState({
    origin: quote.origin || '',
    destination: quote.destination || '',
    transitPort: quote.transitPort || '',
    serviceType: quote.serviceType || '',
    mode: quote.mode || '',
    modeLabel: quote.modeLabel || quote.mode || '',
    transitTime: quote.transitTime || '',
    validUntil: quote.validUntil || '',
    validFrom: quote.validFrom || '',
    departure: quote.departure || '',
    arrival: quote.arrival || '',
    provider: quote.provider || '',
    portOfLoading: quote.portOfLoading || quote.origin || '',
    portOfDischarge: quote.portOfDischarge || quote.destination || '',
  });

  // Add local editTableRows state - start with quote.tableRows, will be updated by useEffects
  const [editTableRows, setEditTableRows] = useState<Array<any>>(() => {
    console.log('INITIALIZING editTableRows:', {
      quoteTableRows: quote.tableRows,
      selectedQuoteDetailsTableRows: selectedQuoteDetails?.tableRows
    });
    const sourceTableRows = quote.tableRows || selectedQuoteDetails?.tableRows;
    if (!sourceTableRows) return [];
    
    try {
      return structuredClone(sourceTableRows);
    } catch (error) {
      // Fallback to JSON method if structuredClone is not available
      return JSON.parse(JSON.stringify(sourceTableRows));
    }
  });
  
  // Add submission state tracking to prevent duplicate submissions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuoteIds, setSubmittedQuoteIds] = useState<Set<string>>(new Set());

  // Functions for manual quotation table management - optimized with useCallback
  const addTableRow = useCallback(() => {
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
    
    setEditTableRows(prev => [...prev, newRow]);
  }, []);

  const removeTableRow = useCallback((index: number) => {
    setEditTableRows(prev => prev.filter((_: any, i: number) => i !== index));
  }, []);

  const updateTableRow = useCallback((index: number, field: string, value: any) => {
    setEditTableRows(prev => {
      const updatedTableRows = [...prev];
      updatedTableRows[index] = { ...updatedTableRows[index], [field]: value };
      
      // Recalculate amount if qty or baseRate changed
      if (field === 'qty' || field === 'baseRate') {
        const qty = field === 'qty' ? value : updatedTableRows[index].qty;
        const baseRate = field === 'baseRate' ? value : updatedTableRows[index].baseRate;
        updatedTableRows[index].amount = qty * baseRate;
      }
      
      return updatedTableRows;
    });
  }, []);

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
      company: quote.from?.company || effectiveUser?.companyName || 'Demo Company (FreightLynk LLC)',
      address: quote.from?.address || effectiveUser?.companyAddress || '1000 20th Street NW, Suite 400, Washington D.C. 20036',
      phone: quote.from?.phone || effectiveUser?.phone || '(028) 1208 281055',
      preparedBy: quote.from?.preparedBy || effectiveUser?.fullName || 'Demo User',
      mobile: quote.from?.mobile || effectiveUser?.phone || '(028) 1208 281055',
      email: quote.from?.email || effectiveUser?.email || 'demo123@gmail.com',
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
  const [quoteId] = useState(() => {
    console.log('QuoteInvoice: Generating quoteId', {
      isManualQuotation,
      quoteId: quote.id,
      currentDraftQuoteId: currentDraftQuote?.id,
      quoteIdType: typeof quote.id
    });
    
    // For quote search flow, always use the quote's existing ID
    if (!isManualQuotation && quote.id) {
      console.log('QuoteInvoice: Using existing quote ID from search flow:', quote.id);
      return quote.id;
    }
    // For manual quotes, use draft ID or generate new one
    const finalId = currentDraftQuote?.id || (typeof quote.id === 'string' ? quote.id : generateQuoteId());
    console.log('QuoteInvoice: Using ID for manual quote:', finalId);
    return finalId;
  });
  const hasAddedQuote = useRef<string | null>(null);

  // --- Handlers ---
  // 1. Fix edit state initialization in handleEdit
  const handleEdit = () => {
    setEditFrom({
      company: quote.from?.company || effectiveUser?.companyName || 'Demo Company (FreightLynk LLC)',
      address: quote.from?.address || effectiveUser?.companyAddress || '1000 20th Street NW, Suite 400, Washington D.C. 20036',
      phone: quote.from?.phone || effectiveUser?.phone || '(028) 1208 281055',
      preparedBy: quote.from?.preparedBy || effectiveUser?.fullName || 'Demo User',
      mobile: quote.from?.mobile || effectiveUser?.phone || '(028) 1208 281055',
      email: quote.from?.email || effectiveUser?.email || 'demo123@gmail.com',
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
      modeLabel: quote.modeLabel || quote.mode || '',
      transitTime: quote.transitTime || '',
      validUntil: quote.validUntil || '',
      validFrom: quote.validFrom || '',
      departure: quote.departure || '',
      arrival: quote.arrival || '',
      provider: quote.provider || '',
      portOfLoading: quote.portOfLoading || quote.origin || '',
      portOfDischarge: quote.portOfDischarge || quote.destination || '',
    });
    setEditTableRows(quote.tableRows ? structuredClone(quote.tableRows) : []);
    setAdditionalCost(quote.additionalCost || 0);
    setAdditionalCostDescription(quote.additionalCostDescription || '');
    console.log('HANDLE EDIT - Additional Cost Debug:', {
      quoteAdditionalCost: quote.additionalCost,
      quoteAdditionalCostDescription: quote.additionalCostDescription,
      setAdditionalCostValue: quote.additionalCost || 0,
      setAdditionalCostDescriptionValue: quote.additionalCostDescription || ''
    });
    setOriginalState({
      from: { ...editFrom },
      to: { ...editTo },
      remark: editRemark,
      additionalInfo: { ...editAdditionalInfo },
      tableRows: quote.tableRows ? structuredClone(quote.tableRows) : [],
      additionalCost: quote.additionalCost || 0,
      additionalCostDescription: quote.additionalCostDescription || '',
    });
    setIsEditing(true);
  };
  const handleCancel = () => {
    if (originalState) {
      setEditFrom(originalState.from);
      setEditTo(originalState.to);
      setEditRemark(originalState.remark);
      setEditAdditionalInfo(originalState.additionalInfo);
      setEditTableRows(originalState.tableRows ? structuredClone(originalState.tableRows) : []);
      setAdditionalCost(originalState.additionalCost || 0);
      setAdditionalCostDescription(originalState.additionalCostDescription || '');
    }
    setIsEditing(false);
  };
  // In handleSave, do not allow empty 'from' fields; always use defaults if missing
  const handleSave = () => {
    const safeFrom = {
      company: editFrom.company || effectiveUser?.companyName || 'Demo Company (FreightLynk LLC)',
      address: editFrom.address || effectiveUser?.companyAddress || '1000 20th Street NW, Suite 400, Washington D.C. 20036',
      phone: editFrom.phone || effectiveUser?.phone || '(028) 1208 281055',
      preparedBy: editFrom.preparedBy || effectiveUser?.fullName || 'Demo User',
      mobile: editFrom.mobile || effectiveUser?.phone || '(028) 1208 281055',
      email: editFrom.email || effectiveUser?.email || 'demo123@gmail.com',
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
    const finalTotalAmount = totalAmount + (additionalCost || 0);

    // ---- Save quote with additional cost ----
    const newQuote = {
      ...quote,
      from: safeFrom,
      to: safeTo,
      remark: editRemark,
      additionalInfo: cleanedAdditionalInfo,
      tableRows: editTableRows,
      totalAmount,
      finalTotalAmount,
      additionalCost,
      additionalCostDescription,
    };
    
    // Frontend-only save - no API calls, just update local state
    // Database operations only happen on submit
    console.log('Frontend save - updating local state only');
    
    if (Array.isArray(quotes)) {
      const idx = quotes.findIndex((q) => q.id === newQuote.id);
      const updatedQuotes = idx !== -1 ? [...quotes.slice(0, idx), newQuote, ...quotes.slice(idx + 1)] : [...quotes, newQuote];
      setQuotes(updatedQuotes);
    }
    setSelectedQuoteDetails(newQuote as any);

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
    const truckTypeBadges = getTypeQuantityString(tableRows, 'item');
    
    // Weight/volume badge for LCL, AIR, LTL
    let weightVolumeBadge = '';
    
    // Use editTableRows for consistency with the save function
    const rowsToUse = editTableRows.length > 0 ? editTableRows : tableRows;
    console.log('SAVE FUNCTION DEBUG - Data sources:', {
      editTableRowsLength: editTableRows.length,
      editTableRows: editTableRows,
      tableRowsLength: tableRows.length,
      tableRows: tableRows,
      rowsToUseLength: rowsToUse.length,
      rowsToUse: rowsToUse
    });
    
    // FALLBACK: If rowsToUse is empty, try to get data from quote.tableRows directly
    let finalRowsToUse = rowsToUse;
    if (rowsToUse.length === 0 && quote.tableRows && quote.tableRows.length > 0) {
      console.log('FALLBACK: Using quote.tableRows directly:', quote.tableRows);
      finalRowsToUse = quote.tableRows;
    }
    
    // First try to extract from finalRowsToUse description (works for both manual and search flow)
    if (finalRowsToUse.length > 0 && finalRowsToUse[0]?.description) {
      const desc = finalRowsToUse[0].description;
      console.log('WEIGHT/VOLUME EXTRACTION DEBUG: Found description:', desc);
      // Try to extract 'X kg' and 'Y cbm' from the description
      const weightMatch = desc.match(/(\d+(?:\.\d+)?)\s*kg/i);
      const volumeMatch = desc.match(/(\d+(?:\.\d+)?)\s*cbm/i);
      if (weightMatch) weightVolumeBadge = `${weightMatch[1]} kg`;
      if (volumeMatch) weightVolumeBadge = `${weightVolumeBadge} / ${volumeMatch[1]} cbm`;
      console.log('WEIGHT/VOLUME EXTRACTION DEBUG: Extracted badge:', weightVolumeBadge);
    }
    
    // If no weight/volume found in rowsToUse, fall back to additional info
    if (!weightVolumeBadge) {
      const weight = editAdditionalInfo.lclWeight || quote.lclWeight || '';
      const volume = editAdditionalInfo.lclVolume || quote.lclVolume || '';
      if (weight && volume) {
        weightVolumeBadge = `${weight} kg / ${volume} cbm`;
      } else if (weight) {
        weightVolumeBadge = `${weight} kg`;
      } else if (volume) {
        weightVolumeBadge = `${volume} cbm`;
      }
      console.log('WEIGHT/VOLUME EXTRACTION DEBUG: Using additional info:', weightVolumeBadge);
    }
    
    // Debug weight/volume badge construction
    console.log('WEIGHT/VOLUME BADGE DEBUG:', {
      isManualQuotation,
      mode,
      tableRowsDescription: tableRows[0]?.description,
      editTableRowsDescription: editTableRows[0]?.description,
      rowsToUseDescription: rowsToUse[0]?.description,
      editAdditionalInfo: { lclWeight: editAdditionalInfo.lclWeight, lclVolume: editAdditionalInfo.lclVolume },
      quote: { lclWeight: quote.lclWeight, lclVolume: quote.lclVolume },
      weightVolumeBadge,
      modeChecks: {
        isFCL: mode.includes('SEA') && mode.includes('FCL'),
        isLCL: mode.includes('SEA') && mode.includes('LCL'),
        isAIR: mode.includes('AIR'),
        isFTL: mode.includes('LAND') && mode.includes('FTL'),
        isLTL: mode.includes('LAND') && mode.includes('LTL')
      }
    });

    // Create details badges based on mode
    let detailsBadges = [];
    if (mode.includes('SEA') && mode.includes('FCL')) {
      detailsBadges = [...containerTypeBadges];
    } else if (mode.includes('LAND') && mode.includes('FTL')) {
      detailsBadges = [...truckTypeBadges]; // Now uses 'item' field
    } else if (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL')) {
      // For LCL/AIR/LTL, show weight/volume badge if available
      detailsBadges = weightVolumeBadge ? [weightVolumeBadge] : [];
    } else {
      // Fallback: show container types if available, otherwise weight/volume
      detailsBadges = containerTypeBadges.length > 0 ? [...containerTypeBadges] : (weightVolumeBadge ? [weightVolumeBadge] : []);
    }

    // Extract lclWeight/lclVolume from finalRowsToUse description for all quotes
    let lclWeight = '';
    let lclVolume = '';
    if (finalRowsToUse.length > 0 && finalRowsToUse[0]?.description) {
      const desc = finalRowsToUse[0].description;
      // Try to extract 'X kg' and 'Y cbm' from the description
      const weightMatch = desc.match(/(\d+(?:\.\d+)?)\s*kg/i);
      const volumeMatch = desc.match(/(\d+(?:\.\d+)?)\s*cbm/i);
      if (weightMatch) lclWeight = weightMatch[1];
      if (volumeMatch) lclVolume = volumeMatch[1];
      console.log('LCL WEIGHT/VOLUME EXTRACTION DEBUG: Extracted:', { lclWeight, lclVolume });
    } else {
      lclWeight = editAdditionalInfo.lclWeight || quote.lclWeight || '';
      lclVolume = editAdditionalInfo.lclVolume || quote.lclVolume || '';
      console.log('LCL WEIGHT/VOLUME EXTRACTION DEBUG: Using additional info:', { lclWeight, lclVolume });
    }

    // Use the already extracted lclWeight and lclVolume
    let lclWeightParsed = lclWeight;
    let lclVolumeParsed = lclVolume;

    // Unified badge logic for all modes
    let detailsField: string[] = [];
    let truckTypeField: string[] = [];
    let containerTypeField: string[] = [];
    let weightVolumeField: string[] = [];
    
    // Always capture weight/volume data when available, regardless of mode
    if (weightVolumeBadge) {
      weightVolumeField = [weightVolumeBadge];
    }
    
    if (mode.includes('SEA') && mode.includes('FCL')) {
      detailsField = [...containerTypeBadges];
      containerTypeField = [...containerTypeBadges];
      truckTypeField = [];
    } else if (mode.includes('LAND') && mode.includes('FTL')) {
      detailsField = [...truckTypeBadges]; // Now uses 'item' field
      truckTypeField = [...truckTypeBadges]; // Now uses 'item' field
      containerTypeField = [];
    } else if (mode.includes('SEA') && mode.includes('LCL') || mode.includes('AIR') || mode.includes('LAND') && mode.includes('LTL')) {
      detailsField = weightVolumeBadge ? [weightVolumeBadge] : [];
      containerTypeField = [];
      truckTypeField = [];
    } else {
      detailsField = containerTypeBadges.length > 0 ? [...containerTypeBadges] : (weightVolumeBadge ? [weightVolumeBadge] : []);
      containerTypeField = containerTypeBadges.length > 0 ? [...containerTypeBadges] : [];
      truckTypeField = truckTypeBadges.length > 0 ? [...truckTypeBadges] : [];
    }

    // Debug log to confirm fields
    console.log('QUOTE SAVE DEBUG:', {
      id: quote.id,
      mode,
      weightVolumeBadge,
      detailsField,
      truckTypeField,
      containerTypeField,
      weightVolumeField,
      tableRows: tableRows.map((row: any) => ({ description: row.description, item: row.item })),
      modeChecks: {
        isFCL: mode.includes('SEA') && mode.includes('FCL'),
        isLCL: mode.includes('SEA') && mode.includes('LCL'),
        isAIR: mode.includes('AIR'),
        isFTL: mode.includes('LAND') && mode.includes('FTL'),
        isLTL: mode.includes('LAND') && mode.includes('LTL')
      }
    });
    
    // Debug the final quote object being sent
    console.log('FINAL QUOTE OBJECT DEBUG:', {
      weightVolume: weightVolumeField,
      weightVolumeType: typeof weightVolumeField,
      weightVolumeLength: Array.isArray(weightVolumeField) ? weightVolumeField.length : 'not array',
      editTableRows: editTableRows,
      editTableRowsLength: editTableRows.length,
      firstRowDescription: editTableRows[0]?.description
    });

    // --- Compute totals including additional cost ---
    const draftTotalAmount = editTableRows.reduce((sum: number, row: any) => sum + (typeof row.amount === 'number' ? row.amount : 0), 0);
    const draftFinalTotal = draftTotalAmount + (additionalCost || 0);

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
        // Use the modeLabel from editQuote as the primary source
        const selectedMode = editQuote.modeLabel || selectedQuoteDetails?.modeLabel || quote.modeLabel || '';
        if (selectedMode) {
          // Map to the standardized mode values
          const m = selectedMode.toUpperCase();
          if (m.includes('SEA') && m.includes('FCL')) return 'SEA FCL';
          if (m.includes('SEA') && m.includes('LCL')) return 'SEA LCL';
          if (m.includes('AIR')) return 'AIR';
          if (m.includes('LAND') && m.includes('FTL')) return 'LAND FTL';
          if (m.includes('LAND') && m.includes('LTL')) return 'LAND LTL';
          return selectedMode; // Return as-is if it matches our standard values
        }
        // Fallback to basic mode mapping
        const basicMode = editQuote.mode || selectedQuoteDetails?.mode || quote.mode || '';
        if (basicMode === 'ocean') return 'SEA FCL'; // Default to SEA FCL for ocean
        if (basicMode === 'air') return 'AIR';
        if (basicMode === 'road') return 'LAND FTL'; // Default to LAND FTL for road
        return basicMode.toUpperCase();
      })(),
      modeLabel: editQuote.modeLabel || selectedQuoteDetails?.modeLabel || quote.modeLabel || quote.mode || '',
      // Use only the new fields
      details: detailsField,
      containertype: containerTypeField,
      truckType: truckTypeField,
      weightVolume: weightVolumeField,
      status: quote.status || 'draft',
      // --- Persist additional cost & totals ---
      additionalCost: additionalCost,
      additionalCostDescription: additionalCostDescription,
      totalAmount: draftTotalAmount,
      finalTotalAmount: draftFinalTotal,
      price: draftFinalTotal.toString(),
      createdBy: editFrom.preparedBy || '',
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
      company: quote.from?.company || effectiveUser?.companyName || 'Demo Company (FreightLynk LLC)',
      address: quote.from?.address || effectiveUser?.companyAddress || '1000 20th Street NW, Suite 400, Washington D.C. 20036',
      phone: quote.from?.phone || effectiveUser?.phone || '(028) 1208 281055',
      preparedBy: quote.from?.preparedBy || effectiveUser?.fullName || 'Demo User',
      mobile: quote.from?.mobile || effectiveUser?.phone || '(028) 1208 281055',
      email: quote.from?.email || effectiveUser?.email || 'demo123@gmail.com',
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
      modeLabel: quote.modeLabel || quote.mode || '',
      transitTime: quote.transitTime || '',
      validUntil: quote.validUntil || '',
      validFrom: quote.validFrom || '',
      departure: quote.departure || '',
      arrival: quote.arrival || '',
      provider: quote.provider || '',
      portOfLoading: quote.portOfLoading || quote.origin || '',
      portOfDischarge: quote.portOfDischarge || quote.destination || '',
    });
    setAdditionalCost(quote.additionalCost || 0);
    setAdditionalCostDescription(quote.additionalCostDescription || '');
  }, [quote?.id]);

  // Update editTableRows when quote or selectedQuoteDetails changes
  useEffect(() => {
    const sourceTableRows = selectedQuoteDetails?.tableRows || quote?.tableRows;
    
    if (sourceTableRows && sourceTableRows.length > 0) {
      console.log('UPDATING editTableRows from source:', sourceTableRows);
      setEditTableRows(structuredClone(sourceTableRows));
    }
  }, [selectedQuoteDetails?.tableRows, quote?.tableRows]);

  // Reset form state after submission or when starting a new quote
  useEffect(() => {
    if (!currentDraftQuote) {
      setFormState(emptyFormState);
    }
  }, [currentDraftQuote]);

  // Use tableRows from selectedQuoteDetails for the quote table
  const tableRows = selectedQuoteDetails?.tableRows || [];

  // Build details from tableRows - memoized for performance
  const { containerTypes, truckTypes, weightVolumes, details, totalAmount, currency } = useMemo(() => {
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

    return { containerTypes, truckTypes, weightVolumes, details, totalAmount, currency };
  }, [tableRows, quote.currency]);

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
    const ftlTruckTypes = getTypeQuantityString(tableRows, 'item');
    
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

  // Only consider it already submitted if the quote exists AND has a status other than 'draft'
  const isAlreadySubmitted = quotes.some(q => q.id === quote.id && q.status !== 'draft');

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
      {/* Invoice Send Confirmation Modal and Overlay */}
      {showSendConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-4 text-lg text-gray-900 mb-6">Send invoice to <b>{toCompany}</b>?</div>
            <div className="mb-6 text-sm text-gray-600 w-120">
             Note: This invoice will appear in the selected client's dashboard under their <b>Bookings Confirm</b> page of the respected booking/quote request, placing the price in the <b>Price</b> field and allowing them to view and process payment.
            </div>
            <button onClick={confirmSend} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg mr-2">Confirm</button>
            <button onClick={cancelSend} className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 rounded-lg">Cancel</button>
          </div>
        </div>
      )}
      {invoiceSent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pb-150">
          <div className="bg-green-100 border border-green-600 rounded-lg shadow-sm p-4 text-center text-sm font-medium text-green-800 flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Invoice sent to {toCompany}!
          </div>
        </div>
      )}
      {/* Button Row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {!isEditing ? (
            <>
            <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center gap-2" onClick={handleEdit}>
              <Edit className="w-4 h-4" /> Edit
            </button>
              <button
                disabled={isAlreadySubmitted || isSubmitting}
                className="px-4 py-2 rounded-lg bg-[#FFA726] text-white font-medium hover:bg-[#fb8c00] transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={async () => {
                  // Build the updated quote object directly
                  const safeFrom = {
                    company: editFrom.company || effectiveUser?.companyName || 'Demo Company (FreightLynk LLC)',
                    address: editFrom.address || effectiveUser?.companyAddress || '1000 20th Street NW, Suite 400, Washington D.C. 20036',
                    phone: editFrom.phone || effectiveUser?.phone || '(028) 1208 281055',
                    preparedBy: editFrom.preparedBy || effectiveUser?.fullName || 'Demo User',
                    mobile: editFrom.mobile || effectiveUser?.phone || '(028) 1208 281055',
                    email: editFrom.email || effectiveUser?.email || 'demo123@gmail.com',
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
                  const finalTotalAmount = totalAmount + (additionalCost || 0);
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
                  const truckTypeBadges = getTypeQuantityString(tableRows, 'item');
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
                  
                  // Extract weight/volume for submit handler (same logic as save function)
                  let submitWeightVolumeBadge = '';
                  const submitRowsToUse = editTableRows.length > 0 ? editTableRows : tableRows;
                  if (submitRowsToUse.length > 0 && submitRowsToUse[0]?.description) {
                    const desc = submitRowsToUse[0].description;
                    const weightMatch = desc.match(/(\d+(?:\.\d+)?)\s*kg/i);
                    const volumeMatch = desc.match(/(\d+(?:\.\d+)?)\s*cbm/i);
                    if (weightMatch) submitWeightVolumeBadge = `${weightMatch[1]} kg`;
                    if (volumeMatch) submitWeightVolumeBadge = `${submitWeightVolumeBadge} / ${volumeMatch[1]} cbm`;
                    console.log('SUBMIT HANDLER: Extracted weight/volume:', submitWeightVolumeBadge);
                  }
                  
                  // Calculate price for submit handler (same logic as save function)
                  const submitTotalAmount = submitRowsToUse.reduce((sum: number, row: any) => sum + (typeof row.amount === 'number' ? row.amount : 0), 0);
                  const submitFinalTotalAmount = submitTotalAmount + (additionalCost || 0);
                  console.log('SUBMIT HANDLER: Price calculation:', {
                    submitTotalAmount,
                    additionalCost,
                    submitFinalTotalAmount,
                    tableRows: submitRowsToUse.map((row: any) => ({ description: row.description, amount: row.amount }))
                  });
                  const updatedQuote = {
                    ...quote, // spread first
                    id: quote.id, // explicitly preserve the ID
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
                      // Use the modeLabel from editQuote as the primary source
                      const selectedMode = editQuote.modeLabel || selectedQuoteDetails?.modeLabel || quote.modeLabel || '';
                      if (selectedMode) {
                        // Map to the standardized mode values
                        const m = selectedMode.toUpperCase();
                        if (m.includes('SEA') && m.includes('FCL')) return 'SEA FCL';
                        if (m.includes('SEA') && m.includes('LCL')) return 'SEA LCL';
                        if (m.includes('AIR')) return 'AIR';
                        if (m.includes('LAND') && m.includes('FTL')) return 'LAND FTL';
                        if (m.includes('LAND') && m.includes('LTL')) return 'LAND LTL';
                        return selectedMode; // Return as-is if it matches our standard values
                      }
                      // Fallback to basic mode mapping
                      const basicMode = editQuote.mode || selectedQuoteDetails?.mode || quote.mode || '';
                      if (basicMode === 'ocean') return 'SEA FCL'; // Default to SEA FCL for ocean
                      if (basicMode === 'air') return 'AIR';
                      if (basicMode === 'road') return 'LAND FTL'; // Default to LAND FTL for road
                      return basicMode.toUpperCase();
                    })(),
                    modeLabel: editQuote.modeLabel || selectedQuoteDetails?.modeLabel || quote.modeLabel || quote.mode || '',
                    details: detailsBadges,
                    isTariff: cleanedAdditionalInfo.isTariff ?? quote.isTariff ?? false,
                    client: safeTo.company || quote.client || '',
                    containertype: containerTypeBadges,
                    truckType: truckTypeBadges,
                    weightVolume: submitWeightVolumeBadge ? [submitWeightVolumeBadge] : [],
                    status: quote.status || 'draft',
                    price: submitFinalTotalAmount.toString(),
                    createdBy: effectiveUser?.fullName || quote.createdBy || '',
                    incoterms: cleanedAdditionalInfo.incoterm || quote.incoterms || '',
                    notes: cleanedAdditionalInfo.note || quote.notes || '',
                    tableRows: tableRows,
                    // --- Ensure additional cost fields are always included ---
                    additionalCost: additionalCost,
                    additionalCostDescription: additionalCostDescription,
                    totalAmount: submitTotalAmount,
                    finalTotalAmount: submitFinalTotalAmount,
                  };
                  console.log('QUOTE SUBMIT DEBUG:', updatedQuote);
                  console.log('MODE SUBMISSION DEBUG:', {
                    editQuoteModeLabel: editQuote.modeLabel,
                    selectedQuoteDetailsModeLabel: selectedQuoteDetails?.modeLabel,
                    quoteModeLabel: quote.modeLabel,
                    quoteMode: quote.mode,
                    finalMode: updatedQuote.mode,
                    finalModeLabel: updatedQuote.modeLabel
                  });
                  console.log('Quote ID check:', {
                    originalQuoteId: quote.id,
                    updatedQuoteId: updatedQuote.id,
                    areEqual: quote.id === updatedQuote.id
                  });
                  console.log('ADDITIONAL COST DEBUG:', {
                    additionalCost,
                    additionalCostDescription,
                    quoteAdditionalCost: quote.additionalCost,
                    quoteAdditionalCostDescription: quote.additionalCostDescription,
                    isEditing,
                    isManualQuotation,
                    submitTotalAmount,
                    submitFinalTotalAmount,
                    originalTotalAmount: quote.totalAmount,
                    originalFinalTotalAmount: quote.finalTotalAmount
                  });
                  
                  // Prevent duplicate submissions
                  if (isSubmitting) {
                    console.log('Quote submission already in progress, ignoring duplicate click');
                    return;
                  }

                  const quoteId = updatedQuote.id;
                  
                  // Check if this quote was already submitted in this session
                  if (submittedQuoteIds.has(quoteId)) {
                    console.log('Quote already submitted in this session:', quoteId);
                    return;
                  }
                  
                  setIsSubmitting(true);
                  
                  try {
                    console.log('QuoteInvoice: Submitting quote to database:', quoteId);
                    
                    // For manual quotations, always create new quotes - never update
                    // For search flow quotes, check if they exist in database
                    let isExistingQuote = false;
                    let wasPreviouslySubmitted = false;
                    let hasNonDraftStatus = false;
                    let hasExistingId = false;
                    let isEditingExistingQuote = false;
                    
                    console.log('MANUAL QUOTATION DEBUG:', {
                      isManualQuotation,
                      quoteId,
                      quoteIdType: typeof quoteId,
                      quoteIdStartsWithQR: quoteId?.startsWith('QR-'),
                      isEditing
                    });
                    
                    // Determine if this is an existing quote that should be updated
                    // Check if this quote was previously submitted in this session OR if it has a QR- ID (database ID)
                    if (submittedQuoteIds.has(quoteId) || (quoteId && quoteId.startsWith('QR-'))) {
                      // This quote was already submitted in this session or has a database ID - update it
                      isExistingQuote = true;
                      console.log('UPDATING EXISTING QUOTE:', quoteId, {
                        wasSubmitted: submittedQuoteIds.has(quoteId),
                        hasDatabaseId: quoteId && quoteId.startsWith('QR-')
                      });
                    } else {
                      // This is a new quote - create it
                      isExistingQuote = false;
                      console.log('CREATING NEW QUOTE:', quoteId);
                    }
                    
                    console.log('Quote submission logic debug:', {
                      quoteId,
                      wasPreviouslySubmitted,
                      hasNonDraftStatus,
                      hasExistingId,
                      isEditingExistingQuote,
                      isExistingQuote,
                      quoteStatus: quote.status,
                      originalQuoteId: quote.id,
                      isEditing,
                      isManualQuotation
                    });
                    
                    let finalQuote = updatedQuote;
                    
                    try {
                      // Always try to create the quote first (this will handle both new and existing quotes)
                      console.log('CREATING/UPDATING QUOTE - Calling addQuote with:', {
                        quoteId,
                        updatedQuoteId: updatedQuote.id,
                        updatedQuoteData: updatedQuote
                      });
                      const createdQuote = await addQuote(updatedQuote);
                      console.log('CREATING/UPDATING QUOTE - Successfully created/updated quote with ID:', createdQuote.id);
                      
                      // Update the selectedQuoteDetails in the search store
                      console.log('UPDATING SELECTED QUOTE DETAILS IN SEARCH STORE');
                      setSelectedQuoteDetails(createdQuote);
                      finalQuote = createdQuote;
                    } catch (error) {
                      console.error('Error creating/updating quote:', error);
                      throw error;
                    }
                    
                    // Mark this quote as submitted in this session
                    setSubmittedQuoteIds(prev => new Set([...prev, quoteId]));
                    
                    // Update quotes array
                    const prevQuotes = quotes || [];
                    const idx = prevQuotes.findIndex((q: any) => q.id === finalQuote.id);
                    if (idx !== -1) {
                      const newQuotes = [...prevQuotes];
                      newQuotes[idx] = finalQuote;
                      setQuotes(newQuotes);
                    } else {
                      setQuotes([finalQuote, ...prevQuotes]);
                    }
                    
                    router.push('/quotes/list');
                  } catch (error) {
                    console.error('Error submitting quote:', error);
                    // Reset submission state on error
                    setIsSubmitting(false);
                  }
                }}
                title={isAlreadySubmitted ? 'This quote has already been submitted.' : isSubmitting ? 'Submitting...' : 'Submit this quote'}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button 
                onClick={() => openSendConfirm(editTo.company)}
                className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" /> 
                Send
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


