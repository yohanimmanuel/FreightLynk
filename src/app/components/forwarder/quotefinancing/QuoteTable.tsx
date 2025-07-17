import React, { useState, useRef } from 'react';
import { Plus, Search, ChevronDown, Ship, Box, Plane, Truck, ChevronLeft, ChevronRight, Menu, Download, Upload, Eye, Edit as EditIcon, Trash2, X as XIcon, X } from 'lucide-react';
import { useQuoteRateStore } from '../../../../store/forwarderquote';
import { useClientQuoteStore } from '@/store/clientquotes';
import { useRouter } from 'next/navigation';

const QUOTE_TABS = [
  { label: 'All', value: 'all', icon: <Menu className="w-4 h-4 mr-1" /> },
  { label: 'FCL', value: 'fcl', icon: <Ship className="w-4 h-4 mr-1" /> },
  { label: 'LCL', value: 'lcl', icon: <Box className="w-4 h-4 mr-1" /> },
  { label: 'AIR', value: 'air', icon: <Plane className="w-4 h-4 mr-1" /> },
  { label: 'FTL', value: 'ftl', icon: <Truck className="w-4 h-4 mr-1" /> },
  { label: 'LTL', value: 'ltl', icon: <Truck className="w-4 h-4 mr-1" /> },
];

const VALID_MODES = ['fcl', 'lcl', 'air', 'ftl', 'ltl'];

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
    { key: 'profit', label: 'Total profit' },
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
    { key: 'profit', label: 'Total profit' },
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
    { key: 'profit', label: 'Total profit' },
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
    { key: 'profit', label: 'Total profit' },
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
    { key: 'profit', label: 'Total profit' },
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
    { key: 'profit', label: 'Total profit' },
    { key: 'createdBy', label: 'Created by' },
    { key: 'createdDate', label: 'Created date' },
    { key: 'incoterms', label: 'Incoterms' },
    { key: 'remark', label: 'Remark' },
    { key: 'notes', label: 'Notes' },
  ],
};

// Helper to get the icon for a mode
function getModeIcon(mode: string) {
  switch (mode?.toUpperCase()) {
    case 'FCL':
      return <Ship className="inline w-4 h-4 mr-1 align-text-bottom" />;
    case 'LCL':
      return <Box className="inline w-4 h-4 mr-1 align-text-bottom" />;
    case 'AIR':
      return <Plane className="inline w-4 h-4 mr-1 align-text-bottom" />;
    case 'FTL':
    case 'LTL':
      return <Truck className="inline w-4 h-4 mr-1 align-text-bottom" />;
    default:
      return null;
  }
}

// ManualQuoteModal for manual quote creation
function ManualQuoteModal({ open, onClose, mode, onSave, initialData }: { open: boolean; onClose: () => void; mode: string; onSave: (data: any) => void; initialData?: any }) {
  const [selectedMode, setSelectedMode] = React.useState(mode === 'all' ? 'FCL' : mode.toUpperCase());
  const columns = MODE_COLUMN_CONFIGS[selectedMode.toLowerCase()] || MODE_COLUMN_CONFIGS['all'];
  const [form, setForm] = React.useState<any>(() => Object.fromEntries(columns.map(col => [col.key, ''])));
  const [showModeDropdown, setShowModeDropdown] = React.useState(false);
  React.useEffect(() => {
    if (open && initialData) {
      setForm(initialData);
      setSelectedMode(initialData.mode || (mode === 'all' ? 'FCL' : mode.toUpperCase()));
    } else if (open) {
      setForm(Object.fromEntries(columns.map(col => [col.key, ''])));
      setSelectedMode(mode === 'all' ? 'FCL' : mode.toUpperCase());
    }
    // eslint-disable-next-line
  }, [open, mode, initialData]);
  React.useEffect(() => {
    setForm((f: any) => Object.fromEntries(columns.map(col => [col.key, f[col.key] || ''])));
    // eslint-disable-next-line
  }, [selectedMode]);
  if (!open) return null;
  const quoteId = form.id || `QT-${new Date().getFullYear()}-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`;
    return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-4 max-h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2 ">
          <h2 className="text-lg font-semibold text-gray-900">Manual Quotation {mode === 'all' ? '' : `(${selectedMode})`}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none">
            <span className="sr-only">Close</span>
            <X className="w-4 h-4"/>
          </button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave({ ...form, mode: selectedMode, id: quoteId, status: 'draft' }); }}>
          {mode === 'all' && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">Mode</label>
              <div className="relative">
                <button
                  type="button"
                  className="px-3 py-2 w-full text-xs text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left relative"
                  onClick={() => setShowModeDropdown(v => !v)}
                >
                  {selectedMode}
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className={`w-4 h-4 transition-transform ${showModeDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </button>
                {showModeDropdown && (
                  <div className="absolute left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-full z-50">
                    <div className="p-2">
                      {['FCL', 'LCL', 'AIR', 'FTL', 'LTL'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => { setSelectedMode(opt); setShowModeDropdown(false); }}
                          className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${selectedMode === opt ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs text-gray-500">Quote ID:</span>
            <span className="font-mono text-xs text-gray-900 flex items-center">{getModeIcon(selectedMode)}{quoteId}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {columns.filter(col => col.key !== 'id' && col.key !== 'notes').map((col) => (
              <div key={col.key}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{col.label}</label>
                <input
                  className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form[col.key] || ''}
                  onChange={e => setForm((f: any) => ({ ...f, [col.key]: e.target.value }))}
                  name={col.key}
                  type="text"
                  placeholder={col.label}
                />
              </div>
            ))}
          </div>
          {/* Notes Section as description textarea */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Add notes..."
              value={form.notes || ''}
              onChange={e => setForm((f: any) => ({ ...f, notes: e.target.value }))}
              name="notes"
            />
          </div>
          <div className="flex justify-end gap-2 mt-6 border-t border-gray-200 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-[#007bff] rounded-lg hover:bg-blue-700">Save</button>
          </div>
        </form>
        </div>
      </div>
    );
}

function ViewQuoteModal({ open, onClose, quote, columns }: { open: boolean; onClose: () => void; quote: any; columns: any[] }) {
  if (!open || !quote) return null;

  // Helper to render status badge
  function renderStatusBadge(status: string) {
    let color = 'bg-gray-100 border-gray-300 text-gray-700';
    if (!status) return <span className="inline-block px-2 py-1 rounded border text-xs bg-gray-100 border-gray-300 text-gray-700">-</span>;
    switch (status.toLowerCase()) {
      case 'approved':
      case 'booked':
        color = 'bg-green-100 border-green-300 text-green-800';
        break;
      case 'sent':
      case 'updated':
        color = 'bg-blue-100 border-blue-300 text-blue-800';
        break;
      case 'pending':
        color = 'bg-yellow-100 border-yellow-300 text-yellow-800';
        break;
      case 'rejected':
      case 'cancelled':
        color = 'bg-red-100 border-red-300 text-red-800';
        break;
      case 'draft':
        color = 'bg-gray-100 border-gray-300 text-gray-700';
        break;
      default:
        color = 'bg-gray-100 border-gray-300 text-gray-700';
    }
    return (
      <span className={`inline-block px-3 py-1 rounded border text-xs font-semibold ${color}`}>{status}</span>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-4 max-h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2 ">
          <h2 className="text-lg font-semibold text-gray-900">Quote Details</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        {/* Details Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="text-sm font-semibold text-gray-900 mb-3">Quote details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-xs">
            {columns.filter(col => col.key !== 'notes').map(col => (
              <div key={col.key}>
                <div className="text-gray-500 mb-1">{col.label}</div>
                {col.key === 'status' ? (
                  <div>{renderStatusBadge(quote.status)}</div>
                ) : (
                  <div className="text-gray-900">{quote[col.key] || '-'}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Notes Section */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">Notes</div>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Add notes..."
            value={quote.notes || ''}
            readOnly
          />
        </div>
        <div className="flex justify-end gap-2 mt-6 border-t border-gray-200 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200">Close</button>
        </div>
      </div>
    </div>
  );
}

export default function QuoteTable({ role = 'forwarder' }: { role?: 'forwarder' | 'client' }) {
  // Forwarder store
  const forwarderStore = useQuoteRateStore();
  // Client store
  const clientStore = useClientQuoteStore();

  // Choose the correct store based on role
  const quotes: any[] = role === 'forwarder' ? forwarderStore.quotes : clientStore.quotes;
  const setQuotes = role === 'forwarder' ? forwarderStore.setQuotes : clientStore.setQuotes;
  // For client: Accept/Reject actions
  const updateQuoteStatus = role === 'client' ? clientStore.updateQuoteStatus : undefined;

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
  const [showManualModal, setShowManualModal] = useState(false);
  const [editQuote, setEditQuote] = useState<any|null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewQuote, setViewQuote] = useState<any|null>(null);
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
      case 'isTariff': return q.isTariff ? 'Yes' : 'No';
      case 'containertype': return q.containertype;
      case 'origin': return q.origin;
      case 'destination': return q.destination;
      case 'status': return q.status;
      case 'profit': return q.profit;
      case 'createdBy': return q.createdBy;
      case 'createdDate': return q.createdDate;
      case 'weightVolume': return q.weightVolume;
      case 'truckType': return q.truckType;
      default: return '';
    }
  };

  // Filtered quotes based on tab, filter, search, and status
  const filteredQuotes = quotes.filter(q => {
    // Tab filter (mode)
    const tabMatch = tab === 'all'
      ? (q.mode && VALID_MODES.includes(q.mode.toLowerCase()))
      : (q.mode && q.mode.toLowerCase() === tab);
    // Filter (not implemented, placeholder)
    const filterMatch = filter === 'all';
    // Search (by id, lane, carrier) with type checks
    const searchMatch =
      (typeof q.id === 'string' && q.id.toLowerCase().includes(search.toLowerCase())) ||
      (typeof q.lane === 'string' && q.lane.toLowerCase().includes(search.toLowerCase())) ||
      (typeof q.carrier === 'string' && q.carrier.toLowerCase().includes(search.toLowerCase()));
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
              <button className="px-4 py-2 rounded-lg bg-white text-gray-900 text-sm font-medium border border-gray-300 hover:bg-gray-200 flex items-center gap-2" onClick={() => setShowManualModal(true)}>
                <Plus className="w-4 h-4" />
                Manual Quotation
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#007bff] text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2"
                onClick={() => router.push('/quotes/list/new')}
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
            {selectedQuotes.map((q: any) => {
              const origin = q['origin'] || q['originAirport'] || '';
              const destination = q['destination'] || q['destinationAirport'] || '';
              return (
                <span key={q.id} className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-3 py-2 rounded-full">
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
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { if (selectedQuotes.length === 1) { setViewQuote(selectedQuotes[0]); setShowViewModal(true); }}}
              className={`px-4 py-2 text-sm font-medium text-[#007bff] bg-white rounded hover:text-blue-700 focus:outline-none transition-colors ${selectedQuotes.length !== 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={selectedQuotes.length !== 1}
            >
              View
            </button>
            {role === 'forwarder' ? (
              <>
                <button
                  onClick={() => { if (selectedQuotes.length === 1) { setEditQuote(selectedQuotes[0]); setShowManualModal(true); }}}
                  className={`px-4 py-2 text-sm font-medium text-green-600 bg-white rounded hover:text-green-700 focus:outline-none transition-colors ${selectedQuotes.length !== 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={selectedQuotes.length !== 1}
                >
                  Edit
                </button>
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
                <th key={col.key} className="px-2 py-2 text-left font-medium uppercase text-gray-500 whitespace-nowrap">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedQuotes.length === 0 ? (
              <tr><td colSpan={columns.length+1} className="text-center py-8 text-gray-400">No quotes found.</td></tr>
            ) : paginatedQuotes.map(q => (
              <tr
                key={q.id}
                className={`${selected.includes(q.id) ? 'bg-blue-50' : 'hover:bg-gray-50'} border-b border-gray-200 cursor-pointer`}
                onClick={e => {
                  // Only toggle if not clicking the checkbox
                  if ((e.target as HTMLElement).tagName === 'INPUT') return;
                  toggleRow(q.id);
                }}
              >
                <td className="sticky left-0 z-10 bg-white w-12 px-0 py-0 border-r border-gray-200">
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
                    <td key={col.key} className="px-2 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        q.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        q.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        q.status === 'requested' ? 'bg-yellow-100 text-yellow-700' :
                        q.status === 'expired' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{q.status}</span>
                    </td>
                  ) : col.key === 'id' ? (
                    <td key={col.key} className="px-4 py-4 text-gray-900 font-mono flex items-center gap-1">
                      {getModeIcon(tab === 'all' ? q.mode : tab)}{getValue(q, col.key)}
                    </td>
                  ) : col.key === 'details' ? (
                    <td key={col.key} className="px-4 py-4 text-gray-900">
                      {[
                        q.containertype,
                        q.weightVolume,
                        q.truckType
                      ].filter(Boolean).join(', ') || '-'}
                    </td>
                  ) : (
                    <td key={col.key} className="px-4 py-4 text-gray-900">{getValue(q, col.key)}</td>
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
      {/* View Modal */}
      <ViewQuoteModal open={showViewModal} onClose={() => setShowViewModal(false)} quote={viewQuote} columns={MODE_COLUMN_CONFIGS[tab] || MODE_COLUMN_CONFIGS['all']} />
      {/* Manual/Edit Modal */}
      <ManualQuoteModal open={showManualModal} onClose={() => { setShowManualModal(false); setEditQuote(null); }} mode={tab} onSave={data => {
        if (editQuote) {
          setQuotes(quotes.map(q => q.id === editQuote.id ? { ...editQuote, ...data } : q));
        } else {
          setQuotes([...quotes, data]);
        }
        setShowManualModal(false);
        setEditQuote(null);
      }} initialData={editQuote} />
    </div>
  );
}