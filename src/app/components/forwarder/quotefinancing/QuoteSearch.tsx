import React, { useState, useRef } from 'react';
import { Search, Calendar, MapPin, Package, Filter, ChevronDown, Check, CheckSquare, Square } from 'lucide-react';

const QuoteSearch = () => {
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    shipmentDate: '',
    containerType: '20DV, 40DV',
    cargoType: 'DRY'
  });

  const [results, setResults] = useState([
    {
      id: 1,
      carrier: 'MAERSK',
      logo: '/maersk.png',
      origin: 'KEELUNG, TAIPEI',
      destination: 'LOS ANGELES, US',
      departure: '10-10-2023',
      arrival: '10-30-2023',
      transitTime: '25 days',
      validity: '12-05-2023',
      rates: {
        '20GP': { price: 1635.32, currency: 'USD' },
        '40GP': { price: 1840.00, currency: 'USD' },
        '40HC': { price: 2062.25, currency: 'USD' }
      }
    },
    {
      id: 2,
      carrier: 'EVERGREEN',
      logo: '/evergreen.svg',
      origin: 'KEELUNG, TAIPEI',
      destination: 'LOS ANGELES, US',
      departure: '10-10-2023',
      arrival: '10-30-2023',
      transitTime: '25 days',
      validity: '12-05-2023',
      rates: {
        '20GP': { price: 1781.53, currency: 'USD' },
        '40GP': { price: 1985.00, currency: 'USD' },
        '40HC': { price: 2108.25, currency: 'USD' }
      }
    },
    {
      id: 3,
      carrier: 'HAPAG-LLOYD',
      logo: '/hapaglloyd.svg',
      origin: 'KEELUNG, TAIPEI',
      destination: 'LOS ANGELES, US',
      departure: '10-10-2023',
      arrival: '10-30-2023',
      transitTime: '24 days',
      validity: '12-05-2023',
      rates: {
        '20GP': { price: 1701.53, currency: 'USD' },
        '40GP': { price: 2005.00, currency: 'USD' },
        '40HC': { price: 2108.25, currency: 'USD' }
      }
    }
  ]);

  const [sortBy, setSortBy] = useState('Cheapest First');
  const [selectedQuotes, setSelectedQuotes] = useState<number[]>([]);

  const cargoTypeOptions = ['DRY', 'REEFER', 'HAZMAT'];
  const containerTypeOptions = ['20DV, 40DV', '20DV', '40DV', '40HC'];
  const sortByOptions = ['Cheapest First', 'Fastest Transit', 'Best Rating'];
  const [showCargoDropdown, setShowCargoDropdown] = useState(false);
  const [showContainerDropdown, setShowContainerDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const cargoDropdownRef = useRef<HTMLDivElement>(null);
  const containerDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    // Simulate search functionality
    console.log('Searching with params:', searchParams);
  };

  const handleAddToQuote = (carrierId: number) => {
    setSelectedQuotes((prev) =>
      prev.includes(carrierId)
        ? prev.filter((id) => id !== carrierId)
        : [...prev, carrierId]
    );
  };

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        cargoDropdownRef.current && !cargoDropdownRef.current.contains(event.target as Node) &&
        containerDropdownRef.current && !containerDropdownRef.current.contains(event.target as Node) &&
        sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCargoDropdown(false);
        setShowContainerDropdown(false);
        setShowSortDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            Results Found: {results.length}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Sort by: </span>
              <div className="relative" ref={sortDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowSortDropdown((v) => !v)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white flex items-center gap-2"
                >
                  {sortBy}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showSortDropdown && (
                  <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-full z-50">
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
          {results.map((result) => (
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
                      <span className="text-xs text-gray-700 font-medium">{result.origin}</span>
                      <span className="text-[11px] text-gray-500">{result.departure}</span>
                    </div>
                    {/* Arrow */}
                    <div className="flex flex-col items-center">
                      <span className="text-gray-400 text-lg">→</span>
                    </div>
                    {/* Destination */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-700 font-medium">{result.destination}</span>
                      <span className="text-[11px] text-gray-500">{result.arrival}</span>
                    </div>
                    {/* TT and Validity */}
                    <div className="flex flex-col items-end ml-auto">
                      <span className="text-xs text-gray-500">Travel Time: <span className="text-gray-900 font-medium">{result.transitTime}</span></span>
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
                  {Object.entries(result.rates).map(([containerType, rate]) => (
                    <div key={containerType} className="grid grid-cols-3 items-center gap-2">
                      <span className="text-xs font-medium text-gray-700 uppercase text-left">{containerType}</span>
                      <span className="text-sm font-bold text-[#007bff] text-center">{rate.price.toFixed(2)}</span>
                      <span className="text-xs text-gray-500 text-right">{rate.currency}</span>
                    </div>
                  ))}
                </div>
                {/* 4. Actions Column */}
                <div className="flex flex-col justify-center items-center py-2 px-4 lg:col-span-1">
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
                    Add to Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Quote Button */}
        {selectedQuotes.length > 0 && (
          <div className="fixed left-1/2 bottom-8 z-50 -translate-x-1/2">
            <button className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300" style={{boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18), 0 1.5px 8px 0 rgba(0,0,0,0.10)'}}>
              Create Quote
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteSearch;