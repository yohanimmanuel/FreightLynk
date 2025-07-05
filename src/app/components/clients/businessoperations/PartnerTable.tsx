import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, MessageSquare, Eye, ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Partner, partnerDirectory } from '@/store/partnerCompanyData';

interface PartnerTableProps {
  partners?: Partner[];
  view?: 'full' | 'summary';
  maxRows?: number;
}

const PartnerTable: React.FC<PartnerTableProps> = ({ 
  partners = partnerDirectory, 
  view = 'full', 
  maxRows = 5 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState('All Types');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const typeButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node) &&
          typeButtonRef.current && !typeButtonRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const partnerTypes = ['All Types', 'Client', 'Forwarder', 'Provider'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Client': return 'bg-blue-100 text-blue-800';
      case 'Forwarder': return 'bg-purple-100 text-purple-800';
      case 'Provider': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter partners based on search term and selected type
  const getFilteredPartners = () => {
    let filtered = partners;
    
    // Filter by partner type
    if (selectedType !== 'All Types') {
      filtered = filtered.filter(partner => partner.type === selectedType);
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(partner => 
        partner.name.toLowerCase().includes(searchLower) || 
        partner.industry.toLowerCase().includes(searchLower) ||
        partner.type.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  };

  const filteredPartners = getFilteredPartners();

  // Limit number of rows shown in summary view or paginate for full view
  const displayPartners = view === 'summary' 
    ? filteredPartners.slice(0, maxRows)
    : filteredPartners.slice((currentPage - 1) * 5, currentPage * 5);

  const totalPages = Math.ceil(filteredPartners.length / 5);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setShowTypeDropdown(false);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const renderTypeDropdown = () => {
    if (!showTypeDropdown) return null;
  
    return (
      <div 
        ref={typeDropdownRef}
        className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-40 max-h-80 overflow-hidden z-50"
      >
        <div className="p-2 max-h-64 overflow-y-auto">
          <div className="space-y-1">
            {partnerTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeSelect(type)}
                className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${
                  selectedType === type ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {type}
              </button>
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
          Showing {Math.min((currentPage - 1) * 5 + 1, filteredPartners.length)} to {Math.min(currentPage * 5, filteredPartners.length)} of {filteredPartners.length} partners
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

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 w-full">
        {view === 'full' ? (
          <>
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search partners..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative">
                <button 
                  ref={typeButtonRef}
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 flex items-center gap-2 hover:bg-gray-50"
                >
                  {selectedType}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                </button>
                {renderTypeDropdown()}
              </div>
              <Link href="/business/explore" className="w-full md:w-auto">
                <button className="w-full md:w-auto px-3 py-2 bg-[#007bff] text-white rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors">
                  Explore More Partners
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="flex w-full justify-between">
            <h2 className="text-md font-semibold text-gray-900 mt-1">Partner Directory</h2>
            <Link href="/business/partners">
              <button className="bg-[#007bff] text-white hover:bg-blue-700 text-sm rounded-lg shadow-sm p-2 px-4">
                View All
              </button>
            </Link>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayPartners.map(partner => (
              <tr key={partner.id}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#007bff] flex items-center justify-center text-white font-bold text-sm">
                      {partner.avatar}
                    </div>
                    <div className="ml-3">
                      <div className="text-xs font-medium text-gray-900">{partner.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(partner.type)}`}>
                    {partner.type}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(partner.status)}`}>
                    {partner.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-700">
                  {partner.industry}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-700">
                  {partner.lastContact}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-xs font-medium">
                  <Link href={`/business/partners/details?id=${partner.id}`}>
                    <button className="border border-gray-300 rounded-lg px-3 py-1 text-gray-600 hover:bg-gray-100">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {renderPagination()}
      
      {filteredPartners.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No partners found
        </div>
      )}
    </div>
  );
};

export default PartnerTable;
