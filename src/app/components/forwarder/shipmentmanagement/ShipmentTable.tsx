import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, ChevronDown, Ship, Box, Plane, Truck, ChevronLeft, ChevronRight, Menu, Download, Upload, Eye, Edit as EditIcon, Trash2, X as XIcon, X, Package, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SHIPMENT_TABS = [
  { label: 'All', value: 'all', icon: <Menu className="w-4 h-4 mr-1" /> },
  { label: 'FCL', value: 'fcl', icon: <Ship className="w-4 h-4 mr-1" /> },
  { label: 'LCL', value: 'lcl', icon: <Box className="w-4 h-4 mr-1" /> },
  { label: 'AIR', value: 'air', icon: <Plane className="w-4 h-4 mr-1" /> },
  { label: 'FTL', value: 'ftl', icon: <Truck className="w-4 h-4 mr-1" /> },
  { label: 'LTL', value: 'ltl', icon: <Truck className="w-4 h-4 mr-1" /> },
];

const FILTERS = [
  { label: 'All Types', value: 'all' },
  { label: 'Export', value: 'export' },
  { label: 'Import', value: 'import' },
  { label: 'Domestic', value: 'domestic' },
  { label: 'Other', value: 'other' },   
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PROCESS_OPTIONS = [
  { value: 'all', label: 'All Process' },
  { value: 'order', label: 'Order' },
  { value: 'booking', label: 'Booking' },
  { value: 'shipping', label: 'Shipping' },
  { value: 'customs', label: 'Customs' },
  { value: 'delivery', label: 'Delivery' },
];

// Column configs for each mode
const MODE_COLUMN_CONFIGS: Record<string, { key: string; label: string }[]> = {
  all: [
    { key: 'shipmentId', label: 'Shipment ID' },
    { key: 'type', label: 'Type' },
    { key: 'client', label: 'Client' },
    { key: 'status', label: 'Status' },
    { key: 'process', label: 'Process' },
    { key: 'mode', label: 'Mode' },
    { key: 'blNumber', label: 'B/L' },
    { key: 'bookingNo', label: 'Booking ID' },
    { key: 'accountManager', label: 'Account Manager' },
    { key: 'provider', label: 'Provider' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'etd', label: 'ETD' },
    { key: 'eta', label: 'ETA' },
    { key: 'volume', label: 'Volume' },
    { key: 'createdDate', label: 'Created Date' },
  ],
  fcl: [
    { key: 'shipmentId', label: 'Shipment ID' },
    { key: 'type', label: 'Type' },
    { key: 'client', label: 'Client' },
    { key: 'status', label: 'Status' },
    { key: 'process', label: 'Process' },
    { key: 'mode', label: 'Mode' },
    { key: 'blNumber', label: 'B/L' },
    { key: 'bookingNo', label: 'Booking ID' },
    { key: 'accountManager', label: 'Account Manager' },
    { key: 'provider', label: 'Provider' },
    { key: 'containerType', label: 'Container Type' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'etd', label: 'ETD' },
    { key: 'eta', label: 'ETA' },
    { key: 'volume', label: 'Volume' },
  ],
  lcl: [
    { key: 'shipmentId', label: 'Shipment ID' },
    { key: 'type', label: 'Type' },
    { key: 'client', label: 'Client' },
    { key: 'status', label: 'Status' },
    { key: 'process', label: 'Process' },
    { key: 'mode', label: 'Mode' },
    { key: 'blNumber', label: 'B/L' },
    { key: 'bookingNo', label: 'Booking ID' },
    { key: 'accountManager', label: 'Account Manager' },
    { key: 'provider', label: 'Provider' },
    { key: 'volume', label: 'Volume' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'etd', label: 'ETD' },
    { key: 'eta', label: 'ETA' },
  ],
  air: [
    { key: 'shipmentId', label: 'Shipment ID' },
    { key: 'type', label: 'Type' },
    { key: 'client', label: 'Client' },
    { key: 'status', label: 'Status' },
    { key: 'process', label: 'Process' },
    { key: 'mode', label: 'Mode' },
    { key: 'blNumber', label: 'AWB' },
    { key: 'bookingNo', label: 'Booking ID' },
    { key: 'accountManager', label: 'Account Manager' },
    { key: 'provider', label: 'Provider' },
    { key: 'volume', label: 'Volume' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'etd', label: 'ETD' },
    { key: 'eta', label: 'ETA' },
  ],
  ftl: [
    { key: 'shipmentId', label: 'Shipment ID' },
    { key: 'type', label: 'Type' },
    { key: 'client', label: 'Client' },
    { key: 'status', label: 'Status' },
    { key: 'process', label: 'Process' },
    { key: 'mode', label: 'Mode' },
    { key: 'blNumber', label: 'B/L' },
    { key: 'bookingNo', label: 'Booking ID' },
    { key: 'accountManager', label: 'Account Manager' },
    { key: 'provider', label: 'Provider' },
    { key: 'volume', label: 'Volume' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'etd', label: 'ETD' },
    { key: 'eta', label: 'ETA' },
  ],
  ltl: [
    { key: 'shipmentId', label: 'Shipment ID' },
    { key: 'type', label: 'Type' },
    { key: 'client', label: 'Client' },
    { key: 'status', label: 'Status' },
    { key: 'process', label: 'Process' },
    { key: 'mode', label: 'Mode' },
    { key: 'blNumber', label: 'B/L' },
    { key: 'bookingNo', label: 'Booking ID' },
    { key: 'accountManager', label: 'Account Manager' },
    { key: 'provider', label: 'Provider' },
    { key: 'volume', label: 'Volume' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'etd', label: 'ETD' },
    { key: 'eta', label: 'ETA' },
  ],
};

// Mock data for shipments
const MOCK_SHIPMENTS = [
  {
    id: '1',
    shipmentId: 'FCL-S-2305-E-FCL-009',
    type: 'EXPORT',
    client: 'ANC TRANSPORT',
    status: 'PENDING',
    process: 'ORDER',
    mode: 'FREEHAND',
    blNumber: 'HBLOCE2305009',
    bookingNo: 'BKEXFR2305009',
    accountManager: 'John Smith',
    provider: 'HEUNG-A',
    origin: 'HO CHI MINH CITY, VN',
    destination: 'HOUSTON, TX, US',
    etd: '2023-05-12',
    eta: '2023-06-15',
    volume: '20\'DC x 1',
    containerType: '20\'DC',
    weightVolume: '',
    truckType: '',
    createdDate: '2023-05-01',
  },
  {
    id: '2',
    shipmentId: 'LCL-S-2305-I-LCL-015',
    type: 'IMPORT',
    client: 'OCEANIC FREIGHT',
    status: 'ACTIVE',
    process: 'SHIPPING',
    mode: 'FREEHAND',
    blNumber: 'HBLOCE2305015',
    bookingNo: 'BKIMFR2305015',
    accountManager: 'Sarah Johnson',
    provider: 'MAERSK',
    origin: 'SINGAPORE, SG',
    destination: 'JAKARTA, ID',
    etd: '2023-05-15',
    eta: '2023-05-25',
    volume: '',
    containerType: '',
    weightVolume: '500 kg / 2.5 cbm',
    truckType: '',
    createdDate: '2023-05-02',
  },
  {
    id: '3',
    shipmentId: 'AIR-S-2305-E-AIR-023',
    type: 'EXPORT',
    client: 'GLOBAL LOGISTICS',
    status: 'ACTIVE',
    process: 'CUSTOMS',
    mode: 'FREEHAND',
    blNumber: 'AWBGLO2305023',
    bookingNo: 'BKEXAI2305023',
    accountManager: 'Mike Wilson',
    provider: 'FEDEX',
    origin: 'LOS ANGELES, US',
    destination: 'TOKYO, JP',
    etd: '2023-05-18',
    eta: '2023-05-19',
    volume: '',
    containerType: '',
    weightVolume: '150 kg / 0.8 cbm',
    truckType: '',
    createdDate: '2023-05-03',
  },
];

function getModeIcon(shipmentId: string) {
  if (shipmentId.includes('FCL')) {
    return <Ship className="w-4 h-4" />;
  } else if (shipmentId.includes('LCL')) {
    return <Box className="w-4 h-4" />;
  } else if (shipmentId.includes('AIR')) {
    return <Plane className="w-4 h-4" />;
  } else if (shipmentId.includes('FTL') || shipmentId.includes('LTL')) {
    return <Truck className="w-4 h-4" />;
  } else {
    return <Package className="w-4 h-4" />;
  }
}

function formatDisplayDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export default function ShipmentTable() {
  const [tab, setTab] = useState('all');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [process, setProcess] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showProcessDropdown, setShowProcessDropdown] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const processDropdownRef = useRef<HTMLDivElement>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // CSV Export logic
  const handleExportCSV = () => {
    const exportCols = MODE_COLUMN_CONFIGS[tab] || MODE_COLUMN_CONFIGS['all'];
    const rows = filteredShipments.map(s => exportCols.map(col => getValue(s, col.key)));
    const csv = [exportCols.map(col => col.label).join(','), ...rows.map(r => r.map(v => '"'+(v??'')+'"').join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shipments_${tab}.csv`;
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
      const newShipments = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const obj: any = { mode };
        headers.forEach((h, i) => { obj[h] = values[i]; });
        if (!obj.id) obj.id = `SM-${new Date().getFullYear()}-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`;
        return obj;
      });
      // In a real app, you would update the store here
      console.log('Imported shipments:', newShipments);
      setShowImportModal(false);
    };
    reader.readAsText(file);
  };

  // Determine current mode (tab)
  let columns = MODE_COLUMN_CONFIGS[tab] || MODE_COLUMN_CONFIGS['all'];

  // Helper to safely get values for each column
  const getValue = (s: any, key: string) => {
    switch (key) {
      case 'shipmentId':
        return s.shipmentId || '';
      case 'type':
        return s.type || '';
      case 'client':
        return s.client || '';
      case 'status':
        return s.status || '';
      case 'process':
        return s.process || '';
      case 'mode':
        return s.mode || '';
      case 'blNumber':
        return s.blNumber || '';
      case 'bookingNo':
        return s.bookingNo || '';
      case 'accountManager':
        return s.accountManager || '';
      case 'provider':
        return s.provider || '';
      case 'containerType':
        return s.containerType || '';
      case 'weightVolume':
        return s.weightVolume || '';
      case 'truckType':
        return s.truckType || '';
      case 'origin':
        return s.origin || '';
      case 'destination':
        return s.destination || '';
      case 'etd':
        return s.etd ? formatDisplayDate(s.etd) : '';
      case 'eta':
        return s.eta ? formatDisplayDate(s.eta) : '';
      case 'volume':
        return s.volume || '';
      case 'createdDate':
        return s.createdDate ? formatDisplayDate(s.createdDate) : '';
      default:
        return '';
    }
  };

  // Filtered shipments based on tab, filter, search, status, and process
  const filteredShipments = MOCK_SHIPMENTS.filter(s => {
    // Tab filter (type)
    const tabMatch = (() => {
      if (tab === 'all') return true;
      
      const type = (s.type || '').toLowerCase().trim();
      if (!type) return false;
      
      if (tab === 'fcl') return type.includes('export') && s.shipmentId?.includes('FCL');
      if (tab === 'lcl') return type.includes('import') && s.shipmentId?.includes('LCL');
      if (tab === 'air') return s.shipmentId?.includes('AIR');
      if (tab === 'ftl') return s.shipmentId?.includes('FTL');
      if (tab === 'ltl') return s.shipmentId?.includes('LTL');
      return false;
    })();
    
    // Filter (category)
    const filterMatch = filter === 'all' || s.type?.toLowerCase() === filter.toLowerCase();
    
    // Search (by shipmentId, client, provider)
    const searchMatch =
      (typeof s.shipmentId === 'string' && s.shipmentId.toLowerCase().includes(search.toLowerCase())) ||
      (typeof s.client === 'string' && s.client.toLowerCase().includes(search.toLowerCase())) ||
      (typeof s.provider === 'string' && s.provider.toLowerCase().includes(search.toLowerCase()));
    
    // Status
    const statusMatch = status === 'all' || s.status?.toLowerCase() === status.toLowerCase();
    
    // Process
    const processMatch = process === 'all' || s.process?.toLowerCase() === process.toLowerCase();
    
    return tabMatch && filterMatch && searchMatch && statusMatch && processMatch;
  });

  const paginatedShipments = filteredShipments.slice((page-1)*itemsPerPage, page*itemsPerPage);
  const allIds = paginatedShipments.map(s => s.id);

  // Selection logic
  const allSelected = allIds.length > 0 && allIds.every(id => selected.includes(id));
  const toggleAll = () => {
    if (allSelected) setSelected(selected.filter(id => !allIds.includes(id)));
    else setSelected([...selected, ...allIds.filter(id => !selected.includes(id))]);
  };
  const toggleRow = (id: string) => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };

  // Pagination
  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage);

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
      if (
        processDropdownRef.current &&
        !processDropdownRef.current.contains(e.target as Node)
      ) {
        setShowProcessDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Bulk action bar logic
  const selectedShipments = MOCK_SHIPMENTS.filter((s: any) => selected.includes(s.id));

  const handleViewShipment = (shipmentId: string) => {
    router.push(`/dashboard/shipments/details/${shipmentId}`);
  };

  const handleEditShipment = (shipmentId: string) => {
    router.push(`/dashboard/shipments/edit/${shipmentId}`);
  };

  const handleDeleteShipment = (shipmentId: string) => {
    // In a real app, you would call the delete API here
    console.log('Delete shipment:', shipmentId);
  };

  return (
    <div className="bg-white">
      {/* Tabs */}
      <div className="flex gap-2 space-x-8 mb-4 border-b border-gray-200">
        {SHIPMENT_TABS.map(t => (
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

      {/* Search, Filters, Actions */}
      <div className="flex flex-wrap gap-2 items-center justify-between py-2 mb-2 text-sm text-gray-900">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search shipments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

                     {/* Filter Dropdown */}
           <div className="relative" ref={filterDropdownRef}>
             <button
               type="button"
               className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
               onClick={() => setShowFilterDropdown(v => !v)}
             >
               {FILTERS.find(f => f.value === filter)?.label || 'All Types'}
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

                     {/* Status Dropdown */}
           <div className="relative" ref={statusDropdownRef}>
             <button
               type="button"
               className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
               onClick={() => setShowStatusDropdown(v => !v)}
             >
               {STATUS_OPTIONS.find(s => s.value === status)?.label || 'All Status'}
               <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
             </button>
             {showStatusDropdown && (
               <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-40 z-50">
                 <div className="p-2">
                   {STATUS_OPTIONS.map(s => (
                     <button
                       key={s.value}
                       onClick={() => {
                         setStatus(s.value);
                         setShowStatusDropdown(false);
                       }}
                       className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${status === s.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                     >
                       {s.label}
                     </button>
                   ))}
                 </div>
               </div>
             )}
           </div>

                     {/* Process Dropdown */}
           <div className="relative" ref={processDropdownRef}>
             <button
               type="button"
               className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
               onClick={() => setShowProcessDropdown(v => !v)}
             >
               {PROCESS_OPTIONS.find(p => p.value === process)?.label || 'All Process'}
               <ChevronDown className={`w-4 h-4 transition-transform ${showProcessDropdown ? 'rotate-180' : ''}`} />
             </button>
             {showProcessDropdown && (
               <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-40 z-50">
                 <div className="p-2">
                   {PROCESS_OPTIONS.map(p => (
                     <button
                       key={p.value}
                       onClick={() => {
                         setProcess(p.value);
                         setShowProcessDropdown(false);
                       }}
                       className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${process === p.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                     >
                       {p.label}
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
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={() => router.push('/dashboard/shipments/create')}
            className="flex items-center gap-2 px-4 py-2 bg-[#007bff] text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New Shipment
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
       {selected.length > 0 && (
         <div className="bg-white border border-blue-200 rounded-lg px-4 py-5 mb-4">
           <div className="flex items-center justify-between">
             <span className="text-sm text-[#007bff]">
               {selected.length} shipment{selected.length > 1 ? 's' : ''} selected
             </span>
             <div className="flex gap-10">
               <button className="text-sm text-[#007bff] hover:text-blue-800">
                 View 
               </button>
               <button className="text-sm text-red-600 hover:text-red-800">
                 Remove 
               </button>
             </div>
           </div>
         </div>
       )}

             {/* Table */}
       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
         <div className="overflow-x-auto">
           <table className="w-full">
             <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left sticky left-0 bg-gray-50 z-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  {columns.map(col => (
                    <th key={col.key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {paginatedShipments.map(shipment => (
                                       <tr 
                      key={shipment.id} 
                      className={`cursor-pointer ${
                        selected.includes(shipment.id) 
                          ? 'bg-blue-50' 
                          : 'hover:bg-blue-50'
                      }`}
                      onClick={() => toggleRow(shipment.id)}
                    >
                     <td 
                       className={`px-4 py-4 sticky left-0 z-10 ${
                         selected.includes(shipment.id) ? 'bg-blue-50' : 'bg-white'
                       }`} 
                       onClick={(e) => e.stopPropagation()}
                     >
                       <input
                         type="checkbox"
                         checked={selected.includes(shipment.id)}
                         onChange={() => toggleRow(shipment.id)}
                         className="rounded border-gray-300"
                       />
                     </td>
                   {columns.map(col => (
                     <td key={col.key} className="px-4 py-4 text-xs text-gray-900 whitespace-nowrap">
                       {col.key === 'shipmentId' ? (
                         <div className="flex items-center gap-2">
                           {getModeIcon(shipment.shipmentId)}
                           <span className="font-medium">{getValue(shipment, col.key)}</span>
                         </div>
                                               ) : col.key === 'status' ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            shipment.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            shipment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            shipment.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                            shipment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {shipment.status === 'ACTIVE' ? 'Active' :
                             shipment.status === 'PENDING' ? 'Pending' :
                             shipment.status === 'COMPLETED' ? 'Completed' :
                             shipment.status === 'CANCELLED' ? 'Cancelled' :
                             shipment.status || ''}
                          </span>
                                                ) : col.key === 'process' ? (
                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                             shipment.process === 'ORDER' ? 'bg-blue-100 text-blue-800' :
                             shipment.process === 'BOOKING' ? 'bg-purple-100 text-purple-800' :
                             shipment.process === 'SHIPPING' ? 'bg-green-100 text-green-800' :
                             shipment.process === 'CUSTOMS' ? 'bg-orange-100 text-orange-800' :
                             shipment.process === 'DELIVERY' ? 'bg-indigo-100 text-indigo-800' :
                             'bg-gray-100 text-gray-800'
                           }`}>
                             {shipment.process === 'ORDER' ? 'Order' :
                              shipment.process === 'BOOKING' ? 'Booking' :
                              shipment.process === 'SHIPPING' ? 'Shipping' :
                              shipment.process === 'CUSTOMS' ? 'Customs' :
                              shipment.process === 'DELIVERY' ? 'Delivery' :
                              shipment.process || ''}
                           </span>
                                                 ) : col.key === 'volume' ? (
                           <div className="flex flex-wrap gap-1">
                             {(() => {
                               // For FCL: show container qty x type
                               if (shipment.shipmentId?.includes('FCL') && shipment.containerType) {
                                 const qty = shipment.volume?.split('x')[1]?.trim() || '1';
                                 return (
                                   <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                                     {qty} x {shipment.containerType}
                                   </span>
                                 );
                               }
                               // For LCL: show weight/volume
                               if (shipment.shipmentId?.includes('LCL') && shipment.weightVolume) {
                                 return (
                                   <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                                     {shipment.weightVolume}
                                   </span>
                                 );
                               }
                               // For AIR: show weight/volume
                               if (shipment.shipmentId?.includes('AIR') && shipment.weightVolume) {
                                 return (
                                   <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                                     {shipment.weightVolume}
                                   </span>
                                 );
                               }
                               // For FTL/LTL: show truck qty x type
                               if ((shipment.shipmentId?.includes('FTL') || shipment.shipmentId?.includes('LTL')) && shipment.truckType) {
                                 return (
                                   <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                                     1 x {shipment.truckType}
                                   </span>
                                 );
                               }
                               return null;
                             })()}
                           </div>
                        ) : (
                          getValue(shipment, col.key)
                        )}
                     </td>
                   ))}
                 </tr>
               ))}
             </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white mt-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, filteredShipments.length)} of {filteredShipments.length} shipments
          </div>
          <div className="flex items-center gap-2">
            <button
             onClick={() => setPage(Math.max(1, page - 1))}
             disabled={page === 1}
             className={`p-1 rounded transition-colors ${page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600'}`}
             >
             <ChevronLeft className="w-4 h-4" />
            </button>
              <span className="px-3 py-2 bg-[#007bff] text-white rounded text-sm">
               {page}
              </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`p-1 rounded transition-colors ${page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600'}`}
            >
             <ChevronRight className="w-4 h-4" />
            </button>
          </div>
         </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-gray-900 font-semibold">Import Shipments</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                Upload a CSV file with shipment data. The file should include headers matching the table columns.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm bg-[#007bff] text-white rounded-md hover:bg-blue-700"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
