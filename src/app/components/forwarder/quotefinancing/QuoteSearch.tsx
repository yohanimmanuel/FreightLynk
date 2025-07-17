'use client';

import React, { useState, useRef } from 'react';
import { Search, Calendar, MapPin, Package, Filter, ChevronDown, Check, CheckSquare, Square, Ship, Truck, Plane, Plus, Minus } from 'lucide-react';
import { useQuoteSearchStore, QuoteSearchResult } from '../../../../store/quotesearchdata';
import { useRouter } from 'next/navigation';

const QuoteSearch = () => {
  const {
    searchResults,
    setSelectedQuoteId,
    setSearchCriteria,
    setSelectedQuoteDetails
  } = useQuoteSearchStore();
  const router = useRouter();
  
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    shipmentDate: '',
    containerType: '',
    cargoType: '',
    originType: 'Port',
    destinationType: 'Port',
    truckType: '',
    truckQuantity: '',
  });

  const [sortBy, setSortBy] = useState('Cheapest First');
  const [selectedQuote, setSelectedQuote] = useState<number | null>(null);
  const [transportMode, setTransportMode] = useState('Sea');
  const [showCargoTypeModal, setShowCargoTypeModal] = useState(false);
  const [cargoTab, setCargoTab] = useState('FCL');
  const [fclQuantities, setFclQuantities] = useState<{ [key: string]: number }>({ '20DC': 0, '40DC': 0, '40HC': 0, '45HC': 0, '20RF': 0, '40RF': 0, '20OT': 0, '40OT': 0, '20FR': 0, '40FR': 0, '20Tank': 0, '40Tank': 0, 'FOOCDC': 0, 'FOOCHC': 0, });
  const [lclWeight, setLclWeight] = useState('');
  const [lclVolume, setLclVolume] = useState('');
  
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

  // Add state to track open detail cost and remark
  const [openDetailCost, setOpenDetailCost] = useState<number | null>(null);
  // Remove Remark button and openRemark state

  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  // Add applied state for search
  const [appliedTransportMode, setAppliedTransportMode] = useState(transportMode);
  const [appliedCargoTab, setAppliedCargoTab] = useState(cargoTab);
  const [appliedFclQuantities, setAppliedFclQuantities] = useState(fclQuantities);
  const [appliedLclWeight, setAppliedLclWeight] = useState(lclWeight);
  const [appliedLclVolume, setAppliedLclVolume] = useState(lclVolume);
  const [appliedSearchParams, setAppliedSearchParams] = useState(searchParams);

  const handleSearch = () => {
    setShowResults(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
      setAppliedTransportMode(transportMode);
      setAppliedCargoTab(cargoTab);
      setAppliedFclQuantities({ ...fclQuantities });
      setAppliedLclWeight(lclWeight);
      setAppliedLclVolume(lclVolume);
      setAppliedSearchParams({ ...searchParams });
      // Store search criteria in Zustand
      setSearchCriteria({
        transportMode,
        cargoTab,
        fclQuantities,
        lclWeight,
        lclVolume,
        searchParams
      });
    }, 800);
    // Simulate search functionality
    console.log('Searching with params:', searchParams);
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

  React.useEffect(() => {
    // Reset cargo-related fields when transportMode changes
    setLclWeight('');
    setLclVolume('');
    setFclQuantities({ '20DC': 0, '40DC': 0, '40HC': 0, '45HC': 0, '20RF': 0, '40RF': 0, '20OT': 0, '40OT': 0, '20FR': 0, '40FR': 0, '20Tank': 0, '40Tank': 0, 'FOOCDC': 0, 'FOOCHC': 0 });
    setSearchParams(params => ({
      ...params,
      containerType: '',
      cargoType: '',
      truckType: '',
      truckQuantity: '',
    }));
  }, [transportMode]);

  // Helper to build detail cost rows based on mode and user input
  interface DetailCostRow {
    type: string;
    item: string;
    description: string;
    calculation: string;
    containerType?: string;
    truckType?: string;
    qty: number;
    baseRate: number;
    amount: number;
    currency: string;
  }
  function buildDetailCostRows(
    result: any,
    transportMode: string,
    cargoTab: string,
    fclQuantities: { [key: string]: number },
    lclWeight: string,
    lclVolume: string,
    searchParams: any
  ): DetailCostRow[] {
    const rows: DetailCostRow[] = [];
    if (transportMode === 'Sea' && cargoTab === 'FCL') {
      // FCL: one row per container type with qty > 0
      Object.entries(fclQuantities).forEach(([type, qty]) => {
        const qtyNum = typeof qty === 'number' ? qty : parseInt(qty as any) || 0;
        if (qtyNum > 0 && result.rates[type]) {
          const baseRate = result.rates[type].price;
          rows.push({
            type: 'Ocean Freight',
            item: type,
            description: 'Container Cost',
            calculation: 'By container type',
            containerType: type,
            qty: qtyNum,
            baseRate,
            amount: baseRate * qtyNum,
            currency: result.rates[type].currency,
          });
        }
      });
    } else if ((transportMode === 'Sea' && cargoTab === 'LCL') || transportMode === 'Air') {
      // LCL or Air: show both per kg and per cbm, use chargeable
      const weight = parseFloat(lclWeight) || 0;
      const volume = parseFloat(lclVolume) || 0;
      const perKg = result.lclRates?.perKg || result.ltlRates?.perKg || 0;
      const perCbm = result.lclRates?.perCbm || result.ltlRates?.perCbm || 0;
      const currency = result.lclRates?.currency || result.ltlRates?.currency || 'USD';
      const weightCharge = weight * perKg;
      const volumeCharge = volume * perCbm;
      const chargeable = weightCharge > volumeCharge ? weightCharge : volumeCharge;
      const chargeBasis = weightCharge > volumeCharge ? 'Weight' : 'Volume';
      rows.push({
        type: transportMode === 'Air' ? 'Air Freight' : 'LCL Freight',
        item: chargeBasis,
        description: chargeBasis === 'Weight' ? `Weight: ${weight} kg` : `Volume: ${volume} cbm`,
        calculation: chargeBasis === 'Weight' ? 'By weight (kg)' : 'By volume (cbm)',
        qty: chargeBasis === 'Weight' ? weight : volume,
        baseRate: chargeBasis === 'Weight' ? perKg : perCbm,
        amount: chargeable,
        currency,
      });
    } else if (transportMode === 'Land' && cargoTab === 'FTL') {
      // FTL: one row for selected truck type and quantity
      const truckType = searchParams.truckType;
      const qty = parseInt(searchParams.truckQuantity) || 0;
      if (truckType && qty > 0 && result.ftlRates[truckType]) {
        const baseRate = result.ftlRates[truckType].price;
        rows.push({
          type: 'Road Freight',
          item: truckType,
          description: 'Truck Cost',
          calculation: 'By truck type',
          truckType,
          qty,
          baseRate,
          amount: baseRate * qty,
          currency: result.ftlRates[truckType].currency,
        });
      }
    } else if (transportMode === 'Land' && cargoTab === 'LTL') {
      // LTL: same as LCL
      const weight = parseFloat(lclWeight) || 0;
      const volume = parseFloat(lclVolume) || 0;
      const perKg = result.ltlRates?.perKg || 0;
      const perCbm = result.ltlRates?.perCbm || 0;
      const currency = result.ltlRates?.currency || 'USD';
      const weightCharge = weight * perKg;
      const volumeCharge = volume * perCbm;
      const chargeable = weightCharge > volumeCharge ? weightCharge : volumeCharge;
      const chargeBasis = weightCharge > volumeCharge ? 'Weight' : 'Volume';
      rows.push({
        type: 'Road Freight',
        item: chargeBasis,
        description: chargeBasis === 'Weight' ? `Weight: ${weight} kg` : `Volume: ${volume} cbm`,
        calculation: chargeBasis === 'Weight' ? 'By weight (kg)' : 'By volume (cbm)',
        qty: chargeBasis === 'Weight' ? weight : volume,
        baseRate: chargeBasis === 'Weight' ? perKg : perCbm,
        amount: chargeable,
        currency,
      });
    }
    return rows;
  }

  // Helper to check if all required fields are filled
  function isSearchFormValid(transportMode: string, cargoTab: string, searchParams: any, fclQuantities: { [key: string]: number }, lclWeight: string, lclVolume: string) {
    if (!searchParams.origin || !searchParams.destination) return false;
    if (transportMode === 'Sea' && cargoTab === 'FCL') {
      // At least one container type with qty > 0
      return Object.values(fclQuantities).some(qty => qty > 0);
    } else if ((transportMode === 'Sea' && cargoTab === 'LCL') || transportMode === 'Air') {
      return parseFloat(lclWeight) > 0 && parseFloat(lclVolume) > 0;
    } else if (transportMode === 'Land' && cargoTab === 'FTL') {
      return searchParams.truckType && parseInt(searchParams.truckQuantity) > 0;
    } else if (transportMode === 'Land' && cargoTab === 'LTL') {
      return parseFloat(lclWeight) > 0 && parseFloat(lclVolume) > 0;
    }
    return false;
  }

  // When a quote is selected (example: in your select button handler)
  const handleSelectQuote = (quoteResult: QuoteSearchResult, index: number) => {
    setSelectedQuote(index);
    setSelectedQuoteId(quoteResult.id);
    // Build modeLabel and cargoLabel for invoice
    let modeLabel = '';
    let cargoLabel = '';
    type TableRow = {
      chargeType: string;
      item: string;
      description: string;
      calculation: string;
      containerType?: string;
      qty: number;
      baseRate: number;
      amount: number;
      currency: string;
    };
    let tableRows: TableRow[] = [];
    if (appliedTransportMode === 'Sea' && appliedCargoTab === 'FCL') {
      modeLabel = 'Sea FCL';
      // Build cargo label and table rows for FCL
      const containers = Object.entries(appliedFclQuantities)
        .filter(([type, qty]) => qty > 0)
        .map(([type, qty]) => ({ type, qty: Number(qty) }));
      cargoLabel = containers.map(c => `${c.qty} x ${c.type}`).join(', ');
      tableRows = containers.map(({ type, qty }) => ({
        chargeType: 'Ocean Freight',
        item: type,
        description: 'Container Cost',
        calculation: 'By container type',
        containerType: type,
        qty,
        baseRate: quoteResult.rates[type]?.price || 0,
        amount: (quoteResult.rates[type]?.price || 0) * qty,
        currency: quoteResult.rates[type]?.currency || 'USD',
      }));
    } else if (appliedTransportMode === 'Sea' && appliedCargoTab === 'LCL') {
      modeLabel = 'Sea LCL';
      // Use the same logic and values as displayed in the QuoteSearch result
      // Assume the user selected either perKg or perCbm as the chargeable basis
      // For this implementation, pass both values and let the UI display as in the search result
      cargoLabel = `${appliedLclWeight}kg / ${appliedLclVolume}cbm`;
      // Use the same calculation as in the search result
      // If the QuoteSearch result table shows perCbm, use perCbm; if perKg, use perKg
      // Here, we assume the chargeable basis is volume if volumeCharge >= weightCharge, else weight
      const weight = parseFloat(appliedLclWeight) || 0;
      const volume = parseFloat(appliedLclVolume) || 0;
      const perKg = quoteResult.lclRates?.perKg || 0;
      const perCbm = quoteResult.lclRates?.perCbm || 0;
      const currency = quoteResult.lclRates?.currency || 'USD';
      const weightCharge = weight * perKg;
      const volumeCharge = volume * perCbm;
      let chargeableBasis = '';
      let baseRate = 0;
      let qty = 0;
      let description = '';
      let calculation = '';
      if (volumeCharge >= weightCharge) {
        chargeableBasis = 'Volume';
        baseRate = perCbm;
        qty = volume;
        description = `Volume: ${volume} cbm`;
        calculation = 'By volume (cbm)';
      } else {
        chargeableBasis = 'Weight';
        baseRate = perKg;
        qty = weight;
        description = `Weight: ${weight} kg`;
        calculation = 'By weight (kg)';
      }
      tableRows = [
        {
          chargeType: 'LCL Freight',
          item: chargeableBasis,
          description,
          calculation,
          qty,
          baseRate,
          amount: baseRate * qty,
          currency,
        },
      ];
    } else if (appliedTransportMode === 'Air') {
      modeLabel = 'Air LCL';
      // Use the same logic and values as displayed in the QuoteSearch result
      cargoLabel = `${appliedLclWeight}kg / ${appliedLclVolume}cbm`;
      const weight = parseFloat(appliedLclWeight) || 0;
      const volume = parseFloat(appliedLclVolume) || 0;
      const perKg = quoteResult.lclRates?.perKg || 0;
      const perCbm = quoteResult.lclRates?.perCbm || 0;
      const currency = quoteResult.lclRates?.currency || 'USD';
      const weightCharge = weight * perKg;
      const volumeCharge = volume * perCbm;
      let chargeableBasis = '';
      let baseRate = 0;
      let qty = 0;
      let description = '';
      let calculation = '';
      if (volumeCharge >= weightCharge) {
        chargeableBasis = 'Volume';
        baseRate = perCbm;
        qty = volume;
        description = `Volume: ${volume} cbm`;
        calculation = 'By volume (cbm)';
      } else {
        chargeableBasis = 'Weight';
        baseRate = perKg;
        qty = weight;
        description = `Weight: ${weight} kg`;
        calculation = 'By weight (kg)';
      }
      tableRows = [
        {
          chargeType: 'Air Freight',
          item: chargeableBasis,
          description,
          calculation,
          qty,
          baseRate,
          amount: baseRate * qty,
          currency,
        },
      ];
    } else if (appliedTransportMode === 'Land' && appliedCargoTab === 'FTL') {
      modeLabel = 'Land FTL';
      cargoLabel = `${appliedSearchParams.truckQuantity || 1} x ${appliedSearchParams.truckType}`;
      tableRows = [
        {
          chargeType: 'Road Freight',
          item: appliedSearchParams.truckType,
          description: 'Truck Cost',
          calculation: 'By truck type',
          containerType: appliedSearchParams.truckType,
          qty: Number(appliedSearchParams.truckQuantity) || 1,
          baseRate: quoteResult.ftlRates?.[appliedSearchParams.truckType]?.price || 0,
          amount: (quoteResult.ftlRates?.[appliedSearchParams.truckType]?.price || 0) * (Number(appliedSearchParams.truckQuantity) || 1),
          currency: quoteResult.ftlRates?.[appliedSearchParams.truckType]?.currency || 'USD',
        },
      ];
    } else if (appliedTransportMode === 'Land' && appliedCargoTab === 'LTL') {
      modeLabel = 'Land LTL';
      // Use the same logic and values as displayed in the QuoteSearch result
      // (Assume similar to LCL logic)
      const weight = parseFloat(appliedLclWeight) || 0;
      const volume = parseFloat(appliedLclVolume) || 0;
      const perKg = quoteResult.ltlRates?.perKg || 0;
      const perCbm = quoteResult.ltlRates?.perCbm || 0;
      const currency = quoteResult.ltlRates?.currency || 'USD';
      const weightCharge = weight * perKg;
      const volumeCharge = volume * perCbm;
      let chargeableBasis = '';
      let baseRate = 0;
      let qty = 0;
      let description = '';
      let calculation = '';
      if (volumeCharge >= weightCharge) {
        chargeableBasis = 'Volume';
        baseRate = perCbm;
        qty = volume;
        description = `Volume: ${volume} cbm`;
        calculation = 'By volume (cbm)';
      } else {
        chargeableBasis = 'Weight';
        baseRate = perKg;
        qty = weight;
        description = `Weight: ${weight} kg`;
        calculation = 'By weight (kg)';
      }
      tableRows = [
        {
          chargeType: 'LTL Freight',
          item: chargeableBasis,
          description,
          calculation,
          qty,
          baseRate,
          amount: baseRate * qty,
          currency,
        },
      ];
    }
    setSelectedQuoteDetails({
      ...quoteResult,
      transportMode: appliedTransportMode,
      cargoTab: appliedCargoTab,
      fclQuantities: appliedFclQuantities,
      lclWeight: appliedLclWeight,
      lclVolume: appliedLclVolume,
      searchParams: appliedSearchParams,
      modeLabel,
      cargoLabel,
      tableRows,
      provider: quoteResult.provider,
      originType: appliedSearchParams.originType,
      destinationType: appliedSearchParams.destinationType,
      serviceType: `${appliedSearchParams.originType || 'Port'} to ${appliedSearchParams.destinationType || 'Port'}`,
      transitPort: quoteResult.transitPort,
    });
    router.push('/quotes/list/addinfo');
  };

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
                  placeholder="Enter Origin here..."
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
                  placeholder="Enter Destination here..."
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
            {transportMode === 'Air' ? (
              <div className="w-full flex flex-row gap-4 items-center">
                <input
                  type="number"
                  min="0"
                  value={lclWeight}
                  onChange={e => setLclWeight(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Total Weight (kg)"
                />
                <input
                  type="number"
                  min="0"
                  value={lclVolume}
                  onChange={e => setLclVolume(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2.5 border border-gray-300 rounded-lg text-xs text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Total Volume (cbm)"
                />
                <button
                  onClick={handleSearch}
                  disabled={!isSearchFormValid(transportMode, cargoTab, searchParams, fclQuantities, lclWeight, lclVolume)}
                  className={`px-30 py-2.5 rounded-lg flex items-center justify-center ml-auto text-xs transition-colors ${isSearchFormValid(transportMode, cargoTab, searchParams, fclQuantities, lclWeight, lclVolume) ? 'bg-[#007bff] text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-400 cursor-not-allowed'}`}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </button>
              </div>
            ) : (
              <>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (transportMode === 'Sea') {
                        setCargoTab('FCL');
                      } else if (transportMode === 'Land') {
                        setCargoTab('FTL');
                      }
                      setShowCargoTypeModal(true);
                    }}
                    className="flex items-center justify-between px-3 py-2.5 border border-gray-300 hover:bg-gray-200 text-xs text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    Select Cargo Type
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
                  disabled={!isSearchFormValid(transportMode, cargoTab, searchParams, fclQuantities, lclWeight, lclVolume)}
                  className={`px-30 py-2.5 rounded-lg flex items-center justify-center text-xs transition-colors ${isSearchFormValid(transportMode, cargoTab, searchParams, fclQuantities, lclWeight, lclVolume) ? 'bg-[#007bff] text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-400 cursor-not-allowed'}`}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </button>
              </>
            )}
          </div>
          {/* Cargo Type Modal/Dropdown */}
          {showCargoTypeModal && transportMode !== 'Air' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-2xl mx-2">
                {transportMode === 'Land' ? (
                  <>
                    <div className="flex gap-4 mb-4">
                      <button
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold ${cargoTab === 'FTL' ? 'bg-[#007bff] text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setCargoTab('FTL')}
                      >
                        FTL
                      </button>
                      <button
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold ${cargoTab === 'LTL' ? 'bg-[#007bff] text-white' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => setCargoTab('LTL')}
                      >
                        LTL
                      </button>
                    </div>
                    {/* FTL: truck type and quantity */}
                    {cargoTab === 'FTL' && (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <span className="w-30 text-xs font-medium text-gray-700">Truck Type:</span>
                          <input
                            type="text"
                            value={searchParams.truckType || ''}
                            onChange={e => setSearchParams(params => ({ ...params, truckType: e.target.value }))}
                            className="w-40 px-2 py-2 border border-gray-300 rounded-lg text-xs text-left text-gray-900"
                            placeholder="e.g. 40ft Flatbed"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-30 text-xs font-medium text-gray-700">Quantity:</span>
                          <input
                            type="number"
                            min="1"
                            value={searchParams.truckQuantity || ''}
                            onChange={e => setSearchParams(params => ({ ...params, truckQuantity: e.target.value }))}
                            className="w-32 px-2 py-2 border border-gray-300 rounded-lg text-xs text-left text-gray-900"
                            placeholder="e.g. 2"
                          />
                        </div>
                      </div>
                    )}
                    {/* LTL: same as LCL */}
                    {cargoTab === 'LTL' && (
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
                    <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 mt-6">
                      <button
                        className="px-4 py-2 rounded-lg bg-white text-sm text-gray-700 border border-gray-300 hover:bg-gray-100"
                        onClick={() => setShowCargoTypeModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg bg-[#007bff] text-sm text-white border border-[#007bff] hover:bg-blue-700"
                        onClick={() => {
                          setShowCargoTypeModal(false);
                          setSearchParams(params => ({
                            ...params,
                            containerType: cargoTab === 'FTL'
                              ? (searchParams.truckType && searchParams.truckQuantity ? `${searchParams.truckQuantity} x ${searchParams.truckType}` : '')
                              : lclWeight && lclVolume ? `LTL: ${lclWeight}kg, ${lclVolume}cbm` : '',
                            cargoType: cargoTab
                          }));
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </>
                ) : (
                  <>
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
                    <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 mt-6">
                      <button
                        className="px-4 py-2 rounded-lg bg-white text-sm text-gray-700 border border-gray-300 hover:bg-gray-100"
                        onClick={() => setShowCargoTypeModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg bg-[#007bff] text-sm text-white border border-[#007bff] hover:bg-blue-700"
                        onClick={() => {
                          setShowCargoTypeModal(false);
                          setSearchParams(params => ({
                            ...params,
                            containerType: cargoTab === 'FCL'
                              ? Object.entries(fclQuantities).filter(([_, qty]) => qty > 0).map(([type, qty]) => `${qty} x ${type}`).join(', ')
                              : lclWeight && lclVolume ? `LCL: ${lclWeight}kg, ${lclVolume}cbm` : '',
                            cargoType: cargoTab
                          }));
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
            <span className="mt-4 text-gray-500 text-sm">Searching for quotes...</span>
          </div>
        )}
        {showResults && !loading && (
          <>
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
              {searchResults.map((result, idx) => {
                const isDetailOpen = openDetailCost === result.id;
                // Remove Remark button and openRemark state

                return (
                  <div key={result.id} className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all`}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 border divide-x divide-gray-200">
                {/* 1. Logo Column */}
                <div className="flex items-center justify-center py-4 px-2 lg:col-span-1">
                  <img 
                    src={result.logo} 
                    alt={result.provider}
                    className="w-24 h-24 object-contain"
                  />
                </div>
                {/* 2. Details/Journey Column (wider) */}
                <div className="flex flex-col justify-center py-2 px-4 mt-2 mb-2 lg:col-span-2">
                  <div className="font-semibold text-gray-900 text-base mb-2">{result.provider}</div>
                  <div className="flex items-center gap-4 w-full">
                    {/* Origin */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-700 font-medium uppercase">{result.origin}</span>
                    </div>
                    {/* Arrow */}
                    <div className="flex flex-col items-center">
                      <span className="text-gray-400 text-lg">→</span>
                    </div>
                    {/* Destination */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-700 font-medium uppercase">{result.destination}</span>
                    </div>
                    {/* TT and Validity */}
                    <div className="flex flex-col items-end ml-auto">
                      <span className="text-xs text-gray-500">Transit Time: <span className="text-gray-900 font-medium">{result.transitTime}</span></span>
                      <span className="text-xs text-gray-500">Valid From: <span className="text-gray-900 font-medium">{result.validFrom}</span></span>
                      <span className="text-xs text-gray-500">Valid Until: <span className="text-gray-900 font-medium">{result.validUntil}</span></span>
                    </div>
                  </div>
                  {result.transitPort && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">Transit Port:</span>
                      <span className="text-xs text-gray-900 font-semibold">{result.transitPort}</span>
                    </div>
                  )}
                        {/* Remark */}
                        <div className="w-full flex items-center mt-2">
                          <span className="text-xs text-gray-500 italic">Remark: {result.remark || ''}</span>
                  </div>
                </div>
                      {/* 3. Price Column */}
                <div className="flex flex-col justify-center py-2 px-4 min-w-[160px] gap-2 lg:col-span-1">
                  <div>
                          <span className="text-xs font-medium text-gray-700">Price:</span>
                          {(() => {
                            const detailRows = buildDetailCostRows(result, appliedTransportMode, appliedCargoTab, appliedFclQuantities, appliedLclWeight, appliedLclVolume, appliedSearchParams);
                            const totalAmount = detailRows.reduce((sum, row) => sum + (typeof row.amount === 'number' ? row.amount : 0), 0);
                            const currency = detailRows[0]?.currency || result.currency;
                            return (
                              <div className="text-xl font-semibold text-[#007bff]">
                                {totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} {currency}
                          </div>
                            );
                          })()}
                        </div>
                        <button className="mt-6 text-xs text-[#007bff] hover:text-blue-800" onClick={() => setOpenDetailCost(isDetailOpen ? null : result.id)}>
                          Detail Cost
                        </button>
                </div>
                {/* 4. Actions Column */}
                <div className="flex flex-col justify-center items-center py-2 px-4 lg:col-span-1">
                          <button
                          onClick={() => handleSelectQuote(result, idx)}
                          className={`w-full px-4 py-2 rounded-md transition-colors text-sm font-medium flex items-center justify-center gap-2 bg-[#007bff] hover:bg-blue-700 text-white border border-[#007bff]`}
                                  >
                          Select
                                  </button>
                              </div>
                            </div>
                    {/* Detail Cost Dropdown */}
                    {isDetailOpen && (
                      <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="font-medium text-gray-900 mb-2 text-sm">Quote Detail</div>
                        <div className="overflow-x-auto rounded-lg">
                          <table className="min-w-full text-xs text-left border border-gray-200 ">
                            <thead>
                              <tr className="bg-gray-50 text-gray-500 uppercase border border-gray-200">
                                {/* Dynamic columns based on mode/cargo */}
                                <th className="px-4 py-2">Charge Type</th>
                                <th className="px-4 py-2">Item</th>
                                <th className="px-4 py-2">Description</th>
                                <th className="px-4 py-2">Calculation</th>
                                {((appliedTransportMode === 'Sea' && appliedCargoTab === 'FCL') || (appliedTransportMode === 'Land' && appliedCargoTab === 'FTL')) && <th className="px-4 py-2">Container/Truck Type</th>}
                                {((appliedTransportMode === 'Sea' && appliedCargoTab === 'FCL') || (appliedTransportMode === 'Land' && appliedCargoTab === 'FTL')) && <th className="px-4 py-2">Qty</th>}
                                {((appliedTransportMode === 'Sea' && appliedCargoTab === 'FCL') || (appliedTransportMode === 'Land' && appliedCargoTab === 'FTL')) && <th className="px-4 py-2">Base Rate</th>}
                                {((appliedTransportMode === 'Sea' && appliedCargoTab === 'FCL') || (appliedTransportMode === 'Land' && appliedCargoTab === 'FTL')) && <th className="px-4 py-2">Amount</th>}
                                {(((appliedTransportMode === 'Sea' && appliedCargoTab === 'LCL') || appliedTransportMode === 'Air' || (appliedTransportMode === 'Land' && appliedCargoTab === 'LTL'))) && <th className="px-4 py-2">Base Rate</th>}
                                {(((appliedTransportMode === 'Sea' && appliedCargoTab === 'LCL') || appliedTransportMode === 'Air' || (appliedTransportMode === 'Land' && appliedCargoTab === 'LTL'))) && <th className="px-4 py-2">Qty</th>}
                                {(((appliedTransportMode === 'Sea' && appliedCargoTab === 'LCL') || appliedTransportMode === 'Air' || (appliedTransportMode === 'Land' && appliedCargoTab === 'LTL'))) && <th className="px-4 py-2">Amount</th>}
                                {/* Always show Currency column */}
                                <th className="px-4 py-2">Currency</th>
                              </tr>
                            </thead>
                            <tbody className="text-gray-900">
                              {buildDetailCostRows(result, appliedTransportMode, appliedCargoTab, appliedFclQuantities, appliedLclWeight, appliedLclVolume, appliedSearchParams).map((row, idx) => (
                                <tr key={idx}>
                                  <td className="px-4 py-4">{row.type}</td>
                                  <td className="px-4 py-4">{row.item}</td>
                                  <td className="px-4 py-4">{row.description}</td>
                                  <td className="px-4 py-4">{row.calculation}</td>
                                  {((appliedTransportMode === 'Sea' && appliedCargoTab === 'FCL') || (appliedTransportMode === 'Land' && appliedCargoTab === 'FTL')) && <td className="px-4 py-4">{row.containerType || row.truckType}</td>}
                                  {((appliedTransportMode === 'Sea' && appliedCargoTab === 'FCL') || (appliedTransportMode === 'Land' && appliedCargoTab === 'FTL')) && <td className="px-4 py-4">{row.qty}</td>}
                                  {((appliedTransportMode === 'Sea' && appliedCargoTab === 'FCL') || (appliedTransportMode === 'Land' && appliedCargoTab === 'FTL')) && <td className="px-4 py-4">{row.baseRate}</td>}
                                  {((appliedTransportMode === 'Sea' && appliedCargoTab === 'FCL') || (appliedTransportMode === 'Land' && appliedCargoTab === 'FTL')) && <td className="px-4 py-4">{row.amount}</td>}
                                  {(((appliedTransportMode === 'Sea' && appliedCargoTab === 'LCL') || appliedTransportMode === 'Air' || (appliedTransportMode === 'Land' && appliedCargoTab === 'LTL'))) && <td className="px-4 py-4">{row.baseRate}</td>}
                                  {(((appliedTransportMode === 'Sea' && appliedCargoTab === 'LCL') || appliedTransportMode === 'Air' || (appliedTransportMode === 'Land' && appliedCargoTab === 'LTL'))) && <td className="px-4 py-4">{row.qty}</td>}
                                  {(((appliedTransportMode === 'Sea' && appliedCargoTab === 'LCL') || appliedTransportMode === 'Air' || (appliedTransportMode === 'Land' && appliedCargoTab === 'LTL'))) && <td className="px-4 py-4">{row.amount}</td>}
                                  {/* Always show Currency cell */}
                                  <td className="px-4 py-4">{row.currency}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      {/* Spinner CSS if not present globally */}
      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default QuoteSearch;

