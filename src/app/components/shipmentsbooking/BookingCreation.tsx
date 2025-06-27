import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Package, Users, Truck, MapPin, Target, Scale, FileText, Tag, MessageSquare, Save, Send, Info, Plus, X } from 'lucide-react';
import POManagementTable, { 
  PurchaseOrder, 
  PODetail, 
  purchaseOrdersData, 
  poDetailsData, 
} from '../purchasesorders/POManagementTable';


const BookingCreation = () => {
  const [requireShipmentTags, setRequireShipmentTags] = useState(true);
  const [tradeRole, setTradeRole] = useState<'shipper' | 'consignee'>('shipper');

  const [selectedPOs, setSelectedPOs] = useState<{
    poId: string;
    selectedItems: number[];
    bookedQuantities: Record<number, number>;
  }[]>([]);

  useEffect(() => {
    const bookingData = sessionStorage.getItem('bookingData');
    if (bookingData) {
      setSelectedPOs(JSON.parse(bookingData));
      sessionStorage.removeItem('bookingData'); // Clean up
    }
  }, []);

  const getSelectedPODetails = () => {
    return selectedPOs
      .map(poSelection => {
        const po = purchaseOrdersData.find(p => p.id === poSelection.poId);
        if (!po) return null; // Filter out undefined POs
        
        const items = poDetailsData.filter(item => 
          poSelection.selectedItems.includes(item.id) && 
          item.poOrderNumber === parseInt(poSelection.poId.replace('PO', ''))
        );
        return { po, items, selection: poSelection };
      })
      .filter((data): data is NonNullable<typeof data> => data !== null && data.items.length > 0);
  };

  const renderPOReview = () => {
    const selectedData = getSelectedPODetails();
    
    if (selectedData.length === 0) {
      return <div className="text-center py-6 text-gray-500">No POs selected</div>;
    }

    // Create display items combining both data sources
    const displayItems = selectedData.flatMap(({ items, selection }) => 
      items.map(item => ({
        ...item,
        booked: selection.bookedQuantities[item.id] || item.booked || 0
      }))
    );

    return (
      <POManagementTable 
        view="summary"
        purchaseOrders={selectedData.map(d => d.po)}
        poDetails={displayItems}
        onEditOrder={() => {}}
      />
    );
  };

  const [formData, setFormData] = useState({
    shipmentName: 'PO 1057, PO 1055',
    shipper: '',
    consignee: '',
    transportMode: 'sea',
    shipmentType: 'fcl',
    containerType: '',
    incoterms: '',
    originLocation: '',
    originPort: '',
    originCustoms: false,
    cargoReadyDate: '',
    originTrucking: false,
    destinationLocation: '',
    destinationPort: '',
    destinationCustoms: false,
    targetDeliveryDate: '',
    destinationTrucking: false,
    weight: '',
    volume: '',
    packageType: '',
    additionalNotes: '',
    productName: '',
    goodsDescription: '',
    hsCode: '',
    dangerousGoods: false,
    poNumber: '',
    skuNumber: '',
    specialInstructions: ''
  });

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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrefillShipment = (shipmentId: string) => {
    // Mock prefill logic
    const mockData = {
      shipper: 'Studio Apparel',
      consignee: 'Forward Supply Co',
      transportMode: 'sea',
      shipmentType: 'fcl',
      originLocation: 'Shanghai, China',
      destinationLocation: 'Los Angeles, CA'
    };
    setFormData(prev => ({ ...prev, ...mockData }));
  };

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

      <form className="space-y-2 -mt-2">
        {/* Pre-fill Booking */}
        <div className="border border-gray-200 rounded-lg mb-2 overflow-hidden">
          <SectionHeader title="Pre-fill Booking" icon={Package} section="prefill" />
          <FormSection section="prefill">
            <div className="bg-white rounded-lg">
              <p className="text-xs text-gray-700 mb-3">Start this booking from a template or previous shipment</p>
              {previousShipments.length > 0 ? (
                <div className="space-y-2">
                  <select 
                    className="w-full p-2 text-gray-900 text-xs border border-gray-200 rounded-lg"
                    onChange={(e) => e.target.value && handlePrefillShipment(e.target.value)}
                  >
                    <option value="">Select a previous shipment to pre-fill</option>
                    {previousShipments.map(shipment => (
                      <option key={shipment.id} value={shipment.id}>
                        {shipment.name} - {shipment.date}
                      </option>
                    ))}
                  </select>
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
                value={formData.shipmentName}
                onChange={(e) => handleInputChange('shipmentName', e.target.value)}
                className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg"
                placeholder="Enter shipment name for easy recognition"
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
                  <select
                    value={formData.shipper}
                    onChange={(e) => handleInputChange('shipper', e.target.value)}
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select shipper</option>
                    <option value="studio-apparel">Studio Apparel</option>
                    <option value="global-trade">Global Trade Co</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {/* Add new shipper logic */}}
                    className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 text-xs text-white bg-[#007bff] hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Register New Shipper
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Consignee <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.consignee}
                    onChange={(e) => handleInputChange('consignee', e.target.value)}
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select consignee</option>
                    <option value="forward-supply">Forward Supply Co</option>
                    <option value="logistics-hub">Logistics Hub</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {/* Add new consignee logic */}}
                    className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 text-xs text-white bg-[#007bff] hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Register New Consignee
                  </button>
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
                <select
                  value={formData.transportMode}
                  onChange={(e) => handleInputChange('transportMode', e.target.value)}
                  className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sea">Sea Freight</option>
                  <option value="air">Air Freight</option>
                  <option value="land">Land Transport</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Shipment Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.shipmentType}
                  onChange={(e) => handleInputChange('shipmentType', e.target.value)}
                  className="w-full text-xs text-gray-900 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="fcl">FCL (Full Container Load)</option>
                  <option value="lcl">LCL (Less Container Load)</option>
                  <option value="breakbulk">Breakbulk</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Container Type</label>
                <select
                  value={formData.containerType}
                  onChange={(e) => handleInputChange('containerType', e.target.value)}
                  className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select container type</option>
                  <option value="20ft">20ft Standard</option>
                  <option value="40ft">40ft Standard</option>
                  <option value="40ft-hc">40ft High Cube</option>
                  <option value="45ft">45ft High Cube</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Incoterms</label>
                <select
                  value={formData.incoterms}
                  onChange={(e) => handleInputChange('incoterms', e.target.value)}
                  className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select incoterms</option>
                  <option value="FOB">FOB - Free on Board</option>
                  <option value="EXW">EXW - Ex Works</option>
                  <option value="DDP">DDP - Delivered Duty Paid</option>
                  <option value="CIF">CIF - Cost, Insurance & Freight</option>
                </select>
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
                    value={formData.originLocation}
                    onChange={(e) => handleInputChange('originLocation', e.target.value)}
                    placeholder="Enter origin address"
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Origin Port <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.originPort}
                    onChange={(e) => handleInputChange('originPort', e.target.value)}
                    placeholder="Search ports"
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    value={formData.cargoReadyDate}
                    onChange={(e) => handleInputChange('cargoReadyDate', e.target.value)}
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                    value={formData.destinationLocation}
                    onChange={(e) => handleInputChange('destinationLocation', e.target.value)}
                    placeholder="Enter destination address"
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Destination Port <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.destinationPort}
                    onChange={(e) => handleInputChange('destinationPort', e.target.value)}
                    placeholder="Search ports"
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    value={formData.targetDeliveryDate}
                    onChange={(e) => handleInputChange('targetDeliveryDate', e.target.value)}
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="0"
                  className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                  placeholder="0.00"
                  className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Package Type</label>
                <select
                  value={formData.packageType}
                  onChange={(e) => handleInputChange('packageType', e.target.value)}
                  className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select package type</option>
                  <option value="pallet">Pallet</option>
                  <option value="box">Box</option>
                  <option value="crate">Crate</option>
                  <option value="carton">Carton</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Additional Notes</label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                rows={3}
                placeholder="Any additional cargo specifications or handling requirements"
                className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    value={formData.productName}
                    onChange={(e) => handleInputChange('productName', e.target.value)}
                    placeholder="Enter product name"
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    HS Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.hsCode}
                    onChange={(e) => handleInputChange('hsCode', e.target.value)}
                    placeholder="Enter HS code"
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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
                  placeholder="Detailed description of goods (English and Chinese)"
                  className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                    value={formData.poNumber}
                    onChange={(e) => handleInputChange('poNumber', e.target.value)}
                    placeholder="Enter PO number"
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    SKU Number
                  </label>
                  <input
                    type="text"
                    value={formData.skuNumber}
                    onChange={(e) => handleInputChange('skuNumber', e.target.value)}
                    placeholder="Enter SKU number"
                    className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                rows={4}
                placeholder="Any additional information, handling notes, or special alerts for this shipment"
                className="w-full p-3 text-xs text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </FormSection>
        </div>

        {/* Sticky Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3 justify-end">
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-3 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save as Draft
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 text-sm bg-[#007bff] text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="w-4 h-4" />
            Submit Booking
          </button>
        </div>
      </form>
    </div>
  )
};

export default BookingCreation;