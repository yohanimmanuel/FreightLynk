'use client';

import React, { useState, useRef } from 'react';
import { Search, Calendar, MapPin, Package, Filter, ChevronDown, Check, CheckSquare, Square, Ship, Truck, Plane, Plus, Minus } from 'lucide-react';
import { useQuoteSearchStore, QuoteSearchResult } from '../../../../store/quotesearchdata';
import { useRouter } from 'next/navigation';

const QuoteSearch = () => {
  const { searchResults, createQuotesFromSelection } = useQuoteSearchStore();
  const router = useRouter();
  
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    shipmentDate: '',
    containerType: '20DV, 40DV',
    cargoType: 'DRY',
    originType: 'Port',
    destinationType: 'Port',
  });

  const [sortBy, setSortBy] = useState('Cheapest First');
  const [selectedQuote, setSelectedQuote] = useState<number | null>(null);
  const [selectedContainerTypes, setSelectedContainerTypes] = useState<{[key: number]: string}>({});
  const [customPriceRanges, setCustomPriceRanges] = useState<{[key: number]: {min: string, max: string}}>({});
  const [transportMode, setTransportMode] = useState('Sea');
  const [showCargoTypeModal, setShowCargoTypeModal] = useState(false);
  const [cargoTab, setCargoTab] = useState('FCL');
  const [fclQuantities, setFclQuantities] = useState<{ [key: string]: number }>({ '20DC': 0, '40DC': 0, '40HC': 0, '45HC': 0, '20RF': 0, '40RF': 0, '20OT': 0, '40OT': 0, '20FR': 0, '40FR': 0, '20Tank': 0, '40Tank': 0, 'FOOCDC': 0, 'FOOCHC': 0, });
  const [lclQuantities, setLclQuantities] = useState<{ [key: string]: number }>({ '40DC': 0, '40FR': 0, '40OT': 0, '45HC': 0, '40Tank': 0, 'FOOCH': 0 });
  const [lclWeight, setLclWeight] = useState('');
  const [lclVolume, setLclVolume] = useState('');

  const cargoTypeOptions = ['DRY', 'REEFER', 'HAZMAT'];
  const containerTypeOptions = ['20DV, 40DV', '20DV', '40DV', '40HC'];
  const sortByOptions = ['Cheapest First', 'Fastest Transit', 'Best Rating'];
  const [showCargoDropdown, setShowCargoDropdown] = useState(false);
  const [showContainerDropdown, setShowContainerDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showContainerTypeDropdowns, setShowContainerTypeDropdowns] = useState<{[key: number]: boolean}>({});
  
  const cargoDropdownRef = useRef<HTMLDivElement>(null);
  const containerDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const containerTypeDropdownRef = useRef<HTMLDivElement>(null);
  const portDoorOptions = ['Port', 'Door'];
  const [showOriginTypeDropdown, setShowOriginTypeDropdown] = useState(false);
  const [showDestinationTypeDropdown, setShowDestinationTypeDropdown] = useState(false);
  const originTypeDropdownRef = useRef<HTMLDivElement>(null);
  const destinationTypeDropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    // Simulate search functionality
    console.log('Searching with params:', searchParams);
  };

  // Remove selectedQuotes and handleAddToQuote, use setSelectedQuote instead
  const handleContainerTypeChange = (carrierId: number, containerType: string) => {
    setSelectedContainerTypes(prev => ({
      ...prev,
      [carrierId]: containerType
    }));
    
    // Update price range when container type changes
    const result = searchResults.find(r => r.id === carrierId);
    if (result) {
      const basePrice = result.rates[containerType].price;
      setCustomPriceRanges(prevRanges => ({
        ...prevRanges,
        [carrierId]: {
          min: basePrice.toString(),
          max: (basePrice * 1.2).toFixed(2) // Default 20% markup
        }
      }));
    }
    
    setShowContainerTypeDropdowns(prev => ({
      ...prev,
      [carrierId]: false
    }));
  };

  const handlePriceRangeChange = (carrierId: number, field: 'min' | 'max', value: string) => {
    setCustomPriceRanges(prev => ({
      ...prev,
      [carrierId]: {
        ...prev[carrierId],
        [field]: value
      }
    }));
  };

  const toggleContainerTypeDropdown = (carrierId: number) => {
    // Close all other dropdowns first
    const updatedDropdowns: {[key: number]: boolean} = {};
    Object.keys(showContainerTypeDropdowns).forEach(id => {
      updatedDropdowns[Number(id)] = false;
    });
    
    // Toggle the current dropdown
    updatedDropdowns[carrierId] = !showContainerTypeDropdowns[carrierId];
    
    setShowContainerTypeDropdowns(updatedDropdowns);
  };

  const handleCreateQuote = () => {
    // Create selections array with id and containerType
    const selections = selectedQuote !== null ? [{
      id: selectedQuote,
      containerType: selectedContainerTypes[selectedQuote] || 
        Object.keys(searchResults.find(r => r.id === selectedQuote)?.rates || {})[0],
      
      // Include custom price range if available
      priceRange: customPriceRanges[selectedQuote]
    }] : [];
    
    // Call the store function to create quotes with price ranges
    const createdQuoteIds = createQuotesFromSelection(selections);
    
    // Navigate to quotes page
    if (createdQuoteIds.length > 0) {
      router.push('/quotes');
    }
  };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close cargo, container, and sort dropdowns
      if (
        cargoDropdownRef.current && !cargoDropdownRef.current.contains(event.target as Node) &&
        containerDropdownRef.current && !containerDropdownRef.current.contains(event.target as Node) &&
        sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node) &&
        containerTypeDropdownRef.current && !containerTypeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCargoDropdown(false);
        setShowContainerDropdown(false);
        setShowSortDropdown(false);
        
        // Close all container type dropdowns
        const updatedDropdowns: {[key: number]: boolean} = {};
        Object.keys(showContainerTypeDropdowns).forEach(id => {
          updatedDropdowns[Number(id)] = false;
        });
        setShowContainerTypeDropdowns(updatedDropdowns);
      }
      if (originTypeDropdownRef.current && !originTypeDropdownRef.current.contains(event.target as Node)) {
        setShowOriginTypeDropdown(false);
      }
      if (destinationTypeDropdownRef.current && !destinationTypeDropdownRef.current.contains(event.target as Node)) {
        setShowDestinationTypeDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showContainerTypeDropdowns]);

  return (
    <div>
      <div className="w-full mx-auto">

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            {/* Transport Mode Button Group */}
            <div className="flex gap-2 items-center mb-2 lg:mb-0">
              {[{ label: 'Sea', icon: <Ship className="w-4 h-4" /> }, { label: 'Air', icon: <Plane className="w-4 h-4" /> }, { label: 'Land', icon: <Truck className="w-4 h-4" /> }].map(({ label, icon }) => (
                <button
                  key={label}
                  onClick={() => setTransportMode(label)}
                  className={`flex items-center gap-1 px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors ${transportMode === label ? 'bg-[#007bff] text-white border-[#007bff]' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
            {/* Origin */}
            <div className="flex-1 flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchParams.origin}
                  onChange={(e) => setSearchParams({...searchParams, origin: e.target.value})}
                  placeholder="KEELUNG, TAIPEI"
                  className="w-full px-3 py-2.5 border border-gray-300 text-xs text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative w-24" ref={originTypeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowOriginTypeDropdown((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 text-xs text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {searchParams.originType}
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showOriginTypeDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showOriginTypeDropdown && (
                  <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-full z-50">
                    <div className="p-2">
                      {portDoorOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => { setSearchParams({...searchParams, originType: option}); setShowOriginTypeDropdown(false); }}
                          className={`w-full text-left p-2.5 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${searchParams.originType === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Destination */}
            <div className="flex-1 flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
                  placeholder="LOS ANGELES, US"
                  className="w-full px-3 py-2.5 border border-gray-300 text-xs text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative w-24" ref={destinationTypeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowDestinationTypeDropdown((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-300 text-xs text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {searchParams.destinationType}
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showDestinationTypeDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showDestinationTypeDropdown && (
                  <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-full z-50">
                    <div className="p-2">
                      {portDoorOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => { setSearchParams({...searchParams, destinationType: option}); setShowDestinationTypeDropdown(false); }}
                          className={`w-full text-left p-2.5 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${searchParams.destinationType === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* New row for Select Cargo Type and input */}
          <div className="flex flex-col md:flex-row gap-2 mt-4 items-center">
            <div>
              <button
                type="button"
                onClick={() => setShowCargoTypeModal(true)}
                className="flex items-center justify-between px-3 py-2.5 border border-gray-300 text-xs text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                Select Cargo Type
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>
            <input
              type="text"
              className="flex-1 px-3 py-2.5 border border-gray-300 text-xs text-gray-900 rounded-lg bg-gray-100 focus:outline-none"
              value={searchParams.containerType}
              placeholder="Selected cargo types will appear here"
              readOnly
            />
            <button
              onClick={handleSearch}
              className="px-20 py-2.5 bg-[#007bff] text-xs text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </div>
          {/* Cargo Type Modal/Dropdown */}
          {showCargoTypeModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-2xl mx-2">
                <div className="flex gap-4 mb-4">
                  <button
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold ${cargoTab === 'FCL' ? 'bg-[#007bff] text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setCargoTab('FCL')}
                  >
                    FCL
                  </button>
                  <button
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold ${cargoTab === 'LCL' ? 'bg-[#007bff] text-white' : 'bg-gray-100 text-gray-700'}`}
                    onClick={() => setCargoTab('LCL')}
                  >
                    LCL
                  </button>
                </div>
                {/* FCL: two columns */}
                {cargoTab === 'FCL' && (
                  <div className="grid grid-cols-2 gap-8">
                    {Object.keys(fclQuantities).map((type, idx) => (
                      <div key={type} className="flex items-center gap-2 mb-2">
                        <span className="w-16 text-xs font-medium text-gray-700">{type}</span>
                        <button className="px-2 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-500 rounded-lg" onClick={() => setFclQuantities(q => ({ ...q, [type]: Math.max(0, q[type] - 1) }))}><Minus className="w-4 h-4"/></button>
                        <input
                          type="number"
                          min="0"
                          value={fclQuantities[type]}
                          onChange={e => setFclQuantities(q => ({ ...q, [type]: Math.max(0, Number(e.target.value)) }))}
                          className="w-15 px-2 py-2 border border-gray-300 rounded-lg text-xs text-left text-gray-900"
                        />
                        <button className="px-2 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-500 rounded-lg" onClick={() => setFclQuantities(q => ({ ...q, [type]: q[type] + 1 }))}><Plus className="w-4 h-4"/></button>
                      </div>
                    ))}
                  </div>
                )}
                {/* LCL: single total weight/volume */}
                {cargoTab === 'LCL' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-30 text-xs font-medium text-gray-700">Total Weight (kg):</span>
                      <input
                        type="number"
                        min="0"
                        value={lclWeight}
                        onChange={e => setLclWeight(e.target.value)}
                        className="w-32 px-2 py-2.5 border border-gray-300 rounded-lg text-xs text-left text-gray-900"
                        placeholder="e.g. 1200"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-30 text-xs font-medium text-gray-700">Total Volume (cbm):</span>
                      <input
                        type="number"
                        min="0"
                        value={lclVolume}
                        onChange={e => setLclVolume(e.target.value)}
                        className="w-32 px-2 py-2.5 border border-gray-300 rounded-lg text-xs text-left text-gray-900"
                        placeholder="e.g. 8"
                      />
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    className="px-4 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    onClick={() => setShowCargoTypeModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-[#007bff] text-white border border-[#007bff] hover:bg-blue-700"
                    onClick={() => {
                      setShowCargoTypeModal(false);
                      setSearchParams(params => ({
                        ...params,
                        containerType: cargoTab === 'FCL'
                          ? Object.entries(fclQuantities).filter(([_, qty]) => qty > 0).map(([type, qty]) => `${type} x ${qty}`).join(', ')
                          : lclWeight && lclVolume ? `LCL: ${lclWeight}kg, ${lclVolume}cbm` : '',
                        cargoType: cargoTab
                      }));
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-semibold text-gray-900">
            Results Found: {searchResults.length}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Sort by: </span>
              <div className="relative" ref={sortDropdownRef}>
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center text-sm text-[#007bff] font-medium hover:text-blue-700"
                >
                  {sortBy}
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-48 z-50">
                    <div className="p-2">
                      {sortByOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => { setSortBy(option); setShowSortDropdown(false); }}
                          className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${sortBy === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {searchResults.map((result) => {
            return (
              <div key={result.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all`}>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border divide-x divide-gray-200">
                  {/* 1. Logo Column */}
                  <div className="flex items-center justify-center py-4 px-2 lg:col-span-1">
                    <img 
                      src={result.logo} 
                      alt={result.carrier}
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  {/* 2. Details/Journey Column (wider) */}
                  <div className="flex flex-col justify-center py-2 px-4 mt-2 mb-2 lg:col-span-2">
                    <div className="font-semibold text-gray-900 text-base mb-2">{result.carrier}</div>
                    <div className="flex items-center gap-4 w-full">
                      {/* Origin */}
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-700 font-medium uppercase">{result.origin}</span>
                        <span className="text-[11px] text-gray-500">{result.departure}</span>
                      </div>
                      {/* Arrow */}
                      <div className="flex flex-col items-center">
                        <span className="text-gray-400 text-lg">→</span>
                      </div>
                      {/* Destination */}
                      <div className="flex flex-col items-center">
                        <span className="text-xs text-gray-700 font-medium uppercase">{result.destination}</span>
                        <span className="text-[11px] text-gray-500">{result.arrival}</span>
                      </div>
                      {/* TT and Validity */}
                      <div className="flex flex-col items-end ml-auto">
                        <span className="text-xs text-gray-500">Transit Time: <span className="text-gray-900 font-medium">{result.transitTime}</span></span>
                        <span className="text-xs text-gray-500">Validity: <span className="text-gray-900 font-medium">{result.validity}</span></span>
                      </div>
                    </div>
                    {/* Detail Cost and Remark Buttons at the bottom */}
                    <div className="flex space-x-4 text-xs mt-4">
                      <button className="text-[#007bff] hover:text-blue-800">
                        Detail Cost
                      </button>
                      <button className="text-[#007bff] hover:text-blue-800">
                        Remark
                      </button>
                    </div>
                  </div>
                  {/* 3. Prices Column */}
                  <div className="flex flex-col justify-center py-2 px-4 min-w-[160px] gap-2 lg:col-span-1">
                    {/* Container Types with Fixed Prices */}
                    <div>
                      <span className="text-xs font-medium text-gray-700">Container Types:</span>
                      <div className="mt-1 space-y-2">
                        {Object.entries(result.rates).map(([containerType, rate]) => (
                          <div key={containerType} className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-700">{containerType}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-[#007bff]">{rate.price.toFixed(2)}</span>
                              <span className="text-xs text-gray-500">{rate.currency}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* 4. Actions Column */}
                  <div className="flex flex-col justify-center items-center py-2 px-4 lg:col-span-1">
                    <button
                      onClick={() => router.push('/quotes/list/addinfo')}
                      className={`w-full px-4 py-2 rounded-md transition-colors text-sm font-medium flex items-center justify-center gap-2 bg-[#007bff] text-white border border-[#007bff]`}
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuoteSearch;