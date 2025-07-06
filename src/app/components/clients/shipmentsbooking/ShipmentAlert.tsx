import React, { useState } from 'react';
import { AlertTriangle, Clock, MapPin, Ship, Truck, Plane, Star, Bookmark } from 'lucide-react';
import { useShipmentAlertStore, ShipmentAlert } from '../../../../store/shipmentAlertStore';

// Define the type for the local alert object used in the component
interface AlertDisplay {
  id: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location: string;
  timeAgo: string;
  shipmentMode: string;
  details: string;
  status: 'active' | 'resolved';
  resolvedText?: string;
}

const ShipmentAlerts = () => {
  // Get alerts from Zustand store
  const alertsRaw = useShipmentAlertStore((state) => state.alerts);

  // Map store data to display format
  const alerts: AlertDisplay[] = alertsRaw.map((alert: ShipmentAlert): AlertDisplay => ({
    id: alert.code,
    type: alert.icon,
    priority: alert.priority,
    title: alert.title,
    description: alert.description,
    location: alert.location,
    timeAgo: alert.timeAgo,
    shipmentMode: 'ocean', // fallback, or you can add this to store if needed
    details: alert.description,
    status: alert.status,
    resolvedText: alert.resolvedText,
  }));

  const [filter, setFilter] = useState('all');
  const [bookmarkedAlerts, setBookmarkedAlerts] = useState(new Set<string>());

  const toggleBookmark = (alertId: string) => {
    const newBookmarked = new Set(bookmarkedAlerts);
    if (newBookmarked.has(alertId)) {
      newBookmarked.delete(alertId);
    } else {
      newBookmarked.add(alertId);
    }
    setBookmarkedAlerts(newBookmarked);
  };

  const getAlertIcon = (type: string, priority: string) => {
    const baseClass = "w-5 h-5 p-1 rounded-full";
    const priorityColor = {
      'high': 'bg-red-100 text-red-600',
      'medium': 'bg-amber-100 text-amber-600',
      'low': 'bg-blue-100 text-blue-600'
    }[priority] || 'bg-gray-100 text-gray-600';

    switch (type) {
      case 'delay': return <Clock className={`${baseClass} ${priorityColor}`} />;
      case 'customs': return <AlertTriangle className={`${baseClass} ${priorityColor}`} />;
      case 'weather': return <AlertTriangle className={`${baseClass} ${priorityColor}`} />;
      case 'delivery': return <MapPin className={`${baseClass} ${priorityColor}`} />;
      default: return <AlertTriangle className={`${baseClass} ${priorityColor}`} />;
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'ocean': return <Ship className="w-3 h-3" />;
      case 'air': return <Plane className="w-3 h-3" />;
      case 'truck': return <Truck className="w-3 h-3" />;
      default: return <Ship className="w-3 h-3" />;
    }
  };

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter((alert: AlertDisplay) => alert.status === filter);

  return (
    <div className="w-full mx-auto p-3 border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-md font-bold text-gray-900 mb-2">Alerts</h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
              {alerts.filter(a => a.priority === 'high').length} High Priority
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border">
          {['all', 'active', 'resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${
                filter === tab
                  ? 'bg-[#007bff] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== 'all' && (
                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                  {alerts.filter(a => a.status === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-2">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-500 text-xs">There are no shipment alerts matching your current filter.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-lg shadow-sm border p-2 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Combined Alert Icon with Priority */}
                  <div className="mt-1">
                    {getAlertIcon(alert.type, alert.priority)}
                  </div>

                  {/* Alert Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-xs font-mono text-blue-600">
                        {alert.id}
                      </span>
                      <span className="text-xs text-gray-900">•</span>
                      <h3 className="text-xs font-semibold text-gray-900 truncate max-w-[180px]">{alert.title}</h3>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span>{alert.location}</span>
                      </div>
                      <span>-</span>
                      <span>{alert.timeAgo}</span>
                      {alert.status === 'resolved' && (
                        <>
                          <span>•</span>
                          <span className="text-green-600 font-medium">Resolved</span>
                        </>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="text-gray-500">
                        {getModeIcon(alert.shipmentMode)}
                      </div>
                      <p className="text-xs text-gray-700 truncate max-w-[260px]">{alert.details}</p>
                    </div>
                  </div>
                </div>

                {/* Bookmark Button */}
                <button
                    onClick={() => toggleBookmark(alert.id)}
                    className={`p-2 rounded-lg transition-colors ${
                        bookmarkedAlerts.has(alert.id)
                        ? 'text-gray-600'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    >
                    <Bookmark className={`w-4 h-4 ${bookmarkedAlerts.has(alert.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShipmentAlerts;