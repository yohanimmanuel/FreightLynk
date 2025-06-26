import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Package, Truck, DollarSign, MapPin, Check, X } from 'lucide-react';

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
  currency: 'USD' | 'CNY' | 'EUR' | 'IDR' | 'JPY' | 'GBP' | '';
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
  const [formData, setFormData] = useState<POData>(poData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  
  // Track form changes
  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(poData);
    setIsChanged(hasChanged);
  }, [formData, poData]);

  // Dropdown options (same as POCreation)
  const statusOptions = ['Open', 'Closed', 'Pending'] as const;
  const modeOptions = ['Sea', 'Air', 'Road', 'Rail'] as const;
  const currencyOptions = ['USD', 'CNY', 'EUR', 'IDR', 'JPY', 'GBP'] as const;
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
      [field]: value
    }));
  };

  // Create new item
  const createNewItem = (): POItem => ({
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    lineNumber: formData.items.length + 1,
    productSKU: '',
    productName: '',
    crd: '',
    mabd: '',
    mode: '',
    destination: '',
    currency: '',
    unitCost: '',
    uom: '',
    requestedQty: '',
    bookedQty: 0,
    bookingProgress: 0
  });

  // Add new item row
  const addItem = () => {
    const newItem = createNewItem();
    const updatedItems = [...formData.items, newItem];
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
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      progress: calculateProgress(updatedItems)
    }));
  };

  // Handle item field changes
  const handleItemChange = (itemId: string, field: keyof POItem, value: any) => {
    const updatedItems = formData.items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        
        // Calculate booking progress for this item
        if (field === 'requestedQty' || field === 'bookedQty') {
          const requested = field === 'requestedQty' ? Number(value) || 0 : Number(item.requestedQty) || 0;
          const booked = field === 'bookedQty' ? Number(value) || 0 : Number(item.bookedQty) || 0;
          updatedItem.bookingProgress = requested > 0 ? Math.round((booked / requested) * 100) : 0;
        }
        
        return updatedItem;
      }
      return item;
    });

    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      progress: calculateProgress(updatedItems)
    }));
  };

  // Form validation
  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.cargoReadyBy) errors.push('Cargo Ready By date is required');
    if (!formData.mustArriveBy) errors.push('Must Arrive By date is required');
    if (!formData.buyer.trim()) errors.push('Buyer is required');
    if (!formData.seller.trim()) errors.push('Seller is required');
    
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving PO:', error);
      alert('Error saving purchase order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto min-h-screen p-4">
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
              <select
                value={formData.status}
                onChange={(e) => handlePOFieldChange('status', e.target.value as 'Open' | 'Closed' | 'Pending')}
                className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* PO-Level Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <div className="lg:col-span-3">
              <h2 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                <Package className="w-4 h-4 mr-2 text-blue-600" />
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
                <Package className="w-4 h-4 mr-2 text-blue-600" />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Product Info */}
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

                      {/* Dates */}
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

                      {/* Logistics */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Mode *</label>
                        <select
                          value={item.mode}
                          onChange={(e) => handleItemChange(item.id, 'mode', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900"
                          required
                        >
                          <option value="">Select mode</option>
                          {modeOptions.map(mode => (
                            <option key={mode} value={mode}>{mode}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          Destination *
                        </label>
                        <input
                          type="text"
                          value={item.destination}
                          onChange={(e) => handleItemChange(item.id, 'destination', e.target.value)}
                          placeholder="Enter destination"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900"
                          required
                        />
                      </div>

                      {/* Pricing */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          <DollarSign className="w-3 h-3 inline mr-1" />
                          Currency *
                        </label>
                        <select
                          value={item.currency}
                          onChange={(e) => handleItemChange(item.id, 'currency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900"
                          required
                        >
                          <option value="">Select currency</option>
                          {currencyOptions.map(currency => (
                            <option key={currency} value={currency}>{currency}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Unit Cost *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unitCost}
                          onChange={(e) => handleItemChange(item.id, 'unitCost', e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900"
                          required
                        />
                      </div>

                      {/* Quantities */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">UoM *</label>
                        <select
                          value={item.uom}
                          onChange={(e) => handleItemChange(item.id, 'uom', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900"
                          required
                        >
                          <option value="">Select UoM</option>
                          {uomOptions.map(uom => (
                            <option key={uom} value={uom}>{uom}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Requested Qty *</label>
                        <input
                          type="number"
                          min="1"
                          value={item.requestedQty}
                          onChange={(e) => handleItemChange(item.id, 'requestedQty', e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Booked Qty</label>
                        <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-xs text-gray-900">
                          {item.bookedQty} ({item.bookingProgress}%)
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {isChanged && (
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  You have unsaved changes
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  if (!isChanged || confirm('Are you sure you want to discard your changes?')) {
                    onCancel();
                  }
                }}
                className="px-6 py-2 border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isChanged}
                className={`px-6 py-2 text-sm text-white rounded-md ${
                  isSubmitting || !isChanged
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#007bff] hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PODetails;