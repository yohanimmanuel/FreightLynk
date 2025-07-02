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
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/store/bookingStore';

interface BookingReviewProps {
    onConfirmBooking?: () => void;
  }

const BookingReview: React.FC<BookingReviewProps> = ({ onConfirmBooking }) => { 
  const router = useRouter();
  const formData = useBookingStore(state => state.formData);
  const setFormData = useBookingStore(state => state.setFormData);
  const selectedPOs = useBookingStore(state => state.selectedPOs);
  const setSelectedPOs = useBookingStore(state => state.setSelectedPOs);
  const tradeRole = useBookingStore(state => state.tradeRole);
  const setTradeRole = useBookingStore(state => state.setTradeRole);
  const flNumber = useBookingStore(state => state.flNumber);
  const setFlNumber = useBookingStore(state => state.setFlNumber);
  const bookingSubmitted = useBookingStore(state => state.bookingSubmitted);
  const setBookingSubmitted = useBookingStore(state => state.setBookingSubmitted);

  const [shipmentName, setShipmentName] = useState('');

  useEffect(() => {
    // Check if we're coming from confirmation page
    if (typeof window !== 'undefined') {
      const confirmedBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
      // Only check if the booking exists in localStorage
      if (confirmedBookings.some((b: any) => b.id === flNumber)) {
        console.log('Booking already confirmed, redirecting to submitted page');
        router.replace('/bookings/submitted');
        return;
      }
    }

    setShipmentName(formData.shipmentName || '');
  }, [formData.shipmentName, router, flNumber]);

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

  // When confirm button is clicked
  const handleConfirmClick = () => {
    if (!flNumber) {
      const fl = 'FL-' + Math.floor(10000 + Math.random() * 90000);
      setFlNumber(fl);
    }
    // Navigate to confirmation page
    onConfirmBooking && onConfirmBooking();
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
                  {formData ? renderTransportIcon(formData.transportModeValue) : <Ship className="w-8 h-8 text-blue-600" />}
                </div>
                <div>
                  <div className="text-xs text-gray-900">
                    {formData ? renderContainerType(formData.containerTypeValue, formData.containerQuantity, formData.shipmentTypeValue) : 'Container type and quantity data will be shown here'}
                  </div>
                  <div className="text-xs text-gray-900 mt-1">
                    {formData ? (
                      <>
                        <span className="font-semibold">Cargo Ready Date: </span>{formatDate(formData.cargoReadyDate)}
                      </>
                    ) : 'Cargo ready date data will be shown here'}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Incoterms</h4>
                  <div className="text-xs text-gray-900">
                    {formData ? formData.incotermsValue : 'Incoterms data will be shown here'}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Export customs services</h4>
                  <div className="text-xs text-gray-900">
                    {formData ? (formData.originCustoms ? 'Yes' : 'No') : 'Export customs service status will be shown here'}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-2">Import customs services</h4>
                  <div className="text-xs text-gray-900">
                    {formData ? (formData.destinationCustoms ? 'Yes' : 'No') : 'Import customs service status will be shown here'}
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
                      {formData?.shipperValue || 'Not specified'}
                    </div>
                    <div className="text-xs text-gray-600 leading-tight mb-2">
                      {formData?.originLocation || 'Not specified'}
                    </div>
                    <div className="text-xs text-gray-600 leading-tight">
                      <span className="font-medium">Trucking: </span>
                      {formData ? (formData.originTrucking ? 'Trucking required' : 'No trucking') : 'Trucking status will be shown here'}
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
                      <span>{formData?.originPort || 'Not specified'}</span>
                      <span className="mx-1">→</span>
                      <span>{formData?.destinationPort || 'Not specified'}</span>
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
                      {formData?.consigneeValue || 'Not specified'}
                    </div>
                    <div className="text-xs text-gray-600 leading-tight mb-2">
                      {formData?.destinationLocation || 'Not specified'}
                    </div>
                    <div className="text-xs text-gray-600 leading-tight">
                      <span className="font-medium">Trucking: </span>
                      {formData ? (formData.destinationTrucking ? 'Trucking required' : 'No trucking') : 'Trucking status will be shown here'}
                  </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h4 className="text-xs font-medium text-gray-500 mb-2">Are you a Shipper or Consignee?</h4>
                <div className="text-xs text-gray-900">
                  {tradeRole === 'shipper' ? 'Shipper' : 'Consignee'}
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
              <POSummaryTable
                selectedPOs={selectedPOs}
                purchaseOrdersData={purchaseOrdersData}
                poDetailsData={poDetailsData}
              />
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
              <div className="mb-2">
                <div className="font-semibold text-sm text-gray-900 mb-1">
                  {formData?.productName || 'Product name will be shown here'}
                  </div>
                <div className="text-xs text-gray-600 mb-1">
                  {formData?.goodsDescription?.trim() ? formData.goodsDescription : 'No description'}
                </div>
                <div className="text-xs text-gray-600 mb-4">
                  HS Code: {formData?.hsCode || 'N/A'}
                </div>
                <div className="text-xs text-gray-600">
                  Hazardous goods: {formData ? (formData.dangerousGoods ? 'Yes' : 'No') : 'N/A'}
                </div>
              </div>
              {/* Bottom row: Weight, Volume, Pieces */}
              <div className="border-t border-gray-200 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-900">
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Total weight</div>
                  <div className="text-sm font-semibold">{formData?.weight ? `${formData.weight} kg` : 'N/A'}</div>
                </div>
                  <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Total volume</div>
                  <div className="text-sm font-semibold">{formData?.volume ? `${formData.volume} cbm` : 'N/A'}</div>
                  </div>
                  <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Pieces</div>
                  <div className="text-sm font-semibold">
                    {formData?.packageCount ? `${formData.packageCount} ${formData?.packageTypeValue || ''}`.trim() : 'N/A'}
                  </div>
                </div>
              </div>
              {/* Additional Notes Section */}
              <div className="mt-4 w-full">
                <div className="text-xs font-medium text-gray-600 mb-1">Additional Notes</div>
                <div className="text-xs text-gray-900 rounded-lg border border-gray-200 p-3 min-h-[40px]">
                  {formData?.additionalNotes?.trim() ? formData.additionalNotes : 'No additional notes'}
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
              {formData?.requireShipmentTags ? (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">PO Number:</span> <span className="text-gray-900 font-semibold">PO</span>{formData.poNumber ? ` ${formData.poNumber}` : ' N/A'}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">SKU Number:</span> <span className="text-gray-900 font-semibold">#</span>{formData.skuNumber ? ` ${formData.skuNumber}` : ' N/A'}
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
              className="w-full px-6 py-3 text-sm bg-[#007bff] text-white font-semibold rounded-lg hover:bg-blue-700 mb-2"
              onClick={handleConfirmClick}
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
                {formData?.specialInstructions?.trim() ? formData.specialInstructions : 'No special instructions'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingReview;