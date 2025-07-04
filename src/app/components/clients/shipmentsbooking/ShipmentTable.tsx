import React, { useState, useRef, useEffect } from 'react';
import { Eye, Edit, Search, Filter, Upload, Download, Plus, ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';
import { ShipmentData, mockData } from '@/store/shipmentData';

interface ShipmentTableProps {
  view: 'summary' | 'full';
  onSeeAll?: () => void;
}

const ShipmentTable: React.FC<ShipmentTableProps> = ({ view, onSeeAll }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState('All Modes');
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const columnDropdownRef = useRef<HTMLDivElement>(null);
  const columnButtonRef = useRef<HTMLButtonElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  const modeButtonRef = useRef<HTMLButtonElement>(null);
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    transportMode: true,
    goods: true,
    carrier: true,
    origin: true,
    destination: true,
    bookingDate: true,
    estimatedDeparture: true,
    estimatedArrival: true,
    status: true,
    trackingId: true,
    incoterms: true,
    serviceType: true,
    containerType: true,
    lastUpdate: true,
  });

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Column dropdown
      if (columnDropdownRef.current && !columnDropdownRef.current.contains(event.target as Node) &&
          columnButtonRef.current && !columnButtonRef.current.contains(event.target as Node)) {
        setShowColumnDropdown(false);
      }
      
      // Mode dropdown
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target as Node) &&
          modeButtonRef.current && !modeButtonRef.current.contains(event.target as Node)) {
        setShowModeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const transportModes = ['All Modes', 'Air', 'Sea', 'Road', 'Rail'];

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    const statusClasses = {
      'In Transit': 'bg-green-100 text-green-700',
      'Delayed': 'bg-yellow-100 text-yellow-700', 
      'Delivered': 'bg-blue-100 text-blue-700',
      'Pending': 'bg-gray-100 text-gray-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    
    return `${baseClasses} ${statusClasses[status as keyof typeof statusClasses] || statusClasses.Pending}`;
  };

  const getTransportBadge = (mode: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    const modeClasses = {
      'Air': 'bg-sky-100 text-sky-700',
      'Sea': 'bg-blue-100 text-blue-700',
      'Road': 'bg-emerald-100 text-emerald-700',
      'Rail': 'bg-purple-100 text-purple-700'
    };
    
    return `${baseClasses} ${modeClasses[mode as keyof typeof modeClasses] || modeClasses.Road}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const summaryColumns = [
    'Shipment ID',
    'Transport Mode',
    'Goods',
    'Origin',
    'Destination', 
    'Estimated Arrival',
    'Status'
  ];

  const fullColumnConfig = [
    { key: 'id', label: 'Shipment ID' },
    { key: 'transportMode', label: 'Transport Mode' },
    { key: 'goods', label: 'Goods' },
    { key: 'carrier', label: 'Carrier' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'bookingDate', label: 'Booking Date' },
    { key: 'estimatedDeparture', label: 'Est. Departure' },
    { key: 'estimatedArrival', label: 'Est. Arrival' },
    { key: 'status', label: 'Status' },
    { key: 'trackingId', label: 'Tracking ID' },
    { key: 'incoterms', label: 'Incoterms' },
    { key: 'serviceType', label: 'Service Type' },
    { key: 'containerType', label: 'Container Type' },
    { key: 'lastUpdate', label: 'Last Update' },
  ];

  const visibleFullColumns = fullColumnConfig.filter(col => visibleColumns[col.key as keyof typeof visibleColumns]);
  const columns = view === 'summary' ? summaryColumns : visibleFullColumns.map(col => col.label);

  // Filter and search functionality
  const getFilteredData = () => {
    let filtered = mockData;

    // Filter by transport mode
    if (selectedMode !== 'All Modes') {
      filtered = filtered.filter(shipment => shipment.transportMode === selectedMode);
    }

    // Search functionality
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(shipment => 
        shipment.id.toLowerCase().includes(searchLower) ||
        shipment.goods.toLowerCase().includes(searchLower) ||
        (shipment.carrier && shipment.carrier.toLowerCase().includes(searchLower)) ||
        shipment.origin.toLowerCase().includes(searchLower) ||
        shipment.destination.toLowerCase().includes(searchLower) ||
        (shipment.trackingId && shipment.trackingId.toLowerCase().includes(searchLower)) ||
        shipment.status.toLowerCase().includes(searchLower) ||
        shipment.transportMode.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  const renderSummaryRow = (shipment: ShipmentData) => (
    <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
      <td className="px-3 sm:px-4 py-3 text-xs font-medium text-[#007bff] whitespace-nowrap">{shipment.id}</td>
      <td className="px-3 sm:px-4 py-3">
        <span className={getTransportBadge(shipment.transportMode)}>{shipment.transportMode}</span>
      </td>
      <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.goods}</td>
      <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.origin}</td>
      <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.destination}</td>
      <td className="px-3 sm:px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{formatDate(shipment.estimatedArrival)}</td>
      <td className="px-3 sm:px-4 py-3">
        <span className={getStatusBadge(shipment.status)}>{shipment.status}</span>
      </td>
    </tr>
  );

  const renderFullRow = (shipment: ShipmentData) => (
    <tr key={shipment.id} className="hover:bg-gray-50 transition-colors">
      {visibleColumns.id && (
        <td className="px-3 sm:px-4 py-3 text-xs font-medium text-gray-900 whitespace-nowrap">{shipment.id}</td>
      )}
      {visibleColumns.transportMode && (
        <td className="px-3 sm:px-4 py-3">
          <span className={getTransportBadge(shipment.transportMode)}>{shipment.transportMode}</span>
        </td>
      )}
      {visibleColumns.goods && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.goods}</td>
      )}
      {visibleColumns.carrier && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.carrier}</td>
      )}
      {visibleColumns.origin && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.origin}</td>
      )}
      {visibleColumns.destination && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.destination}</td>
      )}
      {visibleColumns.bookingDate && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{shipment.bookingDate ? formatDate(shipment.bookingDate) : '-'}</td>
      )}
      {visibleColumns.estimatedDeparture && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{shipment.estimatedDeparture ? formatDate(shipment.estimatedDeparture) : '-'}</td>
      )}
      {visibleColumns.estimatedArrival && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{formatDate(shipment.estimatedArrival)}</td>
      )}
      {visibleColumns.status && (
        <td className="px-3 sm:px-4 py-3">
          <span className={getStatusBadge(shipment.status)}>{shipment.status}</span>
        </td>
      )}
      {visibleColumns.trackingId && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700 font-mono">{shipment.trackingId}</td>
      )}
      {visibleColumns.incoterms && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.incoterms}</td>
      )}
      {visibleColumns.serviceType && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.serviceType}</td>
      )}
      {visibleColumns.containerType && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.containerType}</td>
      )}
      {visibleColumns.lastUpdate && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{shipment.lastUpdate}</td>
      )}
    </tr>
  );

  const totalPages = Math.ceil(filteredData.length / 5);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleColumnToggle = (columnKey: string) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey as keyof typeof prev]
    }));
  };

  const handleModeSelect = (mode: string) => {
    setSelectedMode(mode);
    setShowModeDropdown(false);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const renderModeDropdown = () => {
    if (!showModeDropdown) return null;
  
    return (
      <div 
        ref={modeDropdownRef}
        className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-40 max-h-80 overflow-hidden z-50"
      >
        <div className="p-2 max-h-64 overflow-y-auto">
          <div className="space-y-1">
            {transportModes.map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeSelect(mode)}
                className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${
                  selectedMode === mode ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderColumnDropdown = () => {
    const columnOptions = [
      { key: 'id', label: 'ID' },
      { key: 'transportMode', label: 'Transport Mode' },
      { key: 'goods', label: 'Goods' },
      { key: 'carrier', label: 'Carrier' },
      { key: 'origin', label: 'Origin' },
      { key: 'destination', label: 'Destination' },
      { key: 'bookingDate', label: 'Booking Date' },
      { key: 'estimatedDeparture', label: 'Est. Departure' },
      { key: 'estimatedArrival', label: 'Est. Arrival' },
      { key: 'status', label: 'Status' },
      { key: 'trackingId', label: 'Tracking ID' },
      { key: 'incoterms', label: 'Incoterms' },
      { key: 'serviceType', label: 'Service Type' },
      { key: 'containerType', label: 'Container Type' },
      { key: 'lastUpdate', label: 'Last Update' },
    ];

    if (!showColumnDropdown) return null;
  
    return (
      <div 
        ref={columnDropdownRef}
        className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-56 max-h-80 overflow-hidden z-50"
      >
        <div className="p-2 max-h-64 overflow-y-auto">
          <div className="space-y-1">
            {columnOptions.map((column) => (
              <label key={column.key} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns[column.key as keyof typeof visibleColumns]}
                  onChange={() => handleColumnToggle(column.key)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 select-none">{column.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
        <div className="text-sm text-gray-700">
          Showing 1 to 5 of {filteredData.length} shipments
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 text-sm rounded ${
                currentPage === i + 1
                  ? 'bg-[#007bff] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  if (view === 'summary') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-1 sm:px-3 py-2 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-md font-semibold text-gray-900">Overview</h2>
          <button 
            onClick={onSeeAll}
            className="px-5 py-1.5 text-sm font-medium text-white bg-[#007bff] hover:bg-blue-700 rounded-lg transition-colors"
          >
            See all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.slice(0, 5).map((shipment) => renderSummaryRow(shipment))}
            </tbody>
          </table>
        </div>
        
        {filteredData.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No shipments found
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Search and Filter Section */}
      <div className="flex items-center gap-4 mt-2 mb-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by route, city, or carrier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm text-gray-900 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                ref={modeButtonRef}
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {selectedMode}
                <ChevronDown className={`w-4 h-4 transition-transform ${showModeDropdown ? 'rotate-180' : ''}`} />
              </button>
              {renderModeDropdown()}
            </div>
          </div>
          <div className="flex items-center justify-end gap-4">
            <div className="relative">
              <button 
                ref={columnButtonRef}
                onClick={() => setShowColumnDropdown(!showColumnDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Add/Remove Columns
                <ChevronDown className={`w-4 h-4 transition-transform ${showColumnDropdown ? 'rotate-180' : ''}`} />
              </button>
              {renderColumnDropdown()}
            </div>
          </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full divide-y divide-gray-200 border border-gray-200 shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.slice((currentPage - 1) * 5, currentPage * 5).map((shipment) => renderFullRow(shipment))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
      
      {filteredData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No shipments found
        </div>
      )}
    </div>
  );
};

export default ShipmentTable;