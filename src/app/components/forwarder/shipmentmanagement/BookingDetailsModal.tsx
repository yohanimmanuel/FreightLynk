import React from 'react';
import { X as XIcon } from 'lucide-react';
import POSummaryTable from '@/app/components/clients/purchasesorders/POSummaryTable';
import { useRouter } from 'next/navigation';

interface BookingDetailsModalProps {
  formData: Record<string, any>;
  onClose: () => void;
}

const LABELS: Record<string, string> = {
  shipmentName: 'Shipment Name',
  id: 'Booking ID',
  bookingId: 'Booking ID',
  shipmentId: 'Shipment ID',
  poNumber: 'PO Number',
  skuNumber: 'SKU Number',
  productName: 'Product Name',
  hsCode: 'HS Code',
  goodsDescription: 'Goods Description',
  shipperValue: 'Shipper',
  consigneeValue: 'Consignee',
  originLocation: 'Origin',
  originPort: 'Origin Port',
  destinationLocation: 'Destination',
  destinationPort: 'Destination Port',
  shipmentTypeValue: 'Shipment Type',
  containerTypeValue: 'Container Type',
  incotermsValue: 'Incoterms',
  cargoReadyDate: 'Cargo Ready Date',
  targetDeliveryDate: 'Target Delivery Date',
  dangerousGoods: 'Dangerous Goods',
  weight: 'Weight',
  volume: 'Volume',
  pieces: 'Pieces',
  status: 'Status',
  eta: 'ETA',
  transportModeValue: 'Transport Mode',
  requireShipmentTags: 'Shipment Tags Required',
  specialInstructions: 'Special Instructions',
  additionalNotes: 'Additional Notes',
};

const SECTION_GROUPS: Record<string, string[]> = {
  'Booking Info': ['id', 'shipmentId', 'shipmentName', 'status', 'eta'],
  'Cargo & Product Details': ['productName', 'hsCode', 'goodsDescription', 'weight', 'volume', 'pieces', 'dangerousGoods'],
  'Route & Parties': ['shipperValue', 'consigneeValue', 'originLocation', 'originPort', 'destinationLocation', 'destinationPort', 'transportModeValue', 'shipmentTypeValue', 'containerTypeValue', 'incotermsValue'],
  'Shipment Tags': ['requireShipmentTags', 'poNumber', 'skuNumber'],
  'Dates & Notes': ['cargoReadyDate', 'targetDeliveryDate', 'specialInstructions', 'additionalNotes'],
};

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <div className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
      <span>{title}</span>
      <span className="flex-1 border-b border-gray-200" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs">{children}</div>
  </div>
);

// Add a helper for status color
const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-lg font-semibold';
    case 'booked':
    case 'delivered':
      return 'bg-green-100 text-green-800 px-2 py-1 rounded-lg font-semibold';
    case 'in transit':
      return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-lg font-semibold';
    default:
      return 'bg-gray-100 text-gray-700 px-2 py-1 rounded-lg font-semibold';
  }
};

const LabelValue: React.FC<{ label: string; value: React.ReactNode; isStatus?: boolean }> = ({ label, value, isStatus }) => (
  <div className="flex justify-between items-center py-0.5">
    <span className="text-gray-500 text-xs font-medium whitespace-nowrap mr-2">{label}</span>
    {isStatus ? (
      <span className={`text-xs text-right break-all ${getStatusClass(String(value))}`}>{value}</span>
    ) : (
      <span className="text-gray-900 text-xs text-right break-all font-medium">{value}</span>
    )}
  </div>
);

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ formData, onClose }) => {
  const router = useRouter();
  // Helper to render a section only if it has at least one value
  const renderSection = (title: string, keys: string[]) => {
    const items = keys
      .map((key) => {
        let value = formData[key];
        if (key === 'dangerousGoods' || key === 'requireShipmentTags') {
          value = value ? 'Yes' : 'No';
        }
        if (value === undefined || value === '' || value === null) return null;
        // For shipment tags, only show PO/SKU if required
        if ((key === 'poNumber' || key === 'skuNumber') && !formData['requireShipmentTags']) return null;
        return <LabelValue key={key} label={LABELS[key] || key} value={value} isStatus={key === 'status'} />;
      })
      .filter(Boolean);
    if (items.length === 0) return null;
    return <SectionCard title={title}>{items}</SectionCard>;
  };

  // Special logic for Shipment Tags section
  const renderShipmentTagsSection = () => {
    if (formData['requireShipmentTags']) {
      return (
        <SectionCard title="Shipment Tags">
          <LabelValue label="PO Number" value={formData['poNumber'] || 'Not specified'} />
          <LabelValue label="SKU Number" value={formData['skuNumber'] || 'Not specified'} />
        </SectionCard>
      );
    }
    return (
      <SectionCard title="Shipment Tags">
        <LabelValue label="Shipment Tags" value="Not required" />
      </SectionCard>
    );
  };

  const mockSelectedPOs = [
    {
      poId: 'PO607180',
      selectedItems: [1],
      bookedQuantities: { 1: 230 },
    },
  ];
  const mockPurchaseOrdersData = [
    {
      id: 'PO607180',
      buyer: 'Acme Corp',
      seller: 'Global Supplies',
      status: 'Open' as 'Open',
      cargoReadyBy: '2024-07-01',
      mustArriveBy: '2024-07-15',
      subjectedCarrier: 'Maersk',
      progress: '1/1 lines booked',
      exceptions: [],
    },
  ];
  const mockPODetailsData = [
    {
      id: 1,
      poOrderNumber: 607180,
      productCode: 'ewrtyutrew',
      productName: 'rtyjtrewtyujy5te4ry',
      cargoReadyDate: '2024-07-01',
      mustArriveDate: '2024-07-15',
      transportMode: 'Sea',
      destination: 'Los Angeles',
      requested: 230,
      booked: 230,
      currency: 'USD',
      unitCost: 20,
      uom: 'PC',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg max-w-3xl w-full p-4 relative max-h-[90vh] overflow-y-auto hide-scrollbar">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-4">Booking Details</h2>
        {/* Render Booking Info section first */}
        {renderSection('Booking Info', SECTION_GROUPS['Booking Info'])}
        {/* Purchase Order section with consistent border and padding */}
        <div className="mb-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="font-semibold text-gray-800 text-sm mb-3 flex items-center gap-2">
            <span>Purchase Order</span>
            <span className="flex-1 border-b border-gray-200" />
          </div>
          <POSummaryTable
            selectedPOs={mockSelectedPOs}
            purchaseOrdersData={mockPurchaseOrdersData}
            poDetailsData={mockPODetailsData}
          />
        </div>
        {/* Render the rest of the sections */}
        {Object.entries(SECTION_GROUPS).map(([section, keys]) =>
          section === 'Booking Info' || section === 'Shipment Tags'
            ? null
            : <React.Fragment key={section}>{renderSection(section, keys)}</React.Fragment>
        )}
        {renderShipmentTagsSection()}
        <div className="mt-4 border-t border-gray-200 pt-4 flex justify-end gap-3">
          <button
            className="border border-gray-300 bg-white text-gray-700 text-sm px-5 py-2 rounded-lg font-medium shadow-sm hover:bg-gray-100 transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal; 