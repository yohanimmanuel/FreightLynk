import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Send, Eye, MoreVertical, Truck, Ship, Plane, ChevronLeft, ChevronRight } from 'lucide-react';

interface Quote {
  id: string;
  lane: string;
  mode: 'ocean' | 'air' | 'truck';
  price: string;
  validity: string;
  transitTime: string;
  carrier: string;
  status: 'sent' | 'draft' | 'requested' | 'expired';
}

const QuotesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Simplified mock data with only essential customer-facing information
  const quotes: Quote[] = [
    {
      id: 'QT-2025-001',
      lane: 'Shanghai → Los Angeles',
      mode: 'ocean',
      price: '$2,100 - $2,800',
      validity: 'Valid until Jul 31, 2024',
      transitTime: '18-22 days',
      carrier: 'COSCO Shipping',
      status: 'sent'
    },
    {
      id: 'QT-2025-002',
      lane: 'Hamburg → Singapore',
      mode: 'ocean',
      price: '$1,650 - $2,200',
      validity: 'Valid until Jun 30, 2024',
      transitTime: '25-30 days',
      carrier: 'Maersk Line',
      status: 'sent'
    },
    {
      id: 'QT-2025-003',
      lane: 'Hong Kong → New York',
      mode: 'air',
      price: '$7,500 - $9,200',
      validity: 'Valid until Jul 15, 2024',
      transitTime: '2-3 days',
      carrier: 'Cathay Pacific Cargo',
      status: 'sent'
    },
    {
      id: 'QT-2025-004',
      lane: 'Long Beach → Tokyo',
      mode: 'ocean',
      price: '$1,890 - $2,450',
      validity: 'Valid until Aug 15, 2024',
      transitTime: '12-15 days',
      carrier: 'ONE (Ocean Network Express)',
      status: 'expired'
    },
    {
      id: 'QT-2025-005',
      lane: 'Singapore → Rotterdam',
      mode: 'ocean',
      price: '$1,950 - $2,300',
      validity: 'Valid until Aug 31, 2024',
      transitTime: '20-25 days',
      carrier: 'MSC',
      status: 'sent'
    },
    {
      id: 'QT-2025-006',
      lane: 'Tokyo → Sydney',
      mode: 'air',
      price: '$4,500 - $5,800',
      validity: 'Valid until Jul 10, 2024',
      transitTime: '1-2 days',
      carrier: 'ANA Cargo',
      status: 'expired'
    },
    {
      id: 'QT-2025-007',
      lane: 'Los Angeles → Chicago',
      mode: 'truck',
      price: '$1,200 - $1,500',
      validity: 'Valid until Sep 30, 2024',
      transitTime: '3-5 days',
      carrier: 'J.B. Hunt',
      status: 'sent'
    }
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

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-2 py-2 mb-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Your Quotes</h1>
            <p className="text-sm text-gray-600 mt-1">Review your freight quotes</p>
          </div>
        </div>
      </div>

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
              <select
                className="px-4 py-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="requested">Requested</option>
                <option value="sent">Sent</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Quotes Table - Simplified for customers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote ID</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transit Time</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedQuotes.length > 0 ? (
                    paginatedQuotes.map((quote) => (
                      <tr key={quote.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedQuote(quote)}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-xs font-medium text-gray-900">{quote.id}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-900">{quote.lane}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getModeIcon(quote.mode)}
                            <span className="text-xs text-gray-900 capitalize">{quote.mode}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-xs font-medium text-gray-900">{quote.price}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-900">{quote.transitTime}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-900">{quote.validity}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-900">{quote.carrier}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                            {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <button className="text-gray-400 hover:text-blue-600 transition-colors" title="View">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Accept">
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
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
    </div>
  );
};

export default QuotesPage;