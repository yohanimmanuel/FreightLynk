import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Calendar, Package, Truck, DollarSign, MapPin, Check, X, ChevronDown } from 'lucide-react';
import { usePOStore } from '@/store/poStore';
import type { PurchaseOrder, PODetail } from '@/store/poMockData';

// Reuse the same type definitions from POCreation
export interface POItem {
  id: string;
  lineNumber: number;
  productSKU: string;
  productName: string;
  crd: string;
  mabd: string;
  mode: 'Sea' | 'Air' | 'Road' | 'Rail' | '';
  destination: string;
  currency: 'USD' | 'CNY' | 'EUR' | 'IDR' | 'JPY' | 'GBP' | 'AUD' | '';
  unitCost: number | '';
  uom: 'PC' | 'KG' | 'CBM' | 'LBS' | 'TON' | '';
  requestedQty: number | '';
  bookedQty: number;
  bookingProgress: number;
}

export interface POData {
  poNumber: string;
  cargoReadyBy: string;
  mustArriveBy: string;
  buyer: string;
  seller: string;
  subjectedCarrier: string;
  status: 'Open' | 'Closed' | 'Pending';
  progress: string;
  exceptions: string[];
  items: POItem[];
}

interface PODetailsProps {
  poData: POData;
  onSave: (data: POData) => Promise<void>;
  onCancel: () => void;
}

const PODetails: React.FC<PODetailsProps> = ({ poData, onSave, onCancel }) => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showModeDropdowns, setShowModeDropdowns] = useState<{[key: string]: boolean}>({});
  const [showCurrencyDropdowns, setShowCurrencyDropdowns] = useState<{[key: string]: boolean}>({});
  const [showUomDropdowns, setShowUomDropdowns] = useState<{[key: string]: boolean}>({});
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const modeDropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const currencyDropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const uomDropdownRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  
  const [formData, setFormData] = useState<POData>(poData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  
  const setPurchaseOrders = usePOStore(state => state.setPurchaseOrders);
  const setPODetails = usePOStore(state => state.setPODetails);
  const purchaseOrders = usePOStore(state => state.purchaseOrders);
  const poDetails = usePOStore(state => state.poDetails);
  
  // Initialize form data when poData changes
  useEffect(() => {
    setFormData(poData);
  }, [poData]);
  
  // Dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Status dropdown
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node) &&
          statusButtonRef.current && !statusButtonRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }

      // Mode dropdowns
      Object.keys(showModeDropdowns).forEach(itemId => {
        const dropdownRef = modeDropdownRefs.current[itemId];
        const buttonRef = document.querySelector(`button[data-mode-dropdown="${itemId}"]`);
        if (showModeDropdowns[itemId] && dropdownRef && !dropdownRef.contains(event.target as Node) &&
            buttonRef && !buttonRef.contains(event.target as Node)) {
          setShowModeDropdowns(prev => ({...prev, [itemId]: false}));
        }
      });

      // Currency dropdowns
      Object.keys(showCurrencyDropdowns).forEach(itemId => {
        const dropdownRef = currencyDropdownRefs.current[itemId];
        const buttonRef = document.querySelector(`button[data-currency-dropdown="${itemId}"]`);
        if (showCurrencyDropdowns[itemId] && dropdownRef && !dropdownRef.contains(event.target as Node) &&
            buttonRef && !buttonRef.contains(event.target as Node)) {
          setShowCurrencyDropdowns(prev => ({...prev, [itemId]: false}));
        }
      });

      // UoM dropdowns
      Object.keys(showUomDropdowns).forEach(itemId => {
        const dropdownRef = uomDropdownRefs.current[itemId];
        const buttonRef = document.querySelector(`button[data-uom-dropdown="${itemId}"]`);
        if (showUomDropdowns[itemId] && dropdownRef && !dropdownRef.contains(event.target as Node) &&
            buttonRef && !buttonRef.contains(event.target as Node)) {
          setShowUomDropdowns(prev => ({...prev, [itemId]: false}));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModeDropdowns, showCurrencyDropdowns, showUomDropdowns]);

  // Track form changes
  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(poData);
    setIsChanged(hasChanged);
  }, [formData, poData]);

  // Dropdown options (same as POCreation)
  const statusOptions = ['Open', 'Closed', 'Pending'] as const;
  const modeOptions = ['Sea', 'Air', 'Road', 'Rail'] as const;
  const currencyOptions = ['USD', 'CNY', 'EUR', 'IDR', 'JPY', 'GBP', 'AUD'] as const;
  const uomOptions = ['PC', 'KG', 'CBM', 'LBS', 'TON'] as const;
 
  // Calculate progress based on booked items
  const calculateProgress = (items: POItem[]): string => {
    if (items.length === 0) return '0/0 lines booked';
    const bookedLines = items.filter(item => item.bookedQty > 0).length;
    return `${bookedLines}/${items.length} lines booked`;
  };

  // Handle PO-level field changes
  const handlePOFieldChange = (field: keyof POData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Update progress if needed
      ...(field === 'items' ? { progress: calculateProgress(value) } : {})
    }));
  };

  let lastId = Date.now();
  function generateUniqueId() {
    return ++lastId + Math.floor(Math.random() * 10000);
  }

  // Create new item
  const createNewItem = (): POItem => ({
    id: generateUniqueId().toString(),
    lineNumber: formData.items.length + 1,
    productSKU: '',
    productName: '',
    crd: '',
    mabd: '',
    mode: '',
    destination: '',
    currency: '',
    unitCost: 0,
    uom: '',
    requestedQty: 0,
    bookedQty: 0,
    bookingProgress: 0
  });

  // Add new item row
  const addItem = () => {
    const newItem = createNewItem();
    const updatedItems = [...formData.items, newItem].map((item, idx) => ({ ...item, lineNumber: idx + 1 }));
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      progress: calculateProgress(updatedItems)
    }));
  };

  // Remove item row
  const removeItem = (itemId: string) => {
    const updatedItems = formData.items
      .filter(item => item.id !== itemId)
      .map((item, index) => ({ ...item, lineNumber: index + 1 }));
    
    handlePOFieldChange('items', updatedItems);
  };

  // Handle item field changes
  const handleItemChange = (itemId: string, field: keyof POItem, value: any) => {
    const updatedItems = formData.items.map(item => {
      if (item.id === itemId) {
        let newValue = value;
        // Always parse numbers for numeric fields
        if (field === 'unitCost' || field === 'requestedQty' || field === 'bookedQty') {
          newValue = Number(value) || 0;
        }
        const updatedItem = { ...item, [field]: newValue };
        // Calculate booking progress for this item
        if (field === 'requestedQty' || field === 'bookedQty') {
          const requested = field === 'requestedQty' ? Number(newValue) || 0 : Number(item.requestedQty) || 0;
          const booked = field === 'bookedQty' ? Number(newValue) || 0 : Number(item.bookedQty) || 0;
          updatedItem.bookingProgress = requested > 0 ? Math.round((booked / requested) * 100) : 0;
        }
        return updatedItem;
      }
      return item;
    });
    handlePOFieldChange('items', updatedItems);
  };

  // Form validation with improved error messages
  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    // Validate PO-level fields
    if (!formData.cargoReadyBy) errors.push('Cargo Ready By date is required');
    if (!formData.mustArriveBy) errors.push('Must Arrive By date is required');
    if (!formData.buyer.trim()) errors.push('Buyer is required');
    if (!formData.seller.trim()) errors.push('Seller is required');
    
    // Validate items
    if (formData.items.length === 0) {
      errors.push('At least one item is required');
    } else {
      formData.items.forEach((item, index) => {
        if (!item.productSKU.trim()) errors.push(`Item ${index + 1}: Product SKU is required`);
        if (!item.productName.trim()) errors.push(`Item ${index + 1}: Product Name is required`);
        if (!item.mode) errors.push(`Item ${index + 1}: Mode is required`);
        if (!item.destination.trim()) errors.push(`Item ${index + 1}: Destination is required`);
        if (!item.currency) errors.push(`Item ${index + 1}: Currency is required`);
        if (!item.unitCost || Number(item.unitCost) <= 0) errors.push(`Item ${index + 1}: Valid unit cost is required`);
        if (!item.requestedQty || Number(item.requestedQty) <= 0) errors.push(`Item ${index + 1}: Valid requested quantity is required`);
      });
    }
    
    return errors;
  };

  // Enhanced onSave to update Zustand store
  const handleSave = async (data: POData) => {
    // Update PO in purchaseOrders
    const updatedPO: PurchaseOrder = {
      id: data.poNumber,
      cargoReadyBy: data.cargoReadyBy,
      mustArriveBy: data.mustArriveBy,
      buyer: data.buyer,
      seller: data.seller,
      subjectedCarrier: data.subjectedCarrier,
      status: data.status,
      progress: data.progress,
      exceptions: data.exceptions[0] || '--',
    };
    const updatedPurchaseOrders = purchaseOrders.map(po =>
      po.id === updatedPO.id ? updatedPO : po
    );
    setPurchaseOrders(updatedPurchaseOrders);

    // Update line items in poDetails
    const poNumber = parseInt(data.poNumber.replace('PO', ''));
    // Remove old items for this PO
    const filteredPODetails = poDetails.filter(item => item.poOrderNumber !== poNumber);
    // Add new items (ensure unique numeric id and correct poOrderNumber)
    const newPODetails: PODetail[] = data.items.map((item, idx) => ({
      id: Number(item.id),
      poOrderNumber: poNumber,
      productCode: item.productSKU,
      productName: item.productName,
      cargoReadyDate: item.crd,
      mustArriveDate: item.mabd,
      transportMode: item.mode,
      destination: item.destination,
      currency: item.currency,
      unitCost: `$${Number(item.unitCost).toFixed(2)}`,
      uom: item.uom,
      requested: Number(item.requestedQty)
    }));
    setPODetails([...filteredPODetails, ...newPODetails]);

    if (onSave) await onSave(data);
  };

  // Handle form submission with proper error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      await handleSave(formData);
    } catch (error) {
      console.error('Error saving PO:', error);
      alert('Error saving purchase order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto min-h-screen">
      <div className="">
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Edit Purchase Order</h1>
              <p className="text-sm text-gray-500 mt-1">PO #{formData.poNumber}</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Status:</span>
              <div className="relative">
                <button
                  ref={statusButtonRef}
                  type="button"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-900 text-sm rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {formData.status}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showStatusDropdown && (
                  <div 
                    ref={statusDropdownRef}
                    className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-32 max-h-80 overflow-hidden z-50"
                  >
                    <div className="p-2 max-h-64 overflow-y-auto">
                      <div className="space-y-1">
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => {
                              handlePOFieldChange('status', status);
                              setShowStatusDropdown(false);
                            }}
                            className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-sm transition-colors ${
                              formData.status === status ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* PO-Level Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-3">
              <h2 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <Package className="w-4 h-4 mr-2 text-[#007bff]" />
                Order Information
              </h2>
            </div>

            {/* Dates */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Cargo Ready By *
              </label>
              <input
                type="date"
                value={formData.cargoReadyBy}
                onChange={(e) => handlePOFieldChange('cargoReadyBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Must Arrive By *
              </label>
              <input
                type="date"
                value={formData.mustArriveBy}
                onChange={(e) => handlePOFieldChange('mustArriveBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-900 mb-2">Progress</label>
              <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-xs text-gray-900">
                {formData.progress}
              </div>
            </div>

            {/* Parties */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Buyer *</label>
              <input
                type="text"
                value={formData.buyer}
                onChange={(e) => handlePOFieldChange('buyer', e.target.value)}
                placeholder="Enter buyer name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Seller *</label>
              <input
                type="text"
                value={formData.seller}
                onChange={(e) => handlePOFieldChange('seller', e.target.value)}
                placeholder="Enter seller name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Subjected Carrier
              </label>
              <input
                type="text"
                value={formData.subjectedCarrier}
                onChange={(e) => handlePOFieldChange('subjectedCarrier', e.target.value)}
                placeholder="Enter carrier name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Items Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-gray-900 flex items-center">
                <Package className="w-4 h-4 mr-2 text-[#007bff]" />
                Order Items
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center px-4 py-2 bg-white text-sm text-[#007bff] rounded-md hover:bg-[#007bff] hover:text-white border border-[#007bff]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>

            {formData.items.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-gray-200">
                <Package className="w-8 h-8 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-xs">No items added yet. Click "Add Item" to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {formData.items.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-xs text-gray-900">Item #{item.lineNumber}</h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Product SKU *</label>
                        <input
                          type="text"
                          value={item.productSKU}
                          onChange={(e) => handleItemChange(item.id, 'productSKU', e.target.value)}
                          placeholder="Enter SKU"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Product Name *</label>
                        <input
                          type="text"
                          value={item.productName}
                          onChange={(e) => handleItemChange(item.id, 'productName', e.target.value)}
                          placeholder="Enter product name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">CRD</label>
                        <input
                          type="date"
                          value={item.crd}
                          onChange={(e) => handleItemChange(item.id, 'crd', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">MABD</label>
                        <input
                          type="date"
                          value={item.mabd}
                          onChange={(e) => handleItemChange(item.id, 'mabd', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Mode *</label>
                        <button
                          type="button"
                          data-mode-dropdown={item.id}
                          onClick={() => setShowModeDropdowns(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          {item.mode || 'Select mode'}
                          <ChevronDown className={`w-4 h-4 transition-transform ${showModeDropdowns[item.id] ? 'rotate-180' : ''}`} />
                        </button>
                        {showModeDropdowns[item.id] && (
                          <div
                            ref={el => {
                              if (el) {
                                modeDropdownRefs.current[item.id] = el;
                              } else {
                                delete modeDropdownRefs.current[item.id];
                              }
                            }}
                            className="absolute right-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50"
                          >
                            <div className="p-2">
                              {modeOptions.map((mode) => (
                                <button
                                  key={mode}
                                  type="button"
                                  onClick={() => {
                                    handleItemChange(item.id, 'mode', mode);
                                    setShowModeDropdowns(prev => ({ ...prev, [item.id]: false }));
                                  }}
                                  className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${item.mode === mode ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                >
                                  {mode}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1"><MapPin className="w-3 h-3 inline mr-1" />Destination *</label>
                        <input
                          type="text"
                          value={item.destination}
                          onChange={(e) => handleItemChange(item.id, 'destination', e.target.value)}
                          placeholder="Enter destination"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900"
                          required
                        />
                      </div>
                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Currency *</label>
                        <button
                          type="button"
                          data-currency-dropdown={item.id}
                          onClick={() => setShowCurrencyDropdowns(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          {item.currency || 'Select currency'}
                          <ChevronDown className={`w-4 h-4 transition-transform ${showCurrencyDropdowns[item.id] ? 'rotate-180' : ''}`} />
                        </button>
                        {showCurrencyDropdowns[item.id] && (
                          <div
                            ref={el => {
                              if (el) {
                                currencyDropdownRefs.current[item.id] = el;
                              } else {
                                delete currencyDropdownRefs.current[item.id];
                              }
                            }}
                            className="absolute right-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50"
                          >
                            <div className="p-2">
                              {currencyOptions.map((currency) => (
                                <button
                                  key={currency}
                                  type="button"
                                  onClick={() => {
                                    handleItemChange(item.id, 'currency', currency);
                                    setShowCurrencyDropdowns(prev => ({ ...prev, [item.id]: false }));
                                  }}
                                  className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${item.currency === currency ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                >
                                  {currency}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Unit Cost *</label>
                        <input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) => handleItemChange(item.id, 'unitCost', e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                      <div className="relative">
                        <label className="block text-xs font-medium text-gray-500 mb-1">UoM *</label>
                        <button
                          type="button"
                          data-uom-dropdown={item.id}
                          onClick={() => setShowUomDropdowns(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                          className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          {item.uom || 'Select UoM'}
                          <ChevronDown className={`w-4 h-4 transition-transform ${showUomDropdowns[item.id] ? 'rotate-180' : ''}`} />
                        </button>
                        {showUomDropdowns[item.id] && (
                          <div
                            ref={el => {
                              if (el) {
                                uomDropdownRefs.current[item.id] = el;
                              } else {
                                delete uomDropdownRefs.current[item.id];
                              }
                            }}
                            className="absolute right-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-50"
                          >
                            <div className="p-2">
                              {uomOptions.map((uom) => (
                                <button
                                  key={uom}
                                  type="button"
                                  onClick={() => {
                                    handleItemChange(item.id, 'uom', uom);
                                    setShowUomDropdowns(prev => ({ ...prev, [item.id]: false }));
                                  }}
                                  className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${item.uom === uom ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                >
                                  {uom}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Requested Qty *</label>
                        <input
                          type="number"
                          value={item.requestedQty}
                          onChange={(e) => handleItemChange(item.id, 'requestedQty', e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Booked Qty</label>
                        <input
                          type="text"
                          value={`${item.bookedQty} (${Number(item.requestedQty) > 0 ? Math.round((Number(item.bookedQty) / Number(item.requestedQty)) * 100) : 0}%)`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 bg-gray-50"
                          disabled
                        />
                      </div>
                      <div></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-[#007bff] text-sm text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PODetails;