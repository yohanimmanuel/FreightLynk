import React, { useState } from 'react';
import { Search, Filter, MapPin, Star } from 'lucide-react';
import { recommendedPartners, RecommendedPartner } from '@/store/partnerExploredata';

interface PartnerExploreProps {
  view?: 'full' | 'recommended';
  partners?: RecommendedPartner[];
}

const PartnerExplore: React.FC<PartnerExploreProps> = ({ 
  view = 'full', 
  partners = recommendedPartners 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Services');
  
  // Filter partners based on search term
  const filteredPartners = partners.filter(partner => 
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    partner.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // For recommended view, limit to top 3 partners
  const displayPartners = view === 'recommended' 
    ? filteredPartners.slice(0, 3) 
    : filteredPartners;

  return (
    <div className="w-full mx-auto">
      {/* Search and Filter Bar - Only show in full view */}
      {view === 'full' && (
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search businesses, partners, or ecosystems..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 flex items-center gap-2 hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                Filter
              </button>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 appearance-none bg-white"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option>All Services</option>
                <option>Logistics Provider</option>
                <option>Exporter</option>
                <option>Customs Broker</option>
                <option>Ocean Freight</option>
                <option>Air Freight</option>
                <option>Trucking</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Partners Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-semibold text-gray-900">Recommended Partners</h2>
          {view === 'recommended' && (
            <a href="/business/explore" className="bg-[#007bff] text-white hover:bg-blue-700 text-sm rounded-lg shadow-sm p-2 px-4">View All</a>
          )}
        </div>

        <div className={`grid grid-cols-1 ${view === 'full' ? 'md:grid-cols-2 lg:grid-cols-3' : ''} gap-4`}>
          {displayPartners.map(partner => (
            <div key={partner.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <div className={`w-12 h-12 rounded-full bg-[#007bff] flex items-center justify-center text-white font-bold text-lg`}>
                  {partner.logo}
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">{partner.name}</h3>
                  <p className="text-sm text-gray-600">{partner.sector}</p>
                </div>
                <div className="ml-auto flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700 ml-1">{partner.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {partner.location}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{partner.connections} connections</span>
                <button className="px-4 py-2 bg-[#007bff] text-white rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center">
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartnerExplore;
