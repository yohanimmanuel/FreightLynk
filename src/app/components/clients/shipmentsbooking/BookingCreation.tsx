import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, ChevronUp, Package, Users, Truck, MapPin, Target, Scale, FileText, Tag, MessageSquare, Info, Plus, X, Trash2 } from 'lucide-react';
import POSummaryTable from '../purchasesorders/POSummaryTable';
import POManagementTable from '../purchasesorders/POManagementTable';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactDOM from 'react-dom';
import { useBookingStore } from '@/store/bookingStore';
import { usePOStore } from '@/store/poStore';

interface BookingCreationProps {
  onSubmitBooking: () => void;
  formData?: any;
  setFormData?: (data: any) => void;
  selectedPOs?: any[];
  setSelectedPOs?: (data: any[]) => void;
  tradeRole?: 'shipper' | 'consignee';
  setTradeRole?: (role: 'shipper' | 'consignee') => void;
}

// Dropdown component
const Dropdown: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  dropdownKey: string;
  openDropdown: string | null;
  setOpenDropdown: (key: string | null) => void;
}> = ({ options, value, placeholder, onChange, dropdownKey, openDropdown, setOpenDropdown }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{top: number, left: number, width: number} | null>(null);

  const isOpen = openDropdown === dropdownKey;
  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown on outside click or scroll
  useEffect(() => {
    const handleClickOrScroll = (event: MouseEvent | Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains((event as MouseEvent).target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains((event as MouseEvent).target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOrScroll);
      window.addEventListener('scroll', handleClickOrScroll, true);
    }

    return () => {
      document.removeEventListener('click', handleClickOrScroll);
      window.removeEventListener('scroll', handleClickOrScroll, true);
    };
  }, [isOpen, setOpenDropdown]);

  // Position dropdown below button
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const handleButtonClick = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setOpenDropdown(isOpen ? null : dropdownKey);
  };

  // Dropdown content
  const dropdownContent = isOpen && dropdownPos
    ? ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 transition-all duration-200 opacity-100 scale-100"
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            minWidth: 120,
          }}
        >
          <div className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpenDropdown(null);
                }}
                className={`block w-full text-left px-4 py-3 text-xs ${
                  value === option.value
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        type="button"
        className={`flex items-center justify-between w-full pl-3 pr-8 py-3 text-xs text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          !selectedOption ? 'text-gray-500' : ''
        }`}
      >
        {displayValue}
        <ChevronDown
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {dropdownContent}
    </div>
  );
};

const BookingCreation: React.FC<BookingCreationProps> = ({ onSubmitBooking }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Use Zustand selectors for reactive state
  const formData = useBookingStore(state => state.formData);
  const setFormData = useBookingStore(state => state.setFormData);
  const selectedPOs = useBookingStore(state => state.selectedPOs);
  const setSelectedPOs = useBookingStore(state => state.setSelectedPOs);
  const tradeRole = useBookingStore(state => state.tradeRole);
  const setTradeRole = useBookingStore(state => state.setTradeRole);
  const clearBooking = useBookingStore(state => state.clearBooking);
  
  // State management
  const [showPOSelection, setShowPOSelection] = useState(false);
  const [showPOReview, setShowPOReview] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [requireFields, setRequireFields] = useState(true);
  const lastAutoPOString = useRef('');

  // Previous shipments data
  const [previousShipments] = useState([
    { id: 'SH001', name: 'PO 1001 - Electronics', date: '2024-01-15' },
    { id: 'SH002', name: 'PO 1002 - Textiles', date: '2024-01-20' }
  ]);

  // Debug log for selectedPOs
  useEffect(() => {
    console.log('selectedPOs state:', selectedPOs);
  }, [selectedPOs]);

  // Auto-fill shipment name with PO numbers when selectedPOs changes
  useEffect(() => {
    const poString = selectedPOs.length > 0
      ? selectedPOs.map(po => `PO ${po.poId.replace(/^PO ?/, '')}`).join(', ')
      : '';
    setFormData({ shipmentName: poString });
    console.log('Force-updating shipmentName to:', poString);
  }, [selectedPOs]);

  // Helper function to format date for input
  const formatDateForInput = (displayDate: string): string => {
    if (!displayDate || displayDate === '--') return '';
    const months: Record<string, string> = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
      Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };
    try {
      const [month, day, year] = displayDate.replace(',', '').split(' ');
      return `${year}-${months[month]}-${day.padStart(2, '0')}`;
    } catch {
      return '';
    }
  };

  // Update handleInputChange to use setFormData from the store
  const handleInputChange = (field: string, value: string | boolean | any[]) => {
    // If transport mode is changing, reset shipment type and related fields
    if (field === 'transportModeValue') {
      const updatedFormData = {
        ...formData,
        [field]: value,
        // Reset shipment type when transport mode changes
        shipmentTypeValue: '',
        // Reset container/truck related fields
        containerTypeValue: '',
        containerQuantity: '',
        truckType: '',
        truckQuantity: '',
        truckTypes: [],
        containerTypes: []
      };
      setFormData(updatedFormData);
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  // Handle edit order
  const handleEditOrder = (poId: string) => {
    const selectedPO = purchaseOrders.find(po => po.id === poId);
    if (!selectedPO) return;

    const poItems = poDetails.filter(
      item => item.poOrderNumber === poId.replace('PO', '')
    );

    // Format dates properly for the form
    const cargoReadyDate = selectedPO.cargoReadyBy || poItems[0]?.cargoReadyDate || '';
    const mustArriveDate = selectedPO.mustArriveBy || poItems[0]?.mustArriveDate || '';

    console.log('Original dates:', {
      cargoReadyBy: selectedPO.cargoReadyBy,
      mustArriveBy: selectedPO.mustArriveBy,
      itemCRD: poItems[0]?.cargoReadyDate,
      itemMABD: poItems[0]?.mustArriveDate
    });

    const poData = {
      ...selectedPO,
      // Ensure these are properly formatted as YYYY-MM-DD for the date inputs
      cargoReadyBy: cargoReadyDate,
      mustArriveBy: mustArriveDate,
      items: poItems.map(item => ({
        ...item,
        cargoReadyDate: item.cargoReadyDate, 
        mustArriveDate: item.mustArriveDate
      }))
    };

    console.log('Storing PO data in sessionStorage:', poData);
    console.log('Date fields being stored:', {
      cargoReadyBy: poData.cargoReadyBy,
      mustArriveBy: poData.mustArriveBy
    });

    // Store PO data and return URL for booking creation context
    sessionStorage.setItem('currentPO', JSON.stringify(poData));
    sessionStorage.setItem('returnToBookingCreation', 'true');
    router.push(`/orders/details?poId=${poId}`);
  };

  // Get selected PO details
  const getSelectedPODetails = () => {
    const details = selectedPOs
      .map(poSelection => {
        const po = purchaseOrders.find(p => p.id === poSelection.poId);
        if (!po) return null;
        const poNum = poSelection.poId.replace('PO', '');
        const items = poDetails.filter(item =>
          poSelection.selectedItems.includes(item.id) &&
          item.poOrderNumber === poNum
        ).map(item => ({
          ...item,
          poOrderNumber: poNum,
          booked: poSelection.bookedQuantities[item.id] || 0
        })).filter(item => item.booked > 0);
        return { po, items, selection: poSelection };
      })
      .filter((data): data is NonNullable<typeof data> => data !== null && data.items.length > 0);
    console.log('getSelectedPODetails:', details);
    return details;
  };

  // Validation for required fields
  const validateForm = () => {
    if (!requireFields) {
      setErrors({});
      return true;
    }
    const newErrors: { [key: string]: string } = {};
    // PO Data
    if (!selectedPOs.length) newErrors.selectedPOs = 'At least one purchase order is required.';
    // Shipment Name
    if (!formData.shipmentName.trim()) newErrors.shipmentName = 'Shipment name is required.';
    // Involved Parties
    if (!formData.shipperValue) newErrors.shipperValue = 'Shipper is required.';
    if (!formData.consigneeValue) newErrors.consigneeValue = 'Consignee is required.';
    // Transport Details
    if (!formData.transportModeValue) newErrors.transportModeValue = 'Transport mode is required.';
    if (!formData.shipmentTypeValue) newErrors.shipmentTypeValue = 'Shipment type is required.';
    if (!formData.incotermsValue) newErrors.incotermsValue = 'Incoterms is required.';
    
    // Validate truck types for FTL
    if (formData.transportModeValue === 'land' && formData.shipmentTypeValue === 'ftl') {
      if (!formData.truckTypes || formData.truckTypes.length === 0) {
        newErrors.truckTypes = 'At least one truck type is required for FTL.';
      } else {
        const invalidTruckTypes = formData.truckTypes.some((truckType: any) => 
          !truckType.type.trim() || !truckType.quantity || truckType.quantity <= 0
        );
        if (invalidTruckTypes) {
          newErrors.truckTypes = 'All truck types must have both type and quantity specified.';
        }
      }
    }
    
    // Validate container types for FCL
    if (formData.shipmentTypeValue === 'fcl') {
      if (!formData.containerTypes || formData.containerTypes.length === 0) {
        newErrors.containerTypes = 'At least one container type is required for FCL.';
      } else {
        const invalidContainerTypes = formData.containerTypes.some((containerType: any) => 
          !containerType.type.trim() || !containerType.quantity || containerType.quantity <= 0
        );
        if (invalidContainerTypes) {
          newErrors.containerTypes = 'All container types must have both type and quantity specified.';
        }
      }
    }
    // Origin
    if (!formData.originLocation.trim()) newErrors.originLocation = 'Origin location is required.';
    if (!formData.originPort.trim()) newErrors.originPort = 'Origin port is required.';
    if (!formData.cargoReadyDate) newErrors.cargoReadyDate = 'Cargo ready date is required.';
    // Destination
    if (!formData.destinationLocation.trim()) newErrors.destinationLocation = 'Destination location is required.';
    if (!formData.destinationPort.trim()) newErrors.destinationPort = 'Destination port is required.';
    if (!formData.targetDeliveryDate) newErrors.targetDeliveryDate = 'Target delivery date is required.';
    // Product & Compliance
    if (!formData.productName.trim()) newErrors.productName = 'Product name is required.';
    if (!formData.hsCode.trim()) newErrors.hsCode = 'HS code is required.';
    // Cargo/Load Specs
    if (!formData.weight.trim()) newErrors.weight = 'Weight is required.';
    if (!formData.volume.trim()) newErrors.volume = 'Volume is required.';
    if (!formData.packageCount.trim()) newErrors.packageCount = 'Package count is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // On submit, just call onSubmitBooking (data is already in the store)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    let updatedFormData = { ...formData };
    if (formData.shipmentTypeValue === 'lcl') {
      updatedFormData = {
        ...updatedFormData,
        containerTypeValue: '-',
        containerType: '-',
      };
      setFormData(updatedFormData);
    }
    if (validateForm()) {
      onSubmitBooking();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('bookingSubmitted');
    }
  }, []);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      clearBooking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('Input value:', formData.shipmentName);

  // Add useEffect to auto-set shipmentTypeValue to 'lcl' when Air Freight is selected
  useEffect(() => {
    if (formData.transportModeValue === 'air' && formData.shipmentTypeValue !== 'lcl') {
      setFormData({ ...formData, shipmentTypeValue: 'lcl' });
    }
  }, [formData.transportModeValue]);

  const purchaseOrders = usePOStore(state => state.purchaseOrders);
  const poDetails = usePOStore(state => state.poDetails);
  const fetchPurchaseOrders = usePOStore(state => state.fetchPurchaseOrders);
  const fetchPODetails = usePOStore(state => state.fetchPODetails);

  // Load purchase orders on component mount
  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  // Load PO details for available purchase orders
  useEffect(() => {
    const loadPODetails = async () => {
      for (const po of purchaseOrders) {
        try {
          await fetchPODetails(po.id);
        } catch (error) {
          console.error('Failed to fetch PO details for', po.id, error);
        }
      }
    };

    if (purchaseOrders.length > 0) {
      loadPODetails();
    }
  }, [purchaseOrders, fetchPODetails]);

  return (
    <div className="max-w-4xl mx-auto p-2 bg-white">
      <div className="mb-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Booking</h1>
        <p className="text-gray-600 text-sm">Fill in the details below to create a new freight booking</p>
      </div>

      <div className="space-y-6">
        {/* Pre-fill Booking */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-4 font-semibold text-sm text-gray-900 border-b border-gray-200 pb-2">Pre-fill your booking</div>
          <p className="text-xs text-gray-700 mb-3">Start this booking from a template or previous shipment</p>
          {previousShipments.length > 0 ? (
            <div className="space-y-2">
              <Dropdown
                value={formData.prefillValue}
                onChange={(value) => handleInputChange('prefillValue', value)}
                options={previousShipments.map(s => ({ 
                  value: s.id, 
                  label: `${s.name} - ${s.date}` 
                }))}
                placeholder="Select a previous shipment to pre-fill"
                dropdownKey="prefill"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />   
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
                <Info className="w-4 h-4" />
                <span>Speed up the process by loading info from a past booking</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No previous shipments available to pre-fill data</p>
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-4 font-medium text-sm text-gray-900 border-b border-gray-200 pb-2 flex justify-between items-center">
            <span className="text-gray-900 font-semibold">Purchase Orders</span>
            <button
              onClick={() => setShowPOSelection(true)}
              className="px-3 py-1 text-xs text-[#007bff] hover:bg-blue-50 border border-[#007bff] rounded"
            >
              + Add PO
            </button>
          </div>
          {hasSubmitted && errors.selectedPOs && (
            <div className="text-xs text-red-500 mb-2">{errors.selectedPOs}</div>
          )}
          <POSummaryTable
            selectedPOs={selectedPOs}
            purchaseOrdersData={purchaseOrders}
            poDetailsData={poDetails}
            onRemovePO={(poId) => {
              const updated = selectedPOs.filter((sel: any) => sel.poId !== poId);
              setSelectedPOs(updated);
            }}
          />
        </div>

        {/* Shipment Name */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            Shipment Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.shipmentName || ""}
            onChange={(e) => handleInputChange('shipmentName', e.target.value)}
            className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.shipmentName ? 'border-red-500' : ''}`}
            placeholder="Enter shipment name for easy recognition"
          />
          {hasSubmitted && errors.shipmentName && (
            <p className="text-xs text-red-500 mt-1">{errors.shipmentName}</p>
          )}
        </div>

        {/* Involved Parties */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-4 font-semibold text-sm text-gray-900 border-b border-gray-200 pb-2">Involved Parties</div>
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setTradeRole('shipper')}
              className={`px-5 py-2 text-xs border rounded-lg ${tradeRole === 'shipper' ? 'bg-[#007bff] text-white border-[#007bff]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Shipper
            </button>
            <button
              type="button"
              onClick={() => setTradeRole('consignee')}
              className={`px-5 py-2 text-xs border rounded-lg ${tradeRole === 'consignee' ? 'bg-[#007bff] text-white border-[#007bff]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Consignee
            </button>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Shipper <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  list="shipper-options"
                  type="text"
                  value={formData.shipperValue}
                  onChange={e => handleInputChange('shipperValue', e.target.value)}
                  className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.shipperValue ? 'border-red-500' : ''}`}
                  placeholder="Select or enter shipper company"
                />
                <button
                  type="button"
                  className="w-40 px-4 py-3 text-xs bg-[#007bff] text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-1"
                  // onClick={...} // Placeholder for add new shipper logic
                >
                  <Plus className="w-3 h-3" />
                  <span>New Shipper</span>
                </button>
              </div>
              <datalist id="shipper-options">
                <option value="Studio Apparel" />
                <option value="Global Trade Co" />
                <option value="Forward Supply Co" />
                <option value="Logistics Hub" />
              </datalist>
              {hasSubmitted && errors.shipperValue && (
                <p className="text-xs text-red-500 mt-1">{errors.shipperValue}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Consignee <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  list="consignee-options"
                  type="text"
                    value={formData.consigneeValue}
                  onChange={e => handleInputChange('consigneeValue', e.target.value)}
                  className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.consigneeValue ? 'border-red-500' : ''}`}
                  placeholder="Select or enter consignee company"
                  />
                <button
                  type="button"
                  className="w-50 px-4 py-3 text-xs bg-[#007bff] text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-1"
                  // onClick={...} // Placeholder for add new consignee logic
                >
                  <Plus className="w-3 h-3" />
                  <span>New Consignee</span>
                </button>
              </div>
              <datalist id="consignee-options">
                <option value="Studio Apparel" />
                <option value="Global Trade Co" />
                <option value="Forward Supply Co" />
                <option value="Logistics Hub" />
              </datalist>
              {hasSubmitted && errors.consigneeValue && (
                <p className="text-xs text-red-500 mt-1">{errors.consigneeValue}</p>
              )}
            </div>
          </div>
        </div>

        {/* Transportation Details */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-4 font-semibold text-sm text-gray-900 border-b border-gray-200 pb-2">Transportation Details</div>
          <div className="grid grid-cols-1 gap-4">
            {/* Freight Method */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Freight Method <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {['sea', 'air', 'land'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`flex-1 px-4 py-3 text-xs border rounded-lg transition-colors
                      ${formData.transportModeValue === method ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => handleInputChange('transportModeValue', method)}
                  >
                    {method === 'sea' && 'Ocean Freight'}
                    {method === 'air' && 'Air Freight'}
                    {method === 'land' && 'Truck'}
                  </button>
                ))}
              </div>
              {hasSubmitted && errors.transportModeValue && (
                <p className="text-xs text-red-500 mt-1">{errors.transportModeValue}</p>
              )}
            </div>
            {/* Shipment Type */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Shipment Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {formData.transportModeValue === 'land' ? (
                  ['ftl', 'ltl'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`flex-1 px-4 py-3 text-xs border rounded-lg transition-colors
                        ${formData.shipmentTypeValue === type ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => handleInputChange('shipmentTypeValue', type)}
                    >
                      {type === 'ftl' ? 'FTL' : 'LTL'}
                    </button>
                  ))
                ) : (
                  ['fcl', 'lcl'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    disabled={formData.transportModeValue === 'air' && type === 'fcl'}
                    className={`flex-1 px-4 py-3 text-xs border rounded-lg transition-colors
                      ${formData.shipmentTypeValue === type ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
                      ${formData.transportModeValue === 'air' && type === 'fcl' ? 'opacity-50 cursor-not-allowed' : ''}
                      ${formData.transportModeValue === 'air' && type === 'lcl' ? 'font-bold' : ''}`}
                    onClick={() => handleInputChange('shipmentTypeValue', type)}
                  >
                    {type === 'fcl' ? 'FCL' : 'LCL'}
                  </button>
                  ))
                )}
              </div>
              {hasSubmitted && errors.shipmentTypeValue && (
                <p className="text-xs text-red-500 mt-1">{errors.shipmentTypeValue}</p>
              )}
            </div>
            {/* Truck Types and Quantities for FTL */}
            {formData.transportModeValue === 'land' && formData.shipmentTypeValue === 'ftl' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-gray-700">
                    Truck Types & Quantities <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const newTruckType = {
                        id: Date.now(),
                        type: '',
                        quantity: ''
                      };
                      const updatedTruckTypes = [...(formData.truckTypes || []), newTruckType];
                      handleInputChange('truckTypes', updatedTruckTypes);
                    }}
                    className="flex items-center gap-1 px-4 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus size={12} />
                    Add Truck Type
                  </button>
                </div>
                
                {(formData.truckTypes || []).length === 0 ? (
                  <div className="text-xs text-gray-500 italic">No truck types added yet. Click "Add Truck Type" to add one.</div>
                ) : (
                  <div className="space-y-2">
                    {(formData.truckTypes || []).map((truckType: any, index: number) => (
                      <div key={truckType.id} className="flex gap-2 items-center">
                        <div className="w-24">
                          <input
                            type="number"
                            min="1"
                            value={truckType.quantity || ''}
                            onChange={(e) => {
                              const updatedTruckTypes = [...(formData.truckTypes || [])];
                              updatedTruckTypes[index].quantity = e.target.value;
                              handleInputChange('truckTypes', updatedTruckTypes);
                            }}
                            className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.truckQuantity ? 'border-red-500' : ''}`}
                            placeholder="Qty"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={truckType.type || ''}
                            onChange={(e) => {
                              const updatedTruckTypes = [...(formData.truckTypes || [])];
                              updatedTruckTypes[index].type = e.target.value;
                              handleInputChange('truckTypes', updatedTruckTypes);
                            }}
                            className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.truckType ? 'border-red-500' : ''}`}
                            placeholder="Enter truck type (e.g. Flatbed, Reefer, etc.)"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedTruckTypes = (formData.truckTypes || []).filter((_: any, i: number) => i !== index);
                            handleInputChange('truckTypes', updatedTruckTypes);
                          }}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {hasSubmitted && errors.truckTypes && (
                  <p className="text-xs text-red-500 mt-1">{errors.truckTypes}</p>
                )}
              </div>
            )}
            {/* Container Types and Quantities for FCL, Cargo & Load Specs for LCL/LTL */}
            {formData.transportModeValue === 'land' && formData.shipmentTypeValue === 'ltl' ? (
              <div className="text-xs text-gray-600 mt-3 mb-2">
                Specify your cargo & load details below for consolidation and handling.
              </div>
            ) : formData.shipmentTypeValue === 'lcl' ? (
              <div className="text-xs text-gray-600 mt-3 mb-2">
                Specify your cargo & load details below for consolidation and handling.
              </div>
            ) : (
              formData.shipmentTypeValue === 'fcl' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-gray-700">
                      Container Types & Quantities <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newContainerType = {
                          id: Date.now(),
                          type: '',
                          quantity: ''
                        };
                        const updatedContainerTypes = [...(formData.containerTypes || []), newContainerType];
                        handleInputChange('containerTypes', updatedContainerTypes);
                      }}
                      className="flex items-center gap-1 px-4 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus size={12} />
                      Add Container Type
                    </button>
                  </div>
                  
                  {(formData.containerTypes || []).length === 0 ? (
                    <div className="text-xs text-gray-500 italic">No container types added yet. Click "Add Container Type" to add one.</div>
                  ) : (
                    <div className="space-y-2">
                      {(formData.containerTypes || []).map((containerType: any, index: number) => (
                        <div key={containerType.id} className="flex gap-2 items-center">
                          <div className="w-20">
                            <input
                              type="number"
                              min="1"
                              value={containerType.quantity || ''}
                              onChange={(e) => {
                                const updatedContainerTypes = [...(formData.containerTypes || [])];
                                updatedContainerTypes[index].quantity = e.target.value;
                                handleInputChange('containerTypes', updatedContainerTypes);
                              }}
                              className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.containerQuantity ? 'border-red-500' : ''}`}
                              placeholder="Qty"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex gap-2">
                              {['20ft', '40ft', '40ft-hc', '45ft-hc'].map((type) => (
                                <button
                                  key={type}
                                  type="button"
                                  className={`flex-1 px-3 py-3 text-xs border rounded-lg transition-colors
                                    ${containerType.type === type ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                  onClick={() => {
                                    const updatedContainerTypes = [...(formData.containerTypes || [])];
                                    updatedContainerTypes[index].type = type;
                                    handleInputChange('containerTypes', updatedContainerTypes);
                                  }}
                                >
                                  {type === '20ft' && '20 ft'}
                                  {type === '40ft' && '40 ft'}
                                  {type === '40ft-hc' && '40 ft HC'}
                                  {type === '45ft-hc' && '45 ft HC'}
                                </button>
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedContainerTypes = (formData.containerTypes || []).filter((_: any, i: number) => i !== index);
                              handleInputChange('containerTypes', updatedContainerTypes);
                            }}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {hasSubmitted && errors.containerTypes && (
                    <p className="text-xs text-red-500 mt-1">{errors.containerTypes}</p>
                  )}
                </div>
              )
            )}
            {/* Incoterms (dropdown) */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Incoterms <span className="text-red-500">*</span>
              </label>
              <Dropdown
                value={formData.incotermsValue}
                onChange={(value) => handleInputChange('incotermsValue', value)}
                options={[
                  { value: 'FOB', label: 'FOB - Free on Board' },
                  { value: 'EXW', label: 'EXW - Ex Works' },
                  { value: 'DDP', label: 'DDP - Delivered Duty Paid' },
                  { value: 'CIF', label: 'CIF - Cost, Insurance & Freight' },
                  { value: 'DAP', label: 'DAP - Delivered at Place' },
                  { value: 'DPU', label: 'DPU - Delivered at Place Unloaded' },
                  { value: 'FCA', label: 'FCA - Free Carrier' },
                  { value: 'CPT', label: 'CPT - Carriage Paid To' },
                  { value: 'CIP', label: 'CIP - Carriage and Insurance Paid To' },
                  { value: 'CFR', label: 'CFR - Cost and Freight' },
                  { value: 'DDU', label: 'DDU - Delivered Duty Unpaid' },
                  { value: 'Other', label: 'Other' },
                ]}
                placeholder="Select incoterms"
                dropdownKey="incoterms"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
              {hasSubmitted && errors.incotermsValue && (
                <p className="text-xs text-red-500 mt-1">{errors.incotermsValue}</p>
              )}
            </div>
          </div>
        </div>

        {/* Origin */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-4 font-semibold text-sm text-gray-900 border-b border-gray-200 pb-2">Origin</div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Origin Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.originLocation}
                  onChange={(e) => handleInputChange('originLocation', e.target.value)}
                  className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.originLocation ? 'border-red-500' : ''}`}
                  placeholder="Enter origin address"
                />
                {hasSubmitted && errors.originLocation && (
                  <p className="text-xs text-red-500 mt-1">{errors.originLocation}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Origin Port <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.originPort}
                  onChange={(e) => handleInputChange('originPort', e.target.value)}
                  className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.originPort ? 'border-red-500' : ''}`}
                  placeholder="Search ports"
                />
                {hasSubmitted && errors.originPort && (
                  <p className="text-xs text-red-500 mt-1">{errors.originPort}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Cargo Ready Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.cargoReadyDate}
                  onChange={(e) => handleInputChange('cargoReadyDate', e.target.value)}
                  className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.cargoReadyDate ? 'border-red-500' : ''}`}
                />
                {hasSubmitted && errors.cargoReadyDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.cargoReadyDate}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.originCustoms}
                  onChange={(e) => handleInputChange('originCustoms', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">Export customs service required</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.originTrucking}
                  onChange={(e) => handleInputChange('originTrucking', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">Trucking required from origin to port</span>
              </label>
            </div>
          </div>
        </div>

        {/* Destination */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-4 font-semibold text-sm text-gray-900 border-b border-gray-200 pb-2">Destination</div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Destination Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.destinationLocation}
                  onChange={(e) => handleInputChange('destinationLocation', e.target.value)}
                  className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.destinationLocation ? 'border-red-500' : ''}`}
                  placeholder="Enter destination address"
                />
                {hasSubmitted && errors.destinationLocation && (
                  <p className="text-xs text-red-500 mt-1">{errors.destinationLocation}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Destination Port <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.destinationPort}
                  onChange={(e) => handleInputChange('destinationPort', e.target.value)}
                  className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.destinationPort ? 'border-red-500' : ''}`}
                  placeholder="Search ports"
                />
                {hasSubmitted && errors.destinationPort && (
                  <p className="text-xs text-red-500 mt-1">{errors.destinationPort}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Target Delivery Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.targetDeliveryDate}
                  onChange={(e) => handleInputChange('targetDeliveryDate', e.target.value)}
                  className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.targetDeliveryDate ? 'border-red-500' : ''}`}
                />
                {hasSubmitted && errors.targetDeliveryDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.targetDeliveryDate}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.destinationCustoms}
                  onChange={(e) => handleInputChange('destinationCustoms', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">Import customs service required</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.destinationTrucking}
                  onChange={(e) => handleInputChange('destinationTrucking', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">Trucking required from port to destination</span>
              </label>
            </div>
          </div>
        </div>

        {/* Cargo & Load Specs */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-4 font-semibold text-sm text-gray-900 border-b border-gray-200 pb-2">Cargo & Load Specs</div>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.weight ? 'border-red-500' : ''}`}
                placeholder="0"
              />
              {hasSubmitted && errors.weight && (
                <p className="text-xs text-red-500 mt-1">{errors.weight}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Volume (cbm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.volume}
                onChange={(e) => handleInputChange('volume', e.target.value)}
                className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.volume ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {hasSubmitted && errors.volume && (
                <p className="text-xs text-red-500 mt-1">{errors.volume}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Package Count <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.packageCount}
                onChange={(e) => handleInputChange('packageCount', e.target.value)}
                className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.packageCount ? 'border-red-500' : ''}`}
                placeholder="Enter total package count"
              />
              {hasSubmitted && errors.packageCount && (
                <p className="text-xs text-red-500 mt-1">{errors.packageCount}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Package Type</label>
              <Dropdown
                value={formData.packageTypeValue}
                onChange={(value) => handleInputChange('packageTypeValue', value)}
                options={[
                  { value: 'pallet', label: 'Pallet' },
                  { value: 'box', label: 'Box' },
                  { value: 'crate', label: 'Crate' },
                  { value: 'carton', label: 'Carton' }
                ]}
                placeholder="Select package type"
                dropdownKey="packageType"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              rows={3}
              className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.additionalNotes ? 'border-red-500' : ''}`}
              placeholder="Any additional cargo specifications or handling requirements"
            />
            {hasSubmitted && errors.additionalNotes && (
              <p className="text-xs text-red-500 mt-1">{errors.additionalNotes}</p>
            )}
          </div>
        </div>

        {/* Product & Compliance */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-4 font-semibold text-sm text-gray-900 border-b border-gray-200 pb-2">Product & Compliance</div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.productName ? 'border-red-500' : ''}`}
                  placeholder="Enter product name"
                />
                {hasSubmitted && errors.productName && (
                  <p className="text-xs text-red-500 mt-1">{errors.productName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  HS Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.hsCode}
                  onChange={(e) => handleInputChange('hsCode', e.target.value)}
                  className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.hsCode ? 'border-red-500' : ''}`}
                  placeholder="Enter HS code"
                />
                {hasSubmitted && errors.hsCode && (
                  <p className="text-xs text-red-500 mt-1">{errors.hsCode}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Goods Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.goodsDescription}
                onChange={(e) => handleInputChange('goodsDescription', e.target.value)}
                rows={3}
                className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.goodsDescription ? 'border-red-500' : ''}`}
                placeholder="Detailed description of goods (English and Chinese)"
              />
              {hasSubmitted && errors.goodsDescription && (
                <p className="text-xs text-red-500 mt-1">{errors.goodsDescription}</p>
              )}
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dangerousGoods}
                  onChange={(e) => handleInputChange('dangerousGoods', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700">This shipment contains dangerous/hazardous goods</span>
              </label>
            </div>
          </div>
        </div>

        {/* Shipment Tags */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-4 font-semibold text-sm text-gray-900 border-b border-gray-200 pb-2">Shipment Tags</div>
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={formData.requireShipmentTags}
              onChange={(e) => handleInputChange('requireShipmentTags', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-xs text-gray-700">
              My consignee requires shipment tags
            </label>
          </div>

          {formData.requireShipmentTags && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Product PO Number
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-semibold">PO</span>
                <input
                  type="text"
                  value={formData.poNumber}
                  onChange={(e) => handleInputChange('poNumber', e.target.value)}
                  className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.poNumber ? 'border-red-500' : ''}`}
                  placeholder="Enter PO number"
                />
                </div>
                {hasSubmitted && errors.poNumber && (
                  <p className="text-xs text-red-500 mt-1">{errors.poNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  SKU Number
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-semibold">#</span>
                <input
                  type="text"
                  value={formData.skuNumber}
                  onChange={(e) => handleInputChange('skuNumber', e.target.value)}
                  className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.skuNumber ? 'border-red-500' : ''}`}
                  placeholder="Enter SKU number"
                />
                </div>
                {hasSubmitted && errors.skuNumber && (
                  <p className="text-xs text-red-500 mt-1">{errors.skuNumber}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Special Instructions */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-4 font-semibold text-sm text-gray-900 border-b border-gray-200 pb-2">Special Instructions</div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Any special instructions?</label>
            <textarea
              value={formData.specialInstructions}
              onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
              rows={4}
              className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.specialInstructions ? 'border-red-500' : ''}`}
              placeholder="Any additional information, handling notes, or special alerts for this shipment"
            />
            {hasSubmitted && errors.specialInstructions && (
              <p className="text-xs text-red-500 mt-1">{errors.specialInstructions}</p>
            )}
          </div>
        </div>

        {/* Sticky Action Buttons */}
        <div className="bg-white border-t border-gray-200 p-4 flex gap-3 justify-end">
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-3 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Save as Draft
          </button>
          <button
            onClick={handleSubmit}
            type="submit"
            className="flex items-center gap-2 px-5 py-3 font-semibold text-sm bg-[#007bff] text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Booking
          </button>
        </div>
      </div>

      {showPOSelection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Select Purchase Orders</h3>
              <button 
                onClick={() => setShowPOSelection(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-4 text-black">
              <POManagementTable
                mode='standalone'
                onEditOrder={handleEditOrder}
                onCreateBooking={async (bookingData) => {
                  console.log('BookingCreation onCreateBooking called with:', bookingData);
                  
                  const normalized = bookingData.map((poSel: any) => ({
                    ...poSel,
                    bookedQuantities: Object.fromEntries(
                      Object.entries(poSel.bookedQuantities).map(([id, qty]: any) => [id, qty > 0 ? qty : 1]))
                  }));
                  
                  console.log('Normalized booking data:', normalized);
                  console.log('Current selectedPOs:', selectedPOs);
                  
                  // Ensure PO details are loaded for newly selected POs
                  for (const poSel of normalized) {
                    try {
                      await fetchPODetails(poSel.poId);
                    } catch (error) {
                      console.error('Failed to fetch PO details for', poSel.poId, error);
                    }
                  }
                  
                  const existingPOIds = new Set(selectedPOs.map((po: any) => po.poId));
                  const newPOs = normalized.filter((po: any) => !existingPOIds.has(po.poId));
                  const mergedPOs = [...selectedPOs, ...newPOs];
                  
                  console.log('Merged POs to set:', mergedPOs);
                  
                  setSelectedPOs(mergedPOs);
                  setShowPOReview(true);
                  setShowPOSelection(false);
                }}
              />
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setShowPOSelection(false)}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg shadow-sm border border-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`mb-4 px-4 py-2 rounded text-sm font-semibold border ${requireFields ? 'bg-red-100 text-red-700 border-red-300' : 'bg-green-100 text-green-700 border-green-300'}`}
        onClick={() => setRequireFields(v => !v)}
      >
        {requireFields ? 'Turn Off Required Fields' : 'Turn On Required Fields'}
      </button>
    </div>
  );
};

export default BookingCreation;