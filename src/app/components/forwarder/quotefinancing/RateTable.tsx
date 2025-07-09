import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Truck, Ship, Plane, ChevronUp, Edit, Plus, Search, Filter, Download, Upload, Trash2, MoreHorizontal, X, ChevronRight, ChevronLeft, Train, Send } from 'lucide-react';
import { useQuoteRateStore, Rate } from '../../../../store/quoterate';
import ReactDOM from 'react-dom';
import RateParser from './RateParser';

interface RateTableProps {
  view?: 'summary' | 'full';
  onViewAll?: () => void;
}

// Place this at the top of the RateTable component, after other consts but before any JSX:
const getShipmentTypeOptions = (mode: string) => {
  if (mode === 'road') return [
    { value: 'FTL', label: 'FTL' },
    { value: 'LTL', label: 'LTL' },
  ];
  if (mode === 'air') return [
    { value: 'LCL', label: 'LCL' },
  ];
  // Default to ocean
  return [
    { value: 'FCL', label: 'FCL' },
    { value: 'LCL', label: 'LCL' },
  ];
};

const weightUnitOptions = [
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
];
const volumeUnitOptions = [
  { value: 'cbm', label: 'cbm' },
  { value: 'm3', label: 'm³' },
  { value: 'ft3', label: 'ft³' },
];

const RateTable: React.FC<RateTableProps> = ({ view = 'summary', onViewAll = () => {} }) => {  
  const { rates, setRates, addRate, updateRate, deleteRate, addQuote } = useQuoteRateStore();
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

  const [addTransportMode, setAddTransportMode] = useState('ocean');
  const [showAddTransportModeDropdown, setShowAddTransportModeDropdown] = useState(false);
  const [addContainerType, setAddContainerType] = useState('20ft');
  const [showAddContainerTypeDropdown, setShowAddContainerTypeDropdown] = useState(false);
  const [addCurrency, setAddCurrency] = useState('USD');
  const [showAddCurrencyDropdown, setShowAddCurrencyDropdown] = useState(false);
  const [addIncoterm, setAddIncoterm] = useState('FOB');
  const [showAddIncotermDropdown, setShowAddIncotermDropdown] = useState(false);
  const [addShipmentType, setAddShipmentType] = useState('FCL');
  const [showAddShipmentTypeDropdown, setShowAddShipmentTypeDropdown] = useState(false);

  const [showEditTransportModeDropdown, setShowEditTransportModeDropdown] = useState(false);
  const [showEditContainerTypeDropdown, setShowEditContainerTypeDropdown] = useState(false);
  const [showEditCurrencyDropdown, setShowEditCurrencyDropdown] = useState(false);
  const [showEditIncotermDropdown, setShowEditIncotermDropdown] = useState(false);
  const [showEditShipmentTypeDropdown, setShowEditShipmentTypeDropdown] = useState(false);

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showRateParser, setShowRateParser] = useState(false);

  // Add Rate form state variables
  const [addFormData, setAddFormData] = useState({
    originCity: '',
    destinationCity: '',
    carrier: '',
    shipmentType: '',
    weight: '',
    volume: '',
    price: '',
    baseRate: '',
    transitTime: '',
    surcharges: '',
    notes: '',
    validFrom: '',
    validTo: '',
    weightMin: '',
    weightMax: '',
    volumeMin: '',
    volumeMax: '',
    ratePerCbmKg: '',
    minimumCharge: '',
    containertype: '',
    weightUnit: 'kg',
    volumeUnit: 'cbm',
    weightMinUnit: 'kg',
    weightMaxUnit: 'kg',
    volumeMinUnit: 'cbm',
    volumeMaxUnit: 'cbm',
  });


  const transportModeOptions = [
    { value: 'ocean', label: 'Ocean' },
    { value: 'air', label: 'Air' },
    { value: 'road', label: 'Road' },
  ];
  const containerTypeOptions = [
    { value: '20ft', label: '20ft' },
    { value: '40ft', label: '40ft' },
    { value: '40ft HC', label: '40ft HC' },
    { value: '45ft', label: '45ft' },
  ];
  const currencyOptions = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' },
    { value: 'CNY', label: 'CNY' },
  ];
  const incotermOptions = [
    { value: 'FOB', label: 'FOB' },
    { value: 'CIF', label: 'CIF' },
    { value: 'EXW', label: 'EXW' },
    { value: 'DAP', label: 'DAP' },
    { value: 'CIP', label: 'CIP' },
  ];
  const shipmentTypeOptions = [
    { value: 'FCL', label: 'FCL' },
    { value: 'LCL', label: 'LCL' },
  ];

  // Add refs for add/edit modal dropdowns
  const addTransportModeDropdownRef = useRef<HTMLDivElement>(null);
  const addTransportModeButtonRef = useRef<HTMLButtonElement>(null);
  const addContainerTypeDropdownRef = useRef<HTMLDivElement>(null);
  const addContainerTypeButtonRef = useRef<HTMLButtonElement>(null);
  const addCurrencyDropdownRef = useRef<HTMLDivElement>(null);
  const addCurrencyButtonRef = useRef<HTMLButtonElement>(null);
  const addIncotermDropdownRef = useRef<HTMLDivElement>(null);
  const addIncotermButtonRef = useRef<HTMLButtonElement>(null);
  const addShipmentTypeDropdownRef = useRef<HTMLDivElement>(null);
  const addShipmentTypeButtonRef = useRef<HTMLButtonElement>(null);
  const editTransportModeDropdownRef = useRef<HTMLDivElement>(null);
  const editTransportModeButtonRef = useRef<HTMLButtonElement>(null);
  const editContainerTypeDropdownRef = useRef<HTMLDivElement>(null);
  const editContainerTypeButtonRef = useRef<HTMLButtonElement>(null);
  const editCurrencyDropdownRef = useRef<HTMLDivElement>(null);
  const editCurrencyButtonRef = useRef<HTMLButtonElement>(null);
  const editIncotermDropdownRef = useRef<HTMLDivElement>(null);
  const editIncotermButtonRef = useRef<HTMLButtonElement>(null);
  const editShipmentTypeDropdownRef = useRef<HTMLDivElement>(null);
  const editShipmentTypeButtonRef = useRef<HTMLButtonElement>(null);

  // Get all existing quote keys for deduplication
  const { quotes } = useQuoteRateStore();
  const quoteKeys = quotes.map(q => `${q.lane}|${q.mode}|${q.containertype}|${q.carrier}`);
  const [showAddWeightUnitDropdown, setShowAddWeightUnitDropdown] = useState(false);
  const [showAddVolumeUnitDropdown, setShowAddVolumeUnitDropdown] = useState(false);
  const [showEditWeightUnitDropdown, setShowEditWeightUnitDropdown] = useState(false);
  const [showEditVolumeUnitDropdown, setShowEditVolumeUnitDropdown] = useState(false);

  // 1. Add refs for each unit dropdown/button pair (add/edit, weight/volume)
  const addWeightUnitRef = useRef<HTMLDivElement>(null);
  const addVolumeUnitRef = useRef<HTMLDivElement>(null);
  const editWeightUnitRef = useRef<HTMLDivElement>(null);
  const editVolumeUnitRef = useRef<HTMLDivElement>(null);

  // 2. Add useEffect for outside click for each dropdown
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (showAddWeightUnitDropdown && addWeightUnitRef.current && !addWeightUnitRef.current.contains(event.target as Node)) {
        setShowAddWeightUnitDropdown(false);
      }
      if (showAddVolumeUnitDropdown && addVolumeUnitRef.current && !addVolumeUnitRef.current.contains(event.target as Node)) {
        setShowAddVolumeUnitDropdown(false);
      }
      if (showEditWeightUnitDropdown && editWeightUnitRef.current && !editWeightUnitRef.current.contains(event.target as Node)) {
        setShowEditWeightUnitDropdown(false);
      }
      if (showEditVolumeUnitDropdown && editVolumeUnitRef.current && !editVolumeUnitRef.current.contains(event.target as Node)) {
        setShowEditVolumeUnitDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showAddWeightUnitDropdown, showAddVolumeUnitDropdown, showEditWeightUnitDropdown, showEditVolumeUnitDropdown]);

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
      
      // Add modal dropdowns
      if (addTransportModeDropdownRef.current && !addTransportModeDropdownRef.current.contains(event.target as Node) &&
          addTransportModeButtonRef.current && !addTransportModeButtonRef.current.contains(event.target as Node)) {
        setShowAddTransportModeDropdown(false);
      }
      if (addContainerTypeDropdownRef.current && !addContainerTypeDropdownRef.current.contains(event.target as Node) &&
          addContainerTypeButtonRef.current && !addContainerTypeButtonRef.current.contains(event.target as Node)) {
        setShowAddContainerTypeDropdown(false);
      }
      if (addCurrencyDropdownRef.current && !addCurrencyDropdownRef.current.contains(event.target as Node) &&
          addCurrencyButtonRef.current && !addCurrencyButtonRef.current.contains(event.target as Node)) {
        setShowAddCurrencyDropdown(false);
      }
      if (addIncotermDropdownRef.current && !addIncotermDropdownRef.current.contains(event.target as Node) &&
          addIncotermButtonRef.current && !addIncotermButtonRef.current.contains(event.target as Node)) {
        setShowAddIncotermDropdown(false);
      }
      if (addShipmentTypeDropdownRef.current && !addShipmentTypeDropdownRef.current.contains(event.target as Node) &&
          addShipmentTypeButtonRef.current && !addShipmentTypeButtonRef.current.contains(event.target as Node)) {
        setShowAddShipmentTypeDropdown(false);
      }
      // Edit modal dropdowns
      if (editTransportModeDropdownRef.current && !editTransportModeDropdownRef.current.contains(event.target as Node) &&
          editTransportModeButtonRef.current && !editTransportModeButtonRef.current.contains(event.target as Node)) {
        setShowEditTransportModeDropdown(false);
      }
      if (editContainerTypeDropdownRef.current && !editContainerTypeDropdownRef.current.contains(event.target as Node) &&
          editContainerTypeButtonRef.current && !editContainerTypeButtonRef.current.contains(event.target as Node)) {
        setShowEditContainerTypeDropdown(false);
      }
      if (editCurrencyDropdownRef.current && !editCurrencyDropdownRef.current.contains(event.target as Node) &&
          editCurrencyButtonRef.current && !editCurrencyButtonRef.current.contains(event.target as Node)) {
        setShowEditCurrencyDropdown(false);
      }
      if (editIncotermDropdownRef.current && !editIncotermDropdownRef.current.contains(event.target as Node) &&
          editIncotermButtonRef.current && !editIncotermButtonRef.current.contains(event.target as Node)) {
        setShowEditIncotermDropdown(false);
      }
      if (editShipmentTypeDropdownRef.current && !editShipmentTypeDropdownRef.current.contains(event.target as Node) &&
          editShipmentTypeButtonRef.current && !editShipmentTypeButtonRef.current.contains(event.target as Node)) {
        setShowEditShipmentTypeDropdown(false);
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
    shipmentType: true,
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
    status: true
  });  



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


  const handleEditRate = (rate: Rate) => {
    setCurrentRate(rate);
    setShowEditModal(true);
  };

  const handleSaveRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRate) return;
    
    const updatedRate = {
      ...currentRate,
      shipmentType: currentRate.mode === 'air' ? 'LCL' : currentRate.shipmentType,
    };
    updateRate(updatedRate);
    setShowEditModal(false);
    setCurrentRate(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentRate(prev => {
      if (!prev) return null;
      let updated = { ...prev, [name]: value };
      if (name === 'originCity' || name === 'destinationCity') {
        updated.lane = `${name === 'originCity' ? value : prev.originCity} - ${name === 'destinationCity' ? value : prev.destinationCity}`;
      }
      return updated;
    });
  };
    
  // Add Rate form input change handler
  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add this handler near handleAddFormChange
  const handleAddSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAddFormData({ ...addFormData, [e.target.name]: e.target.value });
  };

  // Add Rate form submission handler
  const handleAddRate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRate: Rate = {
      id: Date.now(),
      lane: `${addFormData.originCity} - ${addFormData.destinationCity}`,
      mode: addTransportMode as 'ocean' | 'air' | 'truck',
      shipmentType: addTransportMode === 'air' ? 'LCL' : addShipmentType,
      weight: addFormData.weight,
      volume: addFormData.volume,
      containertype:
        (addTransportMode === 'road' && addShipmentType === 'FTL') ? addFormData.containertype :
        (addShipmentType === 'LCL' || addShipmentType === 'LTL') ? 'none' :
        addContainerType,
      currency: addCurrency,
      price: addFormData.price,
      baseRate: parseFloat(addFormData.baseRate) || 0,
      originCity: addFormData.originCity,
      destinationCity: addFormData.destinationCity,
      transitTime: addFormData.transitTime,
      carrier: addFormData.carrier,
      surcharges: addFormData.surcharges,
      incoterm: addIncoterm,
      validFrom: addFormData.validFrom,
      validTo: addFormData.validTo,
      notes: addFormData.notes,
      status: 'draft',
      weightMin: addFormData.weightMin,
      weightMax: addFormData.weightMax,
      volumeMin: addFormData.volumeMin,
      volumeMax: addFormData.volumeMax,
      ratePerCbmKg: addFormData.ratePerCbmKg,
      weightUnit: addFormData.weightUnit,
      volumeUnit: addFormData.volumeUnit,
    };

    addRate(newRate);
    setShowAddModal(false);
    
    // Reset form data
    setAddFormData({
      originCity: '',
      destinationCity: '',
      carrier: '',
      shipmentType: '',
      weight: '',
      volume: '',
      price: '',
      baseRate: '',
      transitTime: '',
      surcharges: '',
      notes: '',
      validFrom: '',
      validTo: '',
      weightMin: '',
      weightMax: '',
      volumeMin: '',
      volumeMax: '',
      ratePerCbmKg: '',
      minimumCharge: '',
      containertype: '',
      weightUnit: 'kg',
      volumeUnit: 'cbm',
      weightMinUnit: 'kg',
      weightMaxUnit: 'kg',
      volumeMinUnit: 'cbm',
      volumeMaxUnit: 'cbm',
    });
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
                  </button>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getModeIcon(rate.mode)}
                      <span className="text-sm font-medium text-gray-900 capitalize">{rate.mode}</span>
                      <span className="text-gray-900">-</span>
                      <span className="text-sm font-semibold text-gray-900 capitalize">{rate.carrier}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-1 uppercase">{rate.lane}</div>
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
       <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2 md:gap-0">
        <h2 className="text-2xl font-semibold text-gray-900">Rate Management</h2>
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
          <button 
            onClick={() => setShowRateParser(true)}
            className="w-full md:w-auto flex items-center text-sm text-gray-900 gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button className="w-full md:w-auto flex items-center text-sm text-gray-900 gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto flex items-center px-4 py-2 text-sm font-semibold text-white bg-[#007bff] rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
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
            className="pl-10 pr-4 py-2 text-sm text-gray-900 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
            <button 
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
        <div className="p-3 mt-4 bg-white border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {selectedRates.map((id) => {
              const rate = rates.find(r => r.id === id);
              if (!rate) return null;
              return (
                <span key={id} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-2 rounded-full mr-2 mb-1">
                  {rate.lane}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedRates(selectedRates.filter(rid => rid !== id));
                    }}
                    className="ml-2 text-blue-400 hover:text-blue-700 focus:outline-none"
                    title="Remove"
                    style={{ lineHeight: 1 }}
                  >
                    <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                  </button>
            </span>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            {/* Remove button without confirmation */}
            <button
              onClick={() => {
                selectedRates.forEach(id => deleteRate(id));
                setSelectedRates([]);
              }}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-white hover:text-red-700 focus:outline-none"
            >
              Remove
              </button>
            {selectedRates.length === 1 && (
              <button
                onClick={() => {
                  const rate = rates.find(r => r.id === selectedRates[0]);
                  if (rate) handleEditRate(rate);
                }}
                className="px-4 py-2 text-sm font-medium text-[#007bff] bg-white hover:text-blue-700 focus:outline-none"
              >
                Edit
              </button>
            )}
            {/* Quote button only for 1 rate with confirmation */}
            {selectedRates.length === 1 && (
              <button
                onClick={() => setShowQuoteModal(true)}
                className="px-5 py-2 text-sm font-semibold text-white bg-[#007bff] rounded-lg hover:bg-blue-700 focus:outline-none"
              >
                Post Rate
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table Container with horizontal scrolling */}
      <div className="mt-3">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columnVisibility.id && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>}
                    {columnVisibility.lane && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lane</th>}
                    {columnVisibility.mode && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>}
                    {columnVisibility.shipmentType && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment Type</th>}
                    {columnVisibility.weight && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>}
                    {columnVisibility.volume && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>}
                    {columnVisibility.containertype && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Container/Truck Type</th>}
                    {columnVisibility.currency && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>}
                    {columnVisibility.price && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>}
                    {columnVisibility.baseRate && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Rate</th>}
                    {columnVisibility.originCity && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origin</th>}
                    {columnVisibility.destinationCity && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>}
                    {columnVisibility.transitTime && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transit Time</th>}
                    {columnVisibility.carrier && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>}
                    {columnVisibility.incoterm && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incoterm</th>}
                    {columnVisibility.validFrom && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid From</th>}
                    {columnVisibility.validTo && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>}
                    {columnVisibility.surcharges && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surcharge</th>}
                    {columnVisibility.notes && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>}   
                    {columnVisibility.status && <th scope="col" className="px-4 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRates.length > 0 ? (
                    paginatedRates.map((rate) => (
                      <tr
                        key={rate.id}
                        className={`hover:bg-gray-50 cursor-pointer ${selectedRates.includes(rate.id) ? 'bg-blue-50' : ''}`}
                        onClick={() => {
                          setSelectedRates((prev) =>
                            prev.includes(rate.id)
                              ? prev.filter((id) => id !== rate.id)
                              : [...prev, rate.id]
                          );
                        }}
                      >
                        {columnVisibility.id && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.id}</td>}
                        {columnVisibility.lane && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900 uppercase">{rate.lane}</td>}
                        {columnVisibility.mode && (
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {getModeIcon(rate.mode)}
                              <span className="text-xs font-medium text-gray-900 capitalize">{rate.mode}</span>
                            </div>
                          </td>
                        )}
                        {columnVisibility.shipmentType && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900 uppercase">{rate.shipmentType}</td>}
                        {columnVisibility.weight && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{(() => {
                          const unit = rate.weightUnit || 'kg';
                          if (rate.weightMin && rate.weightMax) return `${rate.weightMin} ${unit} - ${rate.weightMax} ${unit}`;
                          if (rate.weightMin) return `${rate.weightMin} ${unit}`;
                          if (rate.weightMax) return `${rate.weightMax} ${unit}`;
                          return rate.weight ? `${rate.weight} ${unit}` : '';
                        })()}</td>}
                        {columnVisibility.volume && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{(() => {
                          const unit = rate.volumeUnit || 'cbm';
                          if (rate.volumeMin && rate.volumeMax) return `${rate.volumeMin} ${unit} - ${rate.volumeMax} ${unit}`;
                          if (rate.volumeMin) return `${rate.volumeMin} ${unit}`;
                          if (rate.volumeMax) return `${rate.volumeMax} ${unit}`;
                          return rate.volume ? `${rate.volume} ${unit}` : '';
                        })()}</td>}
                        {columnVisibility.containertype && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900 uppercase">{(rate.shipmentType === 'LCL' || rate.shipmentType === 'LTL') ? 'none' : rate.containertype}</td>}
                        {columnVisibility.currency && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.currency}</td>}
                        {columnVisibility.price && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.price}</td>}
                        {columnVisibility.baseRate && (
                          <td className="px-4 py-4 whitespace-nowrap text-xs font-semibold text-gray-900">
                            {((rate.shipmentType === 'LCL') || (rate.shipmentType === 'LTL') || (rate.mode === 'air'))
                              ? (rate.ratePerCbmKg || '-')
                              : (rate.baseRate ? `$${rate.baseRate.toLocaleString()}` : '-')}
                          </td>
                        )}
                        {columnVisibility.originCity && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900 uppercase">{rate.originCity}</td>}
                        {columnVisibility.destinationCity && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900 uppercase">{rate.destinationCity}</td>}
                        {columnVisibility.transitTime && (
                          <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600">
                            {rate.transitTime
                              ? (rate.transitTime.toLowerCase().includes('day')
                                  ? rate.transitTime
                                  : rate.transitTime + ' days')
                              : '-'}
                          </td>
                        )}
                        {columnVisibility.carrier && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900 uppercase">{rate.carrier}</td>}                   
                        {columnVisibility.incoterm && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600">{rate.incoterm}</td>}
                        {columnVisibility.validFrom && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600">{rate.validFrom}</td>}
                        {columnVisibility.validTo && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600">{rate.validTo}</td>}
                        {columnVisibility.surcharges && <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{rate.surcharges}</td>}    
                        {columnVisibility.notes && <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate overflow-hidden text-ellipsis">{rate.notes}</td>}
                        {columnVisibility.status && (
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rate.status)}`}>
                              {rate.status.charAt(0).toUpperCase() + rate.status.slice(1)}
                            </span>
                          </td>
                        )}
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

      {renderPagination()}

      {/* Add Rate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto border-t-7 border-[#007bff] hide-scrollbar">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">Add New Rate</h3>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-600">
                    Draft
                  </span>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <form onSubmit={handleAddRate}>
              <div className="space-y-6">
                {/* Location & Transport Details */}
                <div>
                  <div className="mb-2 text-xs font-semibold text-gray-900 uppercase tracking-wide">Location & Transport Details</div>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Origin City</label>
                      <input type="text" name="originCity" value={addFormData.originCity} onChange={handleAddFormChange} placeholder="e.g. Shanghai, China" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Destination City</label>
                      <input type="text" name="destinationCity" value={addFormData.destinationCity} onChange={handleAddFormChange} placeholder="e.g. New York, USA" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Transport Mode</label>
                    <div className="relative">
                      <button
                        type="button"
                        ref={addTransportModeButtonRef}
                        onClick={() => setShowAddTransportModeDropdown((v) => !v)}
                        className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        {transportModeOptions.find(opt => opt.value === addTransportMode)?.label || 'Select mode'}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showAddTransportModeDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showAddTransportModeDropdown && (
                        <div ref={addTransportModeDropdownRef} className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-1">
                          {transportModeOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setAddTransportMode(option.value);
                                setAddShipmentType(getShipmentTypeOptions(option.value)[0].value);
                                setAddContainerType('20ft');
                                setAddFormData(prev => ({
                                  ...prev,
                                  shipmentType: getShipmentTypeOptions(option.value)[0].value,
                                  weight: '',
                                  volume: '',
                                  containertype: '',
                                  baseRate: '',
                                  price: '',
                                  currency: 'USD',
                                  weightMin: '',
                                  weightMax: '',
                                  volumeMin: '',
                                  volumeMax: '',
                                  ratePerCbmKg: '',
                                  weightUnit: 'kg',
                                  volumeUnit: 'cbm',
                                }));
                                setShowAddTransportModeDropdown(false);
                              }}
                              className={`w-full text-left p-2 hover:bg-gray-50 rounded text-xs ${addTransportMode === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Carrier</label>
                      <input type="text" name="carrier" value={addFormData.carrier} onChange={handleAddFormChange} placeholder="e.g. Maersk Line" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                  </div>
                <div className="border-t border-gray-200"></div>
                {/* Cargo & Shipping Details */}
                  <div>
                  <div className="-mt-2 mb-2 text-xs font-semibold text-gray-900 uppercase tracking-wide">Cargo & Shipping Details</div>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                  <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Shipment Type</label>
                      <div className="relative">
                        <button
                          type="button"
                          ref={addShipmentTypeButtonRef}
                          onClick={() => {
                            if (getShipmentTypeOptions(addTransportMode).length > 1) setShowAddShipmentTypeDropdown((v) => !v);
                          }}
                          className={`flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${getShipmentTypeOptions(addTransportMode).length === 1 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          disabled={getShipmentTypeOptions(addTransportMode).length === 1}
                        >
                          {(addTransportMode === 'air')
                            ? 'LCL'
                            : (getShipmentTypeOptions(addTransportMode).find(opt => opt.value === addShipmentType)?.label || 'Select shipment type')}
                          <ChevronDown className={`w-4 h-4 transition-transform ${showAddShipmentTypeDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showAddShipmentTypeDropdown && getShipmentTypeOptions(addTransportMode).length > 1 && (
                          <div ref={addShipmentTypeDropdownRef} className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-1">
                            {getShipmentTypeOptions(addTransportMode).map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setAddShipmentType(option.value);
                                  setAddFormData(prev => ({
                                    ...prev,
                                    shipmentType: option.value,
                                    weight: '',
                                    volume: '',
                                    containertype: '',
                                    baseRate: '',
                                    price: '',
                                    currency: 'USD',
                                    weightMin: '',
                                    weightMax: '',
                                    volumeMin: '',
                                    volumeMax: '',
                                    ratePerCbmKg: '',
                                    weightUnit: 'kg',
                                    volumeUnit: 'cbm',
                                  }));
                                  setShowAddShipmentTypeDropdown(false);
                                }}
                                className={`w-full text-left p-2 hover:bg-gray-50 rounded text-xs ${addShipmentType === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                              >
                                {option.label}
                              </button>
                            ))}
                        </div>
                        )}
                      </div>
                    </div>
                  </div>                  
                  {/* LCL/LTL fields */}
                  {((addShipmentType === 'LCL') || (addShipmentType === 'LTL') || (addTransportMode === 'air')) ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Rate Per CBM / KG</label>
                        <input type="text" name="ratePerCbmKg" value={addFormData.ratePerCbmKg || ''} onChange={handleAddFormChange} placeholder="e.g. $20 per CBM or $3.5/kg" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Currency</label>
                        <div className="relative">
                          <button
                            type="button"
                            ref={addCurrencyButtonRef}
                            onClick={() => setShowAddCurrencyDropdown((v) => !v)}
                            className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            {currencyOptions.find(opt => opt.value === addCurrency)?.label || 'Select currency'}
                            <ChevronDown className={`w-4 h-4 transition-transform ${showAddCurrencyDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          {showAddCurrencyDropdown && (
                            <div ref={addCurrencyDropdownRef} className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-1">
                              {currencyOptions.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => {
                                    setAddCurrency(option.value);
                                    setShowAddCurrencyDropdown(false);
                                  }}
                                  className={`w-full text-left p-2 hover:bg-gray-50 rounded text-xs ${addCurrency === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Weight Range (kg)</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            name="weightMin"
                            value={addFormData.weightMin}
                            onChange={handleAddFormChange}
                            placeholder="Min"
                            className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                          <span>-</span>
                          <input
                            type="number"
                            name="weightMax"
                            value={addFormData.weightMax}
                            onChange={handleAddFormChange}
                            placeholder="Max"
                            className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                          <div className="relative inline-block" ref={addWeightUnitRef}>
                            <button
                              type="button"
                              onClick={() => setShowAddWeightUnitDropdown((v) => !v)}
                              className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50"
                            >
                              {addFormData.weightUnit || 'kg'}
                            </button>
                            {showAddWeightUnitDropdown && (
                              <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded shadow-lg">
                                {weightUnitOptions.map(opt => (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                      setAddFormData({ ...addFormData, weightUnit: opt.value });
                                      setShowAddWeightUnitDropdown(false);
                                    }}
                                    className={`block w-full text-left px-4 py-3 text-xs ${addFormData.weightUnit === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Volume Range (cbm)</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            name="volumeMin"
                            value={addFormData.volumeMin}
                            onChange={handleAddFormChange}
                            placeholder="Min"
                            className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                          <span>-</span>
                          <input
                            type="number"
                            name="volumeMax"
                            value={addFormData.volumeMax}
                            onChange={handleAddFormChange}
                            placeholder="Max"
                            className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                          <div className="relative inline-block" ref={addVolumeUnitRef}>
                            <button
                              type="button"
                              onClick={() => setShowAddVolumeUnitDropdown((v) => !v)}
                              className="ml-2 px-2 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50"
                            >
                              {addFormData.volumeUnit || 'cbm'}
                            </button>
                            {showAddVolumeUnitDropdown && (
                              <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded shadow-lg">
                                {volumeUnitOptions.map(opt => (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                      setAddFormData({ ...addFormData, volumeUnit: opt.value });
                                      setShowAddVolumeUnitDropdown(false);
                                    }}
                                    className={`block w-full text-left px-4 py-3 text-xs ${addFormData.volumeUnit === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Price Range</label>
                        <input type="text" name="price" value={addFormData.price} onChange={handleAddFormChange} placeholder="e.g. $2,100 - $2,800" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                    </div>
                  ) : ((addShipmentType === 'FTL') || (addTransportMode === 'truck') || (addShipmentType === 'FCL')) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          {addShipmentType === 'FCL' ? 'Container Type' : 'Truck Type'}
                        </label>
                        {addShipmentType === 'FCL' ? (
                          <div className="relative">
                            <button
                              type="button"
                              ref={addContainerTypeButtonRef}
                              onClick={() => setShowAddContainerTypeDropdown((v) => !v)}
                              className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                              {containerTypeOptions.find(opt => opt.value === addContainerType)?.label || 'Select container type'}
                              <ChevronDown className={`w-4 h-4 transition-transform ${showAddContainerTypeDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {showAddContainerTypeDropdown && (
                              <div ref={addContainerTypeDropdownRef} className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-1">
                                {containerTypeOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                      setAddContainerType(option.value);
                                      setShowAddContainerTypeDropdown(false);
                                      setAddFormData({ ...addFormData, containertype: option.value });
                                    }}
                                    className={`w-full text-left p-2 hover:bg-gray-50 rounded text-xs ${addContainerType === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <input
                            type="text"
                            name="containertype"
                            value={addFormData.containertype}
                            onChange={handleAddFormChange}
                            placeholder="e.g. 6-Wheel, 10-Wheel, Wingbox, etc."
                            className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Base Rate</label>
                        <input type="number" name="baseRate" value={addFormData.baseRate} onChange={handleAddFormChange} placeholder={addTransportMode === 'road' ? 'e.g. 1500' : 'e.g. 2000'} className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Price Range</label>
                        <input type="text" name="price" value={addFormData.price} onChange={handleAddFormChange} placeholder="e.g. $2,100 - $2,800" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Currency</label>
                        <div className="relative">
                          <button
                            type="button"
                            ref={addCurrencyButtonRef}
                            onClick={() => setShowAddCurrencyDropdown((v) => !v)}
                            className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            {currencyOptions.find(opt => opt.value === addCurrency)?.label || 'Select currency'}
                            <ChevronDown className={`w-4 h-4 transition-transform ${showAddCurrencyDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          {showAddCurrencyDropdown && (
                            <div ref={addCurrencyDropdownRef} className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-1">
                              {currencyOptions.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => {
                                    setAddCurrency(option.value);
                                    setShowAddCurrencyDropdown(false);
                                  }}
                                  className={`w-full text-left p-2 hover:bg-gray-50 rounded text-xs ${addCurrency === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Max Weight</label>
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            name="weight"
                            value={addFormData.weight}
                            onChange={handleAddFormChange}
                            placeholder="e.g. 26000"
                            className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                          <div className="relative inline-block" ref={addWeightUnitRef}>
                            <button
                              type="button"
                              onClick={() => setShowAddWeightUnitDropdown((v) => !v)}
                              className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50"
                            >
                              {addFormData.weightUnit || 'kg'}
                            </button>
                            {showAddWeightUnitDropdown && (
                              <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded shadow-lg">
                                {weightUnitOptions.map(opt => (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                      setAddFormData({ ...addFormData, weightUnit: opt.value });
                                      setShowAddWeightUnitDropdown(false);
                                    }}
                                    className={`block w-full text-left px-4 py-3 text-xs ${addFormData.weightUnit === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Max Volume</label>
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            name="volume"
                            value={addFormData.volume}
                            onChange={handleAddFormChange}
                            placeholder="e.g. 67"
                            className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                          <div className="relative inline-block" ref={addVolumeUnitRef}>
                            <button
                              type="button"
                              onClick={() => setShowAddVolumeUnitDropdown((v) => !v)}
                              className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50"
                            >
                              {addFormData.volumeUnit || 'cbm'}
                            </button>
                            {showAddVolumeUnitDropdown && (
                              <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded shadow-lg">
                                {volumeUnitOptions.map(opt => (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                      setAddFormData({ ...addFormData, volumeUnit: opt.value });
                                      setShowAddVolumeUnitDropdown(false);
                                    }}
                                    className={`block w-full text-left px-4 py-3 text-xs ${addFormData.volumeUnit === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-200"></div>
                {/* Additional Requirements */}
                <div>
                  <div className="-mt-2 mb-2 text-xs font-semibold text-gray-900 uppercase tracking-wide">Additional Requirements</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Incoterm</label>
                  <div className="relative">
                    <button
                      type="button"
                          ref={addIncotermButtonRef}
                          onClick={() => setShowAddIncotermDropdown((v) => !v)}
                      className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                          {incotermOptions.find(opt => opt.value === addIncoterm)?.label || 'Select incoterm'}
                          <ChevronDown className={`w-4 h-4 transition-transform ${showAddIncotermDropdown ? 'rotate-180' : ''}`} />
                    </button>
                        {showAddIncotermDropdown && (
                          <div ref={addIncotermDropdownRef} className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-1">
                            {incotermOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                  setAddIncoterm(option.value);
                                  setShowAddIncotermDropdown(false);
                            }}
                                className={`w-full text-left p-2 hover:bg-gray-50 rounded text-xs ${addIncoterm === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Transit Time</label>
                      <input type="text" name="transitTime" value={addFormData.transitTime} onChange={handleAddFormChange} placeholder="e.g. 18-22 days" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Valid From</label>
                      <input type="date" name="validFrom" value={addFormData.validFrom} onChange={handleAddFormChange} className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Valid Until</label>
                      <input type="date" name="validTo" value={addFormData.validTo} onChange={handleAddFormChange} className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">Surcharges {/* Tooltip as before */}</label>
                      <textarea name="surcharges" value={addFormData.surcharges} onChange={handleAddFormChange} placeholder="e.g. BAF: $150, CAF: $200" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={2}></textarea>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                      <textarea name="notes" value={addFormData.notes} onChange={handleAddFormChange} placeholder="e.g. Peak season surcharge may apply" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3}></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                    type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-sm text-white bg-[#007bff] rounded-lg hover:bg-blue-700">
                Save Rate
              </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Rate Modal */}
      {showEditModal && currentRate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-sm max-w-4xl w-full max-h-[90vh] overflow-y-auto border-t-7 border-[#007bff] hide-scrollbar">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">Edit Rate</h3>
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-600">
                    Draft
                  </span>
                </div>
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
                <div className="space-y-6">
                  {/* Location & Transport Details */}
                  <div>
                    <div className="mb-2 text-xs font-semibold text-gray-900 uppercase tracking-wide">Location & Transport Details</div>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Origin City</label>
                        <input type="text" name="originCity" value={currentRate.originCity} onChange={handleInputChange} placeholder="e.g. Shanghai, China" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Destination City</label>
                        <input type="text" name="destinationCity" value={currentRate.destinationCity} onChange={handleInputChange} placeholder="e.g. New York, USA" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Transport Mode</label>
                      <div className="relative">
                        <button
                          type="button"
                          ref={editTransportModeButtonRef}
                          onClick={() => setShowEditTransportModeDropdown((v) => !v)}
                          className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          {transportModeOptions.find(opt => opt.value === currentRate.mode)?.label || 'Select mode'}
                          <ChevronDown className={`w-4 h-4 transition-transform ${showEditTransportModeDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {showEditTransportModeDropdown && (
                          <div ref={editTransportModeDropdownRef} className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-1">
                            {transportModeOptions.map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setCurrentRate(prev => ({
                                    ...prev!,
                                    mode: option.value as 'ocean' | 'air' | 'truck',
                                    shipmentType: getShipmentTypeOptions(option.value)[0].value,
                                    weight: '',
                                    volume: '',
                                    containertype: '',
                                    baseRate: 0,
                                    price: '',
                                    currency: 'USD',
                                    weightMin: '',
                                    weightMax: '',
                                    volumeMin: '',
                                    volumeMax: '',
                                    ratePerCbmKg: '',
                                    weightUnit: 'kg',
                                    volumeUnit: 'cbm',
                                  }));
                                  setShowEditTransportModeDropdown(false);
                                }}
                                className={`w-full text-left p-2 hover:bg-gray-50 rounded text-xs ${currentRate.mode === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Carrier</label>
                        <input type="text" name="carrier" value={currentRate.carrier} onChange={handleInputChange} placeholder="e.g. Maersk Line" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                  </div>
                    </div>
                  <div className="border-t border-gray-200"></div>
                  {/* Cargo & Shipping Details */}
                    <div>
                    <div className="-mt-2 mb-2 text-xs font-semibold text-gray-900 uppercase tracking-wide">Cargo & Shipping Details</div>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Shipment Type</label>
                        <div className="relative">
                          <button
                            type="button"
                            ref={editShipmentTypeButtonRef}
                            onClick={() => {
                              if (getShipmentTypeOptions(currentRate.mode).length > 1) setShowEditShipmentTypeDropdown((v) => !v);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${getShipmentTypeOptions(currentRate.mode).length === 1 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                            disabled={getShipmentTypeOptions(currentRate.mode).length === 1}
                          >
                            {(currentRate.mode === 'air')
                              ? 'LCL'
                              : (getShipmentTypeOptions(currentRate.mode).find(opt => opt.value === currentRate.shipmentType)?.label || 'Select shipment type')}
                            <ChevronDown className={`w-4 h-4 transition-transform ${showEditShipmentTypeDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          {showEditShipmentTypeDropdown && getShipmentTypeOptions(currentRate.mode).length > 1 && (
                            <div ref={editShipmentTypeDropdownRef} className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-1">
                              {getShipmentTypeOptions(currentRate.mode).map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => {
                                    setCurrentRate(prev => ({
                                      ...prev!,
                                      shipmentType: option.value,
                                      weight: '',
                                      volume: '',
                                      containertype: '',
                                      baseRate: 0,
                                      price: '',
                                      currency: 'USD',
                                      weightMin: '',
                                      weightMax: '',
                                      volumeMin: '',
                                      volumeMax: '',
                                      ratePerCbmKg: '',
                                      weightUnit: 'kg',
                                      volumeUnit: 'cbm',
                                    }));
                                    setShowEditShipmentTypeDropdown(false);
                                  }}
                                  className={`w-full text-left p-2 hover:bg-gray-50 rounded text-xs ${currentRate.shipmentType === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                >
                                  {option.label}
                                </button>
                              ))}
                    </div>
                          )}
                  </div>
                      </div>
                    </div>
                    {/* Unified conditional for Edit Rate modal fields */}
                    {((currentRate.shipmentType === 'LCL') || (currentRate.shipmentType === 'LTL') || (currentRate.mode === 'air')) ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Rate Per CBM / KG</label>
                          <input type="text" name="ratePerCbmKg" value={currentRate.ratePerCbmKg || ''} onChange={handleInputChange} placeholder="e.g. $20 per CBM or $3.5/kg" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Currency</label>
                          <div className="relative">
                            <button
                              type="button"
                              ref={editCurrencyButtonRef}
                              onClick={() => setShowEditCurrencyDropdown((v) => !v)}
                              className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                              {currencyOptions.find(opt => opt.value === currentRate.currency)?.label || 'Select currency'}
                              <ChevronDown className={`w-4 h-4 transition-transform ${showEditCurrencyDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {showEditCurrencyDropdown && (
                              <div ref={editCurrencyDropdownRef} className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-1">
                                {currencyOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                      setCurrentRate(prev => ({
                                        ...prev!,
                                        currency: option.value
                                      }));
                                      setShowEditCurrencyDropdown(false);
                                    }}
                                    className={`w-full text-left p-2 hover:bg-gray-50 rounded text-xs ${currentRate.currency === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Weight Range (kg)</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="number"
                              name="weightMin"
                              value={currentRate.weightMin}
                              onChange={handleInputChange}
                              placeholder="Min"
                              className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              inputMode="numeric"
                              pattern="[0-9]*"
                            />
                            <span>-</span>
                            <input
                              type="number"
                              name="weightMax"
                              value={currentRate.weightMax}
                              onChange={handleInputChange}
                              placeholder="Max"
                              className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              inputMode="numeric"
                              pattern="[0-9]*"
                            />
                            <div className="relative inline-block" ref={editWeightUnitRef}>
                              <button
                                type="button"
                                onClick={() => setShowEditWeightUnitDropdown((v) => !v)}
                                className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50"
                              >
                                {currentRate.weightUnit || 'kg'}
                              </button>
                              {showEditWeightUnitDropdown && (
                                <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded shadow-lg">
                                  {weightUnitOptions.map(opt => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => {
                                        setCurrentRate(prev => ({ ...prev!, weightUnit: opt.value }));
                                        setShowEditWeightUnitDropdown(false);
                                      }}
                                      className={`block w-full text-left px-4 py-3 text-xs ${currentRate.weightUnit === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Volume Range (cbm)</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="number"
                              name="volumeMin"
                              value={currentRate.volumeMin}
                              onChange={handleInputChange}
                              placeholder="Min"
                              className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              inputMode="numeric"
                              pattern="[0-9]*"
                            />
                            <span>-</span>
                            <input
                              type="number"
                              name="volumeMax"
                              value={currentRate.volumeMax}
                              onChange={handleInputChange}
                              placeholder="Max"
                              className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              inputMode="numeric"
                              pattern="[0-9]*"
                            />
                            <div className="relative inline-block" ref={editVolumeUnitRef}>
                              <button
                                type="button"
                                onClick={() => setShowEditVolumeUnitDropdown((v) => !v)}
                                className="ml-2 px-2 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50"
                              >
                                {currentRate.volumeUnit || 'cbm'}
                              </button>
                              {showEditVolumeUnitDropdown && (
                                <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded shadow-lg">
                                  {volumeUnitOptions.map(opt => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => {
                                        setCurrentRate(prev => ({ ...prev!, volumeUnit: opt.value }));
                                        setShowEditVolumeUnitDropdown(false);
                                      }}
                                      className={`block w-full text-left px-4 py-3 text-xs ${currentRate.volumeUnit === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Price Range</label>
                          <input type="text" name="price" value={currentRate.price} onChange={handleInputChange} placeholder="e.g. $2,100 - $2,800" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                      </div>
                    ) : ((currentRate.shipmentType === 'FCL') || (currentRate.shipmentType === 'FTL')) && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            {currentRate.shipmentType === 'FCL' ? 'Container Type' : 'Truck Type'}
                          </label>
                          {currentRate.shipmentType === 'FCL' ? (
                            <div className="relative">
                              <button
                                type="button"
                                ref={editContainerTypeButtonRef}
                                onClick={() => setShowEditContainerTypeDropdown((v) => !v)}
                                className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              >
                                {containerTypeOptions.find(opt => opt.value === currentRate.containertype)?.label || 'Select container type'}
                                <ChevronDown className={`w-4 h-4 transition-transform ${showEditContainerTypeDropdown ? 'rotate-180' : ''}`} />
                              </button>
                              {showEditContainerTypeDropdown && (
                                <div ref={editContainerTypeDropdownRef} className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-1">
                                  {containerTypeOptions.map((option) => (
                                    <button
                                      key={option.value}
                                      type="button"
                                      onClick={() => {
                                        setCurrentRate(prev => ({ ...prev!, containertype: option.value }));
                                        setShowEditContainerTypeDropdown(false);
                                      }}
                                      className={`w-full text-left p-2 hover:bg-gray-50 rounded text-xs ${currentRate.containertype === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                    >
                                      {option.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <input
                              type="text"
                              name="containertype"
                              value={currentRate.containertype}
                              onChange={handleInputChange}
                              placeholder="e.g. 6-Wheel, 10-Wheel, Wingbox, etc."
                              className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Base Rate</label>
                          <input type="number" name="baseRate" value={currentRate.baseRate} onChange={handleInputChange} placeholder={currentRate.mode === 'truck' ? 'e.g. 1500' : 'e.g. 2000'} className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Price Range</label>
                          <input type="text" name="price" value={currentRate.price} onChange={handleInputChange} placeholder="e.g. $2,100 - $2,800" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Currency</label>
                          <div className="relative">
                            <button
                              type="button"
                              ref={editCurrencyButtonRef}
                              onClick={() => setShowEditCurrencyDropdown((v) => !v)}
                              className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                              {currencyOptions.find(opt => opt.value === currentRate.currency)?.label || 'Select currency'}
                              <ChevronDown className={`w-4 h-4 transition-transform ${showEditCurrencyDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {showEditCurrencyDropdown && (
                              <div ref={editCurrencyDropdownRef} className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-1">
                                {currencyOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                      setCurrentRate(prev => ({
                                        ...prev!,
                                        currency: option.value
                                      }));
                                      setShowEditCurrencyDropdown(false);
                                    }}
                                    className={`w-full text-left p-2 hover:bg-gray-50 rounded text-xs ${currentRate.currency === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Max Weight</label>
                          <div className="relative flex items-center">
                            <input
                              type="number"
                              name="weight"
                              value={currentRate.weight}
                              onChange={handleInputChange}
                              placeholder="e.g. 26000"
                              className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              inputMode="numeric"
                              pattern="[0-9]*"
                            />
                            <div className="relative inline-block" ref={editWeightUnitRef}>
                              <button
                                type="button"
                                onClick={() => setShowEditWeightUnitDropdown((v) => !v)}
                                className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50"
                              >
                                {currentRate.weightUnit || 'kg'}
                              </button>
                              {showEditWeightUnitDropdown && (
                                <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded shadow-lg">
                                  {weightUnitOptions.map(opt => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => {
                                        setCurrentRate(prev => ({ ...prev!, weightUnit: opt.value }));
                                        setShowEditWeightUnitDropdown(false);
                                      }}
                                      className={`block w-full text-left px-4 py-3 text-xs ${currentRate.weightUnit === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Max Volume</label>
                          <div className="relative flex items-center">
                            <input
                              type="number"
                              name="volume"
                              value={currentRate.volume}
                              onChange={handleInputChange}
                              placeholder="e.g. 67"
                              className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              inputMode="numeric"
                              pattern="[0-9]*"
                            />
                            <div className="relative inline-block" ref={editVolumeUnitRef}>
                              <button
                                type="button"
                                onClick={() => setShowEditVolumeUnitDropdown((v) => !v)}
                                className="ml-2 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 bg-white hover:bg-gray-50"
                              >
                                {currentRate.volumeUnit || 'cbm'}
                              </button>
                              {showEditVolumeUnitDropdown && (
                                <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded shadow-lg">
                                  {volumeUnitOptions.map(opt => (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => {
                                        setCurrentRate(prev => ({ ...prev!, volumeUnit: opt.value }));
                                        setShowEditVolumeUnitDropdown(false);
                                      }}
                                      className={`block w-full text-left px-4 py-3 text-xs ${currentRate.volumeUnit === opt.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-gray-200"></div>
                  {/* Additional Requirements */}
                  <div>
                    <div className="-mt-2 mb-2 text-xs font-semibold text-gray-900 uppercase tracking-wide">Additional Requirements</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Incoterm</label>
                    <div className="relative">
                      <button
                        type="button"
                            ref={editIncotermButtonRef}
                            onClick={() => setShowEditIncotermDropdown((v) => !v)}
                        className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                            {incotermOptions.find(opt => opt.value === currentRate.incoterm)?.label || 'Select incoterm'}
                            <ChevronDown className={`w-4 h-4 transition-transform ${showEditIncotermDropdown ? 'rotate-180' : ''}`} />
                      </button>
                          {showEditIncotermDropdown && (
                            <div ref={editIncotermDropdownRef} className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full mt-1">
                              {incotermOptions.map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setCurrentRate(prev => ({
                                  ...prev!,
                                      incoterm: option.value
                                }));
                                    setShowEditIncotermDropdown(false);
                              }}
                                  className={`w-full text-left p-2 hover:bg-gray-50 rounded text-xs ${currentRate.incoterm === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Transit Time</label>
                        <input type="text" name="transitTime" value={currentRate.transitTime} onChange={handleInputChange} placeholder="e.g. 18-22 days" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>             
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Valid From</label>
                        <input type="date" name="validFrom" value={currentRate.validFrom} onChange={handleInputChange} className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Valid Until</label>
                        <input type="date" name="validTo" value={currentRate.validTo} onChange={handleInputChange} className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">Surcharges {/* Tooltip as before */}</label>
                        <textarea name="surcharges" value={currentRate.surcharges} onChange={handleInputChange} placeholder="e.g. BAF: $150, CAF: $200" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={2}></textarea>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                        <textarea name="notes" value={currentRate.notes} onChange={handleInputChange} placeholder="e.g. Peak season surcharge may apply" className="w-full px-3 py-2 border text-xs text-gray-900 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3}></textarea>
                      </div>
                    </div>
                  </div>
                </div>             
                <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
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

      {/* Quote Confirmation Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-lg text-gray-900 font-semibold mb-4">Post Rate</h2>
            <div>
              <div className="text-sm text-gray-700 mb-2">Are you sure you want to post this rate?</div>
              {selectedRates.length === 1 && (() => {
                const rate = rates.find(r => r.id === selectedRates[0]);
                if (!rate) return null;
                const key = `${rate.lane}|${rate.mode}|${rate.containertype}|${rate.carrier}`;
                const isDuplicate = quoteKeys.includes(key);
                return (
                  <>
                    <div className="mb-2">
                      <div className="text-sm text-gray-900 font-medium">{rate.lane}</div>
                      <div className="text-sm text-gray-700">{rate.mode} • {rate.containertype} • {rate.carrier}</div>
                      <div className="text-sm text-gray-700">{rate.currency} {rate.price}</div>
                      {isDuplicate && (
                        <div className="text-sm text-red-600 mt-2">⚠️ This rate already exists in the quote table</div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => setShowQuoteModal(false)}
                        className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      {!isDuplicate && (
                        <button
                          onClick={() => {
                            addQuote({
                              id: `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
                              lane: rate.lane,
                              mode: rate.mode,
                              containertype: rate.containertype,
                              currency: rate.currency,
                              baseRate: rate.baseRate,
                              price: rate.price,
                              transitTime: rate.transitTime,
                              carrier: rate.carrier,
                              validity: `Valid until ${rate.validTo}`,
                              status: 'draft',
                            });
                            setQuoteSuccess(true);
                            setTimeout(() => setQuoteSuccess(false), 2000);
                            setShowQuoteModal(false);
                            setSelectedRates([]);
                          }}
                          className="px-5 py-2 text-sm font-semibold text-white bg-[#007bff] rounded-lg hover:bg-blue-700 focus:outline-none"
                        >
                          Post Rate
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal after posting quote */}
      {quoteSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-xs w-full p-6 flex flex-col items-center">
            <div className="mb-4 flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </span>
            </div>
            <div className="text-base font-semibold text-gray-800 mb-1 text-center">Your rate is posted in the quote table</div>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-4">Remove Rates</h2>
            <div className="mb-4">
              <div className="text-sm text-gray-700 mb-2">Are you sure you want to remove the following rates?</div>
              <ul className="mb-2">
                {selectedRates.map(id => {
                  const rate = rates.find(r => r.id === id);
                  if (!rate) return null;
                  return (
                    <li key={id} className="flex items-center gap-2 text-sm text-gray-900 uppercase">{rate.lane}</li>
                  );
                })}
              </ul>
                </div>             
            <div className="flex justify-end gap-2 mt-4">
                  <button
                onClick={() => setShowRemoveModal(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button 
                onClick={() => {
                  selectedRates.forEach(id => deleteRate(id));
                  setShowRemoveModal(false);
                  setSelectedRates([]);
                }}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none"
              >
                Remove
                  </button>
            </div>
          </div>
        </div>
      )}

      {/* Rate Parser Modal */}
      {showRateParser && (
        <RateParser
          onRatesParsed={(parsedRates) => {
            parsedRates.forEach(rate => addRate(rate));
            setShowRateParser(false);
          }}
          onClose={() => setShowRateParser(false)}
        />
      )}
    </div>
  );
};

export default RateTable;

function setShowColumnDropdown(arg0: boolean) {
  throw new Error('Function not implemented.');
}


