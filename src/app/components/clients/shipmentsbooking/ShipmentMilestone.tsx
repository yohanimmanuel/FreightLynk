import React, { useState } from 'react';
import { 
  Plane, 
  Ship, 
  Truck, 
  Eye, 
  FileText, 
  MessageCircle, 
  MapPin, 
  Filter,
  Star,
  ChevronDown,
  Package,
  Globe
} from 'lucide-react';

interface ShipmentMilestoneProps {
  onSeeAll?: () => void;
}

const ShipmentMilestone = ({ onSeeAll }: ShipmentMilestoneProps) => {
  const [filter, setFilter] = useState('all');
  const [pinnedItems, setPinnedItems] = useState(new Set(['FL-001927', 'FL-001928']));

  const togglePin = (shipmentId: string) => {
    const newPinned = new Set(pinnedItems);
    if (newPinned.has(shipmentId)) {
      newPinned.delete(shipmentId);
    } else {
      newPinned.add(shipmentId);
    }
    setPinnedItems(newPinned);
  };

  const getMilestoneColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-[#007bff]';
      case 'issue': return 'bg-red-500';
      case 'pending': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'AIR': return <Plane className="w-5 h-5 text-[#007bff]" />;
      case 'SEA': return <Ship className="w-5 h-5 text-[#007bff]" />;
      case 'LAND': return <Truck className="w-5 h-5 text-[#007bff]" />;
      default: return <Package className="w-5 h-5 text-[#007bff]" />;
    }
  };

  const getAlertColor = (alert: string) => {
    switch (alert) {
      case 'Customs Hold': return 'bg-red-50 text-red-700 border-red-200';
      case 'Delay': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Action Needed': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Price Change': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const shipments = [
    {
      id: 'FL-001927',
      goods: 'Palm disposable paper plates',
      priority: 'high',
      pos: ['PO12345', 'PO12346'],
      mode: 'AIR',
      incoterm: 'DDP',
      carrier: 'Maersk',
      client: 'Philips Logistics',
      eta: 'Jul 20',
      lastUpdated: '3h ago',
      status: 'Customs delay at destination',
      alerts: ['Customs Hold', 'Action Needed'],
      milestones: [
        { name: 'Pickup', status: 'completed' },
        { name: 'Origin Port', status: 'completed' },
        { name: 'In Transit', status: 'completed' },
        { name: 'Destination Port', status: 'issue' },
        { name: 'Delivered', status: 'pending' }
      ],
      trackable: true,
      hasDocuments: true
    },
    {
      id: 'FL-001928',
      goods: '[Re-stock] PO 28134',
      priority: 'medium',
      pos: ['PO28134'],
      mode: 'SEA',
      incoterm: 'FOB',
      carrier: 'COSCO',
      client: 'Philips Medisize',
      eta: 'Jul 25',
      lastUpdated: '1h ago',
      status: 'Quote request - 2 quotes ready for view',
      alerts: ['Price Change'],
      milestones: [
        { name: 'Booking', status: 'in-progress' },
        { name: 'Origin Port', status: 'pending' },
        { name: 'In Transit', status: 'pending' },
        { name: 'Destination Port', status: 'pending' },
        { name: 'Delivered', status: 'pending' }
      ],
      trackable: false,
      hasDocuments: true
    },
    {
      id: 'FL-001929',
      goods: 'COA-J1A2747 - 199',
      priority: 'low',
      pos: ['COA-J1A2747'],
      mode: 'SEA',
      incoterm: 'CIF',
      carrier: 'Arvato Distribution',
      client: 'Arvato Distribution',
      eta: 'Jul 28',
      lastUpdated: '5h ago',
      status: 'At arrival port - No updates',
      alerts: [],
      milestones: [
        { name: 'Pickup', status: 'completed' },
        { name: 'Origin Port', status: 'completed' },
        { name: 'In Transit', status: 'completed' },
        { name: 'Destination Port', status: 'completed' },
        { name: 'Delivered', status: 'pending' }
      ],
      trackable: true,
      hasDocuments: false
    },
    {
      id: 'FL-001930',
      goods: 'RRD Texas to Sarvar, Hungary',
      priority: 'medium',
      pos: ['PO88991'],
      mode: 'LAND',
      incoterm: 'DAP',
      carrier: 'IMS Fastpak',
      client: 'IMS Fastpak',
      eta: 'Jul 22',
      lastUpdated: '2h ago',
      status: 'At arrival port - No updates',
      alerts: [],
      milestones: [
        { name: 'Pickup', status: 'completed' },
        { name: 'Origin Hub', status: 'completed' },
        { name: 'In Transit', status: 'in-progress' },
        { name: 'Destination Hub', status: 'pending' },
        { name: 'Delivered', status: 'pending' }
      ],
      trackable: true,
      hasDocuments: true
    },
    {
      id: 'FL-001931',
      goods: 'Carribean Kids Pack Flatware',
      priority: 'low',
      pos: ['PO55512'],
      mode: 'SEA',
      incoterm: 'EXW',
      carrier: 'Go Direct Solutions',
      client: 'Go Direct Solutions',
      eta: 'Aug 5',
      lastUpdated: '30m ago',
      status: 'Booking - Waiting for pricing',
      alerts: ['Delay'],
      milestones: [
        { name: 'Booking', status: 'in-progress' },
        { name: 'Origin Port', status: 'pending' },
        { name: 'In Transit', status: 'pending' },
        { name: 'Destination Port', status: 'pending' },
        { name: 'Delivered', status: 'pending' }
      ],
      trackable: false,
      hasDocuments: false
    }
  ];

  const filteredShipments = shipments.filter(shipment => {
    if (filter === 'all') return true;
    if (filter === 'pinned') return pinnedItems.has(shipment.id);
    if (filter === 'high-priority') return shipment.priority === 'high';
    if (filter === 'alerts') return shipment.alerts.length > 0;
    return true;
  });

  return (
    <div className="w-full mx-auto p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <h1 className="text-md font-bold text-gray-900">Watchlist</h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {filteredShipments.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-7 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Shipments</option>
              <option value="pinned">Starred Only</option>
              <option value="high-priority">High Priority</option>
              <option value="alerts">With Alerts</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={onSeeAll}
            className="px-5 py-1.5 text-sm font-medium text-white bg-[#007bff] hover:bg-blue-700 rounded-lg transition-colors">
            See all
          </button>
        </div>
      </div>

      {/* Shipment Cards */}
      <div className="space-y-2">
        {filteredShipments.map((shipment) => (
          <div key={shipment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 hover:shadow-md transition-shadow">
            <div className="grid grid-cols-14 items-center gap-4">
              
              {/* Left Column - Icon & Shipment Info */}
              <div className="col-span-6 flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {getModeIcon(shipment.mode)}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 text-xs">{shipment.id}</span>
                    <span className="text-gray-900 text-xs">•</span>
                    <span className="font-medium text-gray-900 text-sm truncate">{shipment.goods}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {shipment.pos.slice(0, 2).map(po => (
                      <span key={po} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                        {po}
                      </span>
                    ))}
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                      {shipment.incoterm}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Column - Progress & Status */}
              <div className="col-span-5">
                {/* Progress Bar - Made longer */}
                <div className="mb-2">
                  <div className="flex items-center h-2 bg-gray-200 rounded-full overflow-hidden w-full max-w-xs">
                    {shipment.milestones.map((milestone, index) => (
                      <div
                        key={index}
                        className={`flex-1 h-full ${getMilestoneColor(milestone.status)}`}
                      ></div>
                    ))}
                  </div>
                </div>
                
                {/* Status */}
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-900 truncate">{shipment.status}</span>
                </div>
                
                {/* Alerts */}
                {shipment.alerts.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {shipment.alerts.slice(0, 2).map(alert => (
                      <span key={alert} className={`px-2 py-0.5 rounded text-xs font-medium ${getAlertColor(alert)}`}>
                        {alert}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Client & Actions */}
              <div className="col-span-3 text-right">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <span className="text-xs text-gray-700 truncate">{shipment.client}</span>
                  <button
                    onClick={() => togglePin(shipment.id)}
                    className={`p-1 rounded hover:bg-gray-100 flex-shrink-0 ${pinnedItems.has(shipment.id) ? 'text-yellow-500' : 'text-gray-400'}`}
                  >
                    <Star className={`w-4 h-4 ${pinnedItems.has(shipment.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 mb-2">
                  ETA: {shipment.eta}
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center justify-end gap-1">
                  {shipment.hasDocuments && (
                    <button className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors" title="View Documents">
                      <FileText className="w-3 h-3" />
                    </button>
                  )}
                  {shipment.trackable && (
                    <button className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors" title="Track Live">
                      <Eye className="w-3 h-3" />
                    </button>
                  )}
                  <button className="p-1.5 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors" title="Message Operations">
                    <MessageCircle className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentMilestone;