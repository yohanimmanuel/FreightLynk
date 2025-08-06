import React, { useState, useCallback, useMemo } from 'react';
import { Copy, Download, Edit, FileText, ExternalLink, X, Save, Trash2 } from 'lucide-react';

interface BookingsProps {
  shipmentId?: string;
}

const Bookings: React.FC<BookingsProps> = ({ shipmentId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    // General Booking Information
    bookingNo: 'BKEXFR2305000',
    bookingDate: '2024-01-15',
    bookingNote: 'Urgent shipment - please prioritize',
    bookingNumberReference: 'BK-REF-2024-001',
    bookingTo: 'MAERSK LINE',
    service: 'FCL',
    
    // Origin Information (including Port of Loading)
    placeOfReceipt: 'HO CHI MINH CITY, VN (VNSGN)',
    portOfLoading: 'HO CHI MINH CITY, VN (VNSGN)',
    pickup: 'Container Yard - Ho Chi Minh City',
    dateOfPickup: '2024-01-20',
    etd: '2024-01-25 07:00:00',
    dropoff: 'Container Yard - Ho Chi Minh City',
    feederVessel: 'FEEDER VESSEL 001',
    feederVoyage: 'FV-001',
    motherVessel: 'MAERSK SEALAND',
    motherVoyage: 'MV-2024-001',
    provider: 'MAERSK',
    cyCutoff: '2024-01-18 17:00',
    vgmCutoff: '2024-01-18 12:00',
    
    // Destination Information
    portOfDischarge: 'HOUSTON, TX, US (USHOU)',
    finalDestination: 'HOUSTON, TX, US (USHOU)',
    placeOfDelivery: 'HOUSTON, TX, US (USHOU)',
    eta: '2024-02-20 14:00:00',
    
    // Booking Consignment
    volume: '1x20\'DC',
    grossWeight: '2500 KGS',
    commodity: 'Electronics and Machinery',
    measurement: '28.5 CBM',
    
    // Contact Information
    contact: 'Mr. Đức - Logistics Manager',
    specialRemark: 'Temperature controlled shipment',
    
    // Transit Port
    transitPort: 'LOS ANGELES, CA, US (USLAX)',
    temp: '20°C',
    
    // Other Information
    siCutoff: '2024-01-17 17:00',
    gateIn: '2024-01-19 08:00',
    dateOfCreation: '2024-01-15 10:30:00',
    freightTerms: 'FREIGHT PREPAID',
    vent: '',
    
    // Documents
    documents: [
      { name: 'Booking Confirmation.pdf', url: '/documents/booking-confirmation.pdf', type: 'pdf' },
      { name: 'Shipping Instructions.pdf', url: '/documents/shipping-instructions.pdf', type: 'pdf' },
      { name: 'VGM Declaration.pdf', url: '/documents/vgm-declaration.pdf', type: 'pdf' },
      { name: 'Container Packing List.pdf', url: '/documents/container-packing-list.pdf', type: 'pdf' }
    ]
  });

  const [editData, setEditData] = useState(bookingData);

  const handleCopyData = () => {
    // Format booking data for clipboard
    const formattedData = `BOOKING INFORMATION

GENERAL BOOKING INFORMATION:
Booking No.: ${bookingData.bookingNo}
Booking Number Reference: ${bookingData.bookingNumberReference}
Booking Date: ${bookingData.bookingDate}
Booking To: ${bookingData.bookingTo}
Service: ${bookingData.service}
Booking Note: ${bookingData.bookingNote}

ORIGIN INFORMATION:
Place of Receipt: ${bookingData.placeOfReceipt}
Port of Loading: ${bookingData.portOfLoading}
Pickup: ${bookingData.pickup}
Date of Pickup: ${bookingData.dateOfPickup}
ETD: ${bookingData.etd}
Dropoff: ${bookingData.dropoff}
Feeder Vessel: ${bookingData.feederVessel}
Feeder Voyage: ${bookingData.feederVoyage}
Mother Vessel: ${bookingData.motherVessel}
Mother Voyage: ${bookingData.motherVoyage}
Provider: ${bookingData.provider}
CY Cut-off: ${bookingData.cyCutoff}
VGM Cut-off: ${bookingData.vgmCutoff}
SI Cut-off: ${bookingData.siCutoff}

DESTINATION INFORMATION:
Port of Discharge: ${bookingData.portOfDischarge}
Final Destination: ${bookingData.finalDestination}
Place of Delivery: ${bookingData.placeOfDelivery}
ETA: ${bookingData.eta}

BOOKING CONSIGNMENT:
Volume: ${bookingData.volume}
Gross Weight: ${bookingData.grossWeight}
Commodity: ${bookingData.commodity}
Measurement: ${bookingData.measurement}

CONTACT INFORMATION:
Contact: ${bookingData.contact}
Special Remark: ${bookingData.specialRemark}
Date of Creation: ${bookingData.dateOfCreation}

TRANSIT PORT:
Transit Port: ${bookingData.transitPort}
Temperature: ${bookingData.temp}

OTHER INFORMATION:
Gate In: ${bookingData.gateIn}
Vent: ${bookingData.vent || 'Not specified'}
Freight Terms: ${bookingData.freightTerms}

DOCUMENTS:
${bookingData.documents.map((doc: any, index: number) => `${index + 1}. ${doc.name}`).join('\n')}`;

    // Copy to clipboard
    navigator.clipboard.writeText(formattedData).then(() => {
      // Show success feedback (you can add a toast notification here)
      console.log('Booking data copied to clipboard successfully!');
    }).catch((err) => {
      console.error('Failed to copy data to clipboard:', err);
    });
  };

  const handleEdit = () => {
    setEditData(bookingData);
    setShowEditModal(true);
  };

  const handleSave = () => {
    setBookingData(editData);
    setShowEditModal(false);
  };

  const handleCancel = () => {
    setEditData(bookingData);
    setShowEditModal(false);
  };

  const handleInputChange = useCallback((field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleDateTimeChange = useCallback((field: string, value: string) => {
    const formattedValue = value.replace('T', ' ');
    setEditData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  }, []);

  const renderInput = useCallback((field: string, label: string, type = 'text', placeholder = '') => (
    <div key={field}>
      <label className="block text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={type === 'datetime-local' ? (editData as any)[field]?.replace(' ', 'T') || '' : (editData as any)[field] || ''}
        onChange={(e) => {
          const value = type === 'datetime-local' ? e.target.value.replace('T', ' ') : e.target.value;
          setEditData(prev => ({ ...prev, [field]: value }));
        }}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded text-gray-900"
      />
    </div>
  ), [editData]);

  const renderTextarea = useCallback((field: string, label: string, rows = 3) => (
    <div key={field}>
      <label className="block text-gray-500 mb-1">{label}</label>
      <textarea
        value={(editData as any)[field] || ''}
        onChange={(e) => setEditData(prev => ({ ...prev, [field]: e.target.value }))}
        rows={rows}
        className="w-full p-2 border border-gray-300 rounded text-gray-900"
      />
    </div>
  ), [editData]);

  const renderSelect = useCallback((field: string, label: string, options: string[]) => (
    <div key={field}>
      <label className="block text-gray-500 mb-1">{label}</label>
      <select
        value={(editData as any)[field] || ''}
        onChange={(e) => setEditData(prev => ({ ...prev, [field]: e.target.value }))}
        className="w-full p-2 border border-gray-300 rounded text-gray-900"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  ), [editData]);

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={handleCopyData}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Copy className="w-4 h-4" />
          <span className="text-sm font-medium">Copy Data</span>
        </button>
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 px-4 py-2 bg-[#007bff] text-white hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span className="text-sm font-medium">Edit</span>
        </button>
      </div>

      {/* Booking Information Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* General Booking Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-semibold text-gray-900 mb-4">General</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Booking No.:</span>
                <span className="font-mono text-gray-900">{bookingData.bookingNo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Booking Number Reference:</span>
                <span className="text-gray-900">{bookingData.bookingNumberReference}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Booking Date:</span>
                <span className="text-gray-900">{bookingData.bookingDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Booking To:</span>
                <span className="text-gray-900">{bookingData.bookingTo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Service:</span>
                <span className="text-gray-900">{bookingData.service}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-gray-500">Booking Note:</span>
                <span className="text-gray-900">{bookingData.bookingNote}</span>
              </div>
            </div>
          </div>

          {/* Origin Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Origin</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Place of Receipt:</span>
                <span className="text-gray-900">{bookingData.placeOfReceipt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Port of Loading:</span>
                <span className="text-gray-900">{bookingData.portOfLoading}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Pick up:</span>
                <span className="text-gray-900">{bookingData.pickup}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">ETD:</span>
                <span className="text-gray-900">{bookingData.etd}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Date of Pick up:</span>
                <span className="text-gray-900">{bookingData.dateOfPickup}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Drop off:</span>
                <span className="text-gray-900">{bookingData.dropoff}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Feeder Vessel:</span>
                <span className="text-gray-900">{bookingData.feederVessel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Feeder Voyage:</span>
                <span className="text-gray-900">{bookingData.feederVoyage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Mother Vessel:</span>
                <span className="text-gray-900">{bookingData.motherVessel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Mother Voyage:</span>
                <span className="text-gray-900">{bookingData.motherVoyage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Provider:</span>
                <span className="text-gray-900">{bookingData.provider}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">CY Cut-off:</span>
                <span className="text-gray-900">{bookingData.cyCutoff}</span>
              </div>
                             <div className="flex items-center justify-between">
                 <span className="text-gray-500">VGM Cut-off:</span>
                 <span className="text-gray-900">{bookingData.vgmCutoff}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">SI Cut-off:</span>
                 <span className="text-gray-900">{bookingData.siCutoff}</span>
               </div>
             </div>
           </div>
        </div>

        {/* Middle Column */}
        <div className="space-y-4">
          {/* Destination */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Destination</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Port of Discharge:</span>
                <span className="text-gray-900">{bookingData.portOfDischarge}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Place of Delivery:</span>
                <span className="text-gray-900">{bookingData.placeOfDelivery}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Final destination:</span>
                <span className="text-gray-900">{bookingData.finalDestination}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">ETA:</span>
                <span className="text-gray-900">{bookingData.eta}</span>
              </div>
            </div>
          </div>

          {/* Booking Consignment */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Booking Consignment</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Volume:</span>
                <span className="text-gray-900">{bookingData.volume}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Commodity:</span>
                <span className="text-gray-900">{bookingData.commodity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Gross Weight (KGS):</span>
                <span className="text-gray-900">{bookingData.grossWeight}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Measurement (CBM):</span>
                <span className="text-gray-900">{bookingData.measurement}</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Contact:</span>
                <span className="text-gray-900">{bookingData.contact}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Special Remark:</span>
                <span className="text-gray-900">{bookingData.specialRemark}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Date of Creation:</span>
                <span className="text-gray-900">{bookingData.dateOfCreation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Transit Port */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Transit Port</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Transit Port:</span>
                <span className="text-gray-900">{bookingData.transitPort}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Temp:</span>
                <span className="text-gray-900">{bookingData.temp}</span>
              </div>
            </div>
          </div>

          {/* Other Information */}
           <div className="bg-white border border-gray-200 rounded-lg p-4">
             <h3 className="text-md font-semibold text-gray-900 mb-4">Other Information</h3>
             <div className="space-y-3 text-xs">
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">Gate In:</span>
                 <span className="text-gray-900">{bookingData.gateIn}</span>
               </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Vent:</span>
                <span className="text-gray-900">{bookingData.vent || 'Not specified'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Freight terms:</span>
                <span className="text-gray-900">{bookingData.freightTerms}</span>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Documents</h3>
            <div className="space-y-3 text-xs">
              {bookingData.documents.length > 0 ? (
                <div className="space-y-2">
                  {bookingData.documents.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-900 text-xs">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => window.open(doc.url, '_blank')}
                          className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                          title="View document"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = doc.url;
                            link.download = doc.name;
                            link.click();
                          }}
                          className="p-1 text-gray-500 hover:text-green-600 transition-colors"
                          title="Download document"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-xs">No documents available</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="h-full flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Edit Booking Information</h2>
                <button onClick={handleCancel} className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* General Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-4">General</h3>
                      <div className="space-y-3 text-xs">
                        {renderInput('bookingNo', 'Booking No.*')}
                        {renderInput('bookingNumberReference', 'Booking Number Reference')}
                        {renderInput('bookingDate', 'Booking Date', 'date')}
                        {renderInput('bookingTo', 'Booking To', 'text', 'Please Input')}
                        {renderInput('service', 'Service')}
                        {renderTextarea('bookingNote', 'Booking Note', 3)}
                      </div>
                    </div>

                    {/* Origin Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Origin</h3>
                      <div className="space-y-3 text-xs">
                        {renderInput('placeOfReceipt', 'Place of Receipt')}
                        {renderInput('portOfLoading', 'Port of Loading')}
                        {renderInput('pickup', 'Pick up')}
                        {renderInput('etd', 'ETD', 'datetime-local')}
                        {renderInput('dateOfPickup', 'Date of Pick up', 'date')}
                        {renderInput('dropoff', 'Drop off')}
                        {renderInput('feederVessel', 'Feeder Vessel')}
                        {renderInput('feederVoyage', 'Feeder Voyage')}
                        {renderInput('motherVessel', 'Mother Vessel')}
                        {renderInput('motherVoyage', 'Mother Voyage')}
                        {renderInput('provider', 'Provider')}
                        {renderInput('cyCutoff', 'CY Cut-off', 'datetime-local')}
                        {renderInput('vgmCutoff', 'VGM Cut-off', 'datetime-local')}
                        {renderInput('siCutoff', 'SI Cut-off', 'datetime-local')}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Destination Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Destination</h3>
                      <div className="space-y-3 text-xs">
                        {renderInput('portOfDischarge', 'Port of Discharge')}
                        {renderInput('placeOfDelivery', 'Place of Delivery*')}
                        {renderInput('finalDestination', 'Final destination')}
                        {renderInput('eta', 'ETA', 'datetime-local')}
                      </div>
                    </div>

                    {/* Booking Consignment Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Booking Consignment</h3>
                      <div className="space-y-3 text-xs">
                        {renderInput('volume', 'Volume')}
                        {renderInput('commodity', 'Commodity', 'text', 'Type something')}
                        {renderInput('grossWeight', 'Gross Weight (KGS)')}
                        {renderInput('measurement', 'Measurement (CBM)')}
                      </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <div className="space-y-3 text-xs">
                        {renderInput('contact', 'Contact', 'text', 'Type something')}
                        {renderInput('specialRemark', 'Special Remark', 'text', 'Type something')}
                        {renderInput('dateOfCreation', 'Date of Creation', 'datetime-local')}
                      </div>
                    </div>

                    {/* Transit Port Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Transit Port</h3>
                      <div className="space-y-3 text-xs">
                        {renderInput('transitPort', 'Transit Port')}
                        {renderInput('temp', 'Temp')}
                      </div>
                    </div>

                    {/* Other Information Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-4">Other Information</h3>
                      <div className="space-y-3 text-xs">
                        {renderInput('gateIn', 'Gate In', 'datetime-local')}
                        {renderInput('vent', 'Vent')}
                        {renderSelect('freightTerms', 'Freight terms', ['FREIGHT PREPAID', 'FREIGHT COLLECT', 'FOB', 'CIF'])}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end p-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
