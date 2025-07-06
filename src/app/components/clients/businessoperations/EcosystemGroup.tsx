import React, { useState } from 'react';
import { Plus, Facebook, Instagram, Github, Twitter, Search, Filter } from 'lucide-react';
import { EcosystemGroup, ecosystemGroups } from '@/store/ecosystemData';

interface EcosystemGroupProps {
  ecosystemGroups?: EcosystemGroup[];
  view?: 'list' | 'grid';
}

const EcosystemGroupComponent: React.FC<EcosystemGroupProps> = ({ 
  ecosystemGroups: propEcosystemGroups = ecosystemGroups,
  view = 'list'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All Status');

  // Filter ecosystem groups based on search term, filter type, and status
  const filteredGroups = propEcosystemGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'All Types' || group.type === filterType;
    const matchesStatus = filterStatus === 'All Status' || group.status === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter && matchesStatus;
  });

  // Get unique types for filter dropdown
  const groupTypes = ['All Types', ...Array.from(new Set(propEcosystemGroups.map(group => group.type)))];
  const statusOptions = ['All Status', 'Active', 'Inactive', 'Pending'];

  return (
    <div className={view === 'list' ? '' : 'bg-white rounded-lg border border-gray-200 p-4'}>
      {view === 'grid' && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-md font-semibold text-gray-900">Ecosystem Groups</h2>
          <a href="/business/groups" className="bg-[#007bff] text-white hover:bg-blue-700 text-sm rounded-lg shadow-sm py-2 px-4">View All</a>
        </div>
      )}
      
      {view === 'list' ? (
        // List View
        <div>
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search ecosystem groups..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2">
                <select
                  className="px-3 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 appearance-none bg-white"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  {groupTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <select
                  className="px-3 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 appearance-none bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <button className="px-4 py-3 bg-[#007bff] text-white rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                Create New Ecosystem
              </button>
            </div>
          </div>
          
          <div className="space-y-3 border border-gray-200 rounded-lg">
            {filteredGroups.map(group => (
              <div key={group.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-md ${group.color} flex items-center justify-center text-white font-bold`}>
                  {group.name.substring(0, 2)}
                </div>
                <div className="ml-3 flex-grow">
                  <h3 className="font-medium text-gray-900">{group.name}</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-3">{group.members} members</span>
                    <span className="mr-3">•</span>
                    <span>{group.type}</span>
                    {group.status && (
                      <>
                        <span className="mx-3">•</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          group.status === 'active' ? 'bg-green-100 text-green-800' : 
                          group.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Last activity</div>
                  <div className="text-xs font-medium text-gray-700">{group.lastActivity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {propEcosystemGroups.map(group => (
            <div key={group.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full ${group.color} flex items-center justify-center text-white font-bold text-xl mb-3`}>
                  {group.name.substring(0, 2)}
                </div>
                <h3 className="font-medium text-gray-900 text-md mb-1">{group.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{group.type}</p>
                <p className="text-xs text-gray-500 mb-4">{group.members} members</p>
                
                <div className="flex space-x-3 mt-2">
                  <a href="#" className="text-[#007bff] hover:text-blue-700">
                    <Facebook size={18} />
                  </a>
                  <a href="#" className="text-pink-500 hover:text-pink-700">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="text-gray-700 hover:text-gray-900">
                    <Github size={18} />
                  </a>
                  <a href="#" className="text-blue-400 hover:text-blue-600">
                    <Twitter size={18} />
                  </a>
                </div>
              </div>
            </div>
          ))}
          
          <div className="py-16 bg-white border border-gray-200 border-dashed rounded-lg flex items-center justify-center hover:bg-gray-50 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                <Plus size={20} />
              </div>
              <p className="font-medium text-gray-700">Create New Ecosystem</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcosystemGroupComponent;
