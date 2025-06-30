import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const BookingCreation: React.FC<BookingCreationProps> = ({ onSubmitBooking = () => {} }) => {
  const router = useRouter(); 
  const [showPOSelection, setShowPOSelection] = useState(false);
  const [requireShipmentTags, setRequireShipmentTags] = useState(true);
  const [tradeRole, setTradeRole] = useState<'shipper' | 'consignee'>('shipper');
  const [selectedPOs, setSelectedPOs] = useState<{
    poId: string;
    selectedItems: number[];
    bookedQuantities: Record<number, number>;
  }[]>([]);
  const [showShipperDropdown, setShowShipperDropdown] = useState(false);
  const [showConsigneeDropdown, setShowConsigneeDropdown] = useState(false);
  const shipperDropdownRef = useRef<HTMLDivElement>(null);
  const consigneeDropdownRef = useRef<HTMLDivElement>(null);
  const [shipperDropdownPos, setShipperDropdownPos] = useState<{top: number, left: number, width: number} | null>(null);
  const [consigneeDropdownPos, setConsigneeDropdownPos] = useState<{top: number, left: number, width: number} | null>(null);

  // Add state and refs for transport details dropdowns
  const [showTransportModeDropdown, setShowTransportModeDropdown] = useState(false);
  const [transportModeDropdownPos, setTransportModeDropdownPos] = useState<{top: number, left: number, width: number} | null>(null);
  const transportModeDropdownRef = useRef<HTMLDivElement>(null);

  const [showShipmentTypeDropdown, setShowShipmentTypeDropdown] = useState(false);
  const [shipmentTypeDropdownPos, setShipmentTypeDropdownPos] = useState<{top: number, left: number, width: number} | null>(null);
  const shipmentTypeDropdownRef = useRef<HTMLDivElement>(null);

  const [showContainerTypeDropdown, setShowContainerTypeDropdown] = useState(false);
  const [containerTypeDropdownPos, setContainerTypeDropdownPos] = useState<{top: number, left: number, width: number} | null>(null);
  const containerTypeDropdownRef = useRef<HTMLDivElement>(null);

  const [showIncotermsDropdown, setShowIncotermsDropdown] = useState(false);
  const [incotermsDropdownPos, setIncotermsDropdownPos] = useState<{top: number, left: number, width: number} | null>(null);
  const incotermsDropdownRef = useRef<HTMLDivElement>(null);

  const [showPackageTypeDropdown, setShowPackageTypeDropdown] = useState(false);
  const [packageTypeDropdownPos, setPackageTypeDropdownPos] = useState<{top: number, left: number, width: number} | null>(null);
  const packageTypeDropdownRef = useRef<HTMLDivElement>(null);

  const [showPrefillDropdown, setShowPrefillDropdown] = useState(false);
  const [prefillDropdownPos, setPrefillDropdownPos] = useState<{top: number, left: number, width: number} | null>(null);
  const prefillDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedPrefill, setSelectedPrefill] = useState<string>("");

  // Add refs for portal dropdown content
  const prefillDropdownContentRef = useRef<HTMLDivElement>(null);
  const shipperDropdownContentRef = useRef<HTMLDivElement>(null);
  const consigneeDropdownContentRef = useRef<HTMLDivElement>(null);
  const transportModeDropdownContentRef = useRef<HTMLDivElement>(null);
  const shipmentTypeDropdownContentRef = useRef<HTMLDivElement>(null);
  const containerTypeDropdownContentRef = useRef<HTMLDivElement>(null);
  const incotermsDropdownContentRef = useRef<HTMLDivElement>(null);
  const packageTypeDropdownContentRef = useRef<HTMLDivElement>(null);

  // Use refs for all inputs to make them completely independent of React re-renders
  const shipmentNameRef = useRef<HTMLInputElement>(null);
  const originLocationRef = useRef<HTMLInputElement>(null);
  const originPortRef = useRef<HTMLInputElement>(null);
  const cargoReadyDateRef = useRef<HTMLInputElement>(null);
  const destinationLocationRef = useRef<HTMLInputElement>(null);
  const destinationPortRef = useRef<HTMLInputElement>(null);
  const targetDeliveryDateRef = useRef<HTMLInputElement>(null);
  const weightRef = useRef<HTMLInputElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);
  const additionalNotesRef = useRef<HTMLTextAreaElement>(null);
  const productNameRef = useRef<HTMLInputElement>(null);
  const hsCodeRef = useRef<HTMLInputElement>(null);
  const goodsDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const poNumberRef = useRef<HTMLInputElement>(null);
  const skuNumberRef = useRef<HTMLInputElement>(null);
  const specialInstructionsRef = useRef<HTMLTextAreaElement>(null);

  // Individual state variables for ALL form elements to prevent any interference
  const [shipmentName, setShipmentName] = useState('Shipment Name');
  const [shipper, setShipper] = useState('');
  const [consignee, setConsignee] = useState('');
  const [transportMode, setTransportMode] = useState('sea');
  const [shipmentType, setShipmentType] = useState('fcl');
  const [containerType, setContainerType] = useState('');
  const [incoterms, setIncoterms] = useState('');
  const [originLocation, setOriginLocation] = useState('');
  const [originPort, setOriginPort] = useState('');
  const [cargoReadyDate, setCargoReadyDate] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [destinationPort, setDestinationPort] = useState('');
  const [targetDeliveryDate, setTargetDeliveryDate] = useState('');
  const [weight, setWeight] = useState('');
  const [volume, setVolume] = useState('');
  const [packageType, setPackageType] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [productName, setProductName] = useState('');
  const [goodsDescription, setGoodsDescription] = useState('');
  const [hsCode, setHsCode] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [skuNumber, setSkuNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Individual checkbox states
  const [originCustoms, setOriginCustoms] = useState(false);
  const [originTrucking, setOriginTrucking] = useState(false);
  const [destinationCustoms, setDestinationCustoms] = useState(false);
  const [destinationTrucking, setDestinationTrucking] = useState(false);
  const [dangerousGoods, setDangerousGoods] = useState(false);

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
    setShipper(mockData.shipper);
    setConsignee(mockData.consignee);
    setTransportMode(mockData.transportMode);
    setShipmentType(mockData.shipmentType);
    setOriginLocation(mockData.originLocation);
    setDestinationLocation(mockData.destinationLocation);
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

  // Generalized outside click handler for all dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      
      // Don't close dropdowns if clicking on input elements, textareas, or select elements
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }
      
      // Prefill
      if (showPrefillDropdown && prefillDropdownRef.current && prefillDropdownContentRef.current &&
        !prefillDropdownRef.current.contains(target) &&
        !prefillDropdownContentRef.current.contains(target)) {
        setShowPrefillDropdown(false);
      }
      // Shipper
      if (showShipperDropdown && shipperDropdownRef.current && shipperDropdownContentRef.current &&
        !shipperDropdownRef.current.contains(target) &&
        !shipperDropdownContentRef.current.contains(target)) {
        setShowShipperDropdown(false);
      }
      // Consignee
      if (showConsigneeDropdown && consigneeDropdownRef.current && consigneeDropdownContentRef.current &&
        !consigneeDropdownRef.current.contains(target) &&
        !consigneeDropdownContentRef.current.contains(target)) {
        setShowConsigneeDropdown(false);
      }
      // Transport Mode
      if (showTransportModeDropdown && transportModeDropdownRef.current && transportModeDropdownContentRef.current &&
        !transportModeDropdownRef.current.contains(target) &&
        !transportModeDropdownContentRef.current.contains(target)) {
        setShowTransportModeDropdown(false);
      }
      // Shipment Type
      if (showShipmentTypeDropdown && shipmentTypeDropdownRef.current && shipmentTypeDropdownContentRef.current &&
        !shipmentTypeDropdownRef.current.contains(target) &&
        !shipmentTypeDropdownContentRef.current.contains(target)) {
        setShowShipmentTypeDropdown(false);
      }
      // Container Type
      if (showContainerTypeDropdown && containerTypeDropdownRef.current && containerTypeDropdownContentRef.current &&
        !containerTypeDropdownRef.current.contains(target) &&
        !containerTypeDropdownContentRef.current.contains(target)) {
        setShowContainerTypeDropdown(false);
      }
      // Incoterms
      if (showIncotermsDropdown && incotermsDropdownRef.current && incotermsDropdownContentRef.current &&
        !incotermsDropdownRef.current.contains(target) &&
        !incotermsDropdownContentRef.current.contains(target)) {
        setShowIncotermsDropdown(false);
      }
      // Package Type
      if (showPackageTypeDropdown && packageTypeDropdownRef.current && packageTypeDropdownContentRef.current &&
        !packageTypeDropdownRef.current.contains(target) &&
        !packageTypeDropdownContentRef.current.contains(target)) {
        setShowPackageTypeDropdown(false);
      }
    }

    function handleScroll() {
      // Close all dropdowns when scrolling
      setShowPrefillDropdown(false);
      setShowShipperDropdown(false);
      setShowConsigneeDropdown(false);
      setShowTransportModeDropdown(false);
      setShowShipmentTypeDropdown(false);
      setShowContainerTypeDropdown(false);
      setShowIncotermsDropdown(false);
      setShowPackageTypeDropdown(false);
    }

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('scroll', handleScroll, true); // Use capture phase to catch all scroll events
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [showPrefillDropdown, showShipperDropdown, showConsigneeDropdown, showTransportModeDropdown, showShipmentTypeDropdown, showContainerTypeDropdown, showIncotermsDropdown, showPackageTypeDropdown]);

  const handleShipperDropdown = () => {
    if (!showShipperDropdown) {
      const rect = shipperDropdownRef.current?.getBoundingClientRect();
      if (rect) setShipperDropdownPos({top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width});
    }
    setShowShipperDropdown((v) => !v);
  };

  const handleConsigneeDropdown = () => {
    if (!showConsigneeDropdown) {
      const rect = consigneeDropdownRef.current?.getBoundingClientRect();
      if (rect) setConsigneeDropdownPos({top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width});
    }
    setShowConsigneeDropdown((v) => !v);
  };

  const handleTransportModeDropdown = () => {
    if (!showTransportModeDropdown) {
      const rect = transportModeDropdownRef.current?.getBoundingClientRect();
      if (rect) setTransportModeDropdownPos({top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width});
    }
    setShowTransportModeDropdown((v) => !v);
  };
  const handleShipmentTypeDropdown = () => {
    if (!showShipmentTypeDropdown) {
      const rect = shipmentTypeDropdownRef.current?.getBoundingClientRect();
      if (rect) setShipmentTypeDropdownPos({top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width});
    }
    setShowShipmentTypeDropdown((v) => !v);
  };
  const handleContainerTypeDropdown = () => {
    if (!showContainerTypeDropdown) {
      const rect = containerTypeDropdownRef.current?.getBoundingClientRect();
      if (rect) setContainerTypeDropdownPos({top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width});
    }
    setShowContainerTypeDropdown((v) => !v);
  };
  const handleIncotermsDropdown = () => {
    if (!showIncotermsDropdown) {
      const rect = incotermsDropdownRef.current?.getBoundingClientRect();
      if (rect) setIncotermsDropdownPos({top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width});
    }
    setShowIncotermsDropdown((v) => !v);
  };
  const handlePackageTypeDropdown = () => {
    if (!showPackageTypeDropdown) {
      const rect = packageTypeDropdownRef.current?.getBoundingClientRect();
      if (rect) setPackageTypeDropdownPos({top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width});
    }
    setShowPackageTypeDropdown((v) => !v);
  };

  const handlePrefillDropdown = () => {
    if (!showPrefillDropdown) {
      const rect = prefillDropdownRef.current?.getBoundingClientRect();
      if (rect) setPrefillDropdownPos({top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width});
    }
    setShowPrefillDropdown((v) => !v);
  };

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
                  <div className="relative" ref={prefillDropdownRef}>
                    <button
                      type="button"
                      onClick={handlePrefillDropdown}
                      className="flex items-center justify-between w-full px-3 py-3 border border-gray-300 text-xs text-gray-900 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      {selectedPrefill
                        ? previousShipments.find(s => s.id === selectedPrefill)?.name +
                          ' - ' + previousShipments.find(s => s.id === selectedPrefill)?.date
                        : 'Select a previous shipment to pre-fill'}
                      <ChevronDown className={`w-4 h-4 transition-transform ${showPrefillDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showPrefillDropdown && prefillDropdownPos && ReactDOM.createPortal(
                      <div 
                        ref={prefillDropdownContentRef} 
                        style={{
                          position: 'fixed', 
                          top: prefillDropdownPos.top, 
                          left: prefillDropdownPos.left, 
                          width: prefillDropdownPos.width, 
                          zIndex: 1000
                        }} 
                        className="bg-white rounded-lg shadow-lg border border-gray-200"
                      >
                        <div className="p-2 max-h-64 overflow-y-auto">
                          <div className="space-y-1">
                            {previousShipments.map(shipment => (
                              <button
                                key={shipment.id}
                                type="button"
                                onClick={() => {
                                  setSelectedPrefill(shipment.id);
                                  setShowPrefillDropdown(false);
                                  handlePrefillShipment(shipment.id);
                                }}
                                className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${
                                  selectedPrefill === shipment.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                }`}
                              >
                                {shipment.name} - {shipment.date}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>,
                      document.body
                    )}
                  </div>
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
                defaultValue="Shipment Name"
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
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1" ref={shipperDropdownRef}>
                      <button
                        type="button"
                        onClick={handleShipperDropdown}
                        className="flex items-center justify-between w-full px-3 py-3 border border-gray-300 text-xs text-gray-900 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        {shipper || 'Select shipper'}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showShipperDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showShipperDropdown && shipperDropdownPos && ReactDOM.createPortal(
                        <div 
                          ref={shipperDropdownContentRef} 
                          style={{
                            position: 'fixed', 
                            top: shipperDropdownPos.top, 
                            left: shipperDropdownPos.left, 
                            width: shipperDropdownPos.width, 
                            zIndex: 1000
                          }} 
                          className="bg-white rounded-lg shadow-lg border border-gray-200"
                        >
                          <div className="p-2 max-h-64 overflow-y-auto">
                            <div className="space-y-1">
                              {["studio-apparel", "global-trade"].map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => {
                                    setShipper(option);
                                    setShowShipperDropdown(false);
                                  }}
                                  className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${
                                    shipper === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                  }`}
                                >
                                  {option === 'studio-apparel' ? 'Studio Apparel' : 'Global Trade Co'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>,
                        document.body
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {/* Add new shipper logic */}}
                      className="flex items-center gap-2 px-4 py-3 text-xs text-white bg-[#007bff] hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                    >
                      <Plus className="w-3 h-3" />
                      New Shipper
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Consignee <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1" ref={consigneeDropdownRef}>
                      <button
                        type="button"
                        onClick={handleConsigneeDropdown}
                        className="flex items-center justify-between w-full px-3 py-3 border border-gray-300 text-xs text-gray-900 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        {consignee || 'Select consignee'}
                        <ChevronDown className={`w-4 h-4 transition-transform ${showConsigneeDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      {showConsigneeDropdown && consigneeDropdownPos && ReactDOM.createPortal(
                        <div 
                          ref={consigneeDropdownContentRef} 
                          style={{
                            position: 'fixed', 
                            top: consigneeDropdownPos.top, 
                            left: consigneeDropdownPos.left, 
                            width: consigneeDropdownPos.width, 
                            zIndex: 1000
                          }} 
                          className="bg-white rounded-lg shadow-lg border border-gray-200"
                        >
                          <div className="p-2 max-h-64 overflow-y-auto">
                            <div className="space-y-1">
                              {["forward-supply", "logistics-hub"].map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  onClick={() => {
                                    setConsignee(option);
                                    setShowConsigneeDropdown(false);
                                  }}
                                  className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${
                                    consignee === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                  }`}
                                >
                                  {option === 'forward-supply' ? 'Forward Supply Co' : 'Logistics Hub'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>,
                        document.body
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {/* Add new consignee logic */}}
                      className="flex items-center gap-2 px-4 py-3 text-xs text-white bg-[#007bff] hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                    >
                      <Plus className="w-3 h-3" />
                      New Consignee
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
                <div className="relative" ref={transportModeDropdownRef}>
                  <button
                    type="button"
                    onClick={handleTransportModeDropdown}
                    className="flex items-center justify-between w-full px-3 py-3 border border-gray-300 text-xs text-gray-900 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {transportMode === 'sea' ? 'Sea Freight' : transportMode === 'air' ? 'Air Freight' : transportMode === 'land' ? 'Land Transport' : 'Select mode'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showTransportModeDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showTransportModeDropdown && transportModeDropdownPos && ReactDOM.createPortal(
                    <div 
                      ref={transportModeDropdownContentRef} 
                      style={{
                        position: 'fixed', 
                        top: transportModeDropdownPos.top, 
                        left: transportModeDropdownPos.left, 
                        width: transportModeDropdownPos.width, 
                        zIndex: 1000
                      }} 
                      className="bg-white rounded-lg shadow-lg border border-gray-200"
                    >
                      <div className="p-2 max-h-64 overflow-y-auto">
                        <div className="space-y-1">
                          {[
                            {value: 'sea', label: 'Sea Freight'},
                            {value: 'air', label: 'Air Freight'},
                            {value: 'land', label: 'Land Transport'}
                          ].map(option => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setTransportMode(option.value);
                                setShowTransportModeDropdown(false);
                              }}
                              className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${
                                transportMode === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Shipment Type <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={shipmentTypeDropdownRef}>
                  <button
                    type="button"
                    onClick={handleShipmentTypeDropdown}
                    className="flex items-center justify-between w-full px-3 py-3 border border-gray-300 text-xs text-gray-900 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {shipmentType === 'fcl' ? 'FCL (Full Container Load)' : shipmentType === 'lcl' ? 'LCL (Less Container Load)' : shipmentType === 'breakbulk' ? 'Breakbulk' : 'Select type'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showShipmentTypeDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showShipmentTypeDropdown && shipmentTypeDropdownPos && ReactDOM.createPortal(
                    <div 
                      ref={shipmentTypeDropdownContentRef} 
                      style={{
                        position: 'fixed', 
                        top: shipmentTypeDropdownPos.top, 
                        left: shipmentTypeDropdownPos.left, 
                        width: shipmentTypeDropdownPos.width, 
                        zIndex: 1000
                      }} 
                      className="bg-white rounded-lg shadow-lg border border-gray-200"
                    >
                      <div className="p-2 max-h-64 overflow-y-auto">
                        <div className="space-y-1">
                          {[
                            {value: 'fcl', label: 'FCL (Full Container Load)'},
                            {value: 'lcl', label: 'LCL (Less Container Load)'},
                            {value: 'breakbulk', label: 'Breakbulk'}
                          ].map(option => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setShipmentType(option.value);
                                setShowShipmentTypeDropdown(false);
                              }}
                              className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${
                                shipmentType === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Container Type</label>
                <div className="relative" ref={containerTypeDropdownRef}>
                  <button
                    type="button"
                    onClick={handleContainerTypeDropdown}
                    className="flex items-center justify-between w-full px-3 py-3 border border-gray-300 text-xs text-gray-900 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {containerType === '20ft' ? '20ft Standard' : containerType === '40ft' ? '40ft Standard' : containerType === '40ft-hc' ? '40ft High Cube' : containerType === '45ft' ? '45ft High Cube' : 'Select container type'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showContainerTypeDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showContainerTypeDropdown && containerTypeDropdownPos && ReactDOM.createPortal(
                    <div 
                      ref={containerTypeDropdownContentRef} 
                      style={{
                        position: 'fixed', 
                        top: containerTypeDropdownPos.top, 
                        left: containerTypeDropdownPos.left, 
                        width: containerTypeDropdownPos.width, 
                        zIndex: 1000
                      }} 
                      className="bg-white rounded-lg shadow-lg border border-gray-200"
                    >
                      <div className="p-2 max-h-64 overflow-y-auto">
                        <div className="space-y-1">
                          {[
                            {value: '20ft', label: '20ft Standard'},
                            {value: '40ft', label: '40ft Standard'},
                            {value: '40ft-hc', label: '40ft High Cube'},
                            {value: '45ft', label: '45ft High Cube'}
                          ].map(option => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setContainerType(option.value);
                                setShowContainerTypeDropdown(false);
                              }}
                              className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${
                                containerType === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Incoterms</label>
                <div className="relative" ref={incotermsDropdownRef}>
                  <button
                    type="button"
                    onClick={handleIncotermsDropdown}
                    className="flex items-center justify-between w-full px-3 py-3 border border-gray-300 text-xs text-gray-900 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {incoterms === 'FOB' ? 'FOB - Free on Board' : incoterms === 'EXW' ? 'EXW - Ex Works' : incoterms === 'DDP' ? 'DDP - Delivered Duty Paid' : incoterms === 'CIF' ? 'CIF - Cost, Insurance & Freight' : 'Select incoterms'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showIncotermsDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showIncotermsDropdown && incotermsDropdownPos && ReactDOM.createPortal(
                    <div 
                      ref={incotermsDropdownContentRef} 
                      style={{
                        position: 'fixed', 
                        top: incotermsDropdownPos.top, 
                        left: incotermsDropdownPos.left, 
                        width: incotermsDropdownPos.width, 
                        zIndex: 1000
                      }} 
                      className="bg-white rounded-lg shadow-lg border border-gray-200"
                    >
                      <div className="p-2 max-h-64 overflow-y-auto">
                        <div className="space-y-1">
                          {[
                            {value: 'FOB', label: 'FOB - Free on Board'},
                            {value: 'EXW', label: 'EXW - Ex Works'},
                            {value: 'DDP', label: 'DDP - Delivered Duty Paid'},
                            {value: 'CIF', label: 'CIF - Cost, Insurance & Freight'}
                          ].map(option => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setIncoterms(option.value);
                                setShowIncotermsDropdown(false);
                              }}
                              className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${
                                incoterms === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
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
                    checked={originCustoms}
                    onChange={e => setOriginCustoms(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">Export customs service required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={originTrucking}
                    onChange={e => setOriginTrucking(e.target.checked)}
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
                    checked={destinationCustoms}
                    onChange={e => setDestinationCustoms(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">Import customs service required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={destinationTrucking}
                    onChange={e => setDestinationTrucking(e.target.checked)}
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
                <div className="relative" ref={packageTypeDropdownRef}>
                  <button
                    type="button"
                    onClick={handlePackageTypeDropdown}
                    className="flex items-center justify-between w-full px-3 py-3 border border-gray-300 text-xs text-gray-900 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {packageType === 'pallet' ? 'Pallet' : packageType === 'box' ? 'Box' : packageType === 'crate' ? 'Crate' : packageType === 'carton' ? 'Carton' : 'Select package type'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showPackageTypeDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showPackageTypeDropdown && packageTypeDropdownPos && ReactDOM.createPortal(
                    <div 
                      ref={packageTypeDropdownContentRef} 
                      style={{
                        position: 'fixed', 
                        top: packageTypeDropdownPos.top, 
                        left: packageTypeDropdownPos.left, 
                        width: packageTypeDropdownPos.width, 
                        zIndex: 1000
                      }} 
                      className="bg-white rounded-lg shadow-lg border border-gray-200"
                    >
                      <div className="p-2 max-h-64 overflow-y-auto">
                        <div className="space-y-1">
                          {[
                            {value: 'pallet', label: 'Pallet'},
                            {value: 'box', label: 'Box'},
                            {value: 'crate', label: 'Crate'},
                            {value: 'carton', label: 'Carton'}
                          ].map(option => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setPackageType(option.value);
                                setShowPackageTypeDropdown(false);
                              }}
                              className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${
                                packageType === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}
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
                    checked={dangerousGoods}
                    onChange={e => setDangerousGoods(e.target.checked)}
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
                id="requireTagsCheckbox"
                checked={requireShipmentTags}
                onChange={(e) => setRequireShipmentTags(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="requireTagsCheckbox" className="text-xs text-gray-700">
                My consignee requires shipment tags
              </label>
            </div>

            {requireShipmentTags && (
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
};

export default BookingCreation;