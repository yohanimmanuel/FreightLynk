import React, { useEffect, useState } from 'react';
import { 
  Edit, 
  Save, 
  Package, 
  Ship, 
  MapPin, 
  Calendar, 
  Truck, 
  FileText, 
  Scale, 
  Info,
  Plane,
  Building2
} from 'lucide-react';
import POSummaryTable from '../purchasesorders/POSummaryTable';
import { purchaseOrdersData, poDetailsData } from '../purchasesorders/POManagementTable';


interface BookingReviewProps {
    onConfirmBooking?: () => void;
  }

const BookingReview: React.FC<BookingReviewProps> = ({ onConfirmBooking = () => {} }) => { 
  const [shipmentName, setShipmentName] = useState('');
  const [bookingFormData, setBookingFormData] = useState<any>(null);

  useEffect(() => {
    const name = sessionStorage.getItem('shipmentName') || '';
    setShipmentName(name);
    const formData = sessionStorage.getItem('bookingFormData');
    if (formData) setBookingFormData(JSON.parse(formData));
    // Do not clear PO data here; it will be used in the confirmation step
    // return () => {
    //   sessionStorage.removeItem('bookingData');
    //   console.log('PO data cleared from session storage - user navigated away from booking review');
    // };
  }, []);

  // Helper for transport mode icon
  const renderTransportIcon = (mode: string) => {
    if (mode === 'air') return <Plane className="w-8 h-8 text-[#007bff]" />;
    if (mode === 'sea') return <Ship className="w-8 h-8 text-[#007bff]" />;
    if (mode === 'land') return <Truck className="w-8 h-8 text-[#007bff]" />;
    return null;
  };

  // Helper for container type/quantity
  const renderContainerType = (type: string, qty: string, shipmentType: string) => {
    if (!type) return null;
    if (shipmentType === 'fcl') {
      return `FCL, ${qty || 1} x ${type.replace('ft', ' ft').replace('-hc', ' HC')}`;
    } else if (shipmentType === 'lcl') {
      return `LCL, ${type.replace('ft', ' ft').replace('-hc', ' HC')}`;
    }
    return type;
  };

  // Helper for date formatting
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-8xl mx-auto p-4 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Review and book</h1>
          <p className="text-sm text-gray-600">{shipmentName}</p>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 flex items-center gap-2">
            <Edit className="w-4 h-4 inline mr-2" />
            Edit details
          </button>
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 flex items-center gap-2">
            <Save className="w-4 h-4 inline mr-2" />
            Save draft
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Booking Details Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Booking details
              </h2>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  {bookingFormData ? renderTransportIcon(bookingFormData.transportModeValue) : <Ship className="w-8 h-8 text-blue-600" />}
                </div>
                <div>
                  <div className="text-xs text-gray-900">
                    {bookingFormData ? renderContainerType(bookingFormData.containerTypeValue, bookingFormData.containerQuantity, bookingFormData.shipmentTypeValue) : 'Container type and quantity data will be shown here'}
                  </div>
                  <div className="text-xs text-gray-900 mt-1">
                    {bookingFormData ? (
                      <>
                        <span className="font-semibold">Cargo Ready Date: </span>{formatDate(bookingFormData.cargoReadyDate)}
                      </>
                    ) : 'Cargo ready date data will be shown here'}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Incoterms</h4>
                  <div className="text-xs text-gray-900 p-3 rounded">
                    {bookingFormData ? bookingFormData.incotermsValue : 'Incoterms data will be shown here'}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Export customs services</h4>
                  <div className="text-xs text-gray-900 p-3 rounded">
                    {bookingFormData ? (bookingFormData.originCustoms ? 'Yes' : 'No') : 'Export customs service status will be shown here'}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Import customs services</h4>
                  <div className="text-xs text-gray-900 p-3 rounded">
                    {bookingFormData ? (bookingFormData.destinationCustoms ? 'Yes' : 'No') : 'Import customs service status will be shown here'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Origin & Destination Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Pickup and delivery
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {/* Pickup from */}
              <div>
                <div className="text-xs font-medium text-gray-600 mb-1">Pickup from</div>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-2">
                  <div className="w-14 h-14 bg-blue-100 rounded flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-[#007bff]" />
                  </div>
                  <div className="flex-1 min-h-0">
                    <div className="font-semibold text-sm text-gray-900 leading-tight mb-1">
                      {(() => {
                        const map: Record<string, string> = {
                          'studio-apparel': 'Studio Apparel',
                          'global-trade': 'Global Trade Co',
                        };
                        const val = bookingFormData?.shipperValue as string;
                        return val && map[val] ? map[val] : 'Not specified';
                      })()}
                    </div>
                    <div className="text-xs text-gray-600 leading-tight mb-2">
                      {bookingFormData?.originLocation || 'Not specified'}
                    </div>
                    <div className="text-xs text-gray-600 leading-tight">
                      <span className="font-medium">Trucking: </span>
                      {bookingFormData ? (bookingFormData.originTrucking ? 'Trucking required' : 'No trucking') : 'Trucking status will be shown here'}
                    </div>
                  </div>
                </div>
              </div>
              {/* Selected ports */}
              <div>
                <div className="text-xs font-medium text-gray-600 mb-1">Selected ports</div>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-2">
                  <div className="w-14 h-14 bg-blue-100 rounded flex items-center justify-center">
                    <Ship className="w-7 h-7 text-[#007bff]" />
                  </div>
                  <div className="flex-1 min-h-0">
                    <div className="flex items-center gap-2 text-sm text-gray-900 font-semibold leading-tight">
                      <span>{bookingFormData?.originPort || 'Not specified'}</span>
                      <span className="mx-1">→</span>
                      <span>{bookingFormData?.destinationPort || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Deliver to */}
              <div>
                <div className="text-xs font-medium text-gray-600 mb-1">Delivery to</div>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-2">
                  <div className="w-14 h-14 bg-blue-100 rounded flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-[#007bff]" />
                  </div>
                  <div className="flex-1 min-h-0">
                    <div className="font-semibold text-sm text-gray-900 leading-tight mb-1">
                      {(() => {
                        const map: Record<string, string> = {
                          'forward-supply': 'Forward Supply Co',
                          'logistics-hub': 'Logistics Hub',
                        };
                        const val = bookingFormData?.consigneeValue as string;
                        return val && map[val] ? map[val] : 'Not specified';
                      })()}
                    </div>
                    <div className="text-xs text-gray-600 leading-tight mb-2">
                      {bookingFormData?.destinationLocation || 'Not specified'}
                    </div>
                    <div className="text-xs text-gray-600 leading-tight">
                      <span className="font-medium">Trucking: </span>
                      {bookingFormData ? (bookingFormData.destinationTrucking ? 'Trucking required' : 'No trucking') : 'Trucking status will be shown here'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Order Review Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Purchase Order Review
              </h2>
            </div>
            <div className="p-4">
              {typeof window !== 'undefined' && (() => {
                const bookingData = sessionStorage.getItem('bookingData');
                if (bookingData) {
                  const selectedPOs = JSON.parse(bookingData);
                  console.log('BookingReview selectedPOs:', selectedPOs);
                  if (selectedPOs && selectedPOs.length > 0) {
                    return (
                      <POSummaryTable
                        selectedPOs={selectedPOs}
                        purchaseOrdersData={purchaseOrdersData}
                        poDetailsData={poDetailsData}
                      />
                    );
                  } else {
                    return <div className="text-xs text-gray-600 p-4 rounded">No purchase orders selected</div>;
                  }
                } else {
                  return <div className="text-xs text-gray-600 p-4 rounded">No purchase orders selected</div>;
                }
              })()}
            </div>
          </div>

          {/* Cargo Details Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                Product & Cargo Details
              </h2>
            </div>
            <div className="p-4">
              {/* Top block: Product name, description, HS code, hazardous info */}
              <div className="mb-6">
                <div className="font-semibold text-sm text-gray-900 mb-1">
                  {bookingFormData?.productName || 'Product name will be shown here'}
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  {bookingFormData?.goodsDescription?.trim() ? bookingFormData.goodsDescription : 'No description'}
                </div>
                <div className="text-xs text-gray-600 mb-1">
                  HS Code: {bookingFormData?.hsCode || 'N/A'}
                </div>
                <div className="text-xs text-gray-600">
                  Hazardous goods: {bookingFormData ? (bookingFormData.dangerousGoods ? 'Yes' : 'No') : 'N/A'}
                </div>
              </div>
              {/* Bottom row: Weight, Volume, Pieces */}
              <div className="border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-900">
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Total weight</div>
                  <div className="text-sm font-semibold">{bookingFormData?.weight ? `${bookingFormData.weight} kg` : 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Total volume</div>
                  <div className="text-sm font-semibold">{bookingFormData?.volume ? `${bookingFormData.volume} cbm` : 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Pieces</div>
                  <div className="text-sm font-semibold">
                    {bookingFormData?.packageCount ? `${bookingFormData.packageCount} ${bookingFormData?.packageTypeValue || ''}`.trim() : 'N/A'}
                  </div>
                </div>
              </div>
              {/* Additional Notes Section */}
              <div className="mt-4 w-full">
                <div className="text-xs font-medium text-gray-600 mb-1">Additional Notes</div>
                <div className="text-xs text-gray-900 rounded-lg border border-gray-200 p-3 min-h-[40px]">
                  {bookingFormData?.additionalNotes?.trim() ? bookingFormData.additionalNotes : 'No additional notes'}
                </div>
              </div>
            </div>
          </div>

          {/* Shipment Tags Section */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Shipment tags
              </h2>
            </div>
            <div className="p-4">
              {bookingFormData?.requireShipmentTags ? (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">PO Number:</span> <span className="text-gray-900 font-semibold">PO</span>{bookingFormData.poNumber ? ` ${bookingFormData.poNumber}` : ' N/A'}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">SKU Number:</span> <span className="text-gray-900 font-semibold">#</span>{bookingFormData.skuNumber ? ` ${bookingFormData.skuNumber}` : ' N/A'}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-900">
                  No shipment tags required
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* New Shipment Card with Confirm Button */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-4 flex flex-col gap-2">
            <div className="font-semibold text-sm text-gray-900 mb-2">New Shipment</div>
            <button 
              onClick={onConfirmBooking}
              className="w-full px-6 py-3 text-sm bg-[#007bff] text-white font-semibold rounded-lg hover:bg-blue-700 mb-2"
            >
              Confirm Booking
            </button>
            <label className="flex items-center gap-2 text-xs text-gray-700">
              <input type="checkbox" className="rounded" />
              Create template
            </label>
          </div>

          {/* Special Instructions */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Special Instructions
              </h3>
            </div>
            <div className="p-4">
              <div className="text-xs text-gray-600 p-3 rounded">
                {bookingFormData?.specialInstructions?.trim() ? bookingFormData.specialInstructions : 'No special instructions'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingReview;