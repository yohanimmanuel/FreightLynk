import React, { useState, useRef, useEffect } from 'react';
import { Search, Download, Upload, Plus, Eye, CreditCard, Calendar, Filter, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { billingData } from '@/store/billingData';

interface BillingTableProps {
  onViewDetails?: (item: any) => void;
}

const FreightLynkBilling: React.FC<BillingTableProps> = ({ onViewDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusButtonRef = useRef(null);
  const statusDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusDropdownRef.current &&
        !(statusDropdownRef.current as any).contains(event.target) &&
        !(statusButtonRef.current as any).contains(event.target)
      ) {
        setShowStatusDropdown(false);
      }
    }
    if (showStatusDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown]);

  // Filter and search logic
  const filteredData = billingData.filter(item => {
    const matchesSearch = item.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Unpaid': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      case 'Failed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleView = (item: any) => {
    if (onViewDetails) {
      onViewDetails(item);
    } else {
      console.log('View billing details for:', item.bookingId);
    }
  };

  const handlePay = (item: any) => {
    console.log('Payment process for:', item.bookingId);
    // Payment logic will be implemented later
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statusOptions = ['All Status', 'Paid', 'Unpaid', 'Overdue', 'Failed'];

  const renderStatusFilterDropdown = () => {
    if (!showStatusDropdown) return null;
    return (
      <div
        ref={statusDropdownRef}
        className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-40 max-h-80 overflow-hidden z-50"
      >
        <div className="p-2 max-h-64 overflow-y-auto">
          <div className="space-y-1">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setShowStatusDropdown(false);
                }}
                className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${
                  statusFilter === status ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div>
        {/* Filters and Search */}
        <div className="mb-4">
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 flex-1 gap-2 md:gap-0 w-full">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
                  <div className="relative w-full md:w-auto">
                    <button
                      ref={statusButtonRef}
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full md:w-auto"
                    >
                      {statusFilter}
                      <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {renderStatusFilterDropdown()}
                  </div>
                  <input
                    type="date"
                    className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
                  />
                  <span className="text-gray-400 hidden md:inline">to</span>
                  <input
                    type="date"
                    className="px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-auto"
                  />
                </div>
              </div>
              {/* Import/Export buttons or other controls can remain here on the right if present */}
            </div>
          </div>
        </div>
        {/* Billing Table for md+ screens */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full overflow-x-auto p-0 hidden md:block">
          <table className="w-full min-w-0 table-fixed">
            <colgroup>
              <col style={{ width: '15%' }} />
              <col style={{ width: '19%' }} />
              <col style={{ width: '17%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '18%' }} />
            </colgroup>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs py-2 px-4 font-medium text-gray-500 uppercase">Booking ID</th>
                <th className="text-left text-xs py-2 px-4 font-medium text-gray-500 uppercase">Issuer</th>
                <th className="text-left text-xs py-2 px-4 font-medium text-gray-500 uppercase">Billing Date</th>
                <th className="text-left text-xs py-2 px-4 font-medium text-gray-500 uppercase">Amount Due</th>
                <th className="text-left text-xs py-2 px-4 font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left text-xs py-2 px-4 font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.map((item) => (
                <tr key={item.id} className="text-xs">
                  <td className="py-4 px-4">
                    <span className="font-medium text-[#007bff]">{item.bookingId}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900">{item.issuer}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-700">{formatDate(item.billingDate)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">{formatCurrency(item.amountDue)}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>{item.status}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(item)}
                        className="flex items-center space-x-1 px-4 py-2 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      {(item.status === 'Unpaid' || item.status === 'Overdue' || item.status === 'Failed') && (
                        <button
                          onClick={() => handlePay(item)}
                          className="flex items-center space-x-1 px-4 py-2 font-semibold text-xs bg-[#007bff] text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Pay Now</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {currentData.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#007bff]">{item.bookingId}</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>{item.status}</span>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Issuer</span>
                  <span className="text-gray-900">{item.issuer}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Billing Date</span>
                  <span className="text-gray-900">{formatDate(item.billingDate)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Amount Due</span>
                  <span className="text-gray-900">{formatCurrency(item.amountDue)}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleView(item)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </button>
                {(item.status === 'Unpaid' || item.status === 'Overdue' || item.status === 'Failed') && (
                  <button
                    onClick={() => handlePay(item)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 font-semibold text-xs bg-[#007bff] text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <CreditCard className="w-3 h-3" />
                    <span>Pay Now</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Pagination - outside and below the table */}
        <div className="mt-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
            <div className="text-sm text-gray-700">
              Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} invoices
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
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
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreightLynkBilling;