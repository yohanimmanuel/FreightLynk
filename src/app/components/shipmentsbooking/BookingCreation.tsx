import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, ChevronUp, Package, Users, Truck, MapPin, Target, Scale, FileText, Tag, MessageSquare, Info, Plus, X, Trash2 } from 'lucide-react';
import POManagementTable, { 
  PurchaseOrder, 
  PODetail, 
  purchaseOrdersData, 
  poDetailsData, 
} from '../purchasesorders/POManagementTable';
import { useRouter } from 'next/navigation';
import ReactDOM from 'react-dom';

interface BookingCreationProps {
  onSubmitBooking?: () => void;
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

const BookingCreation: React.FC<BookingCreationProps> = ({ onSubmitBooking = () => {} }) => {
  const router = useRouter();
  
  // State management
  const [showPOSelection, setShowPOSelection] = useState(false);
  const [tradeRole, setTradeRole] = useState<'shipper' | 'consignee'>('shipper');
  const [selectedPOs, setSelectedPOs] = useState<{
    poId: string;
    selectedItems: number[];
    bookedQuantities: Record<number, number>;
  }[]>([]);
  const [showPOReview, setShowPOReview] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    shipmentName: '',
    originLocation: '',
    originPort: '',
    cargoReadyDate: '',
    destinationLocation: '',
    destinationPort: '',
    targetDeliveryDate: '',
    weight: '',
    volume: '',
    additionalNotes: '',
    productName: '',
    hsCode: '',
    goodsDescription: '',
    poNumber: '',
    skuNumber: '',
    specialInstructions: '',
    originCustoms: false,
    originTrucking: false,
    destinationCustoms: false,
    destinationTrucking: false,
    dangerousGoods: false,
    requireShipmentTags: false,
    prefillValue: '',
    shipperValue: '',
    consigneeValue: '',
    transportModeValue: '',
    shipmentTypeValue: '',
    containerTypeValue: '',
    incotermsValue: '',
    packageTypeValue: '',
    packageCount: '',
  });

  // Previous shipments data
  const [previousShipments] = useState([
    { id: 'SH001', name: 'PO 1001 - Electronics', date: '2024-01-15' },
    { id: 'SH002', name: 'PO 1002 - Textiles', date: '2024-01-20' }
  ]);

  // Load booking data from session storage
  useEffect(() => {
    const bookingData = sessionStorage.getItem('bookingData');
    if (bookingData) {
      setSelectedPOs(JSON.parse(bookingData));
    }
  }, []);

  // Debug log for selectedPOs
  useEffect(() => {
    console.log('selectedPOs state:', selectedPOs);
  }, [selectedPOs]);

  // Reset PO data when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      // Clear PO data from session storage when leaving the page
      sessionStorage.removeItem('bookingData');
      console.log('PO data cleared from session storage - user navigated away from booking creation');
    };
  }, []);

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

  // Handle form field changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle edit order
  const handleEditOrder = (poId: string) => {
    const selectedPO = purchaseOrdersData.find(po => po.id === poId);
    if (!selectedPO) return;

    const poItems = poDetailsData.filter(
      item => item.poOrderNumber === parseInt(poId.replace('PO', ''))
    );

    const poData = {
      ...selectedPO,
      cargoReadyBy: formatDateForInput(selectedPO.cargoReadyBy || poItems[0]?.cargoReadyDate),
      mustArriveBy: formatDateForInput(selectedPO.mustArriveBy || poItems[0]?.mustArriveDate),
      items: poItems.map(item => ({
        ...item,
        cargoReadyDate: item.cargoReadyDate, 
        mustArriveDate: item.mustArriveDate
      }))
    };

    console.log('Storing PO data:', {
      poNumber: poData.id,
      crd: poData.cargoReadyBy || poData.items[0]?.cargoReadyDate,
      mabd: poData.mustArriveBy || poData.items[0]?.mustArriveDate,
      items: poData.items.map(i => ({
        id: i.id,
        crd: i.cargoReadyDate,
        mabd: i.mustArriveDate
      }))
    });

    sessionStorage.setItem('currentPO', JSON.stringify(poData));
    router.push('/orders/details');
  };

  // Get selected PO details
  const getSelectedPODetails = () => {
    const details = selectedPOs
      .map(poSelection => {
        const po = purchaseOrdersData.find(p => p.id === poSelection.poId);
        if (!po) return null;
        const poNum = parseInt(poSelection.poId.replace('PO', ''));
        const items = poDetailsData.filter(item =>
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

  // Render PO review section
  const renderPOReview = () => {
    const selectedData = getSelectedPODetails();
    
    if (!showPOReview && selectedData.length === 0) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900">Selected Purchase Orders</h3>
            <button
              onClick={() => setShowPOSelection(true)}
              className="px-3 py-1 text-xs text-[#007bff] hover:text-blue-700"
            >
              Add PO
            </button>
          </div>
          <div className="text-center py-12 text-gray-500">
            No purchase orders found
          </div>
        </div>
      );
    }

    const poDetailsForSummary = selectedData.flatMap(({ items, po }) =>
      items.map(item => ({
        ...item,
        poOrderNumber: typeof item.poOrderNumber === 'number' ? item.poOrderNumber : parseInt(po.id.replace('PO', '')),
        booked: Number(item.booked) || 0
      }))
    );
    
    const purchaseOrdersForSummary = Array.from(
      new Set(
        poDetailsForSummary
          .map(item => purchaseOrdersData.find(po => po.id === `PO${item.poOrderNumber}`))
          .filter((po): po is PurchaseOrder => Boolean(po))
      )
    );

    const groupedPOs: Record<string, (typeof poDetailsForSummary)> = poDetailsForSummary.reduce((acc, item) => {
      const poKey = `PO${item.poOrderNumber}`;
      if (!acc[poKey]) acc[poKey] = [];
      acc[poKey].push(item);
      return acc;
    }, {} as Record<string, typeof poDetailsForSummary>);

    if (poDetailsForSummary.length === 0) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900">Selected Purchase Orders</h3>
            <button
              onClick={() => setShowPOSelection(true)}
              className="px-3 py-1 text-xs text-[#007bff] hover:text-blue-700"
            >
              Add PO
            </button>
          </div>
          <div className="text-center py-12 text-gray-500">
            No booked purchase orders found
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-900">Selected Purchase Orders</h3>
          <button
            onClick={() => setShowPOSelection(true)}
            className="px-3 py-1 text-xs text-[#007bff] hover:text-blue-700"
          >
            {selectedData.length > 0 ? 'Add More' : 'Add PO'}
          </button>
        </div>
        <div className="space-y-2">
          {purchaseOrdersForSummary.map((po) => (
            <div key={po.id} className="bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-blue-600">{po.id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    po.status === 'Open' 
                      ? 'bg-green-100 text-green-800' 
                      : po.status === 'Closed' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {po.status}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedPOs(prev => {
                        const updated = prev.filter(sel => sel.poId !== po.id);
                        sessionStorage.setItem('bookingData', JSON.stringify(updated));
                        return updated;
                      });
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded-full focus:outline-none"
                    title="Remove PO"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {groupedPOs[po.id]?.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-xs text-gray-900">{index + 1}</td>
                        <td className="px-4 py-4">
                          <div className="text-xs font-medium text-gray-900">{item.productCode}</div>
                          <div className="text-xs text-gray-500">{item.productName}</div>
                        </td>
                        <td className="px-4 py-4 text-xs text-gray-900">{item.currency}</td>
                        <td className="px-4 py-4 text-xs text-gray-900">{item.unitCost}</td>
                        <td className="px-4 py-4 text-xs text-gray-900">{item.requested}</td>
                        <td className="px-4 py-4 text-xs text-gray-900">{item.booked}</td>
                        <td className="px-4 py-4 text-xs text-gray-900">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${(item.booked / item.requested) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {Math.round((item.booked / item.requested) * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Validation for required fields
  const validateForm = () => {
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
    if (!formData.containerTypeValue) newErrors.containerTypeValue = 'Container type is required.';
    if (!formData.incotermsValue) newErrors.incotermsValue = 'Incoterms is required.';
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (validateForm()) {
      onSubmitBooking();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
          <div className="mb-4 font-semibold text-sm text-gray-900 border-b border-gray-200 pb-2">Purchase Orders</div>
          {hasSubmitted && errors.selectedPOs && (
            <div className="text-xs text-red-500 mb-2">{errors.selectedPOs}</div>
          )}
          {renderPOReview()}
        </div>

        {/* Shipment Name */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            Shipment Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.shipmentName}
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
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setTradeRole('shipper')}
              className={`px-4 py-2 text-xs border rounded-lg ${tradeRole === 'shipper' ? 'bg-[#007bff] text-white border-[#007bff]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Shipper
            </button>
            <button
              type="button"
              onClick={() => setTradeRole('consignee')}
              className={`px-4 py-2 text-xs border rounded-lg ${tradeRole === 'consignee' ? 'bg-[#007bff] text-white border-[#007bff]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
              Consignee
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Shipper <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  {/* Inline Shipper Dropdown (RateTable pattern) */}
                  {(() => {
                    const [isShipperDropdownOpen, setIsShipperDropdownOpen] = useState(false);
                    const shipperDropdownRef = useRef<HTMLDivElement>(null);
                    useEffect(() => {
                      const handleClick = (e: MouseEvent) => {
                        if (shipperDropdownRef.current && !shipperDropdownRef.current.contains(e.target as Node)) {
                          setIsShipperDropdownOpen(false);
                        }
                      };
                      if (isShipperDropdownOpen) {
                        document.addEventListener('mousedown', handleClick);
                      }
                      return () => document.removeEventListener('mousedown', handleClick);
                    }, [isShipperDropdownOpen]);
                    const options = [
                      { value: 'studio-apparel', label: 'Studio Apparel' },
                      { value: 'global-trade', label: 'Global Trade Co' }
                    ];
                    const selectedOption = options.find(opt => opt.value === formData.shipperValue);
                    return (
                      <div className="relative" ref={shipperDropdownRef}>
                        <button
                          type="button"
                          className={`flex items-center justify-between w-full pl-3 pr-8 py-3 text-xs text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${!selectedOption ? 'text-gray-500' : ''}`}
                          onClick={() => setIsShipperDropdownOpen(v => !v)}
                        >
                          {selectedOption ? selectedOption.label : 'Select shipper'}
                          <ChevronDown
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${isShipperDropdownOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {isShipperDropdownOpen && (
                          <div className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 transition-all duration-200 opacity-100 scale-100 w-full min-w-[120px]">
                            <div className="py-1 max-h-60 overflow-auto">
                              {options.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => {
                                    handleInputChange('shipperValue', option.value);
                                    setIsShipperDropdownOpen(false);
                                  }}
                                  className={`block w-full text-left px-4 py-3 text-xs ${formData.shipperValue === option.value ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
                <button
                  type="button"
                  className="px-4 py-2 text-xs bg-[#007bff] text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Shipper</span>
                </button>
              </div>
              {hasSubmitted && errors.shipperValue && (
                <p className="text-xs text-red-500 mt-1">{errors.shipperValue}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Consignee <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Dropdown
                    value={formData.consigneeValue}
                    onChange={(value) => handleInputChange('consigneeValue', value)}
                    options={[
                      { value: 'forward-supply', label: 'Forward Supply Co' },
                      { value: 'logistics-hub', label: 'Logistics Hub' }
                    ]}
                    placeholder="Select consignee"
                    dropdownKey="consignee"
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                  />
                </div>
                <button
                  type="button"
                  className="px-4 py-2 text-xs bg-[#007bff] text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Consignee</span>
                </button>
              </div>
              {hasSubmitted && errors.consigneeValue && (
                <p className="text-xs text-red-500 mt-1">{errors.consigneeValue}</p>
              )}
            </div>
          </div>
        </div>

        {/* Transportation Details */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="mb-4 font-semibold text-sm text-gray-900 border-b border-gray-200 pb-2">Transportation Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Transport Mode <span className="text-red-500">*</span>
              </label>
              <Dropdown
                value={formData.transportModeValue}
                onChange={(value) => handleInputChange('transportModeValue', value)}
                options={[
                  { value: 'sea', label: 'Sea Freight' },
                  { value: 'air', label: 'Air Freight' },
                  { value: 'land', label: 'Land Transport' }
                ]}
                placeholder="Select mode"
                dropdownKey="transportMode"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
              {hasSubmitted && errors.transportModeValue && (
                <p className="text-xs text-red-500 mt-1">{errors.transportModeValue}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Shipment Type <span className="text-red-500">*</span>
              </label>
              <Dropdown
                value={formData.shipmentTypeValue}
                onChange={(value) => handleInputChange('shipmentTypeValue', value)}
                options={[
                  { value: 'fcl', label: 'FCL (Full Container Load)' },
                  { value: 'lcl', label: 'LCL (Less Container Load)' },
                  { value: 'breakbulk', label: 'Breakbulk' }
                ]}
                placeholder="Select type"
                dropdownKey="shipmentType"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
              {hasSubmitted && errors.shipmentTypeValue && (
                <p className="text-xs text-red-500 mt-1">{errors.shipmentTypeValue}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Container Type <span className="text-red-500">*</span>
              </label>
              <Dropdown
                value={formData.containerTypeValue}
                onChange={(value) => handleInputChange('containerTypeValue', value)}
                options={[
                  { value: '20ft', label: '20ft Standard' },
                  { value: '40ft', label: '40ft Standard' },
                  { value: '40ft-hc', label: '40ft High Cube' },
                  { value: '45ft', label: '45ft High Cube' }
                ]}
                placeholder="Select container type"
                dropdownKey="containerType"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
              {hasSubmitted && errors.containerTypeValue && (
                <p className="text-xs text-red-500 mt-1">{errors.containerTypeValue}</p>
              )}
            </div>
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
                  { value: 'CIF', label: 'CIF - Cost, Insurance & Freight' }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Weight <span className="text-red-500">*</span>
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
                Volume <span className="text-red-500">*</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <span className="text-xs text-gray-700">This shipment contains dangerous goods</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Product PO Number
                </label>
                <input
                  type="text"
                  value={formData.poNumber}
                  onChange={(e) => handleInputChange('poNumber', e.target.value)}
                  className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.poNumber ? 'border-red-500' : ''}`}
                  placeholder="Enter PO number"
                />
                {hasSubmitted && errors.poNumber && (
                  <p className="text-xs text-red-500 mt-1">{errors.poNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  SKU Number
                </label>
                <input
                  type="text"
                  value={formData.skuNumber}
                  onChange={(e) => handleInputChange('skuNumber', e.target.value)}
                  className={`w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${hasSubmitted && errors.skuNumber ? 'border-red-500' : ''}`}
                  placeholder="Enter SKU number"
                />
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
                purchaseOrders={purchaseOrdersData}
                poDetails={poDetailsData}
                onEditOrder={handleEditOrder}
                onCreateBooking={(bookingData) => {
                  const normalized = bookingData.map(poSel => ({
                    ...poSel,
                    bookedQuantities: Object.fromEntries(
                      Object.entries(poSel.bookedQuantities).map(([id, qty]) => [id, qty > 0 ? qty : 1]))
                  }));
                  
                  setSelectedPOs(prevSelectedPOs => {
                    const existingPOIds = new Set(prevSelectedPOs.map(po => po.poId));
                    const newPOs = normalized.filter(po => !existingPOIds.has(po.poId));
                    const mergedPOs = [...prevSelectedPOs, ...newPOs];
                    
                    sessionStorage.setItem('bookingData', JSON.stringify(mergedPOs));
                    return mergedPOs;
                  });
                  
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
    </div>
  );
};

export default BookingCreation;