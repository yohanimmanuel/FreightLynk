import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Filter, Settings, Eye, EyeOff, Calendar, Package, MapPin, Ship, Clock, AlertTriangle, CheckCircle, XCircle, Minus, Download, Upload, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown } from 'lucide-react';

interface BookingTableProps {
  onSubmitBooking?: () => void;
}

const BookingTable: React.FC<BookingTableProps> = ({ onSubmitBooking = () => {} }) => { 
  // Sample booking data (now with 8 entries)
  const [bookings] = useState<Booking[]>([
    {
      id: 'BK-2025-001',
      poNumber: 'PO-24-1001',
      productName: 'Electronic Components',
      hsCode: '8542.31.0000',
      buyer: 'TechCorp Ltd',
      seller: 'ManufactureCo',
      origin: 'Shenzhen, CN',
      destination: 'Los Angeles, US',
      shipmentType: 'FCL',
      containerType: '20ft Standard',
      incoterms: 'FOB',
      cargoReadyDate: '2025-07-15',
      dangerousGoods: false,
      weight: '15,240 kg',
      volume: '28.3 m³',
      pieces: 1240,
      status: 'In Transit',
      eta: '2025-07-28'
    },
    {
      id: 'BK-2025-002',
      poNumber: 'PO-24-1002',
      productName: 'Textile Materials',
      hsCode: '6302.21.0000',
      buyer: 'Fashion House Inc',
      seller: 'TextilePro',
      origin: 'Mumbai, IN',
      destination: 'Hamburg, DE',
      shipmentType: 'LCL',
      containerType: '40ft HC',
      incoterms: 'CIF',
      cargoReadyDate: '2025-07-20',
      dangerousGoods: false,
      weight: '8,750 kg',
      volume: '45.2 m³',
      pieces: 2100,
      status: 'Booked',
      eta: '2025-08-05'
    },
    {
      id: 'BK-2025-003',
      poNumber: 'PO-24-1003',
      productName: 'Chemical Reagents',
      hsCode: '2942.00.0000',
      buyer: 'PharmaLab Corp',
      seller: 'ChemSupply',
      origin: 'Rotterdam, NL',
      destination: 'Singapore, SG',
      shipmentType: 'FCL',
      containerType: '20ft Reefer',
      incoterms: 'DAP',
      cargoReadyDate: '2025-07-25',
      dangerousGoods: true,
      weight: '12,500 kg',
      volume: '22.1 m³',
      pieces: 840,
      status: 'Pending',
      eta: '2025-08-12'
    },
    {
      id: 'BK-2025-004',
      poNumber: 'PO-24-1004',
      productName: 'Automotive Parts',
      hsCode: '8708.29.0000',
      buyer: 'AutoMotive Inc',
      seller: 'PartsMaker',
      origin: 'Yokohama, JP',
      destination: 'Long Beach, US',
      shipmentType: 'FCL',
      containerType: '40ft Standard',
      incoterms: 'EXW',
      cargoReadyDate: '2025-07-30',
      dangerousGoods: false,
      weight: '18,900 kg',
      volume: '67.8 m³',
      pieces: 1580,
      status: 'Delivered',
      eta: '2025-08-15'
    },
    {
      id: 'BK-2025-005',
      poNumber: 'PO-24-1005',
      productName: 'Industrial Pumps',
      hsCode: '8413.70.0000',
      buyer: 'WaterWorks Inc',
      seller: 'PumpMasters',
      origin: 'Berlin, DE',
      destination: 'Toronto, CA',
      shipmentType: 'FCL',
      containerType: '40ft Standard',
      incoterms: 'CIP',
      cargoReadyDate: '2025-08-05',
      dangerousGoods: false,
      weight: '22,100 kg',
      volume: '58.6 m³',
      pieces: 320,
      status: 'Booked',
      eta: '2025-08-20'
    },
    {
      id: 'BK-2025-006',
      poNumber: 'PO-24-1006',
      productName: 'Medical Equipment',
      hsCode: '9018.90.0000',
      buyer: 'HealthPlus Ltd',
      seller: 'MediTech',
      origin: 'Boston, US',
      destination: 'Sydney, AU',
      shipmentType: 'LCL',
      containerType: '20ft Standard',
      incoterms: 'DDP',
      cargoReadyDate: '2025-08-10',
      dangerousGoods: false,
      weight: '7,800 kg',
      volume: '18.9 m³',
      pieces: 150,
      status: 'Pending',
      eta: '2025-08-25'
    },
    {
      id: 'BK-2025-007',
      poNumber: 'PO-24-1007',
      productName: 'Solar Panels',
      hsCode: '8541.40.0000',
      buyer: 'GreenEnergy Corp',
      seller: 'SunPower',
      origin: 'Shanghai, CN',
      destination: 'Dubai, AE',
      shipmentType: 'FCL',
      containerType: '40ft HC',
      incoterms: 'FCA',
      cargoReadyDate: '2025-08-15',
      dangerousGoods: false,
      weight: '14,500 kg',
      volume: '62.3 m³',
      pieces: 480,
      status: 'In Transit',
      eta: '2025-08-30'
    }
  ]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // All available columns
  const allColumns = [
    { key: 'id', label: 'Booking ID', mandatory: true, width: '140px' },
    { key: 'poNumber', label: 'PO Number', mandatory: false, width: '130px' },
    { key: 'productName', label: 'Product Name', mandatory: false, width: '180px' },
    { key: 'hsCode', label: 'HS Code', mandatory: false, width: '140px' },
    { key: 'buyer', label: 'Buyer', mandatory: false, width: '160px' },
    { key: 'seller', label: 'Seller', mandatory: false, width: '140px' },
    { key: 'origin', label: 'Origin', mandatory: false, width: '140px' },
    { key: 'destination', label: 'Destination', mandatory: false, width: '140px' },
    { key: 'shipmentType', label: 'Shipment Type', mandatory: false, width: '120px' },
    { key: 'containerType', label: 'Container Type', mandatory: false, width: '140px' },
    { key: 'incoterms', label: 'Incoterms', mandatory: false, width: '100px' },
    { key: 'cargoReadyDate', label: 'Cargo Ready Date', mandatory: false, width: '140px' },
    { key: 'dangerousGoods', label: 'Dangerous Goods', mandatory: false, width: '130px' },
    { key: 'weight', label: 'Weight', mandatory: false, width: '110px' },
    { key: 'volume', label: 'Volume', mandatory: false, width: '110px' },
    { key: 'pieces', label: 'Pieces', mandatory: false, width: '100px' },
    { key: 'status', label: 'Status', mandatory: true, width: '120px' },
    { key: 'eta', label: 'ETA', mandatory: false, width: '120px' }
  ];

  // Default visible columns
  const defaultVisibleColumns = ['id', 'poNumber', 'productName', 'buyer', 'origin', 'destination', 'shipmentType', 'status', 'eta'];
  
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
        case 'delivered':
          return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
        case 'in transit':
          return { color: 'bg-blue-100 text-blue-800', icon: Ship };
        case 'booked':
          return { color: 'bg-purple-100 text-purple-800', icon: Calendar };
        case 'pending':
          return { color: 'bg-orange-100 text-orange-800', icon: Clock };
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

  // Define booking type
  type Booking = {
    id: string;
    poNumber: string;
    productName: string;
    hsCode: string;
    buyer: string;
    seller: string;
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
  };

  // Render cell content based on column type
  const renderCellContent = (booking: Booking, columnKey: string) => {
    switch (columnKey) {
      case 'status':
        return <StatusBadge status={booking[columnKey]} />;
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
            {booking[columnKey]}
          </span>
        );
      case 'shipmentType':
        return (
          <span className="flex items-center">
            <Package className="w-3 h-3 mr-1 text-gray-400" />
            {booking[columnKey]}
          </span>
        );
      case 'cargoReadyDate':
      case 'eta':
        return (
          <span className="flex items-center">
            <Calendar className="w-3 h-3 mr-1 text-gray-400" />
            {booking[columnKey]}
          </span>
        );
      default:
        return booking[columnKey as keyof Booking];
    }
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
                <tr key={booking.id} className="hover:bg-gray-50 h-[40px]">
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
    </div>
  );
};

export default BookingTable;