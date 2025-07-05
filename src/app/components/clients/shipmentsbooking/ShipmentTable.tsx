import React, { useState, useRef, useEffect } from 'react';
import { Eye, Edit, Search, Filter, Upload, Download, Plus, ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';
import { ShipmentData, useShipmentStore } from '@/store/shipmentData';

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
    id: true,              // Essential - shipment identifier
    bookingId: true,       // Essential - booking reference
    poNumbers: false,       // Essential - PO references
    transportMode: true,   // Essential - type of transport
    goods: true,          // Essential - what's being shipped
    carrier: true,        // Optional but visible by default
    shipper: false,        // New column
    consignee: false,      // New column
    forwarderCompany: false, // New column
    shipmentType: false,  // New column
    incoterms: false,     // New column
    container: false,      // New column
    origin: true,         // Essential - where from
    destination: true,    // Essential - where to
    dates: false,         // Optional - all dates
    estimatedArrival: true,   // Essential - when it arrives
    status: true,         // Essential - current status
    milestones: false,    // New column
    lastUpdate: true,     // New column
  });

  // Get shipment data and setShipments from store
  const shipments = useShipmentStore((state) => state.shipments);
  const setShipments = useShipmentStore((state) => state.setShipments);

  // Fetch shipment data from backend when component mounts
  useEffect(() => {
    const fetchShipments = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch('/api/shipments');
        const data = await response.json();
        setShipments(data);
      } catch (error) {
        console.error('Failed to fetch shipments:', error);
        // Handle error appropriately (show error message, etc.)
      }
    };

    fetchShipments();
  }, [setShipments]);

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
    'Booking ID',
    'PO Numbers',
    'Transport Mode',
    'Goods',
    'Origin',
    'Destination', 
    'Estimated Arrival',
    'Status'
  ];

  const fullColumnConfig = [
    { key: 'id', label: 'Shipment ID' },
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'poNumbers', label: 'PO Numbers' },
    { key: 'transportMode', label: 'Transport Mode' },
    { key: 'goods', label: 'Goods' },
    { key: 'carrier', label: 'Carrier' },
    { key: 'shipper', label: 'Shipper' },
    { key: 'consignee', label: 'Consignee' },
    { key: 'forwarderCompany', label: 'Forwarder Company' },
    { key: 'shipmentType', label: 'Shipment Type' },
    { key: 'incoterms', label: 'Incoterms' },
    { key: 'container', label: 'Container' },
    { key: 'origin', label: 'Origin' },
    { key: 'destination', label: 'Destination' },
    { key: 'dates', label: 'All Dates' },
    { key: 'estimatedArrival', label: 'Est. Arrival' },
    { key: 'status', label: 'Status' },
    { key: 'milestones', label: 'Milestones' },
    { key: 'lastUpdate', label: 'Last Update' },
  ];

  const visibleFullColumns = fullColumnConfig.filter(col => visibleColumns[col.key as keyof typeof visibleColumns]);
  const columns = view === 'summary' ? summaryColumns : visibleFullColumns.map(col => col.label);

  // Filter and search functionality
  const getFilteredData = () => {
    let filtered = shipments;

    // Filter by transport mode
    if (selectedMode !== 'All Modes') {
      filtered = filtered.filter(shipment => shipment.transportMode === selectedMode);
    }

    // Search functionality
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(shipment => 
        shipment.id.toLowerCase().includes(searchLower) ||
        shipment.bookingId.toLowerCase().includes(searchLower) ||
        shipment.poNumbers.some(po => po.toLowerCase().includes(searchLower)) ||
        shipment.goods.description.toLowerCase().includes(searchLower) ||
        shipment.goods.type.toLowerCase().includes(searchLower) ||
        (shipment.carrier && shipment.carrier.toLowerCase().includes(searchLower)) ||
        `${shipment.origin.city}, ${shipment.origin.country}`.toLowerCase().includes(searchLower) ||
        `${shipment.destination.city}, ${shipment.destination.country}`.toLowerCase().includes(searchLower) ||
        shipment.status.toLowerCase().includes(searchLower) ||
        shipment.transportMode.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  const renderSummaryRow = (shipment: ShipmentData) => (
    <tr key={shipment.id}>
      <td className="px-3 sm:px-4 py-3 text-xs font-medium text-[#007bff] whitespace-nowrap">{shipment.id}</td>
      <td className="px-3 sm:px-4 py-3 text-xs font-medium text-gray-700 whitespace-nowrap">{shipment.bookingId}</td>
      <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.poNumbers.join(', ')}</td>
      <td className="px-3 sm:px-4 py-3">
        <span className={getTransportBadge(shipment.transportMode)}>{shipment.transportMode}</span>
      </td>
      <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{`${shipment.goods.description} (${shipment.goods.type})`}</td>
      <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{`${shipment.origin.city}, ${shipment.origin.country}`}</td>
      <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{`${shipment.destination.city}, ${shipment.destination.country}`}</td>
      <td className="px-3 sm:px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{formatDate(shipment.dates.arrival)}</td>
      <td className="px-3 sm:px-4 py-3">
        <span className={getStatusBadge(shipment.status)}>{shipment.status}</span>
      </td>
    </tr>
  );

  const renderFullRow = (shipment: ShipmentData) => (
    <tr key={shipment.id}>
      {visibleColumns.id && (
        <td className="px-3 sm:px-4 py-3 text-xs font-medium text-gray-900 whitespace-nowrap">{shipment.id}</td>
      )}
      {visibleColumns.bookingId && (
        <td className="px-3 sm:px-4 py-3 text-xs font-medium text-gray-700 whitespace-nowrap">{shipment.bookingId}</td>
      )}
      {visibleColumns.poNumbers && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.poNumbers.join(', ')}</td>
      )}
      {visibleColumns.transportMode && (
        <td className="px-3 sm:px-4 py-3">
          <span className={getTransportBadge(shipment.transportMode)}>{shipment.transportMode}</span>
        </td>
      )}
      {visibleColumns.goods && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{`${shipment.goods.description} (${shipment.goods.type})`}</td>
      )}
      {visibleColumns.carrier && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.carrier}</td>
      )}
      {visibleColumns.shipper && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.shipper}</td>
      )}
      {visibleColumns.consignee && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.consignee}</td>
      )}
      {visibleColumns.forwarderCompany && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.forwarderCompany}</td>
      )}
      {visibleColumns.shipmentType && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.shipmentType}</td>
      )}
      {visibleColumns.incoterms && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.incoterms}</td>
      )}
      {visibleColumns.container && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{shipment.container}</td>
      )}
      {visibleColumns.origin && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{`${shipment.origin.city}, ${shipment.origin.country}`}</td>
      )}
      {visibleColumns.destination && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">{`${shipment.destination.city}, ${shipment.destination.country}`}</td>
      )}
      {visibleColumns.dates && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">
          <div>Booking: {formatDate(shipment.dates.booking)}</div>
          <div>Departure: {formatDate(shipment.dates.departure)}</div>
          <div>Arrival: {formatDate(shipment.dates.arrival)}</div>
        </td>
      )}
      {visibleColumns.estimatedArrival && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{formatDate(shipment.dates.arrival)}</td>
      )}
      {visibleColumns.status && (
        <td className="px-3 sm:px-4 py-3">
          <span className={getStatusBadge(shipment.status)}>{shipment.status}</span>
        </td>
      )}
      {visibleColumns.milestones && (
        <td className="px-3 sm:px-4 py-3 text-xs text-gray-700">
          <div className="max-h-20 overflow-y-auto">
            {shipment.milestones.map((milestone, index) => (
              <div key={index} className="mb-1">
                <div className="font-medium">{milestone.step}</div>
                <div>{formatDate(milestone.date)} - {milestone.location}</div>
              </div>
            ))}
          </div>
        </td>
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
      { key: 'bookingId', label: 'Booking ID' },
      { key: 'poNumbers', label: 'PO Numbers' },
      { key: 'transportMode', label: 'Transport Mode' },
      { key: 'goods', label: 'Goods' },
      { key: 'carrier', label: 'Carrier' },
      { key: 'shipper', label: 'Shipper' },
      { key: 'consignee', label: 'Consignee' },
      { key: 'forwarderCompany', label: 'Forwarder Company' },
      { key: 'shipmentType', label: 'Shipment Type' },
      { key: 'incoterms', label: 'Incoterms' },
      { key: 'container', label: 'Container' },
      { key: 'origin', label: 'Origin' },
      { key: 'destination', label: 'Destination' },
      { key: 'dates', label: 'All Dates' },
      { key: 'estimatedArrival', label: 'Est. Arrival' },
      { key: 'status', label: 'Status' },
      { key: 'milestones', label: 'Milestones' },
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
    // Only show pagination in full view
    if (view === 'summary') return null;
    
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
        <div className="text-sm text-gray-700">
          Showing {Math.min((currentPage - 1) * 5 + 1, filteredData.length)} to {Math.min(currentPage * 5, filteredData.length)} of {filteredData.length} shipments
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(Math.max(1, totalPages))].map((_, i) => (
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
            disabled={currentPage === totalPages || totalPages === 0}
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