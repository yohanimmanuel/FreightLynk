import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Package, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Users,
  FileText,
  MessageSquare,
  ChevronDown,
  Edit,
  Save,
  Send,
  Truck,
  Ship,
  Plane
} from 'lucide-react';
import BookingConfirmPopUp from './BookingConfirmPopUp';

const BookingReview = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const [bookingData, setBookingData] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('PO 1057, PO 1055');
  const [tempTitle, setTempTitle] = useState(title);
  const [pricingReady, setPricingReady] = useState(false);
  const [showPopup, setShowPopup] = useState(true);

  // Load booking data from sessionStorage (from BookingCreation form)
  useEffect(() => {
    const savedBookingData = sessionStorage.getItem('bookingData');
    if (savedBookingData) {
      setBookingData(JSON.parse(savedBookingData));
    }
  }, []);

  // Progress steps
  const progressSteps = [
    { id: 'booking', label: 'Booking', status: 'completed', icon: CheckCircle },
    { id: 'pricing', label: 'Pricing', status: 'current', icon: Clock },
    { id: 'authorization', label: 'Authorization', status: 'pending', icon: AlertCircle }
  ];

  // Dummy tasks data
  const tasks = [
    { id: 1, name: 'Initial booking review', assignee: 'FreightLynk Team', status: 'In Progress' },
    { id: 2, name: 'Rate confirmation', assignee: 'Pricing Team', status: 'Pending' },
    { id: 3, name: 'Documentation prep', assignee: 'Operations', status: 'Not Started' }
  ];

  // Dummy activity messages
  const activityMessages = [
    {
      id: 1,
      type: 'message',
      content: 'Booking created successfully. Awaiting rate confirmation.',
      timestamp: '2 minutes ago',
      user: 'System'
    },
    {
      id: 2,
      type: 'update',
      content: 'Shipment details verified and validated.',
      timestamp: '5 minutes ago',
      user: 'FreightLynk Bot'
    }
  ];

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'sea': return Ship;
      case 'air': return Plane;
      case 'land': return Truck;
      default: return Ship;
    }
  };

  const StepIndicator = ({ steps }: { steps: any[] }) => (
    <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4 mb-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === 'completed' 
                  ? 'bg-green-100 text-green-600' 
                  : step.status === 'current'
                    ? 'bg-blue-100 text-[#007bff]'
                    : 'bg-gray-100 text-gray-400'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-sm font-medium mt-2 ${
                step.status === 'current' ? 'text-[#007bff]' : 'text-gray-600'
              }`}>
                {step.label}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                {step.status === 'completed' && 'Completed by Sharon Johnston on Mar 12, 2021'}
                {step.status === 'current' && 'FreightLynk to provide pricing in 24 to 48 hours'}
                {step.status === 'pending' && ''}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-20 h-0.5 mx-4 ${
                step.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );

  // --- Current Status Card ---
  const CurrentStatusCard = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="mb-4 border-b border-gray-200 pb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Current Status</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          <span className="text-xs font-medium text-orange-600">Awaiting Pricing</span>
        </div>
        <button
          className={`mt-4 w-full px-4 py-3 rounded-lg text-xs font-semibold transition-colors duration-200 ${pricingReady ? 'bg-[#007bff] text-white hover:bg-blue-700 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          disabled={!pricingReady}
        >
          Proceed to Payment
        </button>
      </div>
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-900 mb-2">Cargo Ready Date</h4>
        <p className="text-xs text-gray-900">Mar 14, 2021</p>
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
          <div>
            <p className="text-xs font-medium text-gray-900">Shenzhen Forward Supply</p>
            <p className="text-xs text-gray-600">C Zone 5th, No. 1 Exchange Square, Huanan City, Pinghu Town, Shenzhen, Guangdong, China</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
          <div>
            <p className="text-xs font-medium text-gray-900">Shanghai, China</p>
            <p className="text-xs text-gray-600">Shanghai, China</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
          <div>
            <p className="text-xs font-medium text-gray-900">Los Angeles, CA</p>
            <p className="text-xs text-gray-600">Los Angeles, CA, United States</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
          <div>
            <p className="text-xs font-medium text-gray-900">Los Angeles Warehouse</p>
            <p className="text-xs text-gray-600">940 Avila St., Los Angeles, CA, 90012, United States</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Booking Confirm PopUp */}
      {showPopup && <BookingConfirmPopUp onClose={() => setShowPopup(false)} />}
      {/* Header */}
      <div className="bg-white p-4">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Package className="w-4 h-4" />
              <span>FL-10816</span>
            </div>
            <div className="flex items-center gap-4">
              {isEditingTitle ? (
                <>
                  <input
                    className="text-2xl font-bold text-gray-900 mb-1 border border-gray-300 rounded px-2 py-1 w-64"
                    value={tempTitle}
                    onChange={e => setTempTitle(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={() => {
                      setTitle(tempTitle);
                      setIsEditingTitle(false);
                    }}
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setTempTitle(title);
                      setIsEditingTitle(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600">No shipment tags</p>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto p-4 -mt-4">
        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Column (wider) */}
          <div className="flex-1 min-w-0">
             
             {/* Route Map Placeholder */}
             <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <div className="h-100 bg-blue-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Shipment Route Map</p>
                  <p className="text-xs text-gray-400">Shanghai → Los Angeles</p>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <StepIndicator steps={progressSteps} />

            {/* Tasks Section */}
            <div className="bg-white rounded-lg border border-gray-200 mb-4">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Tasks</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Assignee</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.length > 0 ? tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-xs text-gray-900">{task.name}</td>
                        <td className="px-4 py-4 text-xs text-gray-900">{task.assignee}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            task.status === 'In Progress' 
                              ? 'bg-blue-100 text-[#007bff]'
                              : task.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-500">
                          There are no open tasks at this time.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabbed Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Tab Headers */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-4">
                  {['activity', 'details', 'documents', 'purchase-orders'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-[#007bff] text-[#007bff]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.replace('-', ' ')}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {activeTab === 'activity' && (
                  <div>
                    {/* Visibility Control */}
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Messages on linked orders</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        <strong>Viewable by:</strong> 2+ PARTIES
                      </div>
                      <div className="mt-1">
                        <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800">
                          <span>Studio Apparel, FreightLynk</span>
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="space-y-4">
                      {activityMessages.map((message) => (
                        <div key={message.id} className="flex gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-900">{message.content}</p>
                            <p className="text-xs text-gray-500 mt-1">{message.user} • {message.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Shipment Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500">Origin:</span>
                          <span className="ml-2 text-gray-900">Your origin data will go here</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Destination:</span>
                          <span className="ml-2 text-gray-900">Your destination data will go here</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Weight:</span>
                          <span className="ml-2 text-gray-900">Your weight data will go here</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Volume:</span>
                          <span className="ml-2 text-gray-900">Your volume data will go here</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="text-center py-12">
                    <FileText className="w-8 h-8 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-xs">No documents uploaded yet</p>
                    <button className="mt-4 px-4 py-2 bg-[#007bff] text-white text-xs rounded-lg hover:bg-blue-700">
                      Upload Documents
                    </button>
                  </div>
                )}

                {activeTab === 'purchase-orders' && (
                  <div>
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900">Purchase Orders</h4>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="text-xs text-gray-600">PO 1057, PO 1055</p>
                      <p className="text-xs text-gray-500 mt-1">Your PO data values will go here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (narrower) */}
          <div className="w-full lg:w-110 flex-shrink-0">
            <CurrentStatusCard />
            
            {/* Container Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Container Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Transport Mode:</span>
                  <span className="text-xs font-medium text-gray-900">Sea Freight</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Container Type:</span>
                  <span className="text-xs font-medium text-gray-900">40ft Standard</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Shipment Type:</span>
                  <span className="text-xs font-medium text-gray-900">FCL</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingReview;