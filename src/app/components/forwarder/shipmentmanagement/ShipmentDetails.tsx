import React, { useState } from 'react';
import { 
  Home, 
  MessageSquare, 
  Calendar,
  Map,
  FileText,
  Settings,
  BarChart3,
  Activity,
  Package,
  Truck,
  Ship,
  Plane,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Save,
  X
} from 'lucide-react';

interface ShipmentDetailsProps {
  shipmentId?: string;
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ shipmentId }) => {
  const [activeDashboard, setActiveDashboard] = useState('home');
  const [activeTab, setActiveTab] = useState('information');
  const [activeSubTab, setActiveSubTab] = useState('order');
  const [isEditing, setIsEditing] = useState(false);

  // Mock data for demonstration
  const mockShipmentData = {
    id: 'FCL-S-2305-E-FCL-000',
    referenceId: '',
    shipmentType: 'EXPORT',
    shipmentMode: 'Freehand',
    branch: '',
    carrier: 'MAERSK',
    portOfLoading: 'HO CHI MINH CITY, VN (VNSGN)',
    transitPort: 'LOS ANGELES, CA, US (USLAX)',
    placeOfDelivery: 'HOUSTON, TX, US (USHOU)',
    etd: 'May 12, 2023',
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

  const data = mockShipmentData;

  // Dashboard icons configuration
  const dashboardIcons = [
    { id: 'home', icon: Home, label: 'Overview', active: activeDashboard === 'home' },
    { id: 'message', icon: MessageSquare, label: 'Messages', active: activeDashboard === 'message' },
    { id: 'calendar', icon: Calendar, label: 'Calendar', active: activeDashboard === 'calendar' },
    { id: 'map', icon: Map, label: 'Maps', active: activeDashboard === 'map' }
  ];

  // Main tabs configuration
  const mainTabs = [
    { id: 'information', label: 'Information', active: activeTab === 'information' },
    { id: 'document', label: 'Document', active: activeTab === 'document' },
    { id: 'financial', label: 'Financial', active: activeTab === 'financial' },
    { id: 'status-updates', label: 'Status Updates', active: activeTab === 'status-updates' },
    { id: 'activities', label: 'Activities', active: activeTab === 'activities' }
  ];

  // Sub-tabs for Information tab
  const subTabs = [
    { id: 'order', label: 'Order', active: activeSubTab === 'order' },
    { id: 'booking', label: 'Booking', active: activeSubTab === 'booking' },
    { id: 'shipping-instruction', label: 'Shipping Instruction', active: activeSubTab === 'shipping-instruction' },
    { id: 'customs', label: 'Customs', active: activeSubTab === 'customs' },
    { id: 'trucking', label: 'Trucking', active: activeSubTab === 'trucking' }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Content Area */}
      <div className="flex">
        {/* Left Sidebar - Dashboard Icons */}
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
          {dashboardIcons.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveDashboard(item.id)}
              className={`p-3 rounded-lg transition-colors ${
                item.active
                  ? 'bg-[#007bff] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeDashboard === 'home' && (
            <>
              {/* Main Tabs - Only show for Home dashboard */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {mainTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                        tab.active
                          ? 'border-[#007bff] text-[#007bff]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'information' && (
                <div>
                  {/* Sub-tabs for Information */}
                  <div className="border-b border-gray-200">
                    <nav className="flex justify-between items-center px-6">
                      <div className="flex space-x-8">
                        {subTabs.map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                              tab.active
                                ? 'border-[#007bff] text-[#007bff]'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {tab.label.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                      {/* Edit Button */}
                      <button className="flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                        <Edit className="w-4 h-4" />
                        Edit Information
                      </button>
                    </nav>
                  </div>           

                  {/* Sub-tab Content */}
                  <div className="p-6">
                    {activeSubTab === 'order' && (  
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Shipment Specific Details */}
                        <div className="space-y-6">
                          <h3 className="text-md font-semibold text-gray-900 mb-4">Shipment Details</h3>
                          
                          <div className="space-y-4 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Reference ID:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-900">{data.referenceId || 'Not specified'}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Shipment ID:</span>
                              <span className="font-mono text-gray-900">{data.id}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Shipment Type:</span>
                              <span className="text-gray-900">{data.shipmentType}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Shipment Mode:</span>
                              <span className="text-gray-900">{data.shipmentMode}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Branch:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-900">{data.branch || 'Not specified'}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Carrier:</span>
                              <span className="text-gray-900">{data.carrier}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Port of Loading:</span>
                              <span className="text-gray-900">{data.portOfLoading}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Transit Port:</span>
                              <span className="text-gray-900">{data.transitPort}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Place of Delivery:</span>
                              <span className="text-gray-900">{data.placeOfDelivery}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">ETD:</span>
                              <span className="text-gray-900">{data.etd}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Cargo Ready Date:</span>
                              <span className="text-gray-900">{data.cargoReadyDate || 'Not specified'}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Commodities:</span>
                              <span className="text-gray-900">{data.commodities || 'Not specified'}</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-500">Freight Terms:</span>
                              <span className="text-gray-900">{data.freightTerms}</span>
                            </div>

                            <div className="flex items-start justify-between">
                              <span className="text-gray-500">Note:</span>
                              <span className="text-gray-900">{data.note || 'No notes added'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Company & Contact Information */}
                        <div className="space-y-6">
                          <h3 className="text-md font-semibold text-gray-900 mb-4">Company & Contact</h3>
                          
                          {/* Company Information */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Company Information</h4>
                            <div className="space-y-3 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500">Name:</span>
                                <span className="text-gray-900">{data.companyInfo.name}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500">Address:</span>
                                <span className="text-gray-900">{data.companyInfo.address || 'Not specified'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500">Phone:</span>
                                <span className="text-gray-900">{data.companyInfo.phone || 'Not specified'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500">Company ID:</span>
                                <span className="text-gray-900">{data.companyInfo.companyId || 'Not specified'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500">Tax Number:</span>
                                <span className="text-gray-900">{data.companyInfo.taxNumber || 'Not specified'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Contact Person */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Person</h4>
                            <div className="space-y-3 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500">Name:</span>
                                <span className="text-gray-900">{data.contactPerson.name}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500">Email:</span>
                                <span className="text-gray-900">{data.contactPerson.email}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500">Phone:</span>
                                <span className="text-gray-900">{data.contactPerson.phone || 'Not specified'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-500">Title:</span>
                                <span className="text-gray-900">{data.contactPerson.title || 'Not specified'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeSubTab === 'booking' && (
                      <div className="text-center py-12">
                        <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Information</h3>
                        <p className="text-gray-500">Booking details will be displayed here</p>
                      </div>
                    )}

                    {activeSubTab === 'shipping-instruction' && (
                      <div className="text-center py-12">
                        <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Instructions</h3>
                        <p className="text-gray-500">Shipping instruction details will be displayed here</p>
                      </div>
                    )}

                    {activeSubTab === 'customs' && (
                      <div className="text-center py-12">
                        <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Customs Information</h3>
                        <p className="text-gray-500">Customs details will be displayed here</p>
                      </div>
                    )}

                    {activeSubTab === 'trucking' && (
                      <div className="text-center py-12">
                        <Truck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Trucking Information</h3>
                        <p className="text-gray-500">Trucking details will be displayed here</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'financial' && (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pricing Section */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Pricing Information</h3>
                      </div>
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Freight Cost:</span>
                          <span className="text-gray-900">$2,450.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Handling Fee:</span>
                          <span className="text-gray-900">$150.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Documentation:</span>
                          <span className="text-gray-900">$75.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Insurance:</span>
                          <span className="text-gray-900">$120.00</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span className="text-gray-700">Total Cost:</span>
                          <span className="text-gray-900">$2,795.00</span>
                        </div>
                      </div>
                    </div>

                    {/* Profit & Loss Section */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="w-6 h-6 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900">Profit & Loss Analysis</h3>
                      </div>
                      <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Revenue:</span>
                          <span className="text-green-600">$3,200.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Total Cost:</span>
                          <span className="text-red-600">$2,795.00</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                          <span className="text-gray-700">Gross Profit:</span>
                          <span className="text-green-600">$405.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Profit Margin:</span>
                          <span className="text-green-600">12.7%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'document' && (
                <div className="p-6 text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Documents</h3>
                  <p className="text-gray-500">Document management will be displayed here</p>
                </div>
              )}

              {activeTab === 'status-updates' && (
                <div className="p-6 text-center py-12">
                  <Activity className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Status Updates</h3>
                  <p className="text-gray-500">Status update history will be displayed here</p>
                </div>
              )}

              {activeTab === 'activities' && (
                <div className="p-6 text-center py-12">
                  <Activity className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Activities</h3>
                  <p className="text-gray-500">Activity log will be displayed here</p>
                </div>
              )}
            </>
          )}

          {activeDashboard === 'message' && (
            <div className="p-6 text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages</h3>
              <p className="text-gray-500">Message center will be displayed here</p>
            </div>
          )}

          {activeDashboard === 'calendar' && (
            <div className="p-6 text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar</h3>
              <p className="text-gray-500">Calendar view will be displayed here</p>
            </div>
          )}

          {activeDashboard === 'map' && (
            <div className="p-6 text-center py-12">
              <Map className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Maps</h3>
              <p className="text-gray-500">Map view will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;
