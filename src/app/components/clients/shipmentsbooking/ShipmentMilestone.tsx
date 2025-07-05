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
import { useShipmentStore } from '@/store/shipmentData';

interface ShipmentMilestoneProps {
  onSeeAll?: () => void;
}

const ShipmentMilestone = ({ onSeeAll }: ShipmentMilestoneProps) => {
  const [filter, setFilter] = useState('all');
  const [pinnedItems, setPinnedItems] = useState(new Set(['FL-001927', 'FL-001928']));
  const shipments = useShipmentStore((state) => state.shipments);

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

  const getAlertColor = (alert: string) => {
    switch (alert) {
      case 'Customs Hold': return 'bg-red-50 text-red-700 border-red-200';
      case 'Delay': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Action Needed': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Price Change': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Add a function to get the icon based on transportMode
  const getTransportModeIcon = (mode: string) => {
    switch (mode) {
      case 'Sea':
        return <Ship className="w-5 h-5 text-[#007bff]" />;
      case 'Air':
        return <Plane className="w-5 h-5 text-[#007bff]" />;
      case 'Road':
        return <Truck className="w-5 h-5 text-[#007bff]" />;
      default:
        return <Package className="w-5 h-5 text-[#007bff]" />;
    }
  };

  // Map to simplified milestone data
  const milestoneData = shipments.map((s) => {
    const latestMilestone = s.milestones.length > 0 ? s.milestones[s.milestones.length - 1] : null;
    return {
      shipmentID: s.id,
      goodsDescription: s.goods.description,
      poNumbers: s.poNumbers,
      incoterms: s.incoterms,
      progress: s.progress,
      latestMilestone: latestMilestone ? latestMilestone.step : '',
      latestMilestoneDescription: latestMilestone ? latestMilestone.description : '',
      destination: `${s.destination.city}, ${s.destination.country}`,
      eta: new Date(s.dates.arrival).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      transportMode: s.transportMode,
    };
  });

  const filteredShipments = milestoneData.filter(shipment => {
    if (filter === 'all') return true;
    if (filter === 'pinned') return pinnedItems.has(shipment.shipmentID);
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
          <div key={shipment.shipmentID} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 hover:shadow-md transition-shadow">
            <div className="grid grid-cols-14 items-center gap-4">
              
              {/* Left Column - Icon & Shipment Info */}
              <div className="col-span-6 flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {getTransportModeIcon(shipment.transportMode)}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 text-xs">{shipment.shipmentID}</span>
                    <span className="text-gray-900 text-xs">•</span>
                    <span className="font-medium text-gray-900 text-sm truncate">{shipment.goodsDescription}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {shipment.poNumbers.slice(0, 2).map(po => (
                      <span key={po} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                        {po}
                      </span>
                    ))}
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                      {shipment.incoterms}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Column - Progress & Status */}
              <div className="col-span-5">
                {/* Progress Bar - Made longer */}
                <div className="relative flex items-center h-2 mt-2 bg-gray-200 rounded-full w-full max-w-xs">
                  <div className="absolute left-0 top-0 h-2 bg-[#007bff] rounded-full z-0" style={{ width: `${shipment.progress}%` }}></div>
                  {/* Progress circle */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white bg-[#007bff] shadow z-10"
                    style={{ left: `calc(${shipment.progress}% - 8px)` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 flex items-center mt-2">
                  <MapPin className="w-5 h-5 text-gray-400 mr-1" />
                  <span className="truncate" style={{ maxWidth: '100%' }}>{shipment.latestMilestone} - {shipment.latestMilestoneDescription}</span>
                </div>
              </div>

              {/* Right Column - Client & Actions */}
              <div className="col-span-3 text-right mt-1">
                <div className="text-xs text-gray-900 mb-2 flex items-center justify-end">
                  <span>{shipment.destination}</span>
                </div>
                <div className="text-xs text-gray-500 mb-2">ETA: {shipment.eta}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShipmentMilestone;