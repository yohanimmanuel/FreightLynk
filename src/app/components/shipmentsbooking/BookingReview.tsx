import React, { useState } from 'react';
import { 
  Edit, 
  Save, 
  Send, 
  Package, 
  Ship, 
  MapPin, 
  Calendar, 
  Truck, 
  FileText, 
  Users, 
  Scale, 
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';

const BookingReview = () => {
  const [currentView, setCurrentView] = useState('review'); // 'review' or 'confirm'

  const ReviewSection = () => (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Booking Details</h1>
          <p className="text-sm text-gray-600">PO 1057, PO 1055</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Edit className="w-4 h-4 inline mr-2" />
            Edit details
          </button>
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Save className="w-4 h-4 inline mr-2" />
            Save draft
          </button>
          <button 
            onClick={() => setCurrentView('confirm')}
            className="px-6 py-2 text-sm bg-[#007bff] text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Proceed to Confirm
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Booking Details Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Booking details
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Ship className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Container type and quantity data will be shown here</div>
                  <div className="text-sm text-gray-600 mt-1">Cargo ready date data will be shown here</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Incoterms</h4>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    Incoterms data will be shown here
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Export customs services</h4>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    Export customs service status will be shown here
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Origin & Destination Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Pickup and delivery
              </h2>
            </div>
            <div className="p-6 space-y-6">
              
              {/* Pickup from */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  Pickup from
                </h4>
                <div className="ml-8 bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Shipper company name data will be shown here
                  </div>
                  <div className="text-sm text-gray-600">
                    Origin location address data will be shown here
                  </div>
                </div>
              </div>

              {/* Selected ports */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Selected ports</h4>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="text-xs font-medium text-gray-900">
                      Origin port data will be shown here
                    </div>
                  </div>
                  <div className="flex-1 border-t border-gray-300 relative">
                    <Ship className="w-4 h-4 text-gray-500 absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50" />
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="text-xs font-medium text-gray-900">
                      Destination port data will be shown here
                    </div>
                  </div>
                </div>
              </div>

              {/* Deliver to */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  Deliver to
                </h4>
                <div className="ml-8 bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Consignee company name data will be shown here
                  </div>
                  <div className="text-sm text-gray-600">
                    Destination location address data will be shown here
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cargo Details Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                Cargo details
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    Weight data will be shown here
                  </div>
                  <div className="text-sm text-gray-600">Total Weight (kg)</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    Volume data will be shown here
                  </div>
                  <div className="text-sm text-gray-600">Total Volume (cbm)</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    Package count will be shown here
                  </div>
                  <div className="text-sm text-gray-600">Total Packages</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Product Description</h4>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    Goods description data will be shown here
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">HS Code</h4>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      HS Code data will be shown here
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Package Type</h4>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      Package type data will be shown here
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipment Tags Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Shipment tags
              </h2>
            </div>
            <div className="p-6">
              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded">
                Shipment tags data will be shown here (PO numbers, SKU numbers, etc.)
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Selected PO Summary */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Selected Purchase Orders</h3>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  PO numbers and details will be shown here
                </div>
                <div className="text-sm text-gray-600">
                  Selected items count will be shown here
                </div>
                <div className="text-sm text-gray-600">
                  Total booking value will be shown here
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Important Dates
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div>
                  <div className="text-xs font-medium text-gray-900">Cargo Ready Date</div>
                  <div className="text-xs text-gray-600">Cargo ready date data will be shown here</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div>
                  <div className="text-xs font-medium text-gray-900">Target Delivery</div>
                  <div className="text-xs text-gray-600">Target delivery date data will be shown here</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Services */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Additional Services
              </h3>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Origin Trucking</span>
                <span className="text-gray-900">Trucking status will be shown here</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Export Customs</span>
                <span className="text-gray-900">Customs status will be shown here</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Import Customs</span>
                <span className="text-gray-900">Customs status will be shown here</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Destination Trucking</span>
                <span className="text-gray-900">Trucking status will be shown here</span>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Special Instructions
              </h3>
            </div>
            <div className="p-4">
              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                Special instructions data will be shown here
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  const ConfirmSection = () => (
    <div className="max-w-4xl mx-auto p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Confirm Booking</h1>
          <p className="text-sm text-gray-600">Final confirmation for PO 1057, PO 1055</p>
        </div>
        
        <button 
          onClick={() => setCurrentView('review')}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back to Review
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Booking Summary */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Booking Summary
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Route</h4>
                <div className="text-sm text-gray-600">
                  Origin Port → Destination Port
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Service Type</h4>
                <div className="text-sm text-gray-600">
                  Ocean Freight
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Total Weight</h4>
                <div className="text-sm text-gray-600">
                  Weight data will be shown here
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Total Volume</h4>
                <div className="text-sm text-gray-600">
                  Volume data will be shown here
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buyers on Booking */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800">Buyers on this booking</h3>
                <div className="mt-2">
                  <div className="text-sm text-yellow-700 mb-2">
                    • Studio Apparel
                  </div>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-xs underline">
                    View credit management rules
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Terms and Conditions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded" />
                <label className="text-sm text-gray-700">
                  I agree to the <a href="#" className="text-blue-600 hover:text-blue-800 underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-800 underline">Privacy Policy</a>
                </label>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded" />
                <label className="text-sm text-gray-700">
                  I confirm that all booking details are accurate and complete
                </label>
              </div>
              <div className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded" />
                <label className="text-sm text-gray-700">
                  I understand the cancellation and modification policies
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Final Confirmation Buttons */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
              <Save className="w-4 h-4 inline mr-2" />
              Save as Draft
            </button>
            <button className="px-8 py-3 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              <Send className="w-4 h-4 inline mr-2" />
              Confirm Booking
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <>
      {currentView === 'review' ? <ReviewSection /> : <ConfirmSection />}
    </>
  );
};

export default BookingReview;