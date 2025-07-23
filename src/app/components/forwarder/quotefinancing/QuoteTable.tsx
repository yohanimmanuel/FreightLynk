import React, { useState, useRef } from 'react';
import { Plus, Search, ChevronDown, Ship, Box, Plane, Truck, ChevronLeft, ChevronRight, Menu, Download, Upload, Eye, Edit as EditIcon, Trash2, X as XIcon, X } from 'lucide-react';
import { useQuoteRateStore } from '../../../../store/forwarderquote';
import { useClientQuoteStore } from '@/store/clientquotes';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../../store/authStore';
import { useQuoteSearchStore } from '../../../../store/quotesearchdata';

const QUOTE_TABS = [
  { label: 'All', value: 'all', icon: <Menu className="w-4 h-4 mr-1" /> },
  { label: 'FCL', value: 'fcl', icon: <Ship className="w-4 h-4 mr-1" /> },
  { label: 'LCL', value: 'lcl', icon: <Box className="w-4 h-4 mr-1" /> },
  { label: 'AIR', value: 'air', icon: <Plane className="w-4 h-4 mr-1" /> },
  { label: 'FTL', value: 'ftl', icon: <Truck className="w-4 h-4 mr-1" /> },
  { label: 'LTL', value: 'ltl', icon: <Truck className="w-4 h-4 mr-1" /> },
];

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Export', value: 'export' },
  { label: 'Import', value: 'import' },
  { label: 'Domestic', value: 'domestic' },
  { label: 'Other', value: 'other' },
];

const STATUS_OPTIONS = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
  { value: 'booked', label: 'Booked' },
    { value: 'sent', label: 'Sent' },
  { value: 'rejected', label: 'Rejected' },
];


// Column configs for each mode
const MODE_COLUMN_CONFIGS: Record<string, { key: string; label: string }[]> = {
  fcl: [
    { key: 'id', label: 'Quote ID' },
    { key: 'client', label: 'Client' },
    { key: 'isTariff', label: 'Is tariff' },
    { key: 'provider', label: 'Provider' },
    { key: 'containertype', label: 'Container Type' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'status', label: 'Status' },
    { key: 'price', label: 'Price' },
    { key: 'currency', label: 'Currency' },
    { key: 'createdBy', label: 'Created by' },
    { key: 'createdDate', label: 'Created date' },
    { key: 'incoterms', label: 'Incoterms' },
    { key: 'remark', label: 'Remark' },
    { key: 'notes', label: 'Notes' },
  ],
  lcl: [
    { key: 'id', label: 'Quote ID' },
    { key: 'client', label: 'Client' },
    { key: 'isTariff', label: 'Is tariff' },
    { key: 'provider', label: 'Provider' },
    { key: 'weightVolume', label: 'Weight/volume' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'status', label: 'Status' },
    { key: 'price', label: 'Price' },
    { key: 'currency', label: 'Currency' },
    { key: 'createdBy', label: 'Created by' },
    { key: 'createdDate', label: 'Created date' },
    { key: 'incoterms', label: 'Incoterms' },
    { key: 'remark', label: 'Remark' },
    { key: 'notes', label: 'Notes' },
  ],
  air: [
    { key: 'id', label: 'Quote ID' },
    { key: 'client', label: 'Client' },
    { key: 'isTariff', label: 'Is tariff' },
    { key: 'provider', label: 'Provider' },
    { key: 'weightVolume', label: 'Weight/volume' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'status', label: 'Status' },
    { key: 'price', label: 'Price' },
    { key: 'currency', label: 'Currency' },
    { key: 'createdBy', label: 'Created by' },
    { key: 'createdDate', label: 'Created date' },
    { key: 'incoterms', label: 'Incoterms' },
    { key: 'remark', label: 'Remark' },
    { key: 'notes', label: 'Notes' },
  ],
  ftl: [
    { key: 'id', label: 'Quote ID' },
    { key: 'client', label: 'Client' },
    { key: 'isTariff', label: 'Is tariff' },
    { key: 'provider', label: 'Provider' },
    { key: 'truckType', label: 'Truck Type' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'status', label: 'Status' },
    { key: 'price', label: 'Price' },
    { key: 'currency', label: 'Currency' },
    { key: 'createdBy', label: 'Created by' },
    { key: 'createdDate', label: 'Created date' },
    { key: 'incoterms', label: 'Incoterms' },
    { key: 'remark', label: 'Remark' },
    { key: 'notes', label: 'Notes' },
  ],
  ltl: [
    { key: 'id', label: 'Quote ID' },
    { key: 'client', label: 'Client' },
    { key: 'isTariff', label: 'Is tariff' },
    { key: 'provider', label: 'Provider' },
    { key: 'weightVolume', label: 'Weight/volume' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'status', label: 'Status' },
    { key: 'price', label: 'Price' },
    { key: 'currency', label: 'Currency' },
    { key: 'createdBy', label: 'Created by' },
    { key: 'createdDate', label: 'Created date' },
    { key: 'incoterms', label: 'Incoterms' },
    { key: 'remark', label: 'Remark' },
    { key: 'notes', label: 'Notes' },
  ],
  all: [
    { key: 'id', label: 'Quote ID' },
    { key: 'client', label: 'Client' },
    { key: 'isTariff', label: 'Is tariff' },
    { key: 'provider', label: 'Provider' },
    { key: 'details', label: 'Details' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'status', label: 'Status' },
    { key: 'price', label: 'Price' },
    { key: 'currency', label: 'Currency' },
    { key: 'createdBy', label: 'Created by' },
    { key: 'createdDate', label: 'Created date' },
    { key: 'incoterms', label: 'Incoterms' },
    { key: 'remark', label: 'Remark' },
    { key: 'notes', label: 'Notes' },
  ],
};

// Helper to get the icon for a mode
function getModeIcon(mode: string) {
  if (!mode) return null;
  const m = mode.toUpperCase();
  if (m.includes('FCL')) return <Ship className="inline w-4 h-4 mr-1 align-text-bottom" />;
  if (m.includes('LCL')) return <Box className="inline w-4 h-4 mr-1 align-text-bottom" />;
  if (m.includes('AIR')) return <Plane className="inline w-4 h-4 mr-1 align-text-bottom" />;
  if (m.includes('FTL') || m.includes('LTL') || m.includes('TRUCK')) return <Truck className="inline w-4 h-4 mr-1 align-text-bottom" />;
  return null;
}

// Helper to format date as 'Month Day, Year'
function formatDisplayDate(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function QuoteTable({ role = 'forwarder' }: { role?: 'forwarder' | 'client' }) {
  // Forwarder store
  const forwarderStore = useQuoteRateStore();
  // Client store
  const clientStore = useClientQuoteStore();
  const { user } = useAuthStore();
  const resetSearchAndAdditionalInfo = useQuoteSearchStore(state => state.resetSearchAndAdditionalInfo);

  // Choose the correct store based on role
  const quotes: any[] = role === 'forwarder' ? forwarderStore.quotes : clientStore.quotes;
  const setQuotes = role === 'forwarder' ? forwarderStore.setQuotes : clientStore.setQuotes;
  // For client: Accept/Reject actions
  const updateQuoteStatus = role === 'client' ? clientStore.updateQuoteStatus : undefined;

  console.log('QuoteTable quotes:', quotes);

  const [tab, setTab] = useState('all');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const router = useRouter();

  // CSV Export logic
  const handleExportCSV = () => {
    const exportCols = MODE_COLUMN_CONFIGS[tab] || MODE_COLUMN_CONFIGS['all'];
    const rows = filteredQuotes.map(q => exportCols.map(col => getValue(q, col.key)));
    const csv = [exportCols.map(col => col.label).join(','), ...rows.map(r => r.map(v => '"'+(v??'')+'"').join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quotes_${tab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import logic
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length < 2) return;
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const mode = tab.toUpperCase();
      const newQuotes = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const obj: any = { mode };
        headers.forEach((h, i) => { obj[h] = values[i]; });
        // Generate a unique id if not present
        if (!obj.id) obj.id = `QT-${new Date().getFullYear()}-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`;
        return obj;
      });
      setQuotes([...quotes, ...newQuotes]);
      setShowImportModal(false);
    };
    reader.readAsText(file);
  };

  // Determine current mode (tab)
  let columns = MODE_COLUMN_CONFIGS[tab] || MODE_COLUMN_CONFIGS['all'];
  // For client role, filter out 'client', 'isTariff', and 'profit' columns
  if (role === 'client') {
    columns = columns.filter(col => col.key !== 'client' && col.key !== 'isTariff' && col.key !== 'profit');
  }

  // Helper to safely get values for each column
  const getValue = (q: any, key: string) => {
    switch (key) {
      case 'id': return q.id;
      case 'client': return q.client;
      case 'isTariff': {
        const isTariffValue = q.additionalInfo?.isTariff || q.isTariff;
        if (typeof isTariffValue === 'string') {
          return isTariffValue === 'Yes' ? 'Yes' : 'No';
        }
        return isTariffValue ? 'Yes' : 'No';
      }
      case 'provider': return q.provider;
      case 'details': return q.details;
      case 'containertype': return q.containertype;
      case 'origin': return q.origin;
      case 'destination': return q.destination;
      case 'status': return q.status;
      case 'price': {
        // Prefer finalTotalAmount (includes additional cost) then totalAmount, fallback to price
        const rawAmount = q.finalTotalAmount ?? q.totalAmount ?? q.price;
        const num = Number(rawAmount);
        if (!isNaN(num)) {
          // Show up to 2 decimal places, but drop trailing zeros (e.g., 4820 not 4820.00)
          return num.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          });
        }
        return rawAmount;
      }
      case 'currency': return q.currency || 'USD';
      case 'createdBy': return q.createdBy || user?.fullName || q.accountName || '—';
      case 'createdDate': {
        if (q.createdDate) return formatDisplayDate(q.createdDate);
        if (q.createdAt) return formatDisplayDate(q.createdAt);
        return formatDisplayDate(new Date().toISOString());
      }
      case 'incoterms': return q.incoterms || q.invoiceIncoterms || '—';
      case 'remark': return q.remark || q.invoiceRemark || '—';
      case 'notes': return q.notes || q.invoiceNotes || '—';
      case 'weightVolume': {
        // For LCL, AIR, LTL quotes, construct weight/volume from multiple possible sources
        const weight = q.lclWeight || q.additionalInfo?.lclWeight || '';
        const volume = q.lclVolume || q.additionalInfo?.lclVolume || '';
        if (weight && volume) {
          return [`${weight} kg / ${volume} cbm`];
        } else if (weight) {
          return [`${weight} kg`];
        } else if (volume) {
          return [`${volume} cbm`];
        }
        // Fallback to weightVolume field if it exists
        return q.weightVolume || [];
      }
      case 'truckType': return q.truckType;
      case 'shipmentType': return q.shipmentType || q.additionalInfo?.shipmentType || '-';
      case 'mode': return q.mode || q.modeLabel || q.additionalInfo?.shipmentMode || '-';
      default: return '';
    }
  };

  // Filtered quotes based on tab, filter, search, and status
  const filteredQuotes = quotes.filter(q => {
    // Tab filter (mode)
    const tabMatch = (() => {
      if (tab === 'all') return true;
      
      // Check both mode and modeLabel properties
      const mode = (q.mode || q.modeLabel || '').toLowerCase().trim();
      if (!mode) return false;
      
      if (tab === 'fcl') return mode.includes('fcl');
      if (tab === 'lcl') return mode.includes('lcl') && !mode.includes('air');
      if (tab === 'air') return mode.includes('air');
      if (tab === 'ftl') return mode.includes('ftl');
      if (tab === 'ltl') return mode.includes('ltl');
      return false;
    })();
    // Filter (not implemented, placeholder)
    const filterMatch = filter === 'all';
    // Search (by id, lane, provider) with type checks
    const searchMatch =
      (typeof q.id === 'string' && q.id.toLowerCase().includes(search.toLowerCase())) ||
      (typeof q.lane === 'string' && q.lane.toLowerCase().includes(search.toLowerCase())) ||
      (typeof q.provider === 'string' && q.provider.toLowerCase().includes(search.toLowerCase()));
    // Status
    const statusMatch = status === 'all' || q.status === status;
    return tabMatch && filterMatch && searchMatch && statusMatch;
  });
  const paginatedQuotes = filteredQuotes.slice((page-1)*itemsPerPage, page*itemsPerPage);
  const allIds = paginatedQuotes.map(q => q.id);

  // Selection logic
  const allSelected = allIds.length > 0 && allIds.every(id => selected.includes(id));
  const toggleAll = () => {
    if (allSelected) setSelected(selected.filter(id => !allIds.includes(id)));
    else setSelected([...selected, ...allIds.filter(id => !selected.includes(id))]);
  };
  const toggleRow = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter(i => i !== id) : [...selected, id]);
  };

  // Pagination
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(e.target as Node)
      ) {
        setShowFilterDropdown(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(e.target as Node)
      ) {
        setShowStatusDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Bulk action bar logic
  const selectedQuotes = quotes.filter((q: any) => selected.includes(q.id));
  const [showAllSelected, setShowAllSelected] = useState(false);

  // UI
  return (
    <div className="bg-white">
      {/* Tabs */}
      <div className="flex gap-2 space-x-8 mt-4 mb-4 border-b border-gray-200 ">
        {QUOTE_TABS.map(t => (
          <button
            key={t.value}
            className={`flex items-center gap-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px focus:outline-none 
              ${tab === t.value ? 
                'border-[#007bff] text-[#007bff]' 
              : 'border-transparent text-gray-500 hover:text-blue-600 hover:bg-gray-50'}`}
            onClick={() => setTab(t.value)}
            style={{ background: 'none' }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>
      {/* Search, Status, Actions */}
      <div className="flex flex-wrap gap-2 items-center justify-between py-2 mb-2">
        <div className="flex gap-2 items-center flex-1 min-w-0">
          <div className="relative w-64">
                <Search className="absolute left-3 top-2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
              placeholder="Search quotes..."
                  className="w-full pl-10 pr-4 text-gray-900 text-sm py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Filter custom dropdown */}
          <div className="relative" ref={filterDropdownRef}>
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setShowFilterDropdown(v => !v)}
            >
              {FILTERS.find(f => f.value === filter)?.label || 'All'}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-40 z-50">
                <div className="p-2">
                  {FILTERS.map(f => (
                    <button
                      key={f.value}
                      onClick={() => {
                        setFilter(f.value);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${filter === f.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Status custom dropdown */}
          <div className="relative" ref={statusDropdownRef}>
                <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setShowStatusDropdown(v => !v)}
            >
              {STATUS_OPTIONS.find(opt => opt.value === status)?.label || 'All Status'}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                </button>
            {showStatusDropdown && (
              <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-40 z-50">
                <div className="p-2">
                  {STATUS_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setStatus(opt.value);
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${status === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-white text-gray-900 text-sm font-medium border border-gray-300 hover:bg-gray-200 flex items-center gap-2"
            onClick={() => setShowImportModal(true)}
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-white text-gray-900 text-sm font-medium border border-gray-300 hover:bg-gray-200 flex items-center gap-2"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          {role === 'forwarder' && (
            <>
              <button 
                className="px-4 py-2 rounded-lg bg-white text-gray-900 text-sm font-medium border border-gray-300 hover:bg-gray-200 flex items-center gap-2"
                onClick={() => {
                  resetSearchAndAdditionalInfo();
                  router.push('/quotes/list/manual');
                }}
              >
                <Plus className="w-4 h-4" />
                Manual Quotation
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#007bff] text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"
                onClick={() => {
                  resetSearchAndAdditionalInfo();
                  router.push('/quotes/list/new');
                }}
              >
                <Plus className="w-4 h-4" />
                Quote
              </button>
            </>
          )}
        </div>
      </div>
      {/* Bulk Action Bar */}
      {selected.length > 0 && (
        <div className="p-3 mb-2 bg-white border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {(showAllSelected ? selectedQuotes : selectedQuotes.slice(0, 3)).map((q: any) => {
              const origin = q['origin'] || q['originAirport'] || '';
              const destination = q['destination'] || q['destinationAirport'] || '';
              return (
                <span key={`selected-quote-${q.id}`} className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-3 py-2 rounded-full">
                  {q.id} {origin && destination ? `(${origin} → ${destination})` : ''}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelected(selected.filter(i => i !== q.id));
                    }}
                    className="ml-2 text-blue-400 hover:text-blue-700 focus:outline-none"
                    title="Remove"
                    style={{ lineHeight: 1 }}
                  >
                    <X className='w-4 h-4 text-gray-500 hover:text-gray-700'/>
                  </button>
                </span>
              );
            })}
            {selectedQuotes.length > 3 && !showAllSelected && (
              <span key="selected-quotes-more" className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-3 py-2 rounded-full">
                +{selectedQuotes.length - 3} more
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              className={`px-4 py-2 text-sm font-medium text-[#007bff] bg-white rounded hover:text-blue-700 focus:outline-none transition-colors ${selectedQuotes.length !== 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => {
                router.push(`/quotes/list/invoice?id=${selectedQuotes[0].id}`);
              }}
            >
              View
            </button>
            {role === 'forwarder' ? (
              <>
                <button
                  onClick={() => setShowRemoveModal(true)}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-white hover:text-red-700 focus:outline-none"
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => updateQuoteStatus && updateQuoteStatus(selectedQuotes[0].id, 'accepted')}
                  className={`px-4 py-2 text-sm font-medium text-green-600 bg-white rounded hover:text-green-700 focus:outline-none transition-colors ${selectedQuotes.length !== 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={selectedQuotes.length !== 1}
                >
                  Accept
                </button>
                <button
                  onClick={() => updateQuoteStatus && updateQuoteStatus(selectedQuotes[0].id, 'rejected')}
                  className={`px-4 py-2 text-sm font-medium text-red-600 bg-white rounded hover:text-red-700 focus:outline-none transition-colors ${selectedQuotes.length !== 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={selectedQuotes.length !== 1}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {/* Remove Confirmation Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4">
            <h2 className="text-lg text-gray-900 font-semibold mb-4">Remove Quotes</h2>
            <div className="mb-4 text-sm text-gray-700">Are you sure you want to remove the selected quotes?</div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setQuotes(quotes.filter(q => !selected.includes(q.id)));
                  setSelected([]);
                  setShowRemoveModal(false);
                }}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="sticky left-0 z-10 bg-gray-50 w-12 px-0 py-0">
                <div className="flex justify-center items-center h-full">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </div>
              </th>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-2 text-left font-medium uppercase text-gray-500 whitespace-nowrap">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedQuotes.length === 0 ? (
              <tr><td colSpan={columns.length+2} className="text-center py-8 text-gray-400">No quotes found.</td></tr>
            ) : paginatedQuotes.map(q => (
              <tr
                key={q.id}
                className={`${selected.includes(q.id) ? 'bg-blue-50' : 'hover:bg-gray-50'} border-b border-gray-200 cursor-pointer`}
                onClick={e => {
                  // Only toggle if not clicking the checkbox or action button
                  if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('button')) return;
                  toggleRow(q.id);
                }}
              >
                <td className="sticky left-0 z-10 bg-white w-12 px-4 py-4 border-r border-gray-200">
                  <div className="flex justify-center items-center h-full">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                      checked={selected.includes(q.id)}
                      onChange={() => toggleRow(q.id)}
                      onClick={e => e.stopPropagation()}
                    />
                  </div>
                </td>
                {columns.map(col => (
                  col.key === 'status' ? (
                    <td key={col.key} className="px-4 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        q.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        q.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        q.status === 'requested' ? 'bg-yellow-100 text-yellow-700' :
                        q.status === 'expired' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{q.status}</span>
                    </td>
                  ) : col.key === 'id' ? (
                    <td key={col.key} className="px-4 py-4 text-gray-900 whitespace-nowrap overflow-x-auto">
                      {getModeIcon(q.mode || q.modeLabel)}{getValue(q, col.key)}
                    </td>
                  ) : col.key === 'details' || col.key === 'containertype' || col.key === 'truckType' || col.key === 'weightVolume' ? (
                    <td key={col.key} className="px-4 py-4 text-gray-900 whitespace-nowrap overflow-x-auto">
                      {(() => {
                        let badges: string[] = [];
                        if (Array.isArray(q[col.key])) {
                          badges = q[col.key];
                        } else if (typeof q[col.key] === 'string') {
                          badges = q[col.key].split('  ').filter(Boolean);
                        }
                        if (badges.length === 0) {
                          return <span className="text-gray-400">-</span>;
                        }
                        const displayBadges = badges.slice(0, 3);
                        const extraCount = badges.length - 3;
                        return (
                          <>
                            {displayBadges.map((badge, i) => (
                              <span key={i} className="inline-block border border-blue-300 bg-blue-50 text-blue-800 rounded-full px-3 py-1 text-xs font-semibold mr-1 truncate">{badge}</span>
                            ))}
                            {extraCount > 0 && (
                              <span className="inline-block border border-blue-300 bg-blue-50 text-blue-800 rounded-full px-2 py-1 text-xs font-semibold mr-1 truncate">+ more</span>
                            )}
                          </>
                        );
                      })()}
                    </td>
                  ) : (
                    <td key={col.key} className="px-4 py-4 text-gray-900 whitespace-nowrap overflow-x-auto">{getValue(q, col.key)}</td>
                  )
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between bg-white mt-4">
        <div className="text-sm text-gray-500">
          Showing {((page-1)*itemsPerPage)+1} to {Math.min(page*itemsPerPage, filteredQuotes.length)} of {filteredQuotes.length} quotes
        </div>
        <div className="flex gap-1 items-center">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className={`p-1 rounded transition-colors ${page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600'}`}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({length: totalPages}, (_, i) => (
            <button
              key={i+1}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${page === i+1 ? 'bg-[#007bff] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setPage(i+1)}
            >
              {i+1}
            </button>
          ))}
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            className={`p-1 rounded transition-colors ${page === totalPages || totalPages === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600'}`}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-4">Import Quotes (CSV)</h2>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleImportCSV}
              className="mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}