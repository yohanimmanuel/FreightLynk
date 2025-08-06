import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface BLData {
  // Header Information
  blNumber: string;
  bookingNumber: string;
  dateOfIssue: string;
  
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
  
  // Cargo Details
  containers: Array<{
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
  
  // Freight and Charges
  freightCharges: {
    totalFreight: string;
    currency: string;
    paymentTerms: string;
    payableAt: string;
    prepaidAt: string;
    totalPrepaid: string;
    numberOfOriginals: string;
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

const BLFormat: React.FC<BLFormatProps> = ({ data, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    try {
      const element = printRef.current;
      if (!element) {
        alert('BL content not found');
        return;
      }

      // Override styles with inline hex colors and add padding
      const originalStyle = element.style.cssText;
      element.style.cssText = `
        color: #111111 !important;
        border-color: #111111 !important;
        background-color: #ffffff !important;
      `;



      // Override all child elements
      const allElements = element.querySelectorAll('*');
      const originalStyles: string[] = [];
      allElements.forEach((el, index) => {
        const htmlEl = el as HTMLElement;
        originalStyles[index] = htmlEl.style.cssText;
        htmlEl.style.cssText = `
          color: #111111 !important;
          border-color: #111111 !important;
          background-color: #ffffff !important;
        `;
      });

      // Override specific gray background
      const grayBgElements = element.querySelectorAll('.bg-gray-50');
      grayBgElements.forEach((el) => {
        (el as HTMLElement).style.backgroundColor = '#f9f9f9 !important';
      });

      // Override font weights for titles to ensure they're bold in PDF
      const titleElements = element.querySelectorAll('h1');
      titleElements.forEach((el) => {
        (el as HTMLElement).style.fontWeight = '900 !important';
      });

      const boldElements = element.querySelectorAll('.font-bold');
      boldElements.forEach((el) => {
        (el as HTMLElement).style.fontWeight = '900 !important';
      });

      // Specifically override table borders for better PDF rendering
      const tables = element.querySelectorAll('table');
      tables.forEach((table) => {
        (table as HTMLElement).style.borderCollapse = 'collapse';
        (table as HTMLElement).style.borderSpacing = '0';
      });

      const tableHeaders = element.querySelectorAll('thead');
      tableHeaders.forEach((thead) => {
        (thead as HTMLElement).style.borderBottom = '2px solid #111111';
      });

      const tableHeaderCells = element.querySelectorAll('th');
      tableHeaderCells.forEach((th) => {
        (th as HTMLElement).style.borderBottom = '1px solid #111111';
        (th as HTMLElement).style.borderRight = '1px solid #111111';
      });

      const tableBodyCells = element.querySelectorAll('td');
      tableBodyCells.forEach((td) => {
        (td as HTMLElement).style.borderRight = '1px solid #111111';
        (td as HTMLElement).style.borderBottom = '1px solid #111111';
      });

      const tableRows = element.querySelectorAll('tr');
      tableRows.forEach((tr) => {
        (tr as HTMLElement).style.borderBottom = '1px solid #111111';
      });

      // Direct capture with basic options
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Restore original styles
      element.style.cssText = originalStyle;
      allElements.forEach((el, index) => {
        (el as HTMLElement).style.cssText = originalStyles[index];
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions to fit within A4 margins
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 290; // A4 height in mm
      const margin = 5; // 10mm margin on all sides
      
      const availableWidth = pageWidth - (2 * margin);
      const availableHeight = pageHeight - (2 * margin);
      
      // Calculate scaling to fit content within margins
      const scaleX = availableWidth / canvas.width;
      const scaleY = availableHeight / canvas.height;
      const scale = Math.min(scaleX, scaleY);
      
      const imgWidth = canvas.width * scale;
      const imgHeight = canvas.height * scale;
      
      // Center the image on the page
      const x = margin + (availableWidth - imgWidth) / 2;
      const y = margin + (availableHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      
      // Handle multi-page if content is still too tall
      if (imgHeight > availableHeight) {
        let remainingHeight = imgHeight - availableHeight;
        let currentPosition = -availableHeight;
        
        while (remainingHeight > 0) {
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', x, y + currentPosition, imgWidth, imgHeight);
          currentPosition -= availableHeight;
          remainingHeight -= availableHeight;
        }
      }

      pdf.save(`BL-${data.blNumber}.pdf`);
      console.log('PDF generated successfully');
      
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
    const totalPackages = data.containers.reduce((sum, container) => {
      const packages = parseInt(container.packages) || 0;
      return sum + packages;
    }, 0);

    const totalWeight = data.containers.reduce((sum, container) => {
      const weight = parseFloat(container.weight) || 0;
      return sum + weight;
    }, 0);

    const totalVolume = data.containers.reduce((sum, container) => {
      const volume = parseFloat(container.volume) || 0;
      return sum + volume;
    }, 0);

    return { totalPackages, totalWeight, totalVolume };
  };

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Bill of Lading Preview</h2>
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
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
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
                   <div className="h-30.5 border-2 border-dashed border-gray-900 mb-4 flex items-center justify-center">
                     <div className="text-xs text-gray-500">Company Logo</div>
                   </div>
                  </div>
                  

                {/* BL Title */}
                 <div className="text-xl font-bold text-center mb-4">
                   <div className="text-gray-900 mb-1" style={{ fontWeight: 'bold' }}>BILL OF LADING</div>
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
                 <div className="text-gray-900 font-bold p-3" style={{ fontWeight: 'bold' }}> PARTICULARS FURNISHED BY SHIPPER </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-t border-gray-900">
                  <thead className="border-b border-gray-900">
                    <tr>
                      <th className="border-r border-gray-900 p-2 text-left text-gray-900">Marks & Numbers</th>
                      <th className="border-r border-gray-900 p-2 text-left text-gray-900">No. of Container or Packages</th>
                      <th className="border-r border-gray-900 p-2 text-left text-gray-900">Kind of Packages: Description of Goods</th>
                      <th className="border-r border-gray-900 p-2 text-left text-gray-900">Gross Weight (KGS)</th>
                      <th className="p-2 text-left text-gray-900">Measurement (CBM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.containers.map((container, index) => (
                                <tr key={index}>
                                    <td className="border-r border-gray-900 p-4 text-gray-900 align-top" style={{ minHeight: '100px', height: 'auto' }}>
                                      <div className="text-xs leading-normal break-words mb-2">{container.containerNumber}</div>
                                      <div className="text-xs leading-normal break-words mb-2">{container.sealNumber}</div>
                                      <div className="text-xs leading-normal break-words">{container.marks}</div>
                                    </td>
                                    <td className="border-r border-gray-900 p-4 text-gray-900 align-top text-xs" style={{ minHeight: '100px', height: 'auto' }}>{container.packages}</td>
                                    <td className="border-r border-gray-900 p-4 text-gray-900 align-top" style={{ minHeight: '100px', height: 'auto' }}>
                                      <div className="text-xs leading-normal break-words mb-2">{container.type}</div>
                                      <div className="text-xs leading-normal break-words mb-2">{container.description}</div>
                                      <div className="text-xs leading-normal break-words mb-2">{data.cargo.commodity}</div>
                                      <div className="text-xs leading-normal break-words">{data.cargo.serviceMode}</div>
                                    </td>
                                   <td className="border-r border-gray-900 p-4 text-gray-900 align-top text-xs" style={{ minHeight: '100px', height: 'auto' }}>{container.weight}</td>
                                   <td className="p-4 text-gray-900 align-top text-xs" style={{ minHeight: '100px', height: 'auto' }}>{container.volume}</td>
                                 </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

                         {/* Charges Table - Connected to Cargo Table */}
               <div className="border-b border-gray-900 border-t-0 border-l-0 border-r-0">
                <div>
                  <div className="p-3 border-b border-gray-900">
                    <div className="text-gray-900 font-bold py-1" style={{ fontWeight: 'bold' }}> CHARGES </div>
                    <div>
                      <span className="text-xs text-gray-900">Total No. Container or Packages (in words):</span>
                      <span className="ml-2 text-xs text-gray-900">ONE CONTAINER(S) ONLY</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
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
                      <tr>
                        <td className="border-r border-gray-900 p-4 text-gray-900">FREIGHT PREPAID</td>
                        <td className="border-r border-gray-900 p-4 text-gray-900">AS AGREED</td>
                        <td className="border-r border-gray-900 p-4 text-gray-900">{data.freightCharges.currency}</td>
                        <td className="border-r border-gray-900 p-4 text-gray-900">AS AGREED</td>
                        <td className="border-r border-gray-900 p-4 text-gray-900"></td>
                        <td className="p-2 text-gray-900"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

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

