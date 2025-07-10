import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import BookingDetailsModal from '@/app/components/forwarder/shipmentmanagement/BookingDetailsModal';
import { Search, ChevronDown, X as XIcon, X } from 'lucide-react';
import { mockForwarderBookings } from '@/store/bookingStore';

// Booking type (should match client)
type Booking = {
  id: string;
  shipmentId?: string;
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
  transportMode: string;
  quote?: string;
};

const allColumns = [
  { key: 'id', label: 'Booking ID', mandatory: true },
  { key: 'shipmentId', label: 'Shipment ID', mandatory: false },
  { key: 'poNumber', label: 'PO Number', mandatory: false },
  { key: 'productName', label: 'Product Name', mandatory: false },
  { key: 'shipper', label: 'Shipper', mandatory: false },
  { key: 'consignee', label: 'Consignee', mandatory: false },
  { key: 'origin', label: 'Origin', mandatory: false },
  { key: 'destination', label: 'Destination', mandatory: false },
  { key: 'transportMode', label: 'Transport Mode', mandatory: false },
  { key: 'shipmentType', label: 'Shipment Type', mandatory: false },
  { key: 'incoterms', label: 'Incoterms', mandatory: false },
  { key: 'eta', label: 'ETA', mandatory: false },
  { key: 'status', label: 'Status', mandatory: true },
  { key: 'quote', label: 'Quote', mandatory: false },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'booked', label: 'Booked' },
  { value: 'in transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
];

const defaultVisibleColumns = allColumns.filter(col => col.mandatory).map(col => col.key).concat([
  'shipmentId', 'poNumber', 'productName', 'shipper', 'consignee', 'origin', 'destination', 'transportMode', 'shipmentType', 'incoterms', 'eta', 'quote'
]);

const BookingManage: React.FC = () => {
  // Use mock data for now
  const bookings: Booking[] = mockForwarderBookings;
  // Example: const bookings = useBookingStore(state => state.bookings);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(defaultVisibleColumns);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const columnDropdownRef = useRef<HTMLDivElement>(null);
  const columnButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node) &&
          statusButtonRef.current && !statusButtonRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
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

  // Filter bookings based on search and status
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = searchTerm === '' ||
        Object.values(booking).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesFilter = filterStatus === 'all' ||
        booking.status.toLowerCase() === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [bookings, searchTerm, filterStatus]);

  // Get selected status label
  const getSelectedStatusLabel = () => {
    const selectedOption = statusOptions.find(option => option.value === filterStatus);
    return selectedOption ? selectedOption.label : 'All Status';
  };

  // Toggle column visibility
  const toggleColumn = (columnKey: string) => {
    const col = allColumns.find(c => c.key === columnKey);
    if (col?.mandatory) return;
    setVisibleColumns(prev =>
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
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
                onClick={() => { setFilterStatus(option.value); setShowStatusDropdown(false); }}
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

  // Only render visible columns
  const displayColumns = allColumns.filter(col => visibleColumns.includes(col.key));

  // Handle row selection (single-select)
  const handleRowClick = (id: string) => {
    setSelectedId(prev => (prev === id ? null : id));
  };

  // Bulk action handlers
  const handleView = () => {
    const booking = filteredBookings.find(b => b.id === selectedId);
    if (booking) setSelectedBooking(booking);
  };
  const handleReject = () => {
    setShowRejectModal(true);
  };
  const handleRejectSubmit = () => {
    setShowRejectModal(false);
    setRejectComment('');
    setSelectedId(null);
  };

  return (
    <div>
      {/* Search and Filter Controls (outside table section) */}
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

      {/* Bulk Action Bar */}
      {selectedId && (
        <div className="flex items-center border border-blue-200 bg-white rounded-lg px-4 py-2 mb-2 mt-4 shadow-sm">
          <span className="bg-blue-100 text-gray-900 rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2">
            {filteredBookings.find(b => b.id === selectedId)?.id || ''}
            <button
              className="ml-1 p-1 rounded-full hover:bg-blue-200 text-gray-500 hover:text-gray-700 focus:outline-none"
              style={{ lineHeight: 0 }}
              onClick={() => setSelectedId(null)}
              aria-label="Deselect"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </span>
          <div className="flex-1" />
          <button
            className="px-4 py-2 text-[#007bff] rounded-lg text-sm font-medium hover:text-blue-700 mr-2"
            onClick={handleView}
          >
            View
          </button>
          <button
            className="px-4 py-2 text-red-500 rounded-lg text-sm font-medium hover:text-red-700 mr-2"
            onClick={handleReject}
          >
            Reject
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-700"
            // onClick={handleQuote} // To be implemented
            disabled
          >
            Quote
          </button>
        </div>
      )}

      {/* Table Section */}
      <section className="bg-white border border-gray-200 rounded-lg shadow-sm w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {displayColumns.map(col => (
                  <th key={col.key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={displayColumns.length} className="text-center py-8 text-gray-400">No bookings found.</td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className={`hover:bg-blue-50 cursor-pointer transition ${selectedId === booking.id ? 'bg-blue-50' : ''}`}
                    onClick={() => handleRowClick(booking.id)}
                  >
                    {displayColumns.map(col => (
                      <td key={col.key} className="px-4 py-4 whitespace-nowrap text-xs text-gray-700">
                        {col.key === 'quote'
                          ? (!booking.quote || booking.quote === '-' ? (
                              <span className="text-red-600 font-semibold">Fill Quote</span>
                            ) : (
                              <span className="text-[#007bff] font-semibold">{booking.quote}</span>
                            ))
                          : col.key === 'status'
                            ? (
                              <span
                                className={
                                  booking.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg font-semibold'
                                    : booking.status === 'booked' || booking.status === 'delivered'
                                    ? 'bg-green-100 text-green-800 px-2 py-1 rounded-lg font-semibold'
                                    : booking.status === 'in transit'
                                    ? 'bg-blue-100 text-blue-800 px-2 py-1 rounded-lg font-semibold'
                                    : 'bg-gray-100 text-gray-700 px-2 py-1 rounded-lg font-semibold'
                                }
                              >
                                {booking.status}
                              </span>
                            )
                            : booking[col.key as keyof Booking] ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {selectedBooking && (
          <BookingDetailsModal
            formData={selectedBooking}
            onClose={() => setSelectedBooking(null)}
          />
        )}
        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                onClick={() => setShowRejectModal(false)}
                aria-label="Close"
              >
               <X size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
              <h3 className="text-xl text-gray-900 font-semibold mb-4">Reject Booking</h3>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 mb-4 text-xs text-gray-900"
                rows={4}
                placeholder="Please provide a reason for rejection..."
                value={rejectComment}
                onChange={e => setRejectComment(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  onClick={handleRejectSubmit}
                  disabled={!rejectComment.trim()}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default BookingManage;
