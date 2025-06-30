import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { ChevronDown, ChevronUp, Package, Users, Truck, MapPin, Target, Scale, FileText, Tag, MessageSquare, Save, Send, Info, Plus, X, Edit, Trash2 } from 'lucide-react';
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

const BookingCreation: React.FC<BookingCreationProps> = memo(({ onSubmitBooking = () => {} }) => {
  const router = useRouter(); 
  const [showPOSelection, setShowPOSelection] = useState(false);
  const [tradeRole, setTradeRole] = useState<'shipper' | 'consignee'>('shipper');
  const [selectedPOs, setSelectedPOs] = useState<{
    poId: string;
    selectedItems: number[];
    bookedQuantities: Record<number, number>;
  }[]>([]);
  
  // Simple solution: Use HTML select elements with refs - no state, no re-renders
  const shipperSelectRef = useRef<HTMLSelectElement>(null);
  const consigneeSelectRef = useRef<HTMLSelectElement>(null);
  const transportModeSelectRef = useRef<HTMLSelectElement>(null);
  const shipmentTypeSelectRef = useRef<HTMLSelectElement>(null);
  const containerTypeSelectRef = useRef<HTMLSelectElement>(null);
  const incotermsSelectRef = useRef<HTMLSelectElement>(null);
  const packageTypeSelectRef = useRef<HTMLSelectElement>(null);

  // Use refs for all inputs to make them completely independent of React re-renders
  const shipmentNameRef = useRef(null);
  const originLocationRef = useRef(null);
  const originPortRef = useRef(null);
  const cargoReadyDateRef = useRef(null);
  const destinationLocationRef = useRef(null);
  const destinationPortRef = useRef(null);
  const targetDeliveryDateRef = useRef(null);
  const weightRef = useRef(null);
  const volumeRef = useRef(null);
  const additionalNotesRef = useRef(null);
  const productNameRef = useRef(null);
  const hsCodeRef = useRef(null);
  const goodsDescriptionRef = useRef(null);
  const poNumberRef = useRef(null);
  const skuNumberRef = useRef(null);
  const specialInstructionsRef = useRef(null);

  // Individual checkbox states - REPLACE WITH REFS
  const originCustomsRef = useRef<HTMLInputElement>(null);
  const originTruckingRef = useRef<HTMLInputElement>(null);
  const destinationCustomsRef = useRef<HTMLInputElement>(null);
  const destinationTruckingRef = useRef<HTMLInputElement>(null);
  const dangerousGoodsRef = useRef<HTMLInputElement>(null);
  const requireShipmentTagsRef = useRef<HTMLInputElement>(null);

  // Add state for conditional rendering only
  const [showShipmentTags, setShowShipmentTags] = useState(true);

  // Add state for PO review display control
  const [showPOReview, setShowPOReview] = useState(false);

  const [prefillValue, setPrefillValue] = useState('');
  const [shipperValue, setShipperValue] = useState('');
  const [consigneeValue, setConsigneeValue] = useState('');
  const [transportModeValue, setTransportModeValue] = useState('');
  const [shipmentTypeValue, setShipmentTypeValue] = useState('');
  const [containerTypeValue, setContainerTypeValue] = useState('');
  const [incotermsValue, setIncotermsValue] = useState('');
  const [packageTypeValue, setPackageTypeValue] = useState('');

  const Dropdown = React.forwardRef<HTMLDivElement, {
    options: { value: string; label: string }[];
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
  }>(({ options, value, placeholder, onChange }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPos, setDropdownPos] = useState<{top: number, left: number, width: number} | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    // Close dropdown on outside click or scroll
    useEffect(() => {
      const handleClickOrScroll = (event: MouseEvent | Event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains((event as MouseEvent).target as Node) &&
          buttonRef.current &&
          !(buttonRef.current as any).contains((event as MouseEvent).target as Node)
        ) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOrScroll);
        window.addEventListener('scroll', handleClickOrScroll, true);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOrScroll);
        window.removeEventListener('scroll', handleClickOrScroll, true);
      };
    }, [isOpen]);

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

    // Toggle dropdown and set position
    const handleButtonClick = () => {
      if (!isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
      setIsOpen((v) => !v);
    };

    // Dropdown content
    const dropdownContent = isOpen && dropdownPos
      ? ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            className={`absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-[${dropdownPos.width}px] mt-1 transition-all duration-200 opacity-100 scale-100`}
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
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-xs ${
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
      <div className="relative" ref={ref}>
        <button
          ref={buttonRef}
          onClick={handleButtonClick}
          type="button"
          className={`flex items-center justify-between w-full pl-3 pr-8 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
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
  });

  // Sync checkbox ref with display state
  useEffect(() => {
    const handleCheckboxChange = () => {
      if (requireShipmentTagsRef.current) {
        setShowShipmentTags(requireShipmentTagsRef.current.checked);
      }
    };

    const checkbox = requireShipmentTagsRef.current;
    if (checkbox) {
      checkbox.addEventListener('change', handleCheckboxChange);
      return () => checkbox.removeEventListener('change', handleCheckboxChange);
    }
  }, []);

  function formatDateForInput(displayDate: string): string {
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
  }

  useEffect(() => {
    const bookingData = sessionStorage.getItem('bookingData');
    if (bookingData) {
      setSelectedPOs(JSON.parse(bookingData));
    }
  }, []);

  // Add debug log for selectedPOs
  useEffect(() => {
    console.log('selectedPOs state:', selectedPOs);
  }, [selectedPOs]);

  const handleEditOrder = (poId: string) => {
    // 1. Find the PO and its items using your existing data sources
    const selectedPO = purchaseOrdersData.find(po => po.id === poId);
    if (!selectedPO) return;

    const poItems = poDetailsData.filter(
      item => item.poOrderNumber === parseInt(poId.replace('PO', ''))
    );

    // 2. Prepare the data to match EXACTLY what OrderDetails already expects
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

    // 3. Debug log to verify before storing
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

    // 4. Store and navigate (unchanged)
    sessionStorage.setItem('currentPO', JSON.stringify(poData));
    router.push('/orders/details');
  };

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

  const renderPOReview = () => {
    const selectedData = getSelectedPODetails();
    
    // If accessed directly from booking menu (not from PO), show empty state
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

    // Map all selected PO items with booked > 0 for summary view
    const poDetailsForSummary = selectedData.flatMap(({ items, po }) =>
      items.map(item => ({
        ...item,
        poOrderNumber: typeof item.poOrderNumber === 'number' ? item.poOrderNumber : parseInt(po.id.replace('PO', '')),
        booked: Number(item.booked) || 0
      }))
    );
    
    // Always get the full PO object from purchaseOrdersData for every poOrderNumber in poDetailsForSummary
    const purchaseOrdersForSummary = Array.from(
      new Set(
        poDetailsForSummary
          .map(item => purchaseOrdersData.find(po => po.id === `PO${item.poOrderNumber}`))
          .filter((po): po is PurchaseOrder => Boolean(po))
      )
    );

    // Group by PO
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
                  {/* Trash Button */}
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

  const [expandedSections, setExpandedSections] = useState({
    prefill: true,
    po: true,
    shipmentName: true,
    parties: true,
    transportation: true,
    origin: true,
    destination: true,
    cargo: true,
    compliance: true,
    tags: false,
    instructions: false
  });

  const [previousShipments] = useState([
    { id: 'SH001', name: 'PO 1001 - Electronics', date: '2024-01-15' },
    { id: 'SH002', name: 'PO 1002 - Textiles', date: '2024-01-20' }
  ]);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  }, []);

  const handlePrefillShipment = useCallback((shipmentId: string) => {
    // Mock prefill logic
    const mockData = {
      shipper: 'Studio Apparel',
      consignee: 'Forward Supply Co',
      transportMode: 'sea',
      shipmentType: 'fcl',
      originLocation: 'Shanghai, China',
      destinationLocation: 'Los Angeles, CA'
    };
    // Note: originLocation and destinationLocation are handled by input refs
  }, []);

  const SectionHeader = ({ title, icon: Icon, section, required = false }: {
      title: string;
      icon: React.ComponentType<any>;
      section: string;
      required?: boolean;
    }) => (
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-blue-200 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
          {required && <span className="text-red-500 text-sm">*</span>}
        </div>
        {expandedSections[section as keyof typeof expandedSections] ? 
          <ChevronUp className="w-5 h-5 text-gray-500" /> : 
          <ChevronDown className="w-5 h-5 text-gray-500" />
        }
      </button>
    );

  const FormSection = ({ section, children }: { section: string; children: React.ReactNode }) => (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
      {expandedSections[section as keyof typeof expandedSections] && (
        <div className="p-4 space-y-6">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-2 bg-white">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Booking</h1>
        <p className="text-gray-600 text-sm">Fill in the details below to create a new freight booking</p>
      </div>

      <div
        className="space-y-2 -mt-2"
        onSubmit={e => {
          e.preventDefault();
          onSubmitBooking();
        }}
      >
        {/* Pre-fill Booking */}
        <div className="border border-gray-200 rounded-lg mb-2 overflow-hidden">
          <SectionHeader title="Pre-fill Booking" icon={Package} section="prefill" />
          <FormSection section="prefill">
            <div className="bg-white rounded-lg">
              <p className="text-xs text-gray-700 mb-3">Start this booking from a template or previous shipment</p>
              {previousShipments.length > 0 ? (
                <div className="space-y-2">
                    <Dropdown
                      value={prefillValue}
                      onChange={(value) => handlePrefillShipment(value)}
                      options={previousShipments.map(s => ({ 
                        value: s.id, 
                        label: `${s.name} - ${s.date}` 
                      }))}
                      placeholder="Select a previous shipment to pre-fill"
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
          </FormSection>
        </div>

        {/* PO Review */}
        <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
          <SectionHeader title="PO Review" icon={FileText} section="po" required />
          <FormSection section="po">
            <div className="max-h-98 overflow-y-auto"> {/* Added max height and scroll */}
              {renderPOReview()}
            </div>
          </FormSection>
        </div>

        {/* Shipment Name */}
        <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
          <SectionHeader title="Shipment Name" icon={Tag} section="shipmentName" required />
          <FormSection section="shipmentName">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Shipment Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                defaultValue=""
                className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter shipment name for easy recognition"
                ref={shipmentNameRef}
              />
            </div>
          </FormSection>
        </div>

        {/* Involved Parties */}
        <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
          <SectionHeader title="Involved Parties" icon={Users} section="parties" required />
          <FormSection section="parties">
            <div className="space-y-4">
              {/* Separate role toggle buttons */}
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setTradeRole('shipper')}
                  className={`px-4 py-2 text-xs border rounded-lg ${
                    tradeRole === 'shipper'
                      ? 'bg-[#007bff] text-white border-[#007bff]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Shipper
                </button>
                <button
                  type="button"
                  onClick={() => setTradeRole('consignee')}
                  className={`px-4 py-2 text-xs border rounded-lg ${
                    tradeRole === 'consignee'
                      ? 'bg-[#007bff] text-white border-[#007bff]'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
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
                      <Dropdown
                        value={shipperValue}
                        onChange={(value) => setShipperValue(value)}
                        options={[
                          { value: 'studio-apparel', label: 'Studio Apparel' },
                          { value: 'global-trade', label: 'Global Trade Co' }
                        ]}
                        placeholder="Select shipper"
                      />
                    </div>
                    <button
                      type="button"
                      className="px-4 py-2 text-xs bg-[#007bff] text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>New Shipper</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Consignee <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Dropdown
                        value={consigneeValue}
                        onChange={(value) => setConsigneeValue(value)}
                        options={[
                          { value: 'forward-supply', label: 'Forward Supply Co' },
                          { value: 'logistics-hub', label: 'Logistics Hub' }
                        ]}
                        placeholder="Select consignee"
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
                </div>
              </div>
            </div>
          </FormSection>
        </div>

        {/* Transportation Details */}
        <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
          <SectionHeader title="Transportation Details" icon={Truck} section="transportation" required />
          <FormSection section="transportation">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Transport Mode <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Dropdown
                    value={transportModeValue}
                    onChange={(value) => setTransportModeValue(value)}
                    options={[
                      { value: 'sea', label: 'Sea Freight' },
                      { value: 'air', label: 'Air Freight' },
                      { value: 'land', label: 'Land Transport' }
                    ]}
                    placeholder="Select mode"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Shipment Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Dropdown
                    value={shipmentTypeValue}
                    onChange={(value) => setShipmentTypeValue(value)}
                    options={[
                      { value: 'fcl', label: 'FCL (Full Container Load)' },
                      { value: 'lcl', label: 'LCL (Less Container Load)' },
                      { value: 'breakbulk', label: 'Breakbulk' }
                    ]}
                    placeholder="Select type"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Container Type</label>
                <div className="relative">
                  <Dropdown
                    value={containerTypeValue}
                    onChange={(value) => setContainerTypeValue(value)}
                    options={[
                      { value: '20ft', label: '20ft Standard' },
                      { value: '40ft', label: '40ft Standard' },
                      { value: '40ft-hc', label: '40ft High Cube' },
                      { value: '45ft', label: '45ft High Cube' }
                    ]}
                    placeholder="Select container type"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Incoterms</label>
                <div className="relative">
                  <Dropdown
                    value={incotermsValue}
                    onChange={(value) => setIncotermsValue(value)}
                    options={[
                      { value: 'FOB', label: 'FOB - Free on Board' },
                      { value: 'EXW', label: 'EXW - Ex Works' },
                      { value: 'DDP', label: 'DDP - Delivered Duty Paid' },
                      { value: 'CIF', label: 'CIF - Cost, Insurance & Freight' }
                    ]}
                    placeholder="Select incoterms"
                  />
                </div>
              </div>
            </div>
          </FormSection>
        </div>

        {/* Origin */}
        <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
          <SectionHeader title="Origin" icon={MapPin} section="origin" required />
          <FormSection section="origin">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Origin Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue=""
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter origin address"
                    ref={originLocationRef}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Origin Port <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue=""
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search ports"
                    ref={originPortRef}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Cargo Ready Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    defaultValue=""
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ref={cargoReadyDateRef}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    ref={originCustomsRef}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">Export customs service required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    ref={originTruckingRef}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">Trucking required from origin to port</span>
                </label>
              </div>
            </div>
          </FormSection>
        </div>

        {/* Destination */}
        <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
          <SectionHeader title="Destination" icon={Target} section="destination" required />
          <FormSection section="destination">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Destination Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue=""
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter destination address"
                    ref={destinationLocationRef}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Destination Port <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue=""
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search ports"
                    ref={destinationPortRef}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Target Delivery Date (MABD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    defaultValue=""
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    ref={targetDeliveryDateRef}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    ref={destinationCustomsRef}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">Import customs service required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    ref={destinationTruckingRef}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">Trucking required from port to destination</span>
                </label>
              </div>
            </div>
          </FormSection>
        </div>

        {/* Cargo & Load Specs */}
        <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
          <SectionHeader title="Cargo & Load Specs" icon={Scale} section="cargo" required />
          <FormSection section="cargo">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  defaultValue=""
                  className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  ref={weightRef}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Volume (cbm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  defaultValue=""
                  className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  ref={volumeRef}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Package Type</label>
                <div className="relative">
                  <Dropdown
                    value={packageTypeValue}
                    onChange={(value) => setPackageTypeValue(value)}
                    options={[
                      { value: 'pallet', label: 'Pallet' },
                      { value: 'box', label: 'Box' },
                      { value: 'crate', label: 'Crate' },
                      { value: 'carton', label: 'Carton' }
                    ]}
                    placeholder="Select package type"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                defaultValue=""
                rows={3}
                className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional cargo specifications or handling requirements"
                ref={additionalNotesRef}
              />
            </div>
          </FormSection>
        </div>

        {/* Product & Compliance */}
        <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
          <SectionHeader title="Product & Compliance" icon={FileText} section="compliance" required />
          <FormSection section="compliance">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue=""
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                    ref={productNameRef}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    HS Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue=""
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter HS code"
                    ref={hsCodeRef}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Goods Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  defaultValue=""
                  rows={3}
                  className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed description of goods (English and Chinese)"
                  ref={goodsDescriptionRef}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    ref={dangerousGoodsRef}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">This shipment contains dangerous goods</span>
                </label>
              </div>
            </div>
          </FormSection>
        </div>

        {/* Shipment Tags */}
         <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
          <SectionHeader title="Shipment Tags" icon={Tag} section="tags" />
          <FormSection section="tags">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                ref={requireShipmentTagsRef}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="requireTagsCheckbox" className="text-xs text-gray-700">
                My consignee requires shipment tags
              </label>
            </div>

            {showShipmentTags && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Product PO Number
                  </label>
                  <input
                    type="text"
                    defaultValue=""
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter PO number"
                    ref={poNumberRef}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    SKU Number
                  </label>
                  <input
                    type="text"
                    defaultValue=""
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter SKU number"
                    ref={skuNumberRef}
                  />
                </div>
              </div>
            )}
          </FormSection>
        </div>

        {/* Special Instructions */}
        <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
          <SectionHeader title="Special Instructions" icon={MessageSquare} section="instructions" />
          <FormSection section="instructions">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Any special instructions?</label>
              <textarea
                defaultValue=""
                rows={4}
                className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional information, handling notes, or special alerts for this shipment"
                ref={specialInstructionsRef}
              />
            </div>
          </FormSection>
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
            onClick={onSubmitBooking}
            type="submit"
            className="flex items-center gap-2 px-5 py- font-semibold text-sm bg-[#007bff] text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                  // Ensure at least 1 booked quantity for each selected item
                  const normalized = bookingData.map(poSel => ({
                    ...poSel,
                    bookedQuantities: Object.fromEntries(
                      Object.entries(poSel.bookedQuantities).map(([id, qty]) => [id, qty > 0 ? qty : 1])
                    )
                  }));
                  
                  // Merge new selections with existing ones instead of replacing
                  setSelectedPOs(prevSelectedPOs => {
                    const existingPOIds = new Set(prevSelectedPOs.map(po => po.poId));
                    const newPOs = normalized.filter(po => !existingPOIds.has(po.poId));
                    const mergedPOs = [...prevSelectedPOs, ...newPOs];
                    
                    // Update sessionStorage with merged data
                    sessionStorage.setItem('bookingData', JSON.stringify(mergedPOs));
                    return mergedPOs;
                  });
                  
                  // Show PO review section when POs are added
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
  )
});

export default BookingCreation;