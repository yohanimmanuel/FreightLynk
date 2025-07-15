import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
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
  Plane,
  Maximize2,
  X
} from 'lucide-react';
import BookingConfirmPopUp from './BookingConfirmPopUp';
import POSummaryTable from '../purchasesorders/POSummaryTable';
import { usePOStore } from '@/store/poStore';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/store/bookingStore';

// Move zoom handlers outside so both components can use them
type ZoomSetter = Dispatch<SetStateAction<number>>;
const handleZoomIn = (setter: ZoomSetter) => setter((z: number) => Math.min(z + 0.2, 2.5));
const handleZoomOut = (setter: ZoomSetter) => setter((z: number) => Math.max(z - 0.2, 1));

const BookingConfirm = ({ bookingId }: { bookingId?: string }) => {
  const [activeTab, setActiveTab] = useState('activity');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [pricingReady, setPricingReady] = useState(false);
  const [showPopup, setShowPopup] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [headerData, setHeaderData] = useState<{ shipmentId: string; shipmentName: string; shipmentTags: { hasTags: boolean; poNumber: string; skuNumber: string } } | null>(null);
  const [externalBooking, setExternalBooking] = useState<any | null>(null);
  const router = useRouter();

  // Zustand booking data
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
  const purchaseOrders = usePOStore(state => state.purchaseOrders);
  const poDetails = usePOStore(state => state.poDetails);
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

  // --- Current Status Card ---
  const CurrentStatusCard = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="mb-4 border-b border-gray-200 pb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Current Status</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          <span className="text-xs font-medium text-orange-600">Awaiting Pricing</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          * Pricing typically takes 1-3 business days from the forwarder or logistics provider.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-xs text-gray-500">Want to Request Quote?</p>
          <button className="text-xs text-[#007bff] hover:text-blue-700">Request Quote here!</button>
        </div>
        <button
          className={`mt-4 w-full px-4 py-3 rounded-lg text-xs font-semibold transition-colors duration-200 ${pricingReady ? 'bg-[#007bff] text-white hover:bg-blue-700 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          disabled={!pricingReady}
        >
          Proceed to Payment
        </button>
        <button
          className="mt-2 w-full px-4 py-3 rounded-lg text-xs font-semibold bg-white text-gray-500 hover:bg-gray-200 border border-gray-300 transition-colors duration-200"
          onClick={() => {
            router.replace('/bookings');
          }}
        >
          {'>> Go to Bookings'}
        </button>
      </div>

      {/* Cargo Ready Date */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-900 mb-2">Cargo Ready Date</h4>
        <p className="text-xs text-gray-900">{(() => {
          if (!displayData?.cargoReadyDate) return 'Not specified';
          const date = new Date(displayData.cargoReadyDate);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        })()}</p>
      </div>
      <div className="space-y-3">
        {/* Origin */}
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
          <div>
            <div className="text-xs font-semibold text-gray-900">{displayData.shipper || displayData.shipperValue || '-'}</div>
            <div className="text-xs text-gray-700">{displayData.originLocation || '-'}</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
          <div>
            <div className="text-xs font-semibold text-gray-900 mt-1">{bookingId && externalBooking ? externalBooking.originPort : formData.originPort}</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
          <div>
            <div className="text-xs font-semibold text-gray-900 mt-1">{bookingId && externalBooking ? externalBooking.destinationPort : formData.destinationPort}</div>
          </div>
        </div>
        {/* Destination */}
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
          <div>
            <div className="text-xs font-semibold text-gray-900">{displayData.consignee || displayData.consigneeValue || '-'}</div>
            <div className="text-xs text-gray-700">{displayData.destinationLocation || '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (bookingSubmitted) {
      // Build the full booking object with all fields
      const booking = {
        id: flNumber,
        shipmentId: null,
        poNumber: selectedPOs.map(po => `PO ${po.poId.replace(/^PO ?/, '')}`).join(', '),
        productName: formData.productName,
        hsCode: formData.hsCode,
        consignee: formData.consigneeValue,
        shipper: formData.shipperValue,
        origin: formData.originPort,
        destination: formData.destinationPort,
        originPort: formData.originPort,
        destinationPort: formData.destinationPort,
        shipmentType: formData.shipmentTypeValue,
        shipmentTypeValue: formData.shipmentTypeValue,
        containerType: formData.containerTypeValue,
        containerTypeValue: formData.containerTypeValue,
        incoterms: formData.incotermsValue,
        incotermsValue: formData.incotermsValue,
        cargoReadyDate: formData.cargoReadyDate,
        dangerousGoods: formData.dangerousGoods,
        weight: formData.weight,
        volume: formData.volume,
        pieces: Number(formData.packageCount) || 0,
        status: 'Booked',
        eta: formData.targetDeliveryDate || '',
        createdAt: new Date().toISOString(),
        shipmentName: formData.shipmentName,
        requireShipmentTags: formData.requireShipmentTags,
        skuNumber: formData.skuNumber,
        originLocation: formData.originLocation,
        destinationLocation: formData.destinationLocation,
        containerQuantity: formData.containerQuantity,
        transportModeValue: formData.transportModeValue,
        packageType: formData.packageTypeValue || formData.packageType,
        goodsDescription: formData.goodsDescription,
        truckType: formData.truckType,
        truckQuantity: formData.truckQuantity,
        // Properly format selectedPOs for storage
        selectedPOs: selectedPOs.map(po => ({
          poId: po.poId,
          selectedItems: Array.isArray(po.selectedItems) ? po.selectedItems : Array.from(po.selectedItems),
          bookedQuantities: po.bookedQuantities || {}
        })),
      };

      // Save to localStorage first
      if (typeof window !== 'undefined') {
        try {
          const prev = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
          const updated = [...prev, booking];
          localStorage.setItem('confirmedBookings', JSON.stringify(updated));
          console.log('Saved booking to localStorage:', booking);
          
          // Dispatch storage event to notify other components
          window.dispatchEvent(new Event('storage'));
          
          // Clear booking data from sessionStorage
          sessionStorage.removeItem('bookingData');
          
          // Navigate to submitted page
          router.replace('/bookings/submitted');
          
          // Clear state after navigation
          setTimeout(() => {
            setFormData({});
            setSelectedPOs([]);
            setTradeRole('shipper');
            setFlNumber('');
            setBookingSubmitted(false);
          }, 100);
        } catch (error) {
          console.error('Error saving booking:', error);
        }
      }
    }
  }, [bookingSubmitted, router, flNumber, formData, selectedPOs, setFormData, setSelectedPOs, setTradeRole, setFlNumber, setBookingSubmitted]);

  // Check if this is a new booking or viewing an existing one
  useEffect(() => {
    if (bookingId) {
      // If viewing existing booking, don't check bookingSubmitted
      return;
    }

    // For new bookings, check if already confirmed
    if (typeof window !== 'undefined') {
      const confirmedBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
      if (confirmedBookings.some((b: any) => b.id === flNumber)) {
        router.replace('/bookings/submitted');
      }
    }
  }, [bookingId, flNumber, router]);

  // Load existing booking if bookingId is provided
  useEffect(() => {
    if (bookingId && typeof window !== 'undefined') {
      const all = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
      const found = all.find((b: any) => b.id === bookingId);
      if (found) {
        setExternalBooking(found);
        console.log('Loaded existing booking:', found);
        
        // Override Zustand state with the booking data to ensure correct display
        if (found.originPort) {
          setFormData((prev: any) => ({
            ...prev,
            originPort: found.originPort,
            destinationPort: found.destinationPort
          }));
        }
      }
    }
  }, [bookingId, setFormData]);

  // Hybrid logic: if bookingId is present, use localStorage; else use Zustand (formData, etc.)
  const displayData = bookingId && externalBooking ? {
    ...externalBooking,
    id: externalBooking.id,
    shipmentId: externalBooking.shipmentId,
    poNumber: externalBooking.poNumber,
    productName: externalBooking.productName,
    hsCode: externalBooking.hsCode,
    consignee: externalBooking.consignee,
    shipper: externalBooking.shipper,
    origin: externalBooking.origin || externalBooking.originPort,
    destination: externalBooking.destination || externalBooking.destinationPort,
    originPort: externalBooking.originPort,
    destinationPort: externalBooking.destinationPort,
    shipmentType: externalBooking.shipmentType,
    shipmentTypeValue: externalBooking.shipmentTypeValue,
    containerType: externalBooking.containerType,
    containerTypeValue: externalBooking.containerTypeValue,
    incoterms: externalBooking.incoterms,
    incotermsValue: externalBooking.incotermsValue,
    cargoReadyDate: externalBooking.cargoReadyDate,
    dangerousGoods: externalBooking.dangerousGoods,
    weight: externalBooking.weight,
    volume: externalBooking.volume,
    pieces: externalBooking.pieces,
    status: externalBooking.status,
    eta: externalBooking.eta,
    createdAt: externalBooking.createdAt,
    shipmentName: externalBooking.shipmentName,
    requireShipmentTags: externalBooking.requireShipmentTags,
    skuNumber: externalBooking.skuNumber,
    originLocation: externalBooking.originLocation,
    destinationLocation: externalBooking.destinationLocation,
    containerQuantity: externalBooking.containerQuantity,
    transportModeValue: externalBooking.transportModeValue,
    packageType: externalBooking.packageTypeValue || externalBooking.packageType,
    goodsDescription: externalBooking.goodsDescription,
    truckType: externalBooking.truckType,
    truckQuantity: externalBooking.truckQuantity,
    // Ensure selectedPOs is properly formatted for POSummaryTable
    selectedPOs: Array.isArray(externalBooking.selectedPOs) ? externalBooking.selectedPOs : [],
  } : {
    id: flNumber,
    shipmentId: null,
    poNumber: selectedPOs.map(po => `PO ${po.poId.replace(/^PO ?/, '')}`).join(', '),
    productName: formData.productName,
    hsCode: formData.hsCode,
    consignee: formData.consigneeValue,
    shipper: formData.shipperValue,
    origin: formData.originPort,
    destination: formData.destinationPort,
    originPort: formData.originPort,
    destinationPort: formData.destinationPort,
    shipmentType: formData.shipmentTypeValue,
    shipmentTypeValue: formData.shipmentTypeValue,
    containerType: formData.containerTypeValue,
    containerTypeValue: formData.containerTypeValue,
    incoterms: formData.incotermsValue,
    incotermsValue: formData.incotermsValue,
    cargoReadyDate: formData.cargoReadyDate,
    dangerousGoods: formData.dangerousGoods,
    weight: formData.weight,
    volume: formData.volume,
    pieces: Number(formData.packageCount) || 0,
    status: 'Booked',
    eta: formData.targetDeliveryDate || '',
    createdAt: new Date().toISOString(),
    shipmentName: formData.shipmentName,
    requireShipmentTags: formData.requireShipmentTags,
    skuNumber: formData.skuNumber,
    originLocation: formData.originLocation,
    destinationLocation: formData.destinationLocation,
    containerQuantity: formData.containerQuantity,
    transportModeValue: formData.transportModeValue,
    packageType: formData.packageTypeValue || formData.packageType,
    goodsDescription: formData.goodsDescription,
    truckType: formData.truckType,
    truckQuantity: formData.truckQuantity,
    selectedPOs: selectedPOs,
  };

  // For debugging
  useEffect(() => {
    if (bookingId && externalBooking) {
      console.log('Using external booking data:', externalBooking);
      console.log('displayData:', displayData);
    }
  }, [bookingId, externalBooking, displayData]);

  return (
    <div className="min-h-screen bg-white">
      {/* Booking Confirm PopUp */}
      {!bookingId && (  // Only show popup for new bookings
        showPopup && <BookingConfirmPopUp 
          onClose={() => { 
            setShowPopup(false);
            // Save the booking to localStorage when popup is closed
            if (typeof window !== 'undefined') {
              try {
                const booking = {
                  id: flNumber,
                  shipmentId: null,
                  poNumber: selectedPOs.map(po => `PO ${po.poId.replace(/^PO ?/, '')}`).join(', '),
                  productName: formData.productName,
                  hsCode: formData.hsCode,
                  consignee: formData.consigneeValue,
                  shipper: formData.shipperValue,
                  origin: formData.originPort,
                  destination: formData.destinationPort,
                  originPort: formData.originPort,
                  destinationPort: formData.destinationPort,
                  shipmentType: formData.shipmentTypeValue,
                  shipmentTypeValue: formData.shipmentTypeValue,
                  containerType: formData.containerTypeValue,
                  containerTypeValue: formData.containerTypeValue,
                  incoterms: formData.incotermsValue,
                  incotermsValue: formData.incotermsValue,
                  cargoReadyDate: formData.cargoReadyDate,
                  dangerousGoods: formData.dangerousGoods,
                  weight: formData.weight,
                  volume: formData.volume,
                  pieces: Number(formData.packageCount) || 0,
                  status: 'Booked',
                  eta: formData.targetDeliveryDate || '',
                  createdAt: new Date().toISOString(),
                  shipmentName: formData.shipmentName,
                  requireShipmentTags: formData.requireShipmentTags,
                  skuNumber: formData.skuNumber,
                  originLocation: formData.originLocation,
                  destinationLocation: formData.destinationLocation,
                  containerQuantity: formData.containerQuantity,
                  transportModeValue: formData.transportModeValue,
                  packageType: formData.packageTypeValue || formData.packageType,
                  goodsDescription: formData.goodsDescription,
                  truckType: formData.truckType,
                  truckQuantity: formData.truckQuantity,
                  // Properly format selectedPOs for storage
                  selectedPOs: selectedPOs.map(po => ({
                    poId: po.poId,
                    selectedItems: Array.isArray(po.selectedItems) ? po.selectedItems : Array.from(po.selectedItems),
                    bookedQuantities: po.bookedQuantities || {}
                  })),
                };
                const prev = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
                const updated = [...prev, booking];
                localStorage.setItem('confirmedBookings', JSON.stringify(updated));
                console.log('Saved booking to localStorage:', booking);
                
                // Dispatch storage event to notify other components
                window.dispatchEvent(new Event('storage'));
              } catch (error) {
                console.error('Error saving booking:', error);
              }
            }
          }} 
          bookingData={{
            shipmentId: displayData.shipmentId,
            poNumber: displayData.poNumber,
            originPort: displayData.originPort,
            destinationPort: displayData.destinationPort
          }}
        />
      )}
      {/* Header */}
      <div className="bg-white p-4">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <FileText className="w-4 h-4" />
              <span>{displayData.shipmentId || flNumber || 'FLYNK-XXXXX'}</span>
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
                      setFormData({ ...formData, title: tempTitle });
                      setIsEditingTitle(false);
                    }}
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => {
                      setTempTitle(formData?.title || '');
                      setIsEditingTitle(false);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{displayData?.shipmentName || ''}</h1>
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto p-4 -mt-4">
        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Column (wider) */}
          <div className="flex-1 min-w-0">
             
             {/* Route Map Placeholder */}
             <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 relative">
              <div className="h-100 bg-blue-50 rounded-lg overflow-hidden relative flex items-center justify-center">
                <img
                  src="/map.png"
                  alt="Shipment Map Preview"
                  className="object-cover w-full h-full rounded-lg transition-transform duration-200"
                  style={{ transform: `scale(${mapZoom})`, minHeight: '100%', minWidth: '100%' }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-center pointer-events-auto">
                  <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Shipment Route Map</p>
                  <p className="text-xs text-gray-400">Shanghai → Los Angeles</p>
                  </div>
                </div>
                {/* Map Controls - bottom right */}
                <div className="absolute bottom-2 right-2 flex flex-row gap-2 z-10">
                  <button
                    className="bg-white/90 backdrop-blur-sm text-[#007bff] px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-200 shadow-sm transition-colors"
                    title="Zoom In"
                    onClick={() => handleZoomIn(setMapZoom)}
                  >
                    +
                  </button>
                  <button
                    className="bg-white/90 backdrop-blur-sm text-[#007bff] px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-200 shadow-sm transition-colors"
                    title="Zoom Out"
                    onClick={() => handleZoomOut(setMapZoom)}
                  >
                    -
                  </button>
                  <button
                    className="bg-white/90 backdrop-blur-sm text-[#007bff] p-3 border border-gray-300 rounded-md hover:bg-gray-200 shadow-sm transition-colors"
                    title="Expand Map"
                    onClick={() => setShowMapModal(true)}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Map Modal Popup */}
            {showMapModal && (
              <MapModal onClose={() => setShowMapModal(false)} />
            )}

            {/* Booking Statuses Section */}
            {showStatusBar && (
              <div className="bg-[#f8fafc] border border-gray-200 rounded-lg px-6 py-4 flex items-center justify-between mt-2 mb-4">
                <div className="flex items-center flex-1 min-w-0">
                  {/* Step 1: Booking */}
                  <div className="flex flex-col items-center min-w-[120px]">
                    <div className="w-6 h-6 rounded-full bg-[#222] flex items-center justify-center mb-1">
                      <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 8.5l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Booking</span>
                    <span className="text-xs text-gray-500 mt-1 text-center">Completed by Sharon Johnston on Mar 12, 2021</span>
                  </div>
                  {/* Line */}
                  <div className="flex-1 h-0.5 bg-[#e5eaf1] mx-4" />
                  {/* Step 2: Pricing */}
                  <div className="flex flex-col items-center min-w-[120px]">
                    <div className="w-6 h-6 rounded-full border-2 border-[#b6c3d1] bg-white flex items-center justify-center mb-1">
                      <div className="w-3 h-3 bg-[#b6c3d1] rounded-full" />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">Pricing</span>
                    <span className="text-xs text-gray-500 mt-1 text-center">FreightLynk to provide pricing in 24 to 48 hours</span>
                  </div>
                  {/* Line */}
                  <div className="flex-1 h-0.5 bg-[#e5eaf1] mx-4" />
                  {/* Step 3: Authorization */}
                  <div className="flex flex-col items-center min-w-[120px]">
                    <div className="w-6 h-6 rounded-full border-2 border-[#b6c3d1] bg-white flex items-center justify-center mb-1" />
                    <span className="text-sm font-semibold text-gray-900">Authorization</span>
                  </div>
                </div>
                {/* Close Button */}
                <button className="ml-4 text-gray-400 hover:text-gray-600" title="Close" onClick={() => setShowStatusBar(false)}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
              </div>
            )}

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
                    <div className="mb-4 p-4 rounded-lg border border-gray-200">
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
                  <div className="space-y-8">
                    {/* Shipment Details Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Shipment Details</h4>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500">Origin Port:</span>
                          <span className="ml-2 text-gray-900">{bookingId && externalBooking ? externalBooking.originPort : formData.originPort}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Destination Port:</span>
                          <span className="ml-2 text-gray-900">{bookingId && externalBooking ? externalBooking.destinationPort : formData.destinationPort}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Origin Location:</span>
                          <span className="ml-2 text-gray-900">{displayData?.originLocation}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Destination Location:</span>
                          <span className="ml-2 text-gray-900">{displayData?.destinationLocation}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Transport Mode:</span>
                          <span className="ml-2 text-gray-900">{(displayData.transportModeValue || displayData.transportMode || '-').toUpperCase()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Shipment Type:</span>
                          <span className="ml-2 text-gray-900">{(displayData.shipmentTypeValue || displayData.shipmentType || '-').toUpperCase()}</span>
                        </div>
                        {/* Container/Truck Type & Quantity Logic */}
                        {displayData.shipmentTypeValue === 'fcl' && (
                          <>
                            <div>
                              <span className="text-gray-500">Container Type:</span>
                              <span className="ml-2 text-gray-900">{displayData.containerTypeValue || displayData.containerType || '-'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Container Quantity:</span>
                              <span className="ml-2 text-gray-900">{displayData.containerQuantity || '-'}</span>
                            </div>
                          </>
                        )}
                        {displayData.shipmentTypeValue === 'ftl' && (
                          <>
                            <div>
                              <span className="text-gray-500">Truck Type:</span>
                              <span className="ml-2 text-gray-900">{displayData.truckType || '-'}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Truck Quantity:</span>
                              <span className="ml-2 text-gray-900">{displayData.truckQuantity || '-'}</span>
                            </div>
                          </>
                        )}
                        <div>
                          <span className="text-gray-500">Incoterm:</span>
                          <span className="ml-2 text-gray-900">{displayData.incotermsValue || displayData.incoterms || '-'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Cargo & Load Specifications Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Cargo & Load Specifications</h4>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500">Weight:</span>
                          <span className="ml-2 text-gray-900">{displayData.weight || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Volume:</span>
                          <span className="ml-2 text-gray-900">{displayData.volume || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Package Count:</span>
                          <span className="ml-2 text-gray-900">{displayData.packageCount || displayData.pieces || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Package Type:</span>
                          <span className="ml-2 text-gray-900">{displayData.packageTypeValue || displayData.packageType || '-'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Product & Compliance Section */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Product & Compliance</h4>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500">Product Name:</span>
                          <span className="ml-2 text-gray-900">{displayData.productName || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">HS Code:</span>
                          <span className="ml-2 text-gray-900">{displayData.hsCode || '-'}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">Goods Description:</span>
                          <span className="ml-2 text-gray-900">{displayData.goodsDescription || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Dangerous Goods:</span>
                          <span className="ml-2 text-gray-900">{displayData.dangerousGoods ? 'Yes' : 'No'}</span>
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
                      <POSummaryTable
                        selectedPOs={displayData.selectedPOs || []}
                        purchaseOrdersData={purchaseOrders}
                        poDetailsData={poDetails}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (narrower) */}
          <div className="w-full lg:w-110 flex-shrink-0">
            <CurrentStatusCard />

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Shipment Tags</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 w-24">PO Number:</span>
                    <span className="text-xs text-gray-900">{formData.poNumber || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 w-24">SKU Number:</span>
                    <span className="text-xs text-gray-900">{formData.skuNumber || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// MapModal component for expanded map view
const MapModal = ({ onClose }: { onClose: () => void }) => {
  const [zoom, setZoom] = useState(1);
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-3 sm:py-4 border-b gap-2 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Shipment Route Map</h2>
          <button 
            onClick={onClose}
            className="flex items-center text-gray-500 hover:text-gray-700 p-1 rounded flex-shrink-0"
            title="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        {/* Modal Map */}
        <div className="relative flex-1 bg-gray-200 min-h-[400px] sm:min-h-[500px] overflow-hidden rounded-b-lg">
          <img
            src="/map.png"
            alt="Shipment Map - Expanded View"
            className="object-cover w-full h-full rounded-b-lg transition-transform duration-200"
            style={{ transform: `scale(${zoom})`, minHeight: '400px', minWidth: '100%' }}
          />
          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
            <button
              className="bg-white/90 backdrop-blur-sm text-[#007bff] p-2 border border-gray-300 rounded-md hover:bg-gray-200 shadow-sm transition-colors"
              title="Zoom In"
              onClick={() => handleZoomIn(setZoom)}
            >
              +
            </button>
            <button
              className="bg-white/90 backdrop-blur-sm text-[#007bff] p-2 border border-gray-300 rounded-md hover:bg-gray-200 shadow-sm transition-colors"
              title="Zoom Out"
              onClick={() => handleZoomOut(setZoom)}
            >
              -
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirm;