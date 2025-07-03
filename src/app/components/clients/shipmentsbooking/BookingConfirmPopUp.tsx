import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Copy, 
  FileText, 
  Package, 
  RefreshCw, 
  ArrowRight,
  MapPin,
  Calendar,
  Ship,
  X
} from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';

interface BookingConfirmProps {
  onClose?: () => void;
  bookingData?: {
    shipmentId?: string;
    poNumber?: string;
    originPort?: string;
    destinationPort?: string;
  };
}

const BookingConfirmPopUp: React.FC<BookingConfirmProps> = ({ onClose = () => {}, bookingData }) => {
  const [selectedNextAction, setSelectedNextAction] = useState<string>('');
  const formData = useBookingStore(state => state.formData);
  const selectedPOs = useBookingStore(state => state.selectedPOs);
  const flNumber = useBookingStore(state => state.flNumber);
  const setBookingSubmitted = useBookingStore(state => state.setBookingSubmitted);

  useEffect(() => {
    import('canvas-confetti').then((module) => {
      module.default({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        zIndex: 99999,
      });
    });
  }, []);

  const handleActionSelect = (action: string) => {
    setSelectedNextAction(action);
  };

  const handleClose = () => {
    onClose();
  };

  // Use bookingData if provided, otherwise use Zustand state
  const shipmentId = bookingData?.shipmentId || flNumber;
  const poNumber = bookingData?.poNumber || (selectedPOs && selectedPOs.length > 0 ? 
    selectedPOs.map(po => `PO ${po.poId.replace(/^PO ?/, '')}`).join(', ') : '-');
  const originPort = bookingData?.originPort || formData?.originPort || '-';
  const destinationPort = bookingData?.destinationPort || formData?.destinationPort || '-';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-bold text-gray-900">Booking submitted</h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Message */}
        <div className="p-4 -mt-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-gray-900">We will get to work moving your shipment.</span>
          </div>
        </div>

        {/* Booking Reference */}
        <div className="p-4 -mt-3">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Booking Reference</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-[#007bff]">{shipmentId}</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Purchase Orders</div>
                <div className="text-xs font-medium text-gray-900">{poNumber}</div>
              </div>
            </div>
            {/* Route Summary */}
            <div className="flex items-center gap-4 bg-white p-3 rounded border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#007bff] rounded-full"></div>
                <span className="text-xs font-medium text-gray-900">{originPort}</span>
              </div>
              <div className="flex-1 border-t border-gray-300 relative">
                <Ship className="w-4 h-4 text-gray-500 absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-white" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-xs font-medium text-gray-900">{destinationPort}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next Actions */}
        <div className="p-4 -mt-3">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">What would you like to do next?</h3>
          
          <div className="space-y-2">
            {/* Replicate Booking */}
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedNextAction === 'replicate' 
                  ? 'border-[#007bff] bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleActionSelect('replicate')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <Copy className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-900">Replicate this booking</div>
                    <div className="text-xs text-gray-600">Start another booking from an exact copy</div>
                  </div>
                </div>
                <button 
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                    selectedNextAction === 'replicate'
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Replicate
                </button>
              </div>
            </div>

            {/* New Booking */}
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedNextAction === 'new' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleActionSelect('new')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-900">Submit a new booking</div>
                    <div className="text-xs text-gray-600">Start new or use one of your templates</div>
                  </div>
                </div>
                <button 
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                    selectedNextAction === 'new'
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Create Booking
                </button>
              </div>
            </div>

            {/* Save as Template */}
            <div 
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedNextAction === 'template' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleActionSelect('template')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-900">Save as template</div>
                    <div className="text-xs text-gray-600">Save this submitted booking as a template</div>
                  </div>
                </div>
                <button 
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                    selectedNextAction === 'template'
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmPopUp;