import React, { useState } from 'react';
import { ChevronDown, Upload, Download, Plus, Search as SearchIcon, Ship, Plane, Truck, Trash2, X as XIcon } from 'lucide-react';
import RateParser from './RateParser';
import { Rate } from '../../../../store/forwarderquote';
import { useQuoteRateStore } from '../../../../store/forwarderquote';

// Mode-to-columns configuration for dynamic table rendering
const MODE_COLUMN_CONFIGS = {
  FCL: [
    { key: 'provider', label: 'Provider' },
    { key: 'agent', label: 'Agent' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    // FCL Load
    { key: 'currency', label: 'Currency' },
    { key: 'transitTime', label: 'Transit Time' },
    { key: 'ocean20dc', label: 'Ocean 20"DC' },
    { key: 'ocean40dc', label: 'Ocean 40"DC' },
    { key: 'ocean40hc', label: 'Ocean 40"HC' },
    { key: 'ocean45hc', label: 'Ocean 45"HC' },
    { key: 'ocean20rf', label: 'Ocean 20"RF' },
    { key: 'ocean40rf', label: 'Ocean 40"RF' },
    { key: 'ocean20tank', label: 'Ocean 20"TANK' },
    { key: 'ocean40tank', label: 'Ocean 40"TANK' },
    { key: 'ocean20fr', label: 'Ocean 20"FR' },
    { key: 'ocean40fr', label: 'Ocean 40"FR' },
    { key: 'ocean20ot', label: 'Ocean 20"OT' },
    { key: 'ocean40ot', label: 'Ocean 40"OT' },
    // Other fields
    { key: 'portOfDischarge', label: 'Port of Discharge' },
    { key: 'transitPort', label: 'Transit Port' },
    { key: 'remark', label: 'Remark' },
    { key: 'commodity', label: 'Commodity' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'validFrom', label: 'Valid From' },
    { key: 'validTo', label: 'Valid Until' },
    { key: 'createdOn', label: 'Created On' },
    { key: 'type', label: 'Type' },
    { key: 'createType', label: 'Create Type' },
    { key: 'service', label: 'Service' },
    { key: 'serviceCode', label: 'Service Code' },
    { key: 'note', label: 'Note' },
    { key: 'contract', label: 'Contract' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'action', label: 'Action' },
  ],
  LCL: [
    { key: 'provider', label: 'Provider' },
    { key: 'agent', label: 'Agent' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    // Loose Cargo
    { key: 'transitTime', label: 'Transit Time' },
    { key: 'currency', label: 'Currency' },
    { key: 'price', label: 'Price (per CBM or 1,000kg)' },
    { key: 'baseRate', label: 'Base Rate/Range' },
    { key: 'minCharge', label: 'Minimum Charge' },
    // Other fields
    { key: 'portOfDischarge', label: 'Port of Discharge' },
    { key: 'transitPort', label: 'Transit Port' },
    { key: 'remark', label: 'Remark' },
    { key: 'commodity', label: 'Commodity' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'validFrom', label: 'Valid From' },
    { key: 'validTo', label: 'Valid Until' },
    { key: 'createdOn', label: 'Created On' },
    { key: 'type', label: 'Type' },
    { key: 'createType', label: 'Create Type' },
    { key: 'service', label: 'Service' },
    { key: 'serviceCode', label: 'Service Code' },
    { key: 'note', label: 'Note' },
    { key: 'contract', label: 'Contract' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'action', label: 'Action' },
  ],
  AIR: [
    { key: 'provider', label: 'Provider' },
    { key: 'agent', label: 'Agent' },
    { key: 'originAirport', label: 'Origin Airport' },
    { key: 'destinationAirport', label: 'Destination Airport' },
    { key: 'airline', label: 'Airline' },
    // Air Freight
    { key: 'transitTime', label: 'Transit Time' },
    { key: 'currency', label: 'Currency' },
    { key: 'rate45', label: '+45kg Rate' },
    { key: 'rate100', label: '+100kg Rate' },
    { key: 'rate300', label: '+300kg Rate' },
    { key: 'rate500', label: '+500kg Rate' },
    { key: 'rate1000', label: '+1000kg Rate' },
    { key: 'minCharge', label: 'Minimum Charge' },
    // Other fields
    { key: 'portOfDischarge', label: 'Port of Discharge' },
    { key: 'transitPort', label: 'Transit Port' },
    { key: 'remark', label: 'Remark' },
    { key: 'commodity', label: 'Commodity' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'validFrom', label: 'Valid From' },
    { key: 'validTo', label: 'Valid Until' },
    { key: 'createdOn', label: 'Created On' },
    { key: 'type', label: 'Type' },
    { key: 'createType', label: 'Create Type' },
    { key: 'service', label: 'Service' },
    { key: 'serviceCode', label: 'Service Code' },
    { key: 'note', label: 'Note' },
    { key: 'contract', label: 'Contract' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'action', label: 'Action' },
  ],
  FTL: [
    { key: 'provider', label: 'Provider' },
    { key: 'agent', label: 'Agent' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    // Full Truckload
    { key: 'transitTime', label: 'Transit Time' },
    { key: 'currency', label: 'Currency' },
    { key: 'truckType', label: 'Truck Type' },
    { key: 'rate', label: 'Rate' },
    { key: 'minCharge', label: 'Minimum Charge' },
    // Other fields
    { key: 'portOfDischarge', label: 'Port of Discharge' },
    { key: 'transitPort', label: 'Transit Port' },
    { key: 'remark', label: 'Remark' },
    { key: 'commodity', label: 'Commodity' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'validFrom', label: 'Valid From' },
    { key: 'validTo', label: 'Valid Until' },
    { key: 'createdOn', label: 'Created On' },
    { key: 'type', label: 'Type' },
    { key: 'createType', label: 'Create Type' },
    { key: 'service', label: 'Service' },
    { key: 'serviceCode', label: 'Service Code' },
    { key: 'note', label: 'Note' },
    { key: 'contract', label: 'Contract' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'action', label: 'Action' },
  ],
  LTL: [
    { key: 'provider', label: 'Provider' },
    { key: 'agent', label: 'Agent' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    // Less than Truckload
    { key: 'transitTime', label: 'Transit Time' },
    { key: 'currency', label: 'Currency' },
    { key: 'price', label: 'Price (per 100kg or pallet)' },
    { key: 'baseRate', label: 'Base Rate/Range' },
    { key: 'minCharge', label: 'Minimum Charge' },
    // Other fields
    { key: 'portOfDischarge', label: 'Port of Discharge' },
    { key: 'transitPort', label: 'Transit Port' },
    { key: 'remark', label: 'Remark' },
    { key: 'commodity', label: 'Commodity' },
    { key: 'createdBy', label: 'Created By' },
    { key: 'validFrom', label: 'Valid From' },
    { key: 'validTo', label: 'Valid Until' },
    { key: 'createdOn', label: 'Created On' },
    { key: 'type', label: 'Type' },
    { key: 'createType', label: 'Create Type' },
    { key: 'service', label: 'Service' },
    { key: 'serviceCode', label: 'Service Code' },
    { key: 'note', label: 'Note' },
    { key: 'contract', label: 'Contract' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'action', label: 'Action' },
  ],
};

const MODES = ['FCL', 'LCL', 'AIR', 'FTL', 'LTL'];

// Add a helper to get the icon for each mode
const getModeIcon = (mode: string) => {
    switch (mode) {
    case 'FCL':
    case 'LCL':
      return <Ship className="w-4 h-4 mr-1" />;
    case 'AIR':
      return <Plane className="w-4 h-4 mr-1" />;
    case 'FTL':
    case 'LTL':
      return <Truck className="w-4 h-4 mr-1" />;
    default:
      return null;
  }
};

// Placeholder data structure for a rate row - ONLY new standardized fields from STANDARD_FIELDS
const BLANK_RATE: Rate = {
  id: 0,
  provider: '',
  agent: '',
  origin: '',
  destination: '',
  ocean20dc: '',
  ocean40dc: '',
  ocean40hc: '',
  ocean45hc: '',
  ocean20rf: '',
  ocean40rf: '',
  ocean20tank: '',
  ocean40tank: '',
  ocean20fr: '',
  ocean40fr: '',
  ocean20ot: '',
  ocean40ot: '',
  portOfDischarge: '',
  transitPort: '',
  remark: '',
  commodity: '',
  createdBy: '',
      validFrom: '',
      validTo: '',
  createdOn: '',
  type: '',
  createType: '',
  service: '',
  serviceCode: '',
  note: '',
  contract: '',
  frequency: '',
  transitTime: '',
  currency: '',
  price: '',
  baseRate: '',
  minCharge: '',
  originAirport: '',
  destinationAirport: '',
  airline: '',
  rate45: '',
  rate100: '',
  rate300: '',
  rate500: '',
  rate1000: '',
  truckType: '',
  rate: '',
  status: '',
};
type Mode = 'FCL' | 'LCL' | 'AIR' | 'FTL' | 'LTL';

interface RateModalFormProps {
  open: boolean;
  onClose: () => void;
  initialData: Rate | null;
  mode: Mode;
  onSave: (data: Rate) => void;
}

function RateModalForm({ open, onClose, initialData, mode, onSave }: RateModalFormProps) {
  const [form, setForm] = useState<Rate>(initialData || BLANK_RATE);
  // Ensure form is updated when initialData or open changes
  React.useEffect(() => {
    setForm(initialData || BLANK_RATE);
  }, [initialData, open]);
  const columns = MODE_COLUMN_CONFIGS[mode] || [];
  if (!open) return null;
    return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-4 max-h-[80vh] overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2 ">
          <h2 className="text-lg font-semibold text-gray-900">{initialData ? 'Edit Rate' : 'Add Rate'} ({mode})</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none">
            <XIcon className="w-5 h-5" />
            </button>
          </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          <div className="grid grid-cols-2 gap-4">
            {columns.filter((col) => col.key !== 'action').map((col) => (
              <div key={col.key}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{col.label}</label>
                <input
                  className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form[col.key as keyof Rate] || ''}
                  onChange={e => setForm(f => ({ ...f, [col.key as keyof Rate]: e.target.value }))}
                  name={col.key}
                  type="text"
                  placeholder={col.label}
                />
                </div>
              ))}
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

export default function RateTable() {
  const [mode, setMode] = useState<Mode>('FCL');
  const rates = useQuoteRateStore(state => state.rates);
  const setRates = useQuoteRateStore(state => state.setRates);
  const [showAdd, setShowAdd] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const columns = MODE_COLUMN_CONFIGS[mode] || [];

  // Search, status, and column visibility state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'available' | 'expiring' | 'expired'>('all');

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Add remove modal state
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeIdx, setRemoveIdx] = useState<number | null>(null);

  // Add import modal state
  const [showImport, setShowImport] = useState(false);

  // Filtered and searched rates
  const filteredRates = rates.filter(rate => {
    // Only show rates for the current mode
    if (!rate.mode || rate.mode !== mode) return false;
    // Status filter logic placeholder (customize as needed)
    let statusMatch = true;
    if (status === 'available') statusMatch = true; // TODO: implement real logic
    if (status === 'expiring') statusMatch = true;
    if (status === 'expired') statusMatch = true;
    // Search logic: only check string fields
    const searchMatch = Object.values(rate).some(val => typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase()));
    return statusMatch && searchMatch;
  });
  const paginatedRates = filteredRates.slice((page-1)*itemsPerPage, page*itemsPerPage);
  // Bulk selection state (must be after paginatedRates)
  const [selectedRates, setSelectedRates] = useState<number[]>([]);
  const allIds = paginatedRates.map((_, idx) => (page-1)*itemsPerPage+idx);
  const allSelected = selectedRates.length === paginatedRates.length && paginatedRates.length > 0;

  // Bulk remove handler
  const handleBulkRemove = () => {
    setRates(rates.filter((_, idx) => !selectedRates.includes(idx)));
    setSelectedRates([]);
    setShowRemoveModal(false);
  };

  return (
    <div className="bg-white">
      {/* Mode Tabs */}
      <nav className="flex space-x-8 border-b border-gray-200 mb-6">
        {MODES.map((m) => {
          const isActive = mode === m;
          return (
          <button 
              key={m}
              onClick={() => setMode(m as Mode)}
              className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-1 transition-colors focus:outline-none ${
                isActive
                  ? 'border-[#007bff] text-[#007bff]'
                  : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-200'
              }`}
            >
              {getModeIcon(m)}
              {m}
          </button>
          );
        })}
      </nav>
      {/* Controls Row: Search, Mode, Status, and Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl w-200">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
            placeholder="Search by route, city, or carrier..."
            className="pl-10 pr-4 py-2 text-sm text-gray-900 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
          {/* Status Filter Dropdown */}
        <div className="relative">
            <button 
              onClick={() => setShowStatusDropdown(v => !v)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {status === 'all' ? 'All Statuses' : status === 'available' ? 'Available' : status === 'expiring' ? 'Expiring soon' : 'Expired'}
              <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showStatusDropdown && (
              <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-40 z-50">
                <div className="p-2">
                  {['all','available','expiring','expired'].map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        setStatus(s as any);
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${status === s ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      {s==='all'?'All Statuses':s==='available'?'Available':s==='expiring'?'Expiring soon':'Expired'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2">
            <button 
            className="flex items-center text-sm text-gray-900 gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200"
            onClick={() => setShowImport(true)}
            >
            <Upload className="w-4 h-4" />
            Import CSV
            </button>
          <button className="flex items-center text-sm text-gray-900 gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button onClick={()=>setShowAdd(true)} className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-[#007bff] rounded-md hover:bg-blue-700 transition-colors">
            <Plus size={16} className="mr-2" />
            Add New Rate
          </button>
                </div>
              </div>
      {/* Bulk Action Bar */}
      {selectedRates.length > 0 && (
        <div className="p-3 mb-2 bg-white border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {selectedRates.map(idx => {
              const rate = rates[idx];
              if (!rate) return null;
              return (
                <span key={idx} className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-3 py-2 rounded-full mr-2 mb-1">
                  {rate.origin} → {rate.destination}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedRates(selectedRates.filter(i => i !== idx));
                    }}
                    className="ml-2 text-blue-400 hover:text-blue-700 focus:outline-none"
                    title="Remove"
                    style={{ lineHeight: 1 }}
                  >
                    <XIcon className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                  </button>
            </span>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => selectedRates.length === 1 && setEditIdx(selectedRates[0])}
              className={`px-4 py-2 text-sm font-medium text-[#007bff] bg-white rounded hover:text-blue-700 focus:outline-none transition-colors ${selectedRates.length !== 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={selectedRates.length !== 1}
              >
                Edit
              </button>
              <button
              onClick={() => setShowRemoveModal(true)}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-white hover:text-red-700 focus:outline-none"
              >
              Remove
              </button>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
              <th className="sticky left-0 bg-white z-10   px-4 py-2 text-left font-medium text-gray-500 uppercase whitespace-nowrap border-r border-gray-200">
                <input
                   type="checkbox"
                   checked={allSelected}
                   onChange={e => setSelectedRates(e.target.checked ? allIds : [])}
                   className="w-4 h-4 accent-[#007bff] rounded-lg border-gray-300 transition-colors cursor-pointer align-middle"
                   aria-label="Select all rates"
                />
              </th>
              {columns.filter(col => col.key !== 'action').map((col) => (
                <th key={col.key} className="px-4 py-2 text-left font-medium text-gray-500 uppercase whitespace-nowrap">{col.label}</th>
              ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRates.length === 0 ? (
              <tr><td colSpan={columns.length+1} className="text-center py-8 text-gray-400">No rates found.</td></tr>
            ) : paginatedRates.map((rate, idx) => {
              const globalIdx = (page-1)*itemsPerPage+idx;
              return (
                <tr key={idx} className={`hover:bg-blue-50 ${selectedRates.includes(globalIdx) ? 'bg-blue-50' : ''}`}
                  onClick={e => {
                    if ((e.target as HTMLElement).tagName === 'INPUT') return;
                    setSelectedRates(selectedRates.includes(globalIdx)
                      ? selectedRates.filter(i => i !== globalIdx)
                      : [...selectedRates, globalIdx]);
                  }}
                >
                  <td className="sticky left-0 bg-white z-10 shadow-md px-4 py-2 border-r border-gray-200">
                    <input
                      type="checkbox"
                      checked={selectedRates.includes(globalIdx)}
                      onChange={e => {
                        e.stopPropagation();
                        setSelectedRates(e.target.checked
                          ? [...selectedRates, globalIdx]
                          : selectedRates.filter(i => i !== globalIdx));
                      }}
                      className="w-4 h-4 accent-[#007bff] rounded-lg border-gray-300 transition-colors cursor-pointer align-middle"
                      aria-label={`Select rate ${globalIdx+1}`}
                    />
                          </td>
                  {columns.filter(col => col.key !== 'action').map((col) => (
                    <td key={col.key} className="px-4 py-4 text-gray-900 whitespace-nowrap">{rate[col.key as keyof Rate]}</td>
                  ))}
                      </tr>
              );
            })}
                </tbody>
              </table>
            </div>
      {/* Pagination (outside table) */}
      <div className="flex items-center justify-between bg-white mt-2">
        <div className="text-sm text-gray-700">
          Showing {(filteredRates.length===0)?0:((page-1)*itemsPerPage+1)} to {Math.min(page*itemsPerPage, filteredRates.length)} of {filteredRates.length} rates
          </div>
        <div className="flex items-center space-x-2">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">{'<'}</button>
          {[...Array(Math.ceil(filteredRates.length/itemsPerPage)).keys()].map(i => (
            <button key={i+1} onClick={()=>setPage(i+1)} className={`px-3 py-2 text-sm rounded ${page===i+1?'bg-[#007bff] text-white':'text-gray-600 hover:bg-gray-100'}`}>{i+1}</button>
          ))}
          <button onClick={()=>setPage(p=>Math.min(Math.ceil(filteredRates.length/itemsPerPage),p+1))} disabled={page===Math.ceil(filteredRates.length/itemsPerPage)||filteredRates.length===0} className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">{'>'}</button>
                        </div>
                    </div>
      <RateModalForm open={showAdd} onClose={()=>setShowAdd(false)} initialData={null} mode={mode} onSave={data=>{
        setRates([...rates, { ...data, mode }]);
        setShowAdd(false);
      }} />
      <RateModalForm open={editIdx!==null} onClose={()=>setEditIdx(null)} initialData={editIdx!==null?rates[editIdx]:null} mode={mode} onSave={data=>{
        setRates(rates.map((item,i)=>i===editIdx?{ ...data, mode: item.mode || mode }:item));
        setEditIdx(null);
      }} />
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4">
            <h2 className="text-lg text-gray-900 font-semibold mb-4">Remove Rates</h2>
            <div className="mb-4 text-sm text-gray-700">Are you sure you want to remove the selected rates?</div>
            <div className="flex justify-end gap-2 mt-4">
                  <button
                onClick={() => setShowRemoveModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button 
                onClick={handleBulkRemove}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Remove
                  </button>
            </div>
          </div>
        </div>
      )}
      {showImport && (
        <RateParser
          mode={mode}
          onClose={() => setShowImport(false)}
          onRatesParsed={importedRates => {
            setRates([
              ...rates,
              ...importedRates.map(r => ({ ...r, mode }))
            ]);
            setShowImport(false);
          }}
        />
      )}
    </div>
  );
} 