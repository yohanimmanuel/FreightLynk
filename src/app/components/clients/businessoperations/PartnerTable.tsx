import React, { useState } from 'react';
import { Search, Filter, MessageSquare, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Partner, partnerDirectory } from '@/store/partnerMockData';

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

  // Filter partners based on search term
  const filteredPartners = partners.filter(partner => 
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    partner.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Limit number of rows shown in summary view
  const displayPartners = view === 'summary' && maxRows 
    ? filteredPartners.slice(0, maxRows) 
    : filteredPartners;

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
              <button className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 flex items-center gap-2 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                Filter
              </button>
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
                  <button className="border border-gray-300 rounded-lg px-3 py-1 text-gray-600 hover:bg-gray-100">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartnerTable;
