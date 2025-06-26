import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Truck, Ship, Plane, ChevronUp, Edit, Plus, Search, Filter, Download, Upload, Trash2, MoreHorizontal, X, ChevronRight, ChevronLeft, Train } from 'lucide-react';

interface Rate {
  id: number;
  lane: string;
  mode: 'ocean' | 'air' | 'truck';
  rateBasis: string;
  weight: string;
  volume: string;
  containertype: string;
  currency: string;
  price: string;
  baseRate: number;
  originCity: string;
  destinationCity: string;
  transitTime: string;
  carrier: string;
  surcharges: string;
  incoterm: string;
  validFrom: string;
  validTo: string;
  notes: string;
  provider: string;
  status: string;
}

interface RateTableProps {
  view?: 'summary' | 'full';
  onViewAll?: () => void;
}

const RateTable: React.FC<RateTableProps> = ({ view = 'summary', onViewAll = () => {} }) => {  
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'ocean' | 'air' | 'truck'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRate, setCurrentRate] = useState<Rate | null>(null);
  const [selectedRates, setSelectedRates] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const columnDropdownRef = useRef<HTMLDivElement>(null);
  const columnButtonRef = useRef<HTMLButtonElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  const modeButtonRef = useRef<HTMLButtonElement>(null);

  // Update your useEffect for click outside handling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Column dropdown
      if (columnDropdownRef.current && !columnDropdownRef.current.contains(event.target as Node) &&
          columnButtonRef.current && !columnButtonRef.current.contains(event.target as Node)) {
        setShowColumnDropdown(false);
      }
      
      // Mode dropdown
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target as Node) &&
          modeButtonRef.current && !modeButtonRef.current.contains(event.target as Node)) {
        setShowModeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    lane: true,
    mode: true,
    rateBasis: true,
    weight: true,
    volume: true,
    containertype: true,
    currency: true,
    price: true,
    baseRate: true,
    originCity: true,
    destinationCity: true,
    transitTime: true,
    carrier: true,
    surcharges: true,
    incoterm: true,
    validFrom: true,
    validTo: true,
    notes: true,
    provider: true,
    status: true
  });  

  // Extended mock data with all properties
  const [rates, setRates] = useState<Rate[]>([
    {
      id: 1,
      lane: 'Asia → North America',
      mode: 'ocean',
      rateBasis: 'per container',
      containertype: '40ft',
      weight: '200 kg',
      volume: '20 CBM',
      currency: 'USD',
      price: '$2,100 - $2,800',
      baseRate: 2100,
      originCity: 'Shanghai',
      destinationCity: 'Los Angeles',
      transitTime: '18-22 days',
      carrier: 'COSCO Shipping',
      surcharges: 'BAF: $150, CAF: $200',
      incoterm: 'FOB',
      validFrom: '2024-06-01',
      validTo: '2024-07-31',
      notes: 'Peak season surcharge may apply',
      provider: 'Pacific Logistics',
      status: 'draft'
    },
    {
      id: 2,
      lane: 'Europe → Asia',
      mode: 'ocean',
      rateBasis: 'per container',
      containertype: '40ft',
      weight: '200 kg',
      volume: '20 CBM',
      currency: 'USD',
      price: '$1,650 - $2,200',
      baseRate: 1650,
      originCity: 'Hamburg',
      destinationCity: 'Singapore',
      transitTime: '25-30 days',
      carrier: 'Maersk Line',
      surcharges: 'THC: $100, DOC: $50',
      incoterm: 'CIF',
      validFrom: '2024-05-15',
      validTo: '2024-06-30',
      notes: 'Express service available',
      provider: 'Euro Freight',
      status: 'draft'
    },
    {
      id: 3,
      lane: 'Asia → Europe',
      mode: 'air',
      rateBasis: 'per container',
      containertype: '40ft',
      weight: '200 kg',
      volume: '20 CBM',
      currency: 'USD',
      price: '$7,500 - $9,200',
      baseRate: 7500,
      originCity: 'Hong Kong',
      destinationCity: 'Frankfurt',
      transitTime: '2-3 days',
      carrier: 'Cathay Pacific Cargo',
      surcharges: 'FSC: $300, SSC: $150',
      incoterm: 'EXW',
      validFrom: '2024-06-01',
      validTo: '2024-07-15',
      notes: 'Temperature controlled available',
      provider: 'Air Cargo Express',
      status: 'draft'
    },
    {
      id: 4,
      lane: 'North America → Asia',
      mode: 'ocean',
      rateBasis: 'per container',
      containertype: '40ft',
      weight: '200 kg',
      volume: '20 CBM',
      currency: 'USD',
      price: '$1,890 - $2,450',
      baseRate: 1890,
      originCity: 'Long Beach',
      destinationCity: 'Tokyo',
      transitTime: '12-15 days',
      carrier: 'ONE (Ocean Network Express)',
      surcharges: 'PCS: $200, EBS: $100',
      incoterm: 'FOB',
      validFrom: '2024-07-01',
      validTo: '2024-08-15',
      notes: 'Weekly service available',
      provider: 'Trans Pacific Shipping',
      status: 'draft'
    },
    {
      id: 5,
      lane: 'Europe → North America',
      mode: 'truck',
      rateBasis: 'per container',
      containertype: '40ft',
      weight: '200 kg',
      volume: '20 CBM',
      currency: 'USD',
      price: '$1,200 - $1,500',
      baseRate: 1200,
      originCity: 'Berlin',
      destinationCity: 'Chicago',
      transitTime: '5-7 days',
      carrier: 'DB Schenker',
      surcharges: 'Fuel: $150, Toll: $75',
      incoterm: 'DAP',
      validFrom: '2024-06-15',
      validTo: '2024-09-30',
      notes: 'Express delivery available',
      provider: 'Continental Trucking',
      status: 'draft'
    },
    {
      id: 6,
      lane: 'Middle East → Africa',
      mode: 'ocean',
      rateBasis: 'per container',
      containertype: '40ft',
      weight: '200 kg',
      volume: '20 CBM',
      currency: 'USD',
      price: '$1,750 - $2,100',
      baseRate: 1750,
      originCity: 'Dubai',
      destinationCity: 'Mombasa',
      transitTime: '10-14 days',
      carrier: 'MSC',
      surcharges: 'WRS: $120, PCS: $80',
      incoterm: 'FOB',
      validFrom: '2024-07-01',
      validTo: '2024-08-31',
      notes: 'Direct service',
      provider: 'Red Sea Shipping',
      status: 'draft'
    },
    {
      id: 7,
      lane: 'South America → Europe',
      mode: 'air',
      rateBasis: 'per container',
      containertype: '40ft',
      weight: '200 kg',
      volume: '20 CBM',
      currency: 'USD',
      price: '$6,800 - $8,400',
      baseRate: 6800,
      originCity: 'São Paulo',
      destinationCity: 'Amsterdam',
      transitTime: '1-2 days',
      carrier: 'LATAM Cargo',
      surcharges: 'FSC: $350, SEC: $120',
      incoterm: 'CIP',
      validFrom: '2024-06-10',
      validTo: '2024-07-20',
      notes: 'Perishable goods specialist',
      provider: 'Atlantic Air Freight',
      status: 'draft'
    },
  ]);

  const getModeIcon = (mode: 'ocean' | 'air' | 'truck' | 'rail') => {
    switch (mode) {
      case 'ocean': return <Ship className="w-4 h-4 text-[#007bff]" />;
      case 'air': return <Plane className="w-4 h-4 text-[#007bff]" />;
      case 'truck': return <Truck className="w-4 h-4 text-[#007bff]" />;
      case 'rail': return <Train className="w-4 h-4 text-[#007bff]" />;
      default: return <Truck className="w-4 h-4 text-[#007bff]" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-200 text-gray-600';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const filteredRates = rates.filter(rate => {
    const matchesSearch = rate.lane.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rate.originCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rate.destinationCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rate.carrier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMode === 'all' || rate.mode === filterMode;
    return matchesSearch && matchesFilter;
  });

  const paginatedRates = filteredRates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRates.length / itemsPerPage);

  const handleSelectRate = (rateId: number) => {
    setSelectedRates(prev => 
      prev.includes(rateId) 
        ? prev.filter(id => id !== rateId)
        : [...prev, rateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRates.length === paginatedRates.length && paginatedRates.length > 0) {
      setSelectedRates([]);
    } else {
      setSelectedRates(paginatedRates.map(rate => rate.id));
    }
  };

  const handleEditRate = (rate: Rate) => {
    setCurrentRate(rate);
    setShowEditModal(true);
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRate) return;
    
    setRates(prevRates => 
      prevRates.map(rate => 
        rate.id === currentRate.id ? currentRate : rate
      )
    );
    setShowEditModal(false);
    setCurrentRate(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!currentRate) return;
    
    const { name, value } = e.target;
    setCurrentRate(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  const renderPagination = () => {
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRates.length)} of {filteredRates.length} rates
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
    );
  };

  // Summary View (Original Component)
  if (view === 'summary') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="sticky">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Current Rates</h3>
            <button 
              onClick={toggleExpanded}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              aria-label={isExpanded ? "Collapse rates" : "Expand rates"}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
          </div>
          
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isExpanded ? 'opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="space-y-2">
              {rates.slice(0, 4).map((rate) => (
                <div key={rate.id} className="bg-white rounded-lg p-3 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditRate(rate);
                    }}
                    className="absolute top-2 right-2 p-1 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getModeIcon(rate.mode)}
                      <span className="text-sm font-medium text-gray-900 capitalize">{rate.mode}</span>
                      <span className="text-gray-900">-</span>
                      <span className="text-sm font-semibold text-gray-900 capitalize">{rate.provider}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{rate.lane}</div>
                  <div className="text-sm font-semibold text-gray-900 mb-2">{rate.price}</div>
                  <div className="text-xs text-gray-500">
                    Validity date: {rate.validFrom} - {rate.validTo}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button 
                onClick={() => onViewAll()}
                className="w-full text-sm text-white bg-[#007bff] rounded-lg shadow-sm py-2 px-2 hover:bg-blue-700 font-medium">
                View All Rates
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Management View
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="p-4 -mt-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Rate Management</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-200">
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-200">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#007bff] rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add New Rate
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by route, city, or carrier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm text-gray-900 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
              <button 
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {filterMode === 'all' ? 'All Modes' : filterMode.charAt(0).toUpperCase() + filterMode.slice(1)}
                <ChevronDown className={`w-4 h-4 transition-transform ${showModeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showModeDropdown && (
                <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-40 z-50">
                  <div className="p-2">
                    {['all', 'ocean', 'air', 'truck', 'rail'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          setFilterMode(mode as any);
                          setShowModeDropdown(false);
                        }}
                        className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${
                          filterMode === mode ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        {mode === 'all' ? 'All Modes' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowColumnModal(!showColumnModal)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Add/Remove Columns
                <ChevronDown className={`w-4 h-4 transition-transform ${showColumnModal ? 'rotate-180' : ''}`} />
              </button>

              {showColumnModal && (
                <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-56 z-50">
                  <div className="p-2 max-h-64 overflow-y-auto">
                    {Object.entries(columnVisibility).map(([key, visible]) => (
                      <label key={key} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={visible}
                          onChange={(e) => setColumnVisibility(prev => ({
                            ...prev,
                            [key]: e.target.checked
                          }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
        </div>

        {/* Bulk Actions */}
        {selectedRates.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedRates.length} rate{selectedRates.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-3 py-1 text-sm text-[#007bff] hover:text-blue-700">
                  Post Quote
                </button>
                <button className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
                  Archive
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table Container with horizontal scrolling */}
      <div className="px-4 pb-4">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedRates.length === paginatedRates.length && paginatedRates.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    {columnVisibility.id && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>}
                    {columnVisibility.lane && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lane</th>}
                    {columnVisibility.mode && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>}
                    {columnVisibility.rateBasis && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate Basis</th>}
                    {columnVisibility.weight && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>}
                    {columnVisibility.volume && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>}
                    {columnVisibility.containertype && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Container Type</th>}
                    {columnVisibility.currency && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>}
                    {columnVisibility.price && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>}
                    {columnVisibility.baseRate && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Rate</th>}
                    {columnVisibility.originCity && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>}
                    {columnVisibility.destinationCity && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>}
                    {columnVisibility.transitTime && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transit Time</th>}
                    {columnVisibility.carrier && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>}
                    {columnVisibility.surcharges && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surcharge</th>}
                    {columnVisibility.incoterm && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incoterm</th>}
                    {columnVisibility.validFrom && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid From</th>}
                    {columnVisibility.validTo && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>}
                    {columnVisibility.notes && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>}   
                    {columnVisibility.provider && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>}               
                    {columnVisibility.status && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>}
                    <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRates.length > 0 ? (
                    paginatedRates.map((rate) => (
                      <tr key={rate.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedRates.includes(rate.id)}
                            onChange={() => handleSelectRate(rate.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        {columnVisibility.id && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.id}</td>}
                        {columnVisibility.lane && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.lane}</td>}
                        {columnVisibility.mode && (
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getModeIcon(rate.mode)}
                              <span className="text-xs font-medium text-gray-900 capitalize">{rate.mode}</span>
                            </div>
                          </td>
                        )}
                        {columnVisibility.rateBasis && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.rateBasis}</td>}
                        {columnVisibility.weight && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.weight}</td>}
                        {columnVisibility.volume && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.volume}</td>}
                        {columnVisibility.containertype && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.containertype}</td>}
                        {columnVisibility.currency && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.currency}</td>}
                        {columnVisibility.price && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.price}</td>}
                        {columnVisibility.baseRate && <td className="px-4 py-4 whitespace-nowrap text-xs font-semibold text-gray-900">${rate.baseRate.toLocaleString()}</td>}
                        {columnVisibility.originCity && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.originCity}</td>}
                        {columnVisibility.destinationCity && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.destinationCity}</td>}
                        {columnVisibility.transitTime && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600">{rate.transitTime}</td>}
                        {columnVisibility.carrier && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.carrier}</td>}
                        {columnVisibility.surcharges && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.surcharges}</td>}                    
                        {columnVisibility.incoterm && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600">{rate.incoterm}</td>}
                        {columnVisibility.validFrom && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600">{rate.validFrom}</td>}
                        {columnVisibility.validTo && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600">{rate.validTo}</td>}
                        {columnVisibility.notes && <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate overflow-hidden text-ellipsis">{rate.notes}</td>}
                        {columnVisibility.provider && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600">{rate.provider}</td>}
                        {columnVisibility.status && (
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rate.status)}`}>
                              {rate.status.charAt(0).toUpperCase() + rate.status.slice(1)}
                            </span>
                          </td>
                        )}
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">
                          <div className="flex items-center gap-2 relative">
                            <button 
                              onClick={() => handleEditRate(rate)}
                              className="p-1 text-gray-400 hover:text-gray-600 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={Object.values(columnVisibility).filter(Boolean).length + 2} className="px-6 py-4 text-center text-sm text-gray-500">
                        No rates found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {totalPages > 1 && renderPagination()}

      {/* Add Rate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto border-t-7 border-[#007bff]">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add New Rate</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Origin City</label>
                    <input type="text" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Destination City</label>
                    <input type="text" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Transport Mode</label>
                    <select className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="ocean">Ocean</option>
                      <option value="air">Air</option>
                      <option value="truck">Truck</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Carrier</label>
                    <input type="text" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Rate Basis</label>
                    <input type="text" placeholder="per container" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Weight</label>
                    <input type="text" placeholder="200 kg" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Volume</label>
                    <input type="text" placeholder="20 CBM" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Container Type</label>
                    <select className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="20ft">20ft</option>
                      <option value="40ft">40ft</option>
                      <option value="40ft HC">40ft HC</option>
                      <option value="45ft">45ft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Currency</label>
                    <select className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CNY">CNY</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Price Range</label>
                    <input type="text" placeholder="$2,100 - $2,800" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Base Rate ($)</label>
                    <input type="number" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Transit Time</label>
                    <input type="text" placeholder="18-22 days" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Incoterm</label>
                    <select className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="FOB">FOB</option>
                      <option value="CIF">CIF</option>
                      <option value="EXW">EXW</option>
                      <option value="DAP">DAP</option>
                      <option value="CIP">CIP</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Valid From</label>
                    <input type="date" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Valid To</label>
                    <input type="date" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Surcharges</label>
                  <textarea placeholder="BAF: $150, CAF: $200" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={2}></textarea>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                  <textarea placeholder="Peak season surcharge may apply" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3}></textarea>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Provider</label>
                  <input type="text" placeholder="Pacific Logistics" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                  <select className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-sm text-white bg-[#007bff] rounded-lg hover:bg-blue-700">
                Save Rate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Rate Modal */}
      {showEditModal && currentRate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto border-t-7 border-[#007bff]">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Edit Rate</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <form onSubmit={handleSaveRate}>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Origin City</label>
                      <input 
                        type="text" 
                        name="originCity"
                        value={currentRate.originCity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Destination City</label>
                      <input 
                        type="text" 
                        name="destinationCity"
                        value={currentRate.destinationCity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Transport Mode</label>
                      <select 
                        name="mode"
                        value={currentRate.mode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="ocean">Ocean</option>
                        <option value="air">Air</option>
                        <option value="truck">Truck</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Carrier</label>
                      <input 
                        type="text" 
                        name="carrier"
                        value={currentRate.carrier}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Rate Basis</label>
                      <input 
                        type="text" 
                        name="rateBasis"
                        value={currentRate.rateBasis}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Weight</label>
                      <input 
                        type="text" 
                        name="weight"
                        value={currentRate.weight}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Volume</label>
                      <input 
                        type="text" 
                        name="volume"
                        value={currentRate.volume}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Container Type</label>
                      <input 
                        type="text" 
                        name="containertype"
                        value={currentRate.containertype}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Currency</label>
                      <input 
                        type="text" 
                        name="currency"
                        value={currentRate.currency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Price Range</label>
                      <input 
                        type="text" 
                        name="price"
                        value={currentRate.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Base Rate ($)</label>
                      <input 
                        type="number" 
                        name="baseRate"
                        value={currentRate.baseRate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Transit Time</label>
                      <input 
                        type="text" 
                        name="transitTime"
                        value={currentRate.transitTime}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Incoterm</label>
                      <select 
                        name="incoterm"
                        value={currentRate.incoterm}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="FOB">FOB</option>
                        <option value="CIF">CIF</option>
                        <option value="EXW">EXW</option>
                        <option value="DAP">DAP</option>
                        <option value="CIP">CIP</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Valid From</label>
                      <input 
                        type="date" 
                        name="validFrom"
                        value={currentRate.validFrom}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Valid To</label>
                      <input 
                        type="date" 
                        name="validTo"
                        value={currentRate.validTo}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Surcharges</label>
                    <textarea 
                      name="surcharges"
                      value={currentRate.surcharges}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      rows={2}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                    <textarea 
                      name="notes"
                      value={currentRate.notes}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      rows={3}
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Provider</label>
                    <input 
                      type="text" 
                      name="provider"
                      value={currentRate.provider}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                    <select 
                      name="status"
                      value={currentRate.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>             
                <div className="p-4 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 text-sm text-white bg-[#007bff] rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateTable;

function setShowColumnDropdown(arg0: boolean) {
  throw new Error('Function not implemented.');
}
function setShowModeDropdown(arg0: boolean) {
  throw new Error('Function not implemented.');
}

