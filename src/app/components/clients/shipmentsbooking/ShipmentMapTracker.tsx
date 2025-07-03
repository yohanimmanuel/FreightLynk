'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { RefreshCw, Maximize2, Minimize2, X, Map, List, ChevronDown, ChevronUp } from 'lucide-react';

interface ShipmentMapTrackerProps {
  onSeeAll?: () => void;
}

const ShipmentMapTracker = ({ onSeeAll }: ShipmentMapTrackerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTransportMode, setSelectedTransportMode] = useState('all');

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
    <div>     
      {/* Normal View */}
      <div className="w-full rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
        {/* Header */}
        <div className="flex justify-between items-center px-3 py-3.5 border-b">
          <h2 className="text-base sm:text-md font-semibold text-gray-800">Live Tracker</h2>
          <button 
            onClick={onSeeAll}
            className="flex items-center text-xs sm:text-sm bg-[#007bff] text-white px-5 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            See all
          </button>
        </div>

        {/* Map Container with Overlay Controls */}
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] bg-gray-200">
          {/* Static Map Image */}
          <Image
            src="/map.png" // Make sure this exists in /public/
            alt="Shipment Map"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
          
          {/* Overlay Controls - Bottom Right */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            {/* Custom Transport Mode Selector */}
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
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute bottom-full mb-1 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[80px]">
                  {transportModes.map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => handleTransportModeSelect(mode.value)}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                        selectedTransportMode === mode.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      } ${mode.value === transportModes[0].value ? 'rounded-t-md' : ''} ${
                        mode.value === transportModes[transportModes.length - 1].value ? 'rounded-b-md' : ''
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Expand Button */}
            <button 
              onClick={toggleModal}
              className="flex items-center justify-center bg-white/90 backdrop-blur-sm text-[#007bff] p-2 border border-gray-300 rounded-md hover:bg-gray-200 shadow-sm transition-colors"
              title="Expand Map"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Map Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-3 sm:py-4 border-b gap-2 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Live Shipment Map</h2>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <select className="text-gray-700 text-xs sm:text-sm border rounded px-2 sm:px-3 py-1 sm:py-2 min-w-0 flex-shrink-0">
                  <option value="all">All Shipments</option>
                  <option value="ocean">Ocean Freight</option>
                  <option value="air">Air Freight</option>
                  <option value="road">Road Transport</option>
                </select>
                <button className="flex items-center text-gray-700 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 border rounded hover:bg-gray-50 flex-shrink-0">
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Refresh
                </button>
                <button 
                  onClick={toggleModal}
                  className="flex items-center text-gray-500 hover:text-gray-700 p-1 rounded flex-shrink-0"
                  title="Close"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Modal Map */}
            <div className="relative flex-1 bg-gray-200 min-h-[400px] sm:min-h-[500px]">
              <Image
                src="/map.png"
                alt="Shipment Map - Expanded View"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentMapTracker;