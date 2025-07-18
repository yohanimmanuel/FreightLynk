import React, { useState } from 'react';
import { Search, ChevronDown, X, Menu, Ship, Box, Plane, Truck, Upload, Download, CheckCircle, XCircle } from 'lucide-react';
import { useQuoteRateStore } from '@/store/forwarderquote';
import { useClientQuoteStore } from '@/store/clientquotes';
import { useBookingStore } from '@/store/bookingStore';

// Column configs for quote requests
const REQUEST_COLUMNS = [
  { key: 'id', label: 'Request ID' },
  { key: 'customer', label: 'Customer Name' },
  { key: 'commodities', label: 'Commodities' },
  { key: 'details', label: 'Details' },
  { key: 'origin', label: 'Origin' },
  { key: 'destination', label: 'Destination' },
  { key: 'cargoReadyDate', label: 'Cargo Ready Date' },
  { key: 'expectedDelivery', label: 'Target Delivery Date' },
  { key: 'attachment', label: 'Attachment' },
  { key: 'status', label: 'Status' },
  { key: 'incoterms', label: 'Incoterms' },
  { key: 'createdBy', label: 'Created By' },
  { key: 'createdOn', label: 'Created On' },
  { key: 'notes', label: 'Notes' },
  // Add more fields as needed
];

// Example mock data
type RequestType = {
  id: string;
  customer: string;
  provider?: string;
  details: string;
  origin: string;
  destination: string;
  attachment: string;
  status: string;
  incoterms: string;
  createdBy: string;
  createdOn: string;
  mode?: string;
  notes?: string;
  commodity?: string;
  expectedDelivery?: string;
  cargoReadyDate?: string;
  [key: string]: string | undefined; // index signature for dynamic access
};

function ViewRequestModal({ open, onClose, request, columns, onUpdate, onCancel, role = 'forwarder' }: { open: boolean; onClose: () => void; request: RequestType | undefined; columns: { key: string; label: string }[]; onUpdate?: (id: string) => void; onCancel?: (id: string) => void; role?: 'forwarder' | 'client' }) {
  if (!open || !request) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-4 max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Success Alert */}
        {/* This alert is now handled by the parent component */}
        {/* Top: Origin, Destination, Volume */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Origin</div>
            <div className="font-semibold text-gray-900 text-sm">{request.origin}</div>
          </div>
          <div className="flex flex-wrap gap-2 my-2 md:my-0">
            {request.volume && request.volume.split(',').map((v, i) => (
              <span key={i} className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full border border-blue-200">{v.trim()}</span>
            ))}
          </div>
          <div>
            <div className="text-sm  text-gray-500 mb-1">Destination</div>
            <div className="font-semibold text-gray-900 text-sm">{request.destination}</div>
          </div>
        </div>
        {/* Details Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="text-sm font-semibold text-gray-900 mb-3">Quote request details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-xs">
            <div>
              <div className="text-gray-500 mb-1">Request ID</div>
              <div className="font-bold text-gray-900">{request.id}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Details</div>
              <div className="text-gray-900">{request.details || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Incoterms</div>
              <div className="font-bold text-gray-900">{request.incoterms || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Commodities</div>
              <div className="text-gray-900">{request.commodities || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Target delivery date</div>
              <div className="text-gray-900">{request.expectedDelivery || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Cargo ready date</div>
              <div className="text-gray-900">{request.cargoReadyDate || '-'}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Status</div>
              <div className={
                `inline-block font-bold px-3 py-1 rounded-lg text-xs
                ${request.status === 'Booked' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                  request.status === 'Updated' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  request.status === 'Canceled' ? 'bg-red-100 text-red-800 border border-red-200' :
                  'bg-gray-100 text-gray-700 border border-gray-200'}
                `
              }>
                {request.status}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-1">Attachment</div>
              <div className="text-gray-900">{request.attachment || '-'}</div>
            </div>
              <>
                <div>
                  <div className="text-gray-500 mb-1">Created By</div>
                  <div className="text-gray-900">{request.createdBy || '-'}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Created On</div>
                  <div className="text-gray-900">{request.createdOn || '-'}</div>
                </div>
              </>
          </div>
        </div>
        {/* Notes Section */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">Notes</div>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Add notes..."
            defaultValue={request.notes || ''}
            readOnly
          />
        </div>
        {/* Action Buttons */}
        <div className="flex justify-between gap-2 mt-6 border-t border-gray-200 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200">Back</button>
          {role === 'forwarder' && (
            <div className="flex gap-2">
              <button type="button" onClick={() => onUpdate && onUpdate(request.id)} className="px-4 py-2 text-sm text-white bg-[#007bff] rounded-lg hover:bg-blue-700">Update</button>
              <button type="button" onClick={() => onCancel && onCancel(request.id)} className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-700">Cancel Request</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const REQUEST_TABS = [
  { label: 'All', value: 'all', icon: <Menu className="w-4 h-4 mr-1" /> },
  { label: 'FCL', value: 'fcl', icon: <Ship className="w-4 h-4 mr-1" /> },
  { label: 'LCL', value: 'lcl', icon: <Box className="w-4 h-4 mr-1" /> },
  { label: 'AIR', value: 'air', icon: <Plane className="w-4 h-4 mr-1" /> },
  { label: 'FTL', value: 'ftl', icon: <Truck className="w-4 h-4 mr-1" /> },
  { label: 'LTL', value: 'ltl', icon: <Truck className="w-4 h-4 mr-1" /> },
];

function getModeIcon(mode?: string) {
  switch ((mode || '').toUpperCase()) {
    case 'FCL':
    case 'LCL':
      return <Ship className="inline w-4 h-4 mr-1 align-text-bottom" />;
    case 'AIR':
      return <Plane className="inline w-4 h-4 mr-1 align-text-bottom" />;
    case 'FTL':
    case 'LTL':
      return <Truck className="inline w-4 h-4 mr-1 align-text-bottom" />;
    default:
      return <Menu className="inline w-4 h-4 mr-1 align-text-bottom" />;
  }
}

export default function QuoteRequest({ role = 'forwarder', hasBookings = true }: { role?: 'forwarder' | 'client'; hasBookings?: boolean }) {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [successType, setSuccessType] = useState<'success' | 'error' | null>(null);

  // Use forwarder or client store based on role
  const forwarderStore = useQuoteRateStore();
  const clientStore = useClientQuoteStore();
  const bookingStore = useBookingStore();

  // Requests data source
  let requests: RequestType[] = [];
  if (role === 'forwarder') {
    requests = [];
  } else if (role === 'client') {
    // Map confirmedBookings to quote request rows
    const today = new Date().toLocaleDateString('en-CA');
    requests = bookingStore.confirmedBookings.map((b: any, idx: number) => {
      // Determine mode for tab and icon
      let mode = '';
      if (b.transportModeValue === 'sea') {
        mode = b.shipmentTypeValue?.toLowerCase() === 'fcl' ? 'fcl' : 'lcl';
      } else if (b.transportModeValue === 'air') {
        mode = 'air';
      } else if (b.transportModeValue === 'land') {
        mode = b.shipmentTypeValue?.toLowerCase() === 'ftl' ? 'ftl' : 'ltl';
      }
      // Build details string
      let details = '';
      if (b.transportModeValue === 'sea' && b.shipmentTypeValue?.toLowerCase() === 'fcl') {
        details = `${b.containerQuantity || ''} x ${b.containerTypeValue || ''}`;
      } else if (b.transportModeValue === 'land' && b.shipmentTypeValue?.toLowerCase() === 'ftl') {
        details = `${b.truckQuantity || ''} x ${b.truckType || ''}`;
      } else {
        // Default: weight/volume/cargo
        details = (b.weight && b.volume) ? `${b.weight}kg/${b.volume}cbm` : b.weight ? `${b.weight}kg` : b.volume ? `${b.volume}cbm` : '';
      }
      return {
        id: b.bookingId || `REQ-${idx+1}`,
        customer: b.shipperValue || 'Demo User',
        provider: b.provider || '',
        details,
        origin: b.originPort || '',
        destination: b.destinationPort || '',
        cargoReadyDate: b.cargoReadyDate || '',
        expectedDelivery: b.eta || '',
        attachment: b.attachment || 'No attached file',
        status: b.status || 'Booked',
        incoterms: b.incotermsValue || '',
        remark: '', // Always blank for client
        createdBy: 'Demo User',
        createdOn: today,
        mode,
        notes: '',
        commodities: b.productName || '', // Use 'productName' for commodities
      };
    });
  }
  const [localRequests, setLocalRequests] = useState<RequestType[]>(requests);

  // Hide remark, provider, and transitTime columns for client
  let columns = [...REQUEST_COLUMNS];
  if (role === 'client') {
    columns = columns.filter(col => col.key !== 'remark' && col.key !== 'provider' && col.key !== 'transitTime');
  }

  // Filtered data (add real filtering logic as needed)
  const filteredRequests = localRequests.filter(r =>
    (tab === 'all' || (r.mode && r.mode.toLowerCase() === tab)) &&
    (search === '' || Object.values(r).some(val => val !== undefined && val.toString().toLowerCase().includes(search.toLowerCase())))
  );

  // Bulk action bar logic
  const selectedRequests = filteredRequests.filter(r => selected.includes(r.id));

  // Handler to update or cancel a request
  const handleRequestAction = (id: string, action: 'update' | 'cancel') => {
    setLocalRequests(prev => prev.map(r =>
      r.id === id
        ? {
            ...r,
            status: action === 'update' ? 'Updated' : 'Canceled',
          }
        : r
    ));
    if (action === 'update') {
      setSuccessMsg('Updated request successfully');
      setSuccessType('success');
    } else {
      setSuccessMsg('Quote request cancelled');
      setSuccessType('error');
    }
    setTimeout(() => { setSuccessMsg(null); setSuccessType(null); }, 2000);
  };

  // Client: show booking message if no bookings
  if (role === 'client' && !hasBookings) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-lg">
        Please create a booking to request your quote.
      </div>
    );
  }

  // Handlers for CSV import/export
  const handleExportCSV = () => {
    // Placeholder: implement export logic
    alert('Export CSV clicked');
  };
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Placeholder: implement import logic
    alert('Import CSV clicked');
  };

  return (
    <div className="bg-white">
      {successMsg && (
        <div className={`fixed top-30 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded px-4 py-2 shadow-lg border ${successType === 'error' ? 'bg-red-100 border-red-200 text-red-800' : 'bg-green-100 border-green-200 text-green-800'}`}>
          {successType === 'error' ? (
            <XCircle className="w-5 h-5 text-red-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          <span className="text-sm font-medium">{successMsg}</span>
        </div>
      )}
      {/* Mode Tabs */}
      <div className="flex gap-2 space-x-8 mt-4 mb-4 border-b border-gray-200 ">
        {REQUEST_TABS.map(t => (
          <button
            key={t.value}
            className={`flex items-center gap-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px focus:outline-none 
              ${tab === t.value ? 
                'border-[#007bff] text-[#007bff]' 
              : 'border-transparent text-gray-500 hover:text-blue-600 hover:bg-gray-50'}`}
            onClick={() => setTab(t.value)}
            style={{ background: 'none' }}
          >
            {t.icon}{t.label}
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
              placeholder="Search requests..."
              className="w-full pl-10 pr-4 text-gray-900 text-sm py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* Status custom dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setShowStatusDropdown(v => !v)}
            >
              {status === 'all' ? 'All Status' : status}
              <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-40 z-50">
                <div className="p-2">
                  {/* Add status options here */}
                  <button
                    onClick={() => { setStatus('all'); setShowStatusDropdown(false); }}
                    className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${status === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                  >
                    All Status
                  </button>
                  <button
                    onClick={() => { setStatus('Pending'); setShowStatusDropdown(false); }}
                    className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${status === 'Pending' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => { setStatus('Updated'); setShowStatusDropdown(false); }}
                    className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${status === 'Updated' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                  >
                    Updated
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-white text-gray-900 text-sm font-medium border border-gray-300 hover:bg-gray-200 flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleImportCSV}
            className="hidden"
          />
          <button
            className="px-4 py-2 rounded-lg bg-white text-gray-900 text-sm font-medium border border-gray-300 hover:bg-gray-200 flex items-center gap-2"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>
      {/* Bulk Action Bar */}
      {selected.length > 0 && (
        <div className="p-3 mb-2 bg-white border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {selectedRequests.map((r: RequestType) => (
              <span key={r.id} className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-3 py-2 rounded-full">
                {r.id} {r.origin && r.destination ? `(${r.origin} → ${r.destination})` : ''}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setSelected(selected.filter(i => i !== r.id));
                  }}
                  className="ml-2 text-blue-400 hover:text-blue-700 focus:outline-none"
                  title="Remove"
                  style={{ lineHeight: 1 }}
                >
                  <X className='w-4 h-4 text-gray-500 hover:text-gray-700'/>
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { if (selectedRequests.length === 1) { setSelectedId(selectedRequests[0].id); setShowViewModal(true); }}}
              className={`px-4 py-2 text-sm font-medium text-[#007bff] bg-white rounded hover:text-blue-700 focus:outline-none transition-colors ${selectedRequests.length !== 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={selectedRequests.length !== 1}
            >
              View
            </button>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="sticky left-0 z-10 bg-gray-50 w-12 px-4 py-2">
                <div className="flex justify-center items-center h-full">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                    checked={filteredRequests.length > 0 && filteredRequests.every(r => selected.includes(r.id))}
                    onChange={() => {
                      if (filteredRequests.length > 0 && filteredRequests.every(r => selected.includes(r.id))) {
                        setSelected(selected.filter(id => !filteredRequests.map(r => r.id).includes(id)));
                      } else {
                        setSelected([...selected, ...filteredRequests.map(r => r.id).filter(id => !selected.includes(id))]);
                      }
                    }}
                  />
                </div>
              </th>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-2 text-left font-medium uppercase text-gray-500 whitespace-nowrap">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr><td colSpan={columns.length+1} className="text-center py-8 text-gray-400">No requests found.</td></tr>
            ) : filteredRequests.map(request => (
              <tr
                key={request.id}
                className={`hover:bg-blue-50 cursor-pointer border-b border-gray-200 transition ${selected.includes(request.id) ? 'bg-blue-50' : ''}`}
                onClick={e => {
                  // Only toggle if not clicking the checkbox
                  if ((e.target as HTMLElement).tagName === 'INPUT') return;
                  setSelected(selected.includes(request.id) ? selected.filter(i => i !== request.id) : [...selected, request.id]);
                }}
              >
                <td className="sticky left-0 z-10 bg-white w-12 px-0 py-0 border-r border-gray-200">
                  <div className="flex justify-center items-center h-full">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                      checked={selected.includes(request.id)}
                      onChange={() => setSelected(selected.includes(request.id) ? selected.filter(i => i !== request.id) : [...selected, request.id])}
                      onClick={e => e.stopPropagation()}
                    />
                  </div>
                </td>
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-4 whitespace-nowrap text-xs text-gray-700">
                    {col.key === 'id'
                      ? <span className="font-mono text-xs text-gray-900 flex items-center">{getModeIcon(request.mode)}{request[col.key]}</span>
                      : col.key === 'status'
                        ? (
                          <span className={
                            `inline-block font-bold px-3 py-1 rounded-lg text-xs border
                            ${request.status === 'Booked' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                              request.status === 'Updated' ? 'bg-green-100 text-green-800 border-green-200' :
                              request.status === 'Canceled' ? 'bg-red-100 text-red-800 border-red-200' :
                              'bg-gray-100 text-gray-700 border-gray-200'}
                            `
                          }>
                            {request.status}
                          </span>
                        )
                        : request[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* View Modal */}
      <ViewRequestModal
        open={showViewModal}
        onClose={() => setShowViewModal(false)}
        request={filteredRequests.find(r => r.id === selectedId)}
        columns={columns}
        onUpdate={id => {
          setShowViewModal(false);
          handleRequestAction(id, 'update');
        }}
        onCancel={id => {
          setShowViewModal(false);
          handleRequestAction(id, 'cancel');
        }}
        role={role}
      />
    </div>
  );
}
