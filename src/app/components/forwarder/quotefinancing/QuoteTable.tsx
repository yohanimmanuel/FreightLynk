import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Plus, Edit, Send, Eye, MoreVertical, Truck, Ship, Plane, ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';
import { useQuoteRateStore, Quote } from '../../../../store/quoterate';

const QuotesPage = () => {
  const { quotes, generateQuotesFromRates, deleteQuote } = useQuoteRateStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const itemsPerPage = 5;
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node) &&
          statusButtonRef.current && !statusButtonRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (quotes.some(q => !q.price)) {
      generateQuotesFromRates();
    }
  }, [quotes, generateQuotesFromRates]);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'requested', label: 'Requested' },
    { value: 'sent', label: 'Sent' },
    { value: 'expired', label: 'Expired' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-600';
      case 'draft': return 'bg-gray-100 text-gray-600';
      case 'expired': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'ocean': return <Ship className="w-4 h-4 text-[#007bff]" />;
      case 'air': return <Plane className="w-4 h-4 text-[#007bff]" />;
      case 'truck': return <Truck className="w-4 h-4 text-[#007bff]" />;
      default: return <Truck className="w-4 h-4 text-[#007bff]" />;
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.lane.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quote.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quote.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);
  const paginatedQuotes = filteredQuotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusSelect = (value: string) => {
    setStatusFilter(value);
    setShowStatusDropdown(false);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const getSelectedStatusLabel = () => {
    const selectedOption = statusOptions.find(option => option.value === statusFilter);
    return selectedOption ? selectedOption.label : 'All Status';
  };

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
                  statusFilter === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
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

  const renderPagination = () => {
    return (
      <div className="flex items-center justify-between py-3 border-t border-gray-200 bg-white">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredQuotes.length)} of {filteredQuotes.length} quotes
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

  const canSend = selectedQuotes.length > 0 && selectedQuotes.every(id => quotes.find(q => q.id === id)?.status !== 'sent');

  const handleRowClick = (id: string) => {
    if (selectedQuotes.includes(id)) {
      setSelectedQuotes(selectedQuotes.filter(qid => qid !== id));
    } else {
      setSelectedQuotes([...selectedQuotes, id]);
    }
  };

  return (
    <div className="bg-white">
      <div className="flex">
        
        {/* Main Content Area */}
        <div className="w-full p-2">
          {/* Search and Filters */}
          <div className="bg-white mb-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search quotes by route or carrier..."
                  className="w-full pl-10 pr-4 text-gray-900 text-sm py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
            </div>
          </div>

          {/* Selected Quotes Bar */}
          {selectedQuotes.length > 0 && (
            <div className="p-3 mb-2 bg-white border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                {selectedQuotes.map((id) => {
                  const quote = quotes.find(q => q.id === id);
                  if (!quote) return null;
                  return (
                    <span key={id} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-2 rounded-full mr-2 mb-1">
                      {quote.lane.toUpperCase()}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedQuotes(selectedQuotes.filter(qid => qid !== id));
                        }}
                        className="ml-2 text-blue-400 hover:text-blue-700 focus:outline-none"
                        title="Remove"
                        style={{ lineHeight: 1 }}
                      >
                        <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                      </button>
                    </span>
                  );
                })}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowRemoveModal(true)}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-white hover:text-red-700 focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quotes Table - Simplified for customers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote ID</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route/Lane</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transport Mode</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Container Type</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transit Time</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedQuotes.length > 0 ? (
                    paginatedQuotes.map((quote) => (
                      <tr
                        key={quote.id}
                        onClick={() => handleRowClick(quote.id)}
                        className={`hover:bg-gray-50 cursor-pointer ${selectedQuotes.includes(quote.id) ? 'bg-blue-50' : ''}`}
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-xs font-medium text-gray-900">{quote.id}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-900 uppercase">{quote.lane}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getModeIcon(quote.mode)}
                            <span className="text-xs text-gray-900 capitalize">{quote.mode}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-900">{quote.containertype}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-900">{quote.currency}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-xs font-medium text-gray-900">{quote.price}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-900">{quote.transitTime}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-900">{quote.carrier}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-900">{quote.validity}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>{quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-500">
                        No quotes found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination - Now matches ShipmentTable style */}
          {filteredQuotes.length > 0 && renderPagination()}
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-lg text-gray-900 font-semibold mb-4">Remove Quotes</h2>
            <div className="mb-4">
              <div className="text-sm text-gray-700 mb-2">Are you sure you want to remove the following quotes?</div>
              <ul className="mb-2">
                {selectedQuotes.map(id => {
                  const quote = quotes.find(q => q.id === id);
                  if (!quote) return null;
                  return (
                    <li key={id} className="flex items-center gap-2 text-sm text-gray-900 uppercase">{quote.lane}</li>
                  );
                })}
              </ul>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  selectedQuotes.forEach(id => deleteQuote(id));
                  setShowRemoveModal(false);
                  setSelectedQuotes([]);
                }}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
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

export default QuotesPage;