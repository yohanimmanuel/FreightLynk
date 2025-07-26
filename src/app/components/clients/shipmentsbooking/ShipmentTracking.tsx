import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Maximize2, Minimize2, MapPin, X } from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';

interface TimelineEvent {
  step: string;
  date: string;
  location: string;
  completed: boolean;
}

interface Courier {
  name: string;
  avatar: string;
}

interface Origin {
  city: string;
  country: string;
}

interface Shipment {
  id: string;
  status: string;
  statusDot: string;
  destination: string;
  packageCount: number;
  goodsDescription: string;
  arrivalDate: string;
  arrivalTime: string;
  distance: string;
  deliveryTime: string;
  weight: string;
  timeline: TimelineEvent[];
  courier: Courier;
  poNumbers?: string[];
  origin: Origin;
  shipper: string;
  consignee: string;
  carrier: string;
  progress: number;
  transportMode?: string;
  containerTypes?: any[]; // Added for FCL
  truckTypes?: any[]; // Added for FTL
  shipmentTypeValue?: string; // Added for LCL/AIR/LTL
  volume?: string; // Added for LCL/AIR/LTL
  milestones?: any[]; // Added for milestones
}

const ShipmentTracking: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedShipment, setExpandedShipment] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTransportMode, setSelectedTransportMode] = useState('all');

  // Transport mode options
  const transportModes = [
    { value: 'all', label: 'All' },
    { value: 'ocean', label: 'Ocean' },
    { value: 'air', label: 'Air' },
    { value: 'road', label: 'Road' }
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleTransportModeSelect = (mode: string) => {
    setSelectedTransportMode(mode);
    setIsDropdownOpen(false);
  };

  // Load confirmedBookings from API via Zustand store
  const { confirmedBookings, loadBookings } = useBookingStore();

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Map confirmedBookings to Shipment card structure
  const shipments: Shipment[] = Array.isArray(confirmedBookings)
    ? confirmedBookings.map((b: any) => ({
        id: b.bookingId || b.id,
        status: b.status || 'Pending',
        statusDot:
          b.status === 'Delivered'
            ? 'bg-green-500'
            : b.status === 'In Transit'
            ? 'bg-orange-500'
            : b.status === 'Pending'
            ? 'bg-red-500'
            : 'bg-gray-500',
        destination: b.destination || '',
        packageCount: b.packageCount || b.pieces || 1,
        goodsDescription: b.productName || b.goodsDescription || '',
        arrivalDate: b.targetDeliveryDate || b.eta || '',
        arrivalTime: b.targetDeliveryDate || b.eta || '',
        distance: '',
        deliveryTime: '',
        weight: b.weight || '',
        timeline: b.timeline || [
          { step: 'To be confirmed by forwarder/provider', date: '', location: '', completed: false },
        ],
        courier: b.courier || { name: '', avatar: '' },
        poNumbers: b.poNumber ? [b.poNumber] : [],
        origin:
          typeof b.origin === 'string'
            ? { city: b.origin, country: '' }
            : b.origin && typeof b.origin === 'object' && 'city' in b.origin && 'country' in b.origin
            ? b.origin
            : { city: '', country: '' },
        shipper: b.shipper || '',
        consignee: b.consignee || '',
        carrier: b.carrier || 'To be confirmed by forwarder/provider',
        progress: b.progress || 0,
        transportMode: b.transportMode || b.mode || '',
        containerTypes: b.containerTypes || [], // Added for FCL
        truckTypes: b.truckTypes || [], // Added for FTL
        shipmentTypeValue: b.shipmentTypeValue || '', // Added for LCL/AIR/LTL
        volume: b.volume || '', // Added for LCL/AIR/LTL
        milestones: b.milestones || [], // Added for milestones
      }))
    : [];

  // --- BEGIN: Right Panel/Overlay/Map Tracker logic from ShipmentTrackingList.tsx ---
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showMapOverlay, setShowMapOverlay] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShipmentClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setShowMapOverlay(true);
  };

  const toggleExpanded = (shipmentId: string) => {
    setExpandedShipment(expandedShipment === shipmentId ? null : shipmentId);
  };

  // Filter shipments by search and transport mode
  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.goodsDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode =
      selectedTransportMode === 'all' ||
      (shipment.transportMode || '').toLowerCase() === selectedTransportMode;
    return matchesSearch && matchesMode;
  });

  // --- END: Right Panel/Overlay/Map Tracker logic ---

  const getStatusColors = (status: Shipment['status']) => {
    switch (status) {
      case 'Delivered':
        return {
          colorClass: 'bg-green-100 text-green-600',
          dotClass: 'bg-green-500',
        };
      case 'In Transit':
        return {
          colorClass: 'bg-orange-100 text-orange-600',
          dotClass: 'bg-orange-500',
        };
      case 'Pending':
        return {
          colorClass: 'bg-red-100 text-red-600',
          dotClass: 'bg-red-500',
        };
      default:
        return {
          colorClass: 'bg-gray-100 text-gray-600',
          dotClass: 'bg-gray-500',
        };
    }
  };


  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {/* Left Panel - Shipment List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 -mt-1">
            <h1 className="text-2xl font-bold text-gray-900">Tracking</h1>
          </div>

          {/* Search and Transport Mode Dropdown */}
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search tracking ID, destination, or goods"
                className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative min-w-[110px]">
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-between w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>{transportModes.find((mode) => mode.value === selectedTransportMode)?.label}</span>
                {isDropdownOpen ? (
                  <ChevronUp className="w-3 h-3 ml-1" />
                ) : (
                  <ChevronDown className="w-3 h-3 ml-1" />
                )}
              </button>
              {isDropdownOpen && (
                <div className="p-2 absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[110px]">
                  {transportModes.map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => handleTransportModeSelect(mode.value)}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                        selectedTransportMode === mode.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Shipment Cards */}
          <div className="space-y-2 overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(100vh - 190px)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {filteredShipments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400 text-base font-medium">
                No bookings data shown
              </div>
            ) : (
              filteredShipments.map((shipment: Shipment) => {
                const statusColors = getStatusColors(shipment.status);
                return (
                  <div key={shipment.id} className="text-md bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div
                      className="p-4 cursor-pointer transition-colors"
                      onClick={() => handleShipmentClick(shipment)}
                    >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusColors.dotClass}`} />
                        <span className="font-semibold text-sm text-black">{shipment.id}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors.colorClass}`}>
                        {shipment.status}
                      </span>
                    </div>

                    <div className="space-y-1 mb-2">
                      <p className="text-xs text-gray-500">Arrived on {shipment.arrivalDate}</p>
                      <p className="text-xs text-gray-900 font-medium">{shipment.goodsDescription}</p>
                    </div>

                    <div className="border-t">
                    <button
                      onClick={() => expandedShipment === shipment.id ? setExpandedShipment(null) : setExpandedShipment(shipment.id)}
                      className="w-full flex items-center justify-between mt-4 text-xs text-gray-500 transition-colors"
                    >
                      <span>View tracking details</span>
                      {expandedShipment === shipment.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedShipment === shipment.id && (
                      <div className="mt-4 white space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-gray-500">Shipper</p>
                            <p className="text-gray-900 font-medium">{shipment.shipper}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Consignee</p>
                            <p className="text-gray-900 font-medium">{shipment.consignee}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Origin</p>
                            <p className="text-gray-900 font-medium">{`${shipment.origin.city}, ${shipment.origin.country}`}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Destination</p>
                            <p className="text-gray-900 font-medium">{shipment.destination}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Arrival time</p>
                            <p className="text-gray-900 font-medium">{shipment.arrivalTime}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">PO Numbers</p>
                            <p className="text-gray-900 font-medium">{shipment.poNumbers?.join(', ')}</p>
                          </div>
                        </div>
                        <div className="pt-3 space-y-3">
                          {/* Milestone Data */}
                          <div>
                            <p className="text-xs text-gray-900 font-medium mb-3">Milestones</p>
                            {Array.isArray(shipment.milestones) && shipment.milestones.length > 0 ? (
                              <ul className="list-disc ml-4">
                                {shipment.milestones.map((ms: any, idx: number) => (
                                  <li key={idx} className="text-xs text-gray-700">
                                    <span className="font-medium">{ms.step}</span>
                                    {ms.description && (
                                      <span className="block text-gray-500 mt-1">{ms.description}</span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-gray-400">No milestones yet.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              );
            })
           )}
          </div>
        </div>

        {/* Right Panel - Map Tracker and Shipment Details Overlay */}
        <div className="lg:col-span-4 relative">
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden h-[calc(100vh-96px)] sticky">
            {/* Map Controls - Top Right */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center bg-white/90 backdrop-blur-sm text-blue-600 p-2 border border-gray-300 rounded-md hover:bg-white shadow-sm transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Map Background */}
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                <p>Interactive Map View</p>
                <p className="text-sm">Click on a shipment to view tracking details</p>
              </div>
            </div>

            {/* Shipment Details Overlay */}
            {showMapOverlay && selectedShipment && (
              <div className="absolute bottom-3 left-3 right-3 bg-white rounded-t-lg shadow-lg border-t border-gray-200">
                <div className="p-3">
                  {/* Overlay Content */}
                  <div className="space-y-3">
                    {/* Tracking ID and Status - Side by side */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500">Tracking ID:</span>
                        <span className="text-sm font-bold text-[#007bff]">#{selectedShipment.id}</span>
                      </div>
                      <button
                        onClick={() => setShowMapOverlay(false)}
                        className="text-gray-500 hover:text-gray-700 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Milestone Data Below Tracking ID */}
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-xs text-gray-900 font-medium mb-0">Status Update:</p>
                      {Array.isArray(selectedShipment.milestones) && selectedShipment.milestones.length > 0 ? (
                        <span className="text-xs text-blue-700 font-semibold rounded-full px-2 py-1 bg-blue-100 border border-blue-300">
                          {selectedShipment.milestones[selectedShipment.milestones.length - 1].step}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No status updates yet.</span>
                      )}
                    </div>

                    {/* Progress Bar with Origin/Destination */}
                    <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs">
                          <p className="text-gray-500">From</p>
                          <p className="text-gray-900 font-medium">{selectedShipment.origin.city}, {selectedShipment.origin.country}</p>
                        </div>
                        <div className="text-xs">
                          <p className="text-gray-500">Carrier</p>
                          <p className="text-gray-900 font-medium">{selectedShipment.carrier}</p>
                        </div>
                        <div className="text-xs text-right">
                          <p className="text-gray-500">To</p>
                          <p className="text-gray-900 font-medium">{selectedShipment.destination}</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 relative">
                        <div className={`h-2 rounded-full bg-blue-500`} style={{ width: `${selectedShipment.progress}%` }}></div>
                        {/* Progress circle */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white bg-blue-500 shadow"
                          style={{
                            left: `calc(${selectedShipment.progress}% - 8px)`
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Shipment Details - 3 columns */}
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="text-gray-500 mb-1">Est. package arrival</p>
                        <p className="text-gray-900 font-medium">{selectedShipment.arrivalDate} • {selectedShipment.arrivalTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">PO Numbers</p>
                        <p className="text-gray-900 font-medium">{selectedShipment.poNumbers ? selectedShipment.poNumbers.join(', ') : ''}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Goods Description</p>
                        <p className="text-gray-900 font-medium">{selectedShipment.goodsDescription}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Expanded Map Modal (remains the same) */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg text-black font-semibold">Live Shipment Map</h2>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  {/* Expanded Map Content */}
                  <div className="flex-1 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Expanded Map View</p>
                        <p className="text-sm">All shipments shown in full screen</p>
                      </div>
                    </div>
                    {/* Map Controls in Modal */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <button
                        onClick={() => setIsModalOpen(false)}
                        className="flex items-center justify-center bg-white/90 backdrop-blur-sm text-blue-600 p-2 border border-gray-300 rounded-md hover:bg-white shadow-sm transition-colors"
                      >
                        <Minimize2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentTracking;
