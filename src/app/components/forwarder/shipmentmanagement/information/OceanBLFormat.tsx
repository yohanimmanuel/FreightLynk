import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface BLData {
  // Header Information
  blNumber: string;
  bookingNumber: string;
  dateOfIssue: string;
  serviceType: 'fcl' | 'lcl'; // Add service type
  blType: 'hbl' | 'mbl'; // Add BL type to distinguish HBL vs MBL
  
  // Parties
  shipper: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
  consignee: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
  notifyParty: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
  
  // Vessel and Route
  vessel: {
    name: string;
    voyageNumber: string;
    feederVessel?: string;
    feederVoyage?: string;
  };
  portOfLoading: string;
  portOfDischarge: string;
  placeOfReceipt: string;
  placeOfDelivery: string;
  finalDestination: string;
  
  // Cargo Details - FCL
  containers?: Array<{
    containerNumber: string;
    sealNumber: string;
    type: string;
    tare: string;
    vgm: string;
    marks: string;
    description: string;
    packages: string;
    weight: string;
    volume: string;
  }>;
  
  // Cargo Details - LCL
  lclCargo?: Array<{
    marks: string;
    packages: string;
    description: string;
    weight: string;
    volume: string;
    commodity: string;
    serviceMode: string;
  }>;
  
  // LCL Consolidation Details
  consolidation?: {
    consolidator: string;
    masterBLNumber: string;
    houseBLNumber: string;
    containerNumber: string;
    sealNumber: string;
  };
  
  // Freight and Charges
  freightCharges: {
    paymentTerms: string;
    payableAt: string;
    prepaidAt: string;
    totalPrepaid: string;
    numberOfOriginals: string;
    incoterm: string;
  };
  
  // Additional Details
  shippedOnBoardDate: string;
  placeOfIssue: string;
  signatureBy: string;
  cargo: {
    commodity: string;
    description: string;
    serviceMode: string;
    freightTerms: string;
    shippingMarks: string;
  };
}

interface BLFormatProps {
  data: BLData;
  onClose?: () => void;
}

// Utility to replace all OKLCH and modern color functions in the DOM
function replaceUnsupportedColors(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
  let el = walker.currentNode as Element | null;
  while (el) {
    const style = window.getComputedStyle(el);
    // Only replace if the color is in an unsupported format
    if (style.color && /(oklch|lch|lab|color-mix)/.test(style.color)) {
      (el as HTMLElement).style.color = '#111111';
    }
    if (style.backgroundColor && /(oklch|lch|lab|color-mix)/.test(style.backgroundColor)) {
      (el as HTMLElement).style.backgroundColor = '#ffffff';
    }
    if (style.borderColor && /(oklch|lch|lab|color-mix)/.test(style.borderColor)) {
      (el as HTMLElement).style.borderColor = '#111111';
    }
    el = walker.nextNode() as Element | null;
  }
}

const BLFormat: React.FC<BLFormatProps> = ({ data, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    try {
      const element = printRef.current;
      if (!element) {
        alert('BL content not found');
        return;
      }

      // Replace all unsupported colors before html2canvas
      replaceUnsupportedColors(element);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });
      const imgProperties = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const margin = 15; // px, extra whitespace
      const maxImgWidth = pdfWidth - margin * 2;
      const maxImgHeight = pdfHeight - margin * 2;

      let imgWidth = maxImgWidth;
      let imgHeight = (imgProperties.height * imgWidth) / imgProperties.width;

      if (imgHeight > maxImgHeight) {
        imgHeight = maxImgHeight;
        imgWidth = (imgProperties.width * imgHeight) / imgProperties.height;
      }

      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`BL-${data.blNumber}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error generating PDF: ${errorMessage}`);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateTotals = () => {
    let totalPackages = 0;
    let totalWeight = 0;
    let totalVolume = 0;

    if (data.serviceType === 'fcl' && data.containers) {
      totalPackages = data.containers.reduce((sum, container) => {
        const packages = parseInt(container.packages) || 0;
        return sum + packages;
      }, 0);

      totalWeight = data.containers.reduce((sum, container) => {
        const weight = parseFloat(container.weight) || 0;
        return sum + weight;
      }, 0);

      totalVolume = data.containers.reduce((sum, container) => {
        const volume = parseFloat(container.volume) || 0;
        return sum + volume;
      }, 0);
    } else if (data.serviceType === 'lcl' && data.lclCargo) {
      totalPackages = data.lclCargo.reduce((sum, cargo) => {
        const packages = parseInt(cargo.packages) || 0;
        return sum + packages;
      }, 0);

      totalWeight = data.lclCargo.reduce((sum, cargo) => {
        const weight = parseFloat(cargo.weight) || 0;
        return sum + weight;
      }, 0);

      totalVolume = data.lclCargo.reduce((sum, cargo) => {
        const volume = parseFloat(cargo.volume) || 0;
        return sum + volume;
      }, 0);
    }

    return { totalPackages, totalWeight, totalVolume };
  };

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {data.blType === 'mbl' ? 'Master Bill of Lading' : 'House Bill of Lading'} Preview
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={generatePDF}
              className="px-4 py-2 bg-[#007bff] text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* BL Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)] hide-scrollbar">
          <div ref={printRef} className="bg-white border border-gray-900 max-w-4xl mx-auto">
                                   {/* Header Section - Freightek Format */}
                       <div className="border-b border-gray-900 border-t-0 border-l-0 border-r-0">
              <div className="grid grid-cols-2">
                {/* Left Side - Parties */}
                <div className="border-r border-gray-900">
                                               {/* Shipper */}
                             <div className="border-b border-gray-900 p-3 h-32">
                               <div className="text-xs font-bold text-gray-900 mb-2">SHIPPER</div>
                               <div className="text-xs text-gray-900 space-y-1">
                                 <div className="font-medium">{data.shipper.name}</div>
                                 <div>{data.shipper.address}</div>
                               </div>
                             </div>

                             {/* Consignee */}
                             <div className="border-b border-gray-900 p-3 h-32">
                               <div className="text-xs font-bold text-gray-900 mb-2">CONSIGNEE (If "To Order" So Indicate)</div>
                               <div className="text-xs text-gray-900 space-y-1">
                                 <div className="font-medium">{data.consignee.name}</div>
                                 <div>{data.consignee.address}</div>
                               </div>
                             </div>

                             {/* Notify Party */}
                             <div className="p-3 h-32">
                               <div className="text-xs font-bold text-gray-900 mb-2">NOTIFY PARTY (No Claim Shall Attach For Failure To Notify)</div>
                               <div className="text-xs text-gray-900 space-y-1">
                                 <div className="font-medium">{data.notifyParty.name}</div>
                                 <div>{data.notifyParty.address}</div>
                               </div>
                             </div>
                </div>

                {/* Right Side - BL Header */}
                <div>
                  <div className='p-2'>
                    {/* Company Logo Space */}
                   <div className="h-25 border-2 border-dashed border-gray-900 mb-4 flex items-center justify-center">
                     <div className="text-xs text-gray-500">Company Logo</div>
                   </div>
                  </div>
                  

                {/* BL Title */}
                 <div className="text-xl font-bold text-center mb-2">
                   <div className="text-gray-900 mb-1" style={{ fontWeight: 'bold' }}>
                    {data.blType === 'mbl' ? 'MASTER BILL OF LADING' : 'HOUSE BILL OF LADING'}
                  </div>
                 </div>

                  {/* BL Numbers and Forwarding Agent Reference */}
                    <div className="text-xs border-t border-gray-900">
                      {/* BL Numbers Row */}
                      <div className="grid grid-cols-2 border-b border-gray-900">
                        <div className="p-2 border-r border-gray-900">
                          <div className="font-semibold text-gray-900 mb-2">Booking No.:</div>
                          <div className="ml-2 text-gray-900">{data.bookingNumber}</div>
                        </div>
                        <div className="p-2">
                          <div className="font-semibold text-gray-900 mb-2">BL No.:</div>
                          <div className="ml-2 text-gray-900">{data.blNumber}</div>
                        </div>
                      </div>
                      
                      {/* Forwarding Agent Reference Row */}
                      <div className="p-2">
                        <div className="font-semibold text-gray-900 mb-2">Forwarding Agent Reference:</div>
                        <div className="ml-2 text-gray-900">-</div>
                      </div>
                    </div>

                  {/* Legal Disclaimer */}
                  <div className="p-2 text-xs text-gray-900 border-t border-gray-900 pt-2">
                    <p className="leading-tight">
                      RECEIVED by the Carrier the Goods as specified above in apparent good order and condition unless otherwise stated herein to be transported subject to all the terms and conditions appearing on the front and reverse of this Bill of Lading to which the Merchant agrees by accepting this Bill of Lading, any local privileges and customs notwithstanding.
                    </p>
                  </div>
                </div>
              </div>
            </div>

                                   {/* Vessel and Route Information - 3 Rows Structure */}
                        <div className="border-b border-gray-900 mb-2 border-t-0 border-l-0 border-r-0">
               {/* Row 1: Pre-carriage by and Place of Receipt */}
               <div className="grid grid-cols-2 border-b border-gray-900">
                 <div className="border-r border-gray-900 p-2">
                   <div className="text-xs font-medium text-gray-900 mb-2">Pre-Carriage by</div>
                   <div className="ml-2 font-semibold text-xs text-gray-900">-</div>
                 </div>
                 <div className="p-2">
                   <div className="text-xs font-medium text-gray-900 mb-2">Place of Receipt</div>
                   <div className="ml-2 font-semibold text-xs text-gray-900">{data.placeOfReceipt}</div>
                 </div>
               </div>

               {/* Row 2: Ocean Vessel, Voyage and Place of Delivery */}
               <div className="grid grid-cols-4 border-b border-gray-900">
                 <div className="border-r border-gray-900 p-2">
                   <div className="text-xs font-medium text-gray-900 mb-2">Ocean Vessel</div>
                   <div className="ml-2 font-semibold text-xs text-gray-900">{data.vessel.name}</div>
                 </div>
                 <div className="border-r border-gray-900 p-2">
                   <div className="text-xs font-medium text-gray-900 mb-2">Voyage No.</div>
                   <div className="ml-2 font-semibold text-xs text-gray-900">{data.vessel.voyageNumber}</div>
                 </div>
                 <div className="p-2">
                   <div className="text-xs font-medium text-gray-900 mb-2">Place of Delivery</div>
                   <div className="ml-2 font-semibold text-xs text-gray-900">{data.placeOfDelivery}</div>
                 </div>
               </div>

               {/* Row 3: Port of Loading, Discharge, Final Destination and Freight Payable At */}
               <div className="grid grid-cols-4">
                 <div className="border-r border-gray-900 p-2">
                   <div className="text-xs font-medium text-gray-900 mb-2">Port of Loading</div>
                   <div className="ml-2 font-semibold text-xs text-gray-900">{data.portOfLoading}</div>
                 </div>
                 <div className="border-r border-gray-900 p-2">
                   <div className="text-xs font-medium text-gray-900 mb-2">Port of Discharge</div>
                   <div className="ml-2 font-semibold text-xs text-gray-900">{data.portOfDischarge}</div>
                 </div>
                 <div className="border-r border-gray-900 p-2">
                   <div className="text-xs font-medium text-gray-900 mb-2">Final Destination</div>
                   <div className="ml-2 font-semibold text-xs text-gray-900">{data.finalDestination}</div>
                 </div>
                 <div className="p-2">
                   <div className="text-xs font-medium text-gray-900 mb-2">Freight Payable At</div>
                   <div className="ml-2 font-semibold text-xs text-gray-900">{data.freightCharges.payableAt}</div>
                 </div>
               </div>
             </div>

                {/* Cargo Details Table */}
               <div className="border-b border-gray-900 border-t-0 border-l-0 border-r-0">
                 <div className="text-gray-900 font-bold px-3 py-1" style={{ fontWeight: 'bold' }}> PARTICULARS FURNISHED BY SHIPPER </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-t border-gray-900" style={{ height: '430px' }}>
                  <thead>
                    <tr>
                      <th className="p-2 text-left text-gray-900" style={{ width: '20%' }}>Marks & Numbers</th>
                      <th className="p-2 text-left text-gray-900" style={{ width: '15%' }}>No. of Container or Packages</th>
                      <th className="p-2 text-left text-gray-900" style={{ width: '40%' }}>Kind of Packages: Description of Goods</th>
                      <th className="p-2 text-left text-gray-900" style={{ width: '12%' }}>Gross Weight (KGS)</th>
                      <th className="p-2 text-left text-gray-900" style={{ width: '13%' }}>Measurement (CBM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.serviceType === 'fcl' && data.containers?.map((container, index) => (
                                <tr key={index}>
                                    <td className="p-4 text-gray-900 align-top" style={{ minHeight: '100px', height: 'auto', width: '20%' }}>
                                      <div className="text-xs leading-normal break-words mb-2">{container.containerNumber}</div>
                                      <div className="text-xs leading-normal break-words mb-2">{container.sealNumber}</div>
                                      <div className="text-xs leading-normal break-words">{container.marks}</div>
                                    </td>
                                    <td className="p-4 text-gray-900 align-top text-xs" style={{ minHeight: '100px', height: 'auto', width: '15%' }}>{container.packages}</td>
                                    <td className="p-4 text-gray-900 align-top" style={{ minHeight: '100px', height: 'auto', width: '40%' }}>
                                      <div className="text-xs leading-normal break-words mb-2">{container.type}</div>
                                      <div className="text-xs leading-normal break-words mb-2">{container.description}</div>
                                      <div className="text-xs leading-normal break-words mb-2">{data.cargo.commodity}</div>
                                      <div className="text-xs leading-normal break-words">{data.cargo.serviceMode}</div>
                                    </td>
                                   <td className="p-4 text-gray-900 align-top text-xs" style={{ minHeight: '100px', height: 'auto', width: '12%' }}>{container.weight}</td>
                                   <td className="p-4 text-gray-900 align-top text-xs" style={{ minHeight: '100px', height: 'auto', width: '13%' }}>{container.volume}</td>
                                 </tr>
                    ))}
                    {data.serviceType === 'lcl' && data.lclCargo?.map((cargo, index) => (
                                <tr key={index}>
                                    <td className="p-4 text-gray-900 align-top" style={{ minHeight: '100px', height: 'auto', width: '20%' }}>
                                      <div className="text-xs leading-normal break-words mb-2">{cargo.marks}</div>
                                      {data.consolidation && (
                                        <>
                                          <div className="text-xs leading-normal break-words mb-2">Container: {data.consolidation.containerNumber}</div>
                                          <div className="text-xs leading-normal break-words">Seal: {data.consolidation.sealNumber}</div>
                                        </>
                                      )}
                                    </td>
                                    <td className="p-4 text-gray-900 align-top text-xs" style={{ minHeight: '100px', height: 'auto', width: '15%' }}>{cargo.packages}</td>
                                    <td className="p-4 text-gray-900 align-top" style={{ minHeight: '100px', height: 'auto', width: '40%' }}>
                                      <div className="text-xs leading-normal break-words mb-2">{cargo.description}</div>
                                      <div className="text-xs leading-normal break-words mb-2">{cargo.commodity}</div>
                                      <div className="text-xs leading-normal break-words">{cargo.serviceMode}</div>
                                    </td>
                                   <td className="p-4 text-gray-900 align-top text-xs" style={{ minHeight: '100px', height: 'auto', width: '12%' }}>{cargo.weight}</td>
                                   <td className="p-4 text-gray-900 align-top text-xs" style={{ minHeight: '100px', height: 'auto', width: '13%' }}>{cargo.volume}</td>
                                 </tr>
                    ))}
                    
                    {/* Consolidation details at bottom of particulars table */}
                    {data.serviceType === 'lcl' && data.consolidation && (
                      <tr>
                        <td colSpan={4} className="px-3">
                          <div className="flex justify-between text-xs text-gray-900">
                            <span>Consolidated by: {data.consolidation.consolidator}</span>
                            <span>Master BL: {data.consolidation.masterBLNumber}</span>
                            <span>House BL: {data.consolidation.houseBLNumber}</span>
                            <span>Incoterm: {data.freightCharges.incoterm}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                    
                    {/* Incoterm for FCL shipments */}
                    {data.serviceType === 'fcl' && (
                      <tr>
                        <td colSpan={4} className="px-3">
                          <div className="flex justify-start text-xs text-gray-900">
                            <span>Incoterm: {data.freightCharges.incoterm}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

              {/* Charges Table - Connected to Cargo Table (MBL Only) */}
               {data.blType === 'mbl' && (
               <div className="border-b border-gray-900">
                <div>
                  <div className="px-3 border-b border-gray-900 py-1">
                    <div className="text-gray-900 font-bold" style={{ fontWeight: 'bold' }}> CHARGES </div>
                    <div>
                      <span className="text-xs text-gray-900">Total No. Container or Packages (in words):</span>
                      <span className="ml-2 text-xs text-gray-900">
                        {data.serviceType === 'fcl' 
                          ? `ONE CONTAINER(S) ONLY` 
                          : `${totals.totalPackages} PACKAGE(S) ONLY`
                        }
                      </span>
                    </div>
                  </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs charges-table">
                    <thead className="border-b border-gray-900">
                      <tr>
                        <th className="border-r border-gray-900 p-2 text-left text-gray-900">Unit</th>
                        <th className="border-r border-gray-900 p-2 text-left text-gray-900">Rate</th>
                        <th className="border-r border-gray-900 p-2 text-left text-gray-900">Currency</th>
                        <th className="border-r border-gray-900 p-2 text-left text-gray-900">Prepaid</th>
                        <th className="border-r border-gray-900 p-2 text-left text-gray-900">Collect</th>
                        <th className="p-2 text-left text-gray-900">Ex. Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="h-25">
                        <td className="border-r border-gray-900 p-4 text-gray-900">FREIGHT PREPAID</td>
                        <td className="border-r border-gray-900 p-4 text-gray-900">AS AGREED</td>
                        <td className="border-r border-gray-900 p-4 text-gray-900">{data.freightCharges.totalPrepaid}</td>
                        <td className="border-r border-gray-900 p-4 text-gray-900">AS AGREED</td>
                        <td className="border-r border-gray-900 p-4 text-gray-900"></td>
                        <td className="p-2 text-gray-900"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
               )}

            {/* Bottom Section - 3 Column Layout with Borders */}
             <div className="border-b border-gray-900 border-t-0 border-l-0 border-r-0">
               <div className="grid grid-cols-3">
                 {/* Left Column - Charges Details */}
                 <div className="border-r border-gray-900">
                   <div className="text-xs">
                     <div className="border-b border-gray-900 p-2">
                       <div className="font-medium text-gray-900 mb-2">Prepaid at:</div>
                       <div className="ml-2 font-semibold text-gray-900">{data.freightCharges.prepaidAt}</div>
                     </div>
                     <div className="border-b border-gray-900 p-2">
                       <div className="font-medium text-gray-900 mb-2">Total Prepaid in:</div>
                       <div className="ml-2 font-semibold text-gray-900">{data.freightCharges.totalPrepaid}</div>
                     </div>
                     <div className="p-2">
                       <div className="font-medium text-gray-900 mb-2">Shipped on Board Date:</div>
                       <div className="ml-2 font-semibold text-gray-900">{formatDate(data.shippedOnBoardDate)}</div>
                     </div>
                   </div>
                 </div>

                 {/* Middle Column - Issuance Details */}
                 <div className="border-r border-gray-900">
                   <div className="text-xs">
                     <div className="border-b border-gray-900 p-2">
                       <div className="font-medium text-gray-900 mb-2">Payable at:</div>
                       <div className="ml-2 font-semibold text-gray-900">{data.freightCharges.payableAt}</div>
                     </div>
                     <div className="border-b border-gray-900 p-2">
                       <div className="font-medium text-gray-900 mb-2">No. of Original B/L (s):</div>
                       <div className="ml-2 font-semibold text-gray-900">{data.freightCharges.numberOfOriginals}</div>
                     </div>
                     <div className="p-2">
                       <div className="font-medium text-gray-900 mb-2">Place and Date of Issue:</div>
                       <div className="ml-2 font-semibold text-gray-900">{data.placeOfIssue}, {formatDate(data.dateOfIssue)}</div>
                     </div>
                   </div>
                 </div>

                 {/* Right Column - Signature */}
                 <div>
                   <div className="text-xs p-2 h-full">
                     <div className="font-medium text-gray-900 mb-2">Signature By</div>
                   </div>
                 </div>
               </div>
             </div>

            {/* Footer Legal Text */}
            <div className="p-2 text-xs text-gray-900">
              <p className="leading-tight">
                One original Bill of Lading must be surrendered duly endorsed in exchange for the Goods or delivery order. In witness whereof the number of original Bills of Lading stated below have been issued, all of this tenor and date, one of which being accomplished, the others to stand void.
              </p>
            </div>

            {/* Page Number - Bottom Right */}
            <div className="text-right p-2 -mt-2">
              <div className="text-xs text-gray-900">Page 1</div>
            </div>
            </div>
           </div>
         </div>


       </div>
     );
   };

   export default BLFormat;

