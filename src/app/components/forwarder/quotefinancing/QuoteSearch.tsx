'use client';

import React, { useState, useRef } from 'react';
import { Search, Calendar, MapPin, Package, Filter, ChevronDown, Check, CheckSquare, Square } from 'lucide-react';
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
    cargoType: 'DRY'
  });

  const [sortBy, setSortBy] = useState('Cheapest First');
  const [selectedQuotes, setSelectedQuotes] = useState<number[]>([]);
  const [selectedContainerTypes, setSelectedContainerTypes] = useState<{[key: number]: string}>({});
  const [customPriceRanges, setCustomPriceRanges] = useState<{[key: number]: {min: string, max: string}}>({});

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

  const handleSearch = () => {
    // Simulate search functionality
    console.log('Searching with params:', searchParams);
  };

  const handleAddToQuote = (carrierId: number) => {
    setSelectedQuotes((prev) => {
      const isSelected = prev.includes(carrierId);
      
      // If deselecting, remove from container types and price ranges
      if (isSelected) {
        setSelectedContainerTypes(prevTypes => {
          const newTypes = {...prevTypes};
          delete newTypes[carrierId];
          return newTypes;
        });
        setCustomPriceRanges(prevRanges => {
          const newRanges = {...prevRanges};
          delete newRanges[carrierId];
          return newRanges;
        });
        return prev.filter((id) => id !== carrierId);
      } else {
        // If selecting, set default container type to the first available one
        const result = searchResults.find(r => r.id === carrierId);
        if (result) {
          const containerTypes = Object.keys(result.rates);
          if (containerTypes.length > 0) {
            const firstContainerType = containerTypes[0];
            setSelectedContainerTypes(prevTypes => ({
              ...prevTypes,
              [carrierId]: firstContainerType
            }));
            // Initialize price range with the base price
            const basePrice = result.rates[firstContainerType].price;
            setCustomPriceRanges(prevRanges => ({
              ...prevRanges,
              [carrierId]: {
                min: basePrice.toString(),
                max: (basePrice * 1.2).toFixed(2) // Default 20% markup
              }
            }));
          }
        }
        return [...prev, carrierId];
      }
    });
  };

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
    const selections = selectedQuotes.map(id => {
      const containerType = selectedContainerTypes[id] || 
        Object.keys(searchResults.find(r => r.id === id)?.rates || {})[0];
      
      // Include custom price range if available
      const priceRange = customPriceRanges[id];
      
      return {
        id,
        containerType,
        priceRange
      };
    });
    
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
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showContainerTypeDropdowns]);

  return (
    <div>
      <div className="w-full mx-auto">

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            {/* Origin */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Origin Port
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchParams.origin}
                  onChange={(e) => setSearchParams({...searchParams, origin: e.target.value})}
                  placeholder="KEELUNG, TAIPEI"
                  className="w-full px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Destination */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Destination Port
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchParams.destination}
                  onChange={(e) => setSearchParams({...searchParams, destination: e.target.value})}
                  placeholder="LOS ANGELES, US"
                  className="w-full px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" />
                Shipment Date
              </label>
              <input
                type="date"
                value={searchParams.shipmentDate}
                onChange={(e) => setSearchParams({...searchParams, shipmentDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Search Button */}
            <div>
              <button
                onClick={handleSearch}
                className="w-full bg-[#007bff] text-xs text-white px-3 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </button>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                <Package className="inline w-4 h-4 mr-1" />
                Cargo Type
              </label>
              <div className="relative" ref={cargoDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowCargoDropdown((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {searchParams.cargoType}
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showCargoDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showCargoDropdown && (
                  <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-full z-50">
                    <div className="p-2">
                      {cargoTypeOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => { setSearchParams({...searchParams, cargoType: option}); setShowCargoDropdown(false); }}
                          className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${searchParams.cargoType === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Container Type
              </label>
              <div className="relative" ref={containerDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowContainerDropdown((v) => !v)}
                  className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {searchParams.containerType}
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showContainerDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showContainerDropdown && (
                  <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-full z-50">
                    <div className="p-2">
                      {containerTypeOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => { setSearchParams({...searchParams, containerType: option}); setShowContainerDropdown(false); }}
                          className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${searchParams.containerType === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
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
          {searchResults.map((result) => (
            <div key={result.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                  {selectedQuotes.includes(result.id) ? (
                    <div className="w-full" ref={containerTypeDropdownRef}>
                      {/* Container Type Selector */}
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Select Container Type
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => toggleContainerTypeDropdown(result.id)}
                            className="w-full flex items-center justify-between px-3 py-1 border border-gray-300 text-xs text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            {selectedContainerTypes[result.id] || 'Select Container'}
                            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showContainerTypeDropdowns[result.id] ? 'rotate-180' : ''}`} />
                          </button>
                          {showContainerTypeDropdowns[result.id] && (
                            <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-full z-50">
                              <div className="p-2">
                                {Object.keys(result.rates).map((containerType) => (
                                  <button
                                    key={containerType}
                                    onClick={() => handleContainerTypeChange(result.id, containerType)}
                                    className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${selectedContainerTypes[result.id] === containerType ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                  >
                                    {containerType} - {result.rates[containerType].price.toFixed(2)} {result.rates[containerType].currency}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price Range Input */}
                      {selectedContainerTypes[result.id] && (
                        <div className="mb-3">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Set Price Range ({result.rates[selectedContainerTypes[result.id]].currency})
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-xs text-gray-500">Min</label>
                              <input
                                type="number"
                                value={customPriceRanges[result.id]?.min || ''}
                                onChange={(e) => handlePriceRangeChange(result.id, 'min', e.target.value)}
                                className="w-full px-3 py-1 border border-gray-300 text-xs text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Min Price"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500">Max</label>
                              <input
                                type="number"
                                value={customPriceRanges[result.id]?.max || ''}
                                onChange={(e) => handlePriceRangeChange(result.id, 'max', e.target.value)}
                                className="w-full px-3 py-1 border border-gray-300 text-xs text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Max Price"
                                step="0.01"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                  <button
                    onClick={() => handleAddToQuote(result.id)}
                    className={`w-full px-4 py-2 rounded-md transition-colors text-sm font-medium flex items-center justify-center gap-2
                      ${selectedQuotes.includes(result.id)
                        ? 'bg-[#007bff] text-white border border-[#007bff]'
                        : 'bg-white text-[#007bff] border border-[#007bff] hover:bg-blue-50'}`}
                  >
                    {selectedQuotes.includes(result.id) ? (
                      <CheckSquare className="w-5 h-5" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                    {selectedQuotes.includes(result.id) ? 'Selected' : 'Add to Quote'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Quote Button */}
        {selectedQuotes.length > 0 && (
          <div className="fixed left-1/2 bottom-8 z-50 -translate-x-1/2">
            <button 
              onClick={handleCreateQuote}
              disabled={selectedQuotes.some(id => !selectedContainerTypes[id])}
              className={`bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 ${selectedQuotes.some(id => !selectedContainerTypes[id]) ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18), 0 1.5px 8px 0 rgba(0,0,0,0.10)'}}
            >
              Create Quote ({selectedQuotes.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteSearch;