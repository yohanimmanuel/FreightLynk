import React, { useState } from 'react';
import { Search, Plus, ChevronRight, MapPin, Clock, Package, Truck, User, Phone, ChevronDown, ChevronUp, X, Maximize2, Minimize2 } from 'lucide-react';

// TypeScript interfaces
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
}

const ShipmentTrackingList = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [expandedShipment, setExpandedShipment] = useState<string | null>(null);
  const [showMapOverlay, setShowMapOverlay] = useState<boolean>(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTransportMode, setSelectedTransportMode] = useState('all');

  // Sample shipment data with FL tracking IDs
  const shipments: Shipment[] = [
    {
      id: 'FL-5023',
      status: 'Delivered',
      statusDot: 'bg-green-500',
      destination: 'Jakarta, Indonesia',
      packageCount: 2,
      goodsDescription: 'Electronics (Laptops & Accessories)',
      arrivalDate: '25 February 2025',
      arrivalTime: '18:00 PM',
      distance: '153 km',
      deliveryTime: '2 hours 22 minutes',
      weight: '29.86 kg',
      timeline: [
        { step: 'Package being checked', date: 'February 19, 2025 • 18:49 PM', location: 'Jakarta, Indonesia', completed: true },
        { step: 'Package in transit', date: 'February 19, 2025 • 19:45 PM', location: 'Bekasi, Indonesia', completed: true },
        { step: 'Package in transit', date: 'February 19, 2025 • 21:30 PM', location: 'Purwakarta, Indonesia', completed: true },
        { step: 'Package arrive at final destination', date: 'February 19, 2025 • 22:12 PM', location: 'Bandung, Indonesia', completed: true }
      ],
      courier: { name: 'Joko Widodo', avatar: '👤' }
    },
    {
      id: 'FL-5024',
      status: 'In transit',
      statusDot: 'bg-orange-500',
      destination: 'Surabaya, Indonesia',
      packageCount: 3,
      goodsDescription: 'Furniture (Office Chairs)',
      arrivalDate: '26 February 2025',
      arrivalTime: '14:30 PM',
      distance: '287 km',
      deliveryTime: '4 hours 15 minutes',
      weight: '45.32 kg',
      timeline: [
        { step: 'Package being processed', date: 'February 20, 2025 • 09:15 AM', location: 'Jakarta, Indonesia', completed: true },
        { step: 'Package in transit', date: 'February 20, 2025 • 11:20 AM', location: 'Cirebon, Indonesia', completed: true },
        { step: 'Package in transit', date: 'February 20, 2025 • 15:45 PM', location: 'Semarang, Indonesia', completed: false },
        { step: 'Package arrive at final destination', date: 'Estimated', location: 'Surabaya, Indonesia', completed: false }
      ],
      courier: { name: 'Siti Nurhaliza', avatar: '👤' }
    },
    {
      id: 'FL-5025',
      status: 'Pending',
      statusDot: 'bg-red-500',
      destination: 'Medan, Indonesia',
      packageCount: 1,
      goodsDescription: 'Medical Equipment',
      arrivalDate: '27 February 2025',
      arrivalTime: '16:00 PM',
      distance: '425 km',
      deliveryTime: '6 hours 30 minutes',
      weight: '12.45 kg',
      timeline: [
        { step: 'Package received', date: 'February 20, 2025 • 14:00 PM', location: 'Jakarta, Indonesia', completed: true },
        { step: 'Awaiting processing', date: 'Pending', location: 'Jakarta Warehouse', completed: false },
        { step: 'Package in transit', date: 'Scheduled', location: 'In Transit', completed: false },
        { step: 'Package arrive at final destination', date: 'Estimated', location: 'Medan, Indonesia', completed: false }
      ],
      courier: { name: 'Ahmad Rahman', avatar: '👤' }
    },
    {
      id: 'FL-5026',
      status: 'In transit',
      statusDot: 'bg-orange-500',
      destination: 'Bali, Indonesia',
      packageCount: 4,
      goodsDescription: 'Art Supplies & Paintings',
      arrivalDate: '28 February 2025',
      arrivalTime: '12:00 PM',
      distance: '318 km',
      deliveryTime: '5 hours 45 minutes',
      weight: '67.89 kg',
      timeline: [
        { step: 'Package being checked', date: 'February 20, 2025 • 16:30 PM', location: 'Jakarta, Indonesia', completed: true },
        { step: 'Package in transit', date: 'February 20, 2025 • 18:15 PM', location: 'Yogyakarta, Indonesia', completed: true },
        { step: 'Package in transit', date: 'February 21, 2025 • 08:00 AM', location: 'Surabaya, Indonesia', completed: false },
        { step: 'Package arrive at final destination', date: 'Estimated', location: 'Denpasar, Bali', completed: false }
      ],
      courier: { name: 'Made Wijaya', avatar: '👤' }
    },
    {
      id: 'FL-5027',
      status: 'Delivered',
      statusDot: 'bg-green-500',
      destination: 'Makassar, Indonesia',
      packageCount: 2,
      goodsDescription: 'Clothing & Apparel',
      arrivalDate: '24 February 2025',
      arrivalTime: '13:45 PM',
      distance: '198 km',
      deliveryTime: '3 hours 20 minutes',
      weight: '34.67 kg',
      timeline: [
        { step: 'Package being checked', date: 'February 18, 2025 • 10:00 AM', location: 'Jakarta, Indonesia', completed: true },
        { step: 'Package in transit', date: 'February 18, 2025 • 15:30 PM', location: 'Surabaya, Indonesia', completed: true },
        { step: 'Package in transit', date: 'February 19, 2025 • 09:15 AM', location: 'Makassar Port', completed: true },
        { step: 'Package delivered', date: 'February 19, 2025 • 13:45 PM', location: 'Makassar, Indonesia', completed: true }
      ],
      courier: { name: 'Andi Mappasomba', avatar: '👤' }
    }
  ];

  const getStatusColors = (status: Shipment['status']) => {
  switch (status) {
    case 'Delivered':
      return {
        colorClass: 'bg-green-100 text-green-600',
        dotClass: 'bg-green-500'
      };
    case 'In transit':
      return {
        colorClass: 'bg-orange-100 text-orange-600',
        dotClass: 'bg-orange-500'
      };
    case 'Pending':
      return {
        colorClass: 'bg-red-100 text-red-600',
        dotClass: 'bg-red-500'
      };
    default:
      return {
        colorClass: 'bg-gray-100 text-gray-600',
        dotClass: 'bg-gray-500'
      };
  }
};


  const filteredShipments = shipments.filter(shipment =>
    shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.goodsDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShipmentClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setShowMapOverlay(true);
  };

  const toggleExpanded = (shipmentId: string) => {
    setExpandedShipment(expandedShipment === shipmentId ? null : shipmentId);
  };

   const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleTransportModeSelect = (mode: string) => {
    setSelectedTransportMode(mode);
    setIsDropdownOpen(false);
  };

  const transportModes = [
    { value: 'all', label: 'All' },
    { value: 'ocean', label: 'Ocean' },
    { value: 'air', label: 'Air' },
    { value: 'road', label: 'Road' }
  ];

  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
        {/* Left Panel - Shipment List */}
        <div className="lg:col-span-2 space-y-4">            
        {/* Header */}
        <div className="flex justify-between items-center mb-4 -mt-1">
            <h1 className="text-2xl font-bold text-gray-900">Tracking</h1>
            <div className="flex justify-end">
            <button className="bg-[#007bff] text-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
                <Plus size={16} />
                Add Order
            </button>
            </div>
        </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search tracking ID, destination, or goods"
              className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Shipment Cards */}
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 190px)' }}>
            {filteredShipments.map((shipment) => {
              const statusColors = getStatusColors(shipment.status);
              return (
                <div key={shipment.id} className="text-md bg-white rounded-lg border shadow-sm overflow-hidden">
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleShipmentClick(shipment)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusColors.dotClass}`} />
                        <span className="font-semibold text-black">{shipment.id}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors.colorClass}`}>
                        {shipment.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Arrived on {shipment.arrivalDate}</p>
                      <p className="text-xs text-gray-900 font-medium">{shipment.goodsDescription}</p>
                    </div>
                  </div>

                  <div className="border-t -mt-2">
                    <button
                      onClick={() => toggleExpanded(shipment.id)}
                      className="w-full flex items-center justify-between p-3 text-xs text-gray-500 transition-colors"
                    >
                      <span>View tracking details</span>
                      {expandedShipment === shipment.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expandedShipment === shipment.id && (
                      <div className="p-3 bg-gray-50 space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="text-gray-500">Destination</p>
                            <p className="text-gray-900 font-medium">{shipment.destination}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Total items</p>
                            <p className="text-gray-900 font-medium">{shipment.packageCount}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Arrival time</p>
                            <p className="text-gray-900 font-medium">{shipment.arrivalTime}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Weight</p>
                            <p className="text-gray-900 font-medium">{shipment.weight}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              {shipment.courier.avatar}
                            </div>
                            <span className="text-xs text-gray-900">{shipment.courier.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-1 border rounded hover:bg-gray-100">
                              <MapPin size={16} />
                            </button>
                            <button className="p-1 border rounded hover:bg-gray-100">
                              <Phone size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="pt-3 space-y-3">
                          <p className="text-xs text-gray-900 font-medium">Timeline</p>
                          {shipment.timeline.map((event, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className={`w-2 h-2 text-xs rounded-full mt-2 ${event.completed ? 'bg-[#007bff]' : 'bg-gray-300'}`} />
                              <div>
                                <p className={`text-xs text-gray-900 ${event.completed ? 'font-medium' : 'text-gray-500'}`}>
                                  {event.step}
                                </p>
                                <p className="text-xs text-gray-500">{event.date}</p>
                                <p className="text-xs text-gray-500">{event.location}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      {/* Right Panel - Map */}
      <div className="lg:col-span-4">
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden h-[calc(100vh-96px)] sticky">
            {/* Map Controls - Top Right */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <div className="relative">
                <button
                onClick={toggleDropdown}
                className="flex items-center justify-between bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-300 rounded-md px-3 py-2 text-xs shadow-sm hover:bg-white transition-colors min-w-[80px]"
                >
                <span>{transportModes.find(mode => mode.value === selectedTransportMode)?.label}</span>
                {isDropdownOpen ? (
                    <ChevronUp className="w-3 h-3 ml-1" />
                ) : (
                    <ChevronDown className="w-3 h-3 ml-1" />
                )}
                </button>
                
                {/* Transport Mode Dropdown */}
                {isDropdownOpen && (
                <div className="absolute top-full mt-1 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[80px]">
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

            <div>
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
                        <span className={`px-2 py-1 mr-150 rounded-full text-xs font-medium ${getStatusColors(selectedShipment.status).colorClass}`}>
                            {selectedShipment.status}
                        </span>
                        <button 
                          onClick={() => setShowMapOverlay(false)}
                          className="text-gray-500 hover:text-gray-700 p-1"
                          >
                          <X size={16} />
                        </button>
                        </div>

                        {/* Progress Bar with Origin/Destination */}
                        <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-xs">
                            <p className="text-gray-500">From</p>
                            <p className="text-gray-900 font-medium">Jakarta, Indonesia</p>
                            </div>
                            <div className="text-xs text-center">
                            <p className="text-gray-500">Distance</p>
                            <p className="text-gray-900 font-medium">{selectedShipment.distance}</p>
                            </div>
                            <div className="text-xs text-right">
                            <p className="text-gray-500">To</p>
                            <p className="text-gray-900 font-medium">{selectedShipment.destination}</p>
                            </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${
                            selectedShipment.status === 'Delivered' ? 'bg-green-500 w-full' :
                            selectedShipment.status === 'In transit' ? 'bg-blue-500 w-2/3' : 'bg-orange-500 w-1/3'
                            }`}></div>
                        </div>
                        </div>

                        {/* Shipment Details - 3 columns */}
                        <div className="grid grid-cols-3 gap-4 text-xs">
                        <div>
                            <p className="text-gray-500 mb-1">Package shipped</p>
                            <p className="text-gray-900 font-medium">{selectedShipment.arrivalDate} • {selectedShipment.arrivalTime}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Est. package arrival</p>
                            <p className="text-gray-900 font-medium">{selectedShipment.arrivalDate} • {selectedShipment.arrivalTime}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Est. delivery time</p>
                            <p className="text-gray-900 font-medium">{selectedShipment.deliveryTime}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Goods Description</p>
                            <p className="text-gray-900 font-medium">{selectedShipment.goodsDescription}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Total items</p>
                            <p className="text-gray-900 font-medium">{selectedShipment.packageCount}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 mb-1">Total weight</p>
                            <p className="text-gray-900 font-medium">{selectedShipment.weight}</p>
                        </div>
                        </div>
                    </div>
                    </div>
              </div>
            )}
            </div>
            
          </div>
        </div>

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
                <div className="relative">
                    <button
                    onClick={toggleDropdown}
                    className="flex items-center justify-between bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-300 rounded-md px-3 py-2 text-xs shadow-sm hover:bg-white transition-colors min-w-[80px]"
                    >
                    <span>{transportModes.find(mode => mode.value === selectedTransportMode)?.label}</span>
                    {isDropdownOpen ? (
                        <ChevronUp className="w-3 h-3 ml-1" />
                    ) : (
                        <ChevronDown className="w-3 h-3 ml-1" />
                    )}
                    </button>
                    
                    {isDropdownOpen && (
                    <div className="absolute bottom-full mb-1 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[80px]">
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
  );
};

export default ShipmentTrackingList;