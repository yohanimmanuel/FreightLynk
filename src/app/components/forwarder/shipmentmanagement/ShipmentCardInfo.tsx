import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Package, 
  Calendar,
  X
} from 'lucide-react';

interface ShipmentCardInfoProps {
  shipmentData?: {
    id: string;
    shipmentId: string;
    status: string;
    client: string;
    accountManager: string;
    incoterms: string;
    origin: string;
    destination: string;
    transportType: string;
    volume: string;
    bookingNo: string;
    blNo: string;
    etd: string;
    eta: string;
    carrier: string;
    portOfLoading: string;
    transitPort: string;
    placeOfDelivery: string;
    cargoReadyDate: string;
    commodities: string;
    freightTerms: string;
    note: string;
    companyInfo: {
      name: string;
      address: string;
      phone: string;
      companyId: string;
      taxNumber: string;
    };
    contactPerson: {
      name: string;
      email: string;
      phone: string;
      title: string;
    };
  };
}

const ShipmentCardInfo: React.FC<ShipmentCardInfoProps> = ({ shipmentData }) => {
  const [isExpanded, setIsExpanded] = useState(true); // Changed to true to show expanded by default
  const [isEditing, setIsEditing] = useState(false);

  // Mock data for demonstration
  const mockData = {
    id: 'FCL-S-2305-E-FCL-000',
    shipmentId: 'FCL-S-2305-E-FCL-000',
    status: 'Active',
    client: 'ANC TRANSPORT',
    accountManager: 'Systems Administration',
    incoterms: 'Carriage Paid To',
    origin: 'HO CHI MINH CITY, VN (VNSGN)',
    destination: 'HOUSTON, TX, US (USHOU)',
    transportType: 'Sea FCL',
    volume: '1 x 20\'DC',
    bookingNo: 'BKEXFR2305000',
    blNo: 'HBLEX2305000',
    etd: 'May 12, 2023',
    eta: 'May 25, 2023',
    carrier: 'MAERSK',
    portOfLoading: 'HO CHI MINH CITY, VN (VNSGN)',
    transitPort: 'LOS ANGELES, CA, US (USLAX)',
    placeOfDelivery: 'HOUSTON, TX, US (USHOU)',
    cargoReadyDate: '',
    commodities: '',
    freightTerms: 'FREIGHT PREPAID',
    note: '',
    companyInfo: {
      name: 'ANC TRANSPORT',
      address: '',
      phone: '',
      companyId: '',
      taxNumber: ''
    },
    contactPerson: {
      name: 'Mr. Đức',
      email: 'yubichi9@gmail.com',
      phone: '',
      title: ''
    }
  };

  const data = shipmentData || mockData;

  // Algorithm to detect missing items and generate alerts
  const getMissingItems = () => {
    const missingItems = [];
    
    if (!data.cargoReadyDate) {
      missingItems.push('Cargo ready date not specified');
    }
    if (!data.commodities) {
      missingItems.push('Commodities information missing');
    }
    if (!data.note) {
      missingItems.push('No notes added');
    }

    return missingItems;
  };

  const missingItems = getMissingItems();
  const hasAlerts = missingItems.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
      {/* Header with expand/collapse */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${data.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-sm font-semibold text-gray-900">{data.status}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {hasAlerts && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                <AlertCircle className="w-3 h-3" />
                <span>{missingItems.length} items pending</span>
              </div>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="transition-colors bg-white"
            >
              {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500 hover:text-gray-700" /> : <ChevronDown className="w-5 h-5 text-gray-500 hover:text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Alerts Section */}
          {hasAlerts && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-800">Action Required</span>
              </div>
              <div className="space-y-1">
                {missingItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-yellow-700">
                    <div className="w-1 h-1 bg-yellow-600 rounded-full"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

                     {/* Main Information Grid - 4 Columns */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                           {/* Column 1 - Shipment & Booking Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Shipment Information</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Client:</span>
                    <span className="text-gray-900 font-medium">{data.client}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Manager:</span>
                    <span className="text-gray-900 font-medium">{data.accountManager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Incoterms:</span>
                    <span className="text-gray-900 font-medium">{data.incoterms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booking No.:</span>
                    <span className="text-gray-900 font-medium font-mono">{data.bookingNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">BL No.:</span>
                    <span className="text-gray-900 font-medium font-mono">{data.blNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ETD:</span>
                    <span className="text-gray-900 font-medium">{data.etd}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ETA:</span>
                    <span className="text-gray-900 font-medium">{data.eta}</span>
                  </div>
                </div>
              </div>

                           {/* Column 2 - Route Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Route Information</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      Origin:
                    </span>
                    <span className="text-gray-900 font-medium">{data.origin}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" />
                      Destination:
                    </span>
                    <span className="text-gray-900 font-medium">{data.destination}</span>
                  </div>
                </div>
              </div>

                           {/* Column 3 - Transport Details */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Transport Details</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Transport Type:</span>
                    <span className="text-gray-900 font-medium">{data.transportType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Container:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-800 font-semibold border border-blue-300">
                      {data.volume}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Carrier:</span>
                    <span className="text-gray-900 font-medium">{data.carrier}</span>
                  </div>
                </div>
              </div>

                           {/* Column 4 - Additional Details */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Additional Details</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Cargo Ready Date:</span>
                    <span className="text-gray-900 font-medium">
                      {data.cargoReadyDate || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Commodities:</span>
                    <span className="text-gray-900 font-medium">
                      {data.commodities || 'Not specified'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Freight Terms:</span>
                    <span className="text-gray-900 font-medium">
                      {data.freightTerms}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500">Note:</span>
                    <span className="text-gray-900 font-medium">
                      {data.note || 'No notes added'}
                    </span>
                  </div>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentCardInfo;
