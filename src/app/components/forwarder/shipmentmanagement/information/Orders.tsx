import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface OrdersProps {
  shipmentId?: string;
}

const Orders: React.FC<OrdersProps> = ({ shipmentId }) => {
  // Mock data based on QuoteRequest interface structure
  const mockQuoteRequestData: any = {
    // Core Identification
    id: 'qr-123456789',
    request_id: 'QR-2024-001',
    user_id: 'client-001',
    forwarder_user_id: 'forwarder-001',
    booking_id: 'BKEXFR2305000',
    
    // Client Information
    customer_name: 'ANC TRANSPORT',
    created_by: 'Mr. Đức',
    created_on: '2024-01-15',
    company_address: '123 Business Street, Ho Chi Minh City, Vietnam',
    company_phone: '+84 28 1234 5678',
    company_email: 'info@anctransport.com',
    contact_person: 'Mr. Đức',
    contact_email: 'yubichi9@gmail.com',
    contact_phone: '+84 90 123 4567',
    contact_title: 'Logistics Manager',
    
    // Shipment Details
    commodities: 'Electronics and Machinery',
    details: '1 x 20\'DC', // Container/truck types and quantities
    origin: 'HO CHI MINH CITY, VN (VNSGN)',
    destination: 'HOUSTON, TX, US (USHOU)',
    mode: 'FCL',
    
    // Timing & Logistics
    cargo_ready_date: '2024-01-20',
    target_delivery_date: '2024-02-15',
    transit_time: '25 days',
    
    // Commercial Terms
    incoterms: 'FREIGHT PREPAID',
    provider: 'MAERSK',
    quoted_amount: 2450,
    quoted_currency: 'USD',
    quoted_valid_until: '2024-01-30',
    
    // Status & Documentation
    status: 'accepted',
    attachment: [
      { name: 'Commercial Invoice.pdf', url: '/documents/commercial-invoice.pdf', type: 'pdf' },
      { name: 'Packing List.pdf', url: '/documents/packing-list.pdf', type: 'pdf' },
    ],
    notes: 'Urgent shipment - please prioritize',
    
    // System Fields
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  };

  const data = mockQuoteRequestData;

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
         {/* Left Column - Quote Request Details */}
         <div className="space-y-4">
           <h3 className="text-md font-semibold text-gray-900 mb-4">Quote Request Details</h3>
          
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Request ID:</span>
              <span className="font-mono text-gray-900">{data.request_id}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Quote Request ID:</span>
              <span className="font-mono text-gray-900">{data.id}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Transport Mode:</span>
              <span className="text-gray-900">{data.mode}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Origin:</span>
              <span className="text-gray-900">{data.origin}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Destination:</span>
              <span className="text-gray-900">{data.destination}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Cargo Ready Date:</span>
              <span className="text-gray-900">{data.cargo_ready_date || 'Not specified'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Target Delivery Date:</span>
              <span className="text-gray-900">{data.target_delivery_date || 'Not specified'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Transit Time:</span>
              <span className="text-gray-900">{data.transit_time || 'Not specified'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Commodities:</span>
              <span className="text-gray-900">{data.commodities || 'Not specified'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Container/Vehicle Details:</span>
              <span className="text-gray-900">{data.details || 'Not specified'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Incoterms:</span>
              <span className="text-gray-900">{data.incoterms}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-500">Preferred Provider:</span>
              <span className="text-gray-900">{data.provider || 'Not specified'}</span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-gray-500">Notes:</span>
              <span className="text-gray-900">{data.notes || 'No notes added'}</span>
            </div>
          </div>
        </div>

                          {/* Middle Column - Client Information */}
         <div className="space-y-4">
           {/* Company Information */}
           <div className="bg-white border border-gray-200 rounded-lg p-4">
             <h3 className="text-md font-semibold text-gray-900 mb-4">Company Information</h3>
             <div className="space-y-4 text-xs">
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">Company Name:</span>
                 <span className="text-gray-900">{data.customer_name}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">Address:</span>
                 <span className="text-gray-900">{data.company_address || 'Not specified'}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">Phone:</span>
                 <span className="text-gray-900">{data.company_phone || 'Not specified'}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">Email:</span>
                 <span className="text-gray-900">{data.company_email || 'Not specified'}</span>
               </div>
             </div>
           </div>

            {/* Request Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Request Information</h3>
              <div>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Created By:</span>
                    <span className="text-gray-900">{data.created_by}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Request Date:</span>
                    <span className="text-gray-900">{data.created_on}</span>
                  </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Status:</span>
                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                       data.status === 'accepted' ? 'bg-green-100 text-green-800' :
                       data.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                       data.status === 'quoted' ? 'bg-blue-100 text-blue-800' :
                       data.status === 'rejected' ? 'bg-red-100 text-red-800' :
                       'bg-gray-100 text-gray-800'
                     }`}>
                       {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                     </span>
                   </div>
                </div>
              </div>
            </div>
        </div>

           {/* Right Column - Contact Person & Attachments */}
           <div className="space-y-4">
             {/* Contact Person */}
             <div className="bg-white border border-gray-200 rounded-lg p-4">
               <h3 className="text-md font-semibold text-gray-900 mb-4">Contact Person</h3>
               <div className="space-y-4 text-xs">
                 <div className="flex items-center justify-between">
                   <span className="text-gray-500">Name:</span>
                   <span className="text-gray-900">{data.contact_person}</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-gray-500">Title:</span>
                   <span className="text-gray-900">{data.contact_title || 'Not specified'}</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-gray-500">Email:</span>
                   <span className="text-gray-900">{data.contact_email}</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-gray-500">Phone:</span>
                   <span className="text-gray-900">{data.contact_phone || 'Not specified'}</span>
                 </div>
               </div>
             </div>

             {/* Attachments */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
             <h3 className="text-md font-semibold text-gray-900 mb-4">Attachments</h3>
             <div>
               <div className="space-y-3 text-xs">
               {Array.isArray(data.attachment) && data.attachment.length > 0 ? (
                 <div className="space-y-2">
                   {data.attachment.map((doc: any, index: number) => (
                     <div key={index} className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition-colors">
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
                 <div className="text-gray-500 text-xs">No attachments</div>
               )}
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };

 export default Orders;
