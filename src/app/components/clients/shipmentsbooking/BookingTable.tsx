import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Filter, Settings, Eye, EyeOff, Calendar, Package, MapPin, Ship, Clock, AlertTriangle, CheckCircle, XCircle, Minus, Download, Upload, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Booking = {
  id: string;
  bookingId?: string; // Universal booking identifier (was shipmentId)
  poNumber: string;
  productName: string;
  hsCode: string;
  consignee: string;
  shipper: string;
  origin: string;
  destination: string;
  shipmentType: string;
  containerType: string;
  incoterms: string;
  cargoReadyDate: string;
  dangerousGoods: boolean;
  weight: string;
  volume: string;
  pieces: number;
  status: string;
  eta: string;
  transportModeValue?: string;
};

interface BookingTableProps {
  bookings: Booking[];
  view?: 'summary' | 'full';
  onSeeAll?: () => void;
  title?: string;
  maxRows?: number;
  onSubmitBooking?: () => void;
  onRemoveBookings?: (ids: string[]) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  view = 'full',
  onSeeAll,
  title = 'Your bookings',
  maxRows,
  onSubmitBooking = () => {},
  onRemoveBookings = () => {},
}) => {
  // Render cell content based on column type
  const renderCellContent = (booking: Booking, columnKey: string) => {
    switch (columnKey) {
      case 'bookingId':
        // Show placeholder indicating booking ID will be generated after payment
        return booking.bookingId;
      case 'status':
        return <StatusBadge status={booking[columnKey] as string} />;
      case 'dangerousGoods':
        return booking[columnKey] ? (
          <span className="flex items-center text-red-600">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Yes
          </span>
        ) : (
          <span className="text-gray-500">No</span>
        );
      case 'origin':
      case 'destination':
        return (
          <span className="flex items-center">
            <MapPin className="w-3 h-3 mr-1 text-gray-400" />
            {booking[columnKey] as string}
          </span>
        );
      case 'shipmentType':
        return (
          <span className="flex items-center">
            <Package className="w-3 h-3 mr-1 text-gray-400" />
            {(booking[columnKey] as string)?.toUpperCase()}
          </span>
        );
      case 'cargoReadyDate':
      case 'eta':
        return (
          <span className="flex items-center">
            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
            {booking[columnKey] as string}
          </span>
        );
      case 'transportModeValue':
        // Use transportModeValue if present, fallback to transportMode
        let mode = (booking['transportModeValue']|| '').toLowerCase();
        let ModeIcon = Ship;
        if (mode === 'air') ModeIcon = require('lucide-react').Plane;
        else if (mode === 'road') ModeIcon = require('lucide-react').Truck;
        else if (mode === 'sea') ModeIcon = require('lucide-react').Ship;
        else ModeIcon = require('lucide-react').Package;
        return (
          <span className="flex items-center">
            <ModeIcon className="w-4 h-4 mr-1 text-gray-400" />
            {mode ? mode.toUpperCase() : ''}
          </span>
        );
      default:
        return booking[columnKey as keyof Booking] as string;
    }
  };

  // Determine columns for summary view
  const summaryColumns = [
    { key: 'id', label: 'Booking ID', width: '140px' },
    { key: 'poNumber', label: 'PO Number', width: '130px' },
    { key: 'transportModeValue', label: 'Transport Mode', width: '120px' },
    { key: 'productName', label: 'Goods', width: '180px' },
    { key: 'origin', label: 'Origin', width: '140px' },
    { key: 'destination', label: 'Destination', width: '140px' },
    { key: 'eta', label: 'Target Delivery Date', width: '120px' },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Render summary view
  if (view === 'summary') {
    const displayRows = maxRows ? bookings.slice(0, maxRows) : bookings;
    return (
      <div className="w-full mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-3">
          <h1 className="text-md font-bold text-gray-900">{title}</h1>
          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className="px-5 py-1.5 text-sm font-medium text-white bg-[#007bff] hover:bg-blue-700 rounded-lg transition-colors"
            >
              See all
            </button>
          )}
        </div>
        <div className="overflow-x-auto border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {summaryColumns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-2 text-xs font-medium text-gray-500 uppercase bg-gray-50"
                    style={{ width: col.width }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.length === 0 ? (
                <tr>
                  <td colSpan={summaryColumns.length} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-sm text-gray-500">No bookings found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                displayRows.map((booking) => (
                  <tr key={booking.id} className="h-[40px] hover:bg-gray-50">
                    {summaryColumns.map((col) => (
                      <td key={col.key} className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">
                        {renderCellContent(booking, col.key)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }


  // All available columns
  const allColumns = [
    { key: 'id', label: 'Booking ID', mandatory: true, width: '140px' },

    { key: 'poNumber', label: 'PO Number', mandatory: false, width: '130px' },
    { key: 'productName', label: 'Product Name', mandatory: false, width: '180px' },
    { key: 'hsCode', label: 'HS Code', mandatory: false, width: '140px' },
    { key: 'shipper', label: 'Shipper', mandatory: false, width: '160px' },
    { key: 'consignee', label: 'Consignee', mandatory: false, width: '140px' }, 
    { key: 'transportModeValue', label: 'Transport Mode', mandatory: false, width: '120px' },
    { key: 'origin', label: 'Origin', mandatory: false, width: '140px' },
    { key: 'destination', label: 'Destination', mandatory: false, width: '140px' },
    { key: 'shipmentType', label: 'Shipment Type', mandatory: false, width: '120px' },
    { key: 'containerType', label: 'Container Type', mandatory: false, width: '140px' },
    { key: 'incoterms', label: 'Incoterms', mandatory: false, width: '100px' },
    { key: 'dangerousGoods', label: 'Dangerous Goods', mandatory: false, width: '130px' },
    { key: 'weight', label: 'Weight', mandatory: false, width: '110px' },
    { key: 'volume', label: 'Volume', mandatory: false, width: '110px' },
    { key: 'pieces', label: 'Pieces', mandatory: false, width: '100px' },
    { key: 'cargoReadyDate', label: 'Cargo Ready Date', mandatory: false, width: '140px' },
    { key: 'eta', label: 'Target Delivery Date', mandatory: false, width: '120px' },
    { key: 'status', label: 'Status', mandatory: true, width: '120px' },
  ];

  // Default visible columns
  const defaultVisibleColumns = ['id', 'poNumber', 'productName', 'shipper', 'consignee', 'origin', 'destination', 'shipmentType', 'status', 'eta', 'transportModeValue', 'incoterms'];
  
  const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  // Refs for dropdown management
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const columnDropdownRef = useRef<HTMLDivElement>(null);
  const columnButtonRef = useRef<HTMLButtonElement>(null);

  // Status filter options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'booked', label: 'Booked' },
    { value: 'in transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' }
  ];

  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close status dropdown
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node) &&
          statusButtonRef.current && !statusButtonRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      
      // Close column dropdown
      if (columnDropdownRef.current && !columnDropdownRef.current.contains(event.target as Node) &&
          columnButtonRef.current && !columnButtonRef.current.contains(event.target as Node)) {
        setShowColumnDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close modal on outside click
  useEffect(() => {
    if (!showRemoveModal) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowRemoveModal(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showRemoveModal]);

  // Get visible column configuration
  const displayColumns = useMemo(() => {
    return allColumns.filter(col => visibleColumns.includes(col.key));
  }, [visibleColumns]);

  // Filter bookings based on search and filter
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = searchTerm === '' || 
        Object.values(booking).some(value => 
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesFilter = filterStatus === 'all' || 
        booking.status.toLowerCase().includes(filterStatus.toLowerCase());
      
      return matchesSearch && matchesFilter;
    });
  }, [bookings, searchTerm, filterStatus]);

  // Calculate total pages based on filtered data
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);

  // Get current page data from filtered bookings
  const currentBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredBookings.slice(startIndex, endIndex);
  }, [filteredBookings, currentPage]);

  // Reset to first page when search/filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Handle column visibility toggle
  const toggleColumn = (columnKey: string) => {
    const column = allColumns.find(col => col.key === columnKey);
    if (column?.mandatory) return; // Can't toggle mandatory columns
    
    setVisibleColumns(prev => 
      prev.includes(columnKey) 
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  // Handle status filter selection
  const handleStatusSelect = (value: string) => {
    setFilterStatus(value);
    setShowStatusDropdown(false);
    setCurrentPage(1);
  };

  // Get selected status label
  const getSelectedStatusLabel = () => {
    const selectedOption = statusOptions.find(option => option.value === filterStatus);
    return selectedOption ? selectedOption.label : 'All Status';
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
      switch (status.toLowerCase()) {
        case 'booked':
          return { color: 'bg-blue-100 text-blue-800', icon: Calendar };
        case 'payment':
          return { color: 'bg-orange-100 text-orange-800', icon: Clock };
        case 'confirmed':
          return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
        default:
          return { color: 'bg-gray-100 text-gray-800', icon: Minus };
      }
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  // Render status dropdown
  const renderStatusDropdown = () => {
    if (!showStatusDropdown) return null;

    return (
      <div 
        ref={statusDropdownRef}
        className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-40 max-h-80 overflow-hidden z-50"
      >
        <div className="p-2 max-h-64 overflow-y-auto">
          <div className="space-y-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleStatusSelect(option.value)}
                className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${
                  filterStatus === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render column customizer dropdown
  const renderColumnDropdown = () => {
    if (!showColumnDropdown) return null;

    return (
      <div 
        ref={columnDropdownRef}
        className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-64 max-h-80 overflow-hidden z-50"
      >
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Add/Remove Columns</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allColumns.map((column) => (
              <label key={column.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(column.key)}
                  onChange={() => toggleColumn(column.key)}
                  disabled={column.mandatory}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                />
                <span className={`ml-2 text-sm ${column.mandatory ? 'text-gray-500' : 'text-gray-900'}`}>
                  {column.label}
                  {column.mandatory && <span className="text-xs text-gray-400 ml-1">(Required)</span>}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Handle row selection (multi-select)
  const handleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Truncate Booking ID
  const truncateId = (id: string) => id.length > 8 ? id.slice(0, 8) + '...' : id;

  // Bulk action bar (multi-select)
  const selectedBookings = bookings.filter(b => selectedIds.includes(b.id));

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="">
        {/* Search and Filter Controls */}
        <div className="flex items-center space-x-4 mb-2">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm text-gray-900 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <button
              ref={statusButtonRef}
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {getSelectedStatusLabel()}
              <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
            </button>
            {renderStatusDropdown()}
          </div>

          {/* Customize Columns Button */}
          <div className="relative">
            <button
              ref={columnButtonRef}
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              Customize Columns
              <ChevronDown className={`w-4 h-4 transition-transform ${showColumnDropdown ? 'rotate-180' : ''}`} />
            </button>
            {renderColumnDropdown()}
          </div>
        </div>
        {/* Bulk Action Bar (multi-select) */}
        {selectedIds.length > 0 && (
          <div className="flex items-center border border-blue-200 bg-white rounded-lg px-4 py-2 mb-2 mt-4">
            <span className="bg-blue-100 text-gray-900 rounded-full px-4 py-2 text-sm font-medium">
              {selectedIds.length === 1
                ? truncateId(selectedBookings[0]?.id || '')
                : `${selectedIds.length} selected`}
            </span>
            <div className="flex-1" />
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-700 mr-2"
              onClick={() => setShowRemoveModal(true)}
            >
              Remove
            </button>
            {selectedIds.length === 1 && selectedBookings[0] && (
              <button
                className="px-4 py-2 bg-[#007bff] text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                onClick={() => {
                  // Navigate to confirmation page with booking ID as query param
                  router.push(`/bookings/confirmation?id=${selectedBookings[0].id}`);
                }}
              >
                View Booking Details
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {displayColumns.map((column) => (
                <th
                  key={column.key}
                  style={{ minWidth: column.width }}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={displayColumns.length} className="px-4 py-12">
                  <div className="flex flex-col items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              currentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className={`h-[40px] cursor-pointer ${selectedIds.includes(booking.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => handleSelect(booking.id)}
                >
                  {displayColumns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-4 whitespace-nowrap text-xs text-gray-900"
                    >
                      {renderCellContent(booking, column.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls - Only show if there are results */}
      {filteredBookings.length > 0 && (
        <div className="py-3 flex items-center justify-between bg-white border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
            {Math.min(currentPage * rowsPerPage, filteredBookings.length)} of{' '}
            <span className="font-medium">{filteredBookings.length}</span> shipments
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
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
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Are you sure you wanted to remove this booking data?</h2>
            <p className="text-sm text-gray-600 mb-4">*If you remove this booking, you will no longer see any of the related shipment, quote request, or shipment milestone/watchlist data for this booking.</p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                onClick={() => setShowRemoveModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-700"
                onClick={() => {
                  onRemoveBookings(selectedIds);
                  setSelectedIds([]);
                  setShowRemoveModal(false);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingTable;