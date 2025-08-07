'use client';

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Interfaces for Shipping Instructions data structure
interface ShipperInfo {
  name: string;
  address: string;
  city?: string;
  country?: string;
}

interface ConsigneeInfo {
  name: string;
  address: string;
  city?: string;
  country?: string;
}

interface NotifyPartyInfo {
  name: string;
  address: string;
  city?: string;
  country?: string;
}

interface VesselInfo {
  name: string;
  voyageNumber: string;
  feederVessel?: string;
  feederVoyage?: string;
}

interface CargoInfo {
  marks: string;
  kind: string;
  packages: string;
  description: string;
  grossWeight: string;
  measurements: string;
}

interface ContainerInfo {
  containerNumber: string;
  sealNumber: string;
  containerType: string;
  tareWeight: string;
  vgm: string;
  temperature?: string;
  specialEquipment?: string;
}

interface ConsolidationInfo {
  masterBLNumber: string;
  houseBLNumber: string;
  consolidator: string;
  containerNumber: string;
  sealNumber: string;
}

interface DocumentInfo {
  commercialInvoice: boolean;
  packingList: boolean;
  certificateOfOrigin: boolean;
  phytosanitaryCertificate: boolean;
  otherDocuments: string;
}

interface InsuranceInfo {
  insuranceRequired: boolean;
  insuranceValue: string;
  insuranceType: string;
  claimsProcedure: string;
}

interface CustomsInfo {
  hsCodes: string;
  customsValue: string;
  importLicense: string;
  exportLicense: string;
  dutyTaxInfo: string;
}

interface SIData {
  // Header Information
  siNumber: string;
  pageNumber?: string;
  reference?: string;
  buyerReference?: string;
  exportDeclarationNumber?: string;
  masterBLNumber?: string; // For FCL shipments
  
  // Party Information
  exporter: ShipperInfo;
  consignee: ConsigneeInfo;
  notifyParty?: NotifyPartyInfo;
  
  // Transportation Details
  carrier?: string;
  methodOfDispatch: string;
  typeOfShipment: string;
  countryOfOriginOfGoods: string;
  countryOfFinalDestination: string;
  
  // Ports and Dates
  vesselOrAircraft: string;
  voyageNo: string;
  placeOfReceipt: string;
  portOfLoading: string;
  dateOfDeparture: string;
  freightCharges: string;
  documentInstructions: string;
  portOfDischarge: string;
  finalDestination: string;
  incoterms2020: string;
  declaredValue: string;
  
  // FCL Specific Information
  containers?: ContainerInfo[];
  stowageInstructions?: string;
  equipmentRequirements?: string;
  
  // LCL Specific Information
  consolidation?: ConsolidationInfo;
  breakBulkInstructions?: string;
  
  // Cargo Details
  cargoDetails: CargoInfo[];
  
  // Documentation Requirements
  documents: DocumentInfo;
  
  // Insurance and Liability
  insurance: InsuranceInfo;
  
  // Customs Information
  customs: CustomsInfo;
  
  // Special Handling
  temperatureControlled?: boolean;
  temperatureRange?: string;
  hazardousGoods?: boolean;
  hazardousDetails?: string;
  oversizedCargo?: boolean;
  heavyLift?: boolean;
  perishableGoods?: boolean;
  
  // Footer Information
  totalThisPage: string;
  consignmentTotal: string;
  dangerousGoods?: string;
  creditInfo?: string;
  specialInstructions?: string;
  
  // Signature Section
  placeAndDateOfIssue: string;
  signatoryCompany: string;
  nameOfAuthorizedSignatory: string;
  signature?: string;
}

interface OceanSIFormatProps {
  data: SIData;
  onClose: () => void;
}

const OceanSIFormat: React.FC<OceanSIFormatProps> = ({ data, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  // Replace unsupported color functions with safe hex values
  const replaceUnsupportedColors = (root: HTMLElement) => {
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
  };

  const generatePDF = async () => {
    try {
      const element = printRef.current;
      if (!element) {
        alert('SI content not found');
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

      const margin = 5; // px, extra whitespace
      const maxImgWidth = pdfWidth - margin;
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
      pdf.save(`SI-${data.siNumber}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error generating PDF: ${errorMessage}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>Shipping Instructions Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={generatePDF}
              className="px-4 py-2 bg-[#007bff] text-white rounded-lg hover:bg-blue-700 transition-colors"
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

        {/* SI Document Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)] hide-scrollbar">
          <div ref={printRef} className="bg-white" style={{ width: '1000px', margin: '0 auto' }}>
                         {/* Document Header */}
             <div className="border border-gray-900 p-2 mb-0">
               <div className="text-center">
                 <h1 className="text-lg font-bold" style={{ color: '#111827' }}>SHIPPING INSTRUCTION</h1>
               </div>
             </div>

                         {/* Header Section - 2 Columns */}
             <div className="border border-gray-900 border-t-0">
               <div className="grid grid-cols-12 text-xs" style={{ color: '#111827' }}>
                 {/* Left Column - Shipper, Consignee, Notify Party */}
                 <div className="col-span-6 border-r border-gray-900">
                   <div className="grid grid-rows-3 h-85.5">
                     {/* Shipper */}
                     <div className="border-b border-gray-900 p-2">
                       <div className="font-semibold mb-2">Shipper</div>
                       <div className="ml-2">
                         <div>{data.exporter.name}</div>
                         <div>{data.exporter.address}</div>
                       </div>
                     </div>
                     {/* Consignee */}
                     <div className="border-b border-gray-900 p-2">
                       <div className="font-semibold mb-2">Consignee</div>
                       <div className="ml-2">
                         <div>{data.consignee.name}</div>
                         <div>{data.consignee.address}</div>
                       </div>
                     </div>
                     {/* Notify Party */}
                     <div className="p-2">
                       <div className="font-semibold mb-2">Notify Party (if not Consignee)</div>
                       {data.notifyParty && (
                         <div className="ml-2">
                           <div>{data.notifyParty.name}</div>
                           <div>{data.notifyParty.address}</div>
                         </div>
                       )}
                     </div>
                   </div>
                 </div>
                 
                {/* Right Column - Reference Information */}
                  <div className="col-span-6">
                    <div className="grid grid-rows-4">
                      {/* Page - 1/4 height (equal to Shipper) */}
                      <div className="border-b border-gray-900 p-2">
                        <div className="font-semibold text-xs mb-2">Master BL Number</div>
                        <div className="ml-2 text-xs">{data.masterBLNumber || ''}</div>
                      </div>
                      {/* References Row - 1/4 height (equal to Shipper) */}
                      <div className="border-b border-gray-900">
                        <div className="grid grid-cols-3 h-full">
                          {/* Reference */}
                          <div className="border-r border-gray-900 p-2">
                            <div className="font-semibold text-xs mb-2">Reference</div>
                            <div className="ml-2 text-xs">{data.reference || ''}</div>
                          </div>
                          {/* Buyer Reference */}
                          <div className="border-r border-gray-900 p-2">
                            <div className="font-semibold text-xs mb-2">Buyer Reference</div>
                            <div className="ml-2 text-xs">{data.buyerReference || ''}</div>
                          </div>
                          {/* Export Declaration Number */}
                          <div className="p-2">
                            <div className="font-semibold text-xs mb-2">Export Declaration Number</div>
                            <div className="ml-2 text-xs">{data.exportDeclarationNumber || ''}</div>
                          </div>
                        </div>
                      </div>
                      {/* Carrier - 2/4 height (equal to Consignee + Notify Party) */}
                      <div className="p-2">
                        <div className="font-semibold mb-2">Carrier</div>
                        <div className="ml-2 text-xs">{data.carrier || ''}</div>
                      </div>
                    </div>
                  </div>
               </div>
             </div>
                  {/* Transportation Details Section */}
                   <div className="border-t-0 border border-gray-900">
                     <div className="grid grid-cols-4 text-xs" style={{ color: '#111827' }}>
                       {/* Column 1 - Left side transportation details */}
                       <div className="col-span-1 border-r border-gray-900">
                         <div className="border-b border-gray-900 p-2">
                           <div className="font-semibold mb-2">Method of Dispatch</div>
                           <div className="ml-2">{data.methodOfDispatch}</div>
                         </div>
                         <div className="border-b border-gray-900 p-2">
                           <div className="font-semibold mb-2">Vessel / Aircraft (Voyage No)</div>
                           <div className="ml-2">{data.vesselOrAircraft} ({data.voyageNo})</div>
                         </div>
                         <div className="border-b border-gray-900 p-2">
                           <div className="font-semibold mb-2">Port of Loading</div>
                           <div className="ml-2">{data.portOfLoading}</div>
                         </div>
                         <div className="p-2">
                           <div className="font-semibold mb-2">Port of Discharge</div>
                           <div className="ml-2">{data.portOfDischarge}</div>
                         </div>
                       </div>
                       
                       {/* Column 2 - Right side transportation details */}
                       <div className="col-span-1 border-r border-gray-900">
                         <div className="border-b border-gray-900 p-2">
                           <div className="font-semibold mb-2">Type of Shipment</div>
                           <div className="ml-2">{data.typeOfShipment}</div>
                         </div>
                         <div className="border-b border-gray-900 p-2">
                           <div className="font-semibold mb-2">Place of Receipt</div>
                           <div className="ml-2">{data.placeOfReceipt}</div>
                         </div>
                         <div className="border-b border-gray-900 p-2">
                           <div className="font-semibold mb-2">Date of Departure</div>
                           <div className="ml-2">{data.dateOfDeparture}</div>
                         </div>
                         <div className="p-2">
                           <div className="font-semibold mb-2">Final Destination</div>
                           <div className="ml-2">{data.finalDestination}</div>
                         </div>
                       </div>
                       
                        {/* Column 3 - Country of Origin (spans vertically) */}
                        <div className="col-span-1 border-r border-gray-900">
                          <div className="p-2">
                           <div className="font-semibold mb-2">Incoterms as per 2020</div>
                           <div className="ml-2">{data.incoterms2020}</div>
                          </div>
                          <div className="border-t border-gray-900 p-2">
                           <div className="font-semibold mb-2">Freight Charges</div>
                           <div className="ml-2">{data.freightCharges}</div>
                         </div>
                         <div className="border-t border-gray-900 p-2">
                           <div className="font-semibold mb-2">Country Of Origin of Goods</div>
                           <div className="ml-2">{data.countryOfOriginOfGoods}</div>
                         </div>
                        </div>
                        
                        {/* Column 4 - Country of Final Destination (spans vertically) */}
                        <div className="col-span-1">
                          <div className="p-2">
                           <div className="font-semibold mb-2">Declared Value</div>
                           <div className="ml-2">{data.declaredValue}</div>
                          </div>
                          <div className="border-t border-gray-900 p-2">
                           <div className="font-semibold mb-2">Document Instructions</div>
                           <div className="ml-2">{data.documentInstructions}</div>
                         </div>
                         <div className="border-t border-gray-900 p-2">
                            <div className="font-semibold mb-2">Country of Final Destination</div>
                            <div className="ml-2">{data.countryOfFinalDestination}</div>
                         </div>
                        </div>
                     </div>
                   </div>

            {/* Cargo Details Table */}
             <div className="border border-gray-900 border-t-0">
               <div className="grid grid-cols-12 text-xs border-b border-gray-900" style={{ color: '#111827' }}>
                 <div className="col-span-2 border-r border-gray-900 p-2">
                   <div className="font-semibold">Marks and Numbers</div>
                 </div>
                 <div className="col-span-2 border-r border-gray-900 p-2">
                   <div className="font-semibold">Kind & No of Packages</div>
                 </div>
                 <div className="col-span-4 border-r border-gray-900 p-2">
                   <div className="font-semibold">Description of Goods</div>
                 </div>
                 <div className="col-span-2 border-r border-gray-900 p-2">
                   <div className="font-semibold">Gross Weight (kg)</div>
                 </div>
                 <div className="col-span-2 p-2">
                   <div className="font-semibold">Measurements (m³)</div>
                 </div>
               </div>
               
               {/* Cargo Details Rows */}
               <div style={{ height: '300px' }}>
                 {data.cargoDetails?.map((cargo, index) => (
                   <div key={index} className="grid grid-cols-12 text-xs" style={{ color: '#111827' }}>
                     <div className="col-span-2 p-2">
                       <div>{cargo.marks}</div>
                     </div>
                     <div className="col-span-2 p-2">
                       <div>{cargo.kind}</div>
                       <div>{cargo.packages}</div>
                     </div>
                     <div className="col-span-4 p-2">
                       <div>{cargo.description}</div>
                     </div>
                     <div className="col-span-2 p-2">
                       <div>{cargo.grossWeight}</div>
                     </div>
                     <div className="col-span-2 p-2">
                       <div>{cargo.measurements}</div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
             {/* FCL Specific Information */}
             {data.typeOfShipment?.toLowerCase() === 'fcl' && data.containers && (
               <div className="border border-gray-900 border-t-0">
                 <div className="border-b border-gray-900 p-2">
                   <div className="font-semibold text-xs" style={{ color: '#111827' }}>CONTAINER INFORMATION (FCL)</div>
                 </div>
                 <div className="grid grid-cols-7 text-xs border-b border-gray-900" style={{ color: '#111827' }}>
                   <div className="col-span-2 border-r border-gray-900 p-2">
                     <div className="font-semibold">Container No.</div>
                   </div>
                   <div className="col-span-1 border-r border-gray-900 p-2">
                     <div className="font-semibold">Seal No.</div>
                   </div>
                   <div className="col-span-1 border-r border-gray-900 p-2">
                     <div className="font-semibold">Type</div>
                   </div>
                   <div className="col-span-1 border-r border-gray-900 p-2">
                     <div className="font-semibold">Tare (kg)</div>
                   </div>
                   <div className="col-span-1 border-r border-gray-900 p-2">
                     <div className="font-semibold">VGM (kg)</div>
                   </div>
                   <div className="col-span-1 p-2">
                     <div className="font-semibold">Temp (°C)</div>
                   </div>
                 </div>
                 {data.containers.map((container, index) => (
                   <div key={index} className="grid grid-cols-7 text-xs" style={{ color: '#111827' }}>
                     <div className="col-span-2 p-2">
                       <div>{container.containerNumber}</div>
                     </div>
                     <div className="col-span-1 p-2">
                       <div>{container.sealNumber}</div>
                     </div>
                     <div className="col-span-1 p-2">
                       <div>{container.containerType}</div>
                     </div>
                     <div className="col-span-1 p-2">
                       <div>{container.tareWeight}</div>
                     </div>
                     <div className="col-span-1 p-2">
                       <div>{container.vgm}</div>
                     </div>
                     <div className="col-span-1 p-2">
                       <div>{container.temperature || 'N/A'}</div>
                     </div>
                   </div>
                 ))}
                 {(data.stowageInstructions || data.equipmentRequirements) && (
                   <div className="grid grid-cols-2 text-xs" style={{ color: '#111827' }}>
                     <div className="border-r border-gray-900 p-2">
                       <div className="font-semibold mb-2">Stowage Instructions</div>
                       <div className="ml-2">{data.stowageInstructions || 'N/A'}</div>
                     </div>
                     <div className="p-2">
                       <div className="font-semibold mb-2">Equipment Requirements</div>
                       <div className="ml-2">{data.equipmentRequirements || 'N/A'}</div>
                     </div>
                   </div>
                 )}
               </div>
             )}

             {/* LCL Specific Information */}
             {data.typeOfShipment?.toLowerCase() === 'lcl' && data.consolidation && (
               <div className="border border-gray-900 border-t-0">
                 <div className="border-b border-gray-900 p-2">
                   <div className="font-semibold text-xs" style={{ color: '#111827' }}>CONSOLIDATION INFORMATION (LCL)</div>
                 </div>
                 <div className="grid grid-cols-3 text-xs" style={{ color: '#111827' }}>
                   <div className="p-2">
                     <div className="font-semibold mb-2">Master BL Number</div>
                     <div className="ml-2">{data.consolidation.masterBLNumber}</div>
                   </div>
                   <div className="p-2">
                     <div className="font-semibold mb-2">House BL Number</div>
                     <div className="ml-2">{data.consolidation.houseBLNumber}</div>
                   </div>
                   <div className="p-2">
                     <div className="font-semibold mb-2">Break-Bulk Instructions</div>
                     <div className="ml-2">{data.breakBulkInstructions || 'N/A'}</div>
                   </div>
                 </div>
                 <div className="grid grid-cols-3 text-xs" style={{ color: '#111827' }}>
                   <div className="p-2">
                     <div className="font-semibold mb-2">Consolidator</div>
                     <div className="ml-2">{data.consolidation.consolidator}</div>
                   </div>
                   <div className="p-2">
                     <div className="font-semibold mb-2">Container Number</div>
                     <div className="ml-2">{data.consolidation.containerNumber}</div>
                   </div>
                   <div className="p-2">
                     <div className="font-semibold mb-2">Seal Number</div>
                     <div className="ml-2">{data.consolidation.sealNumber}</div>
                   </div>
                 </div>
               </div>
             )}

             {/* Documentation Requirements */}
             <div className="border border-gray-900 border-t-0">
               <div className="border-b border-gray-900 p-2">
                 <div className="font-semibold text-xs" style={{ color: '#111827' }}>DOCUMENTATION REQUIREMENTS</div>
               </div>
               <div className="grid grid-cols-2 text-xs" style={{ color: '#111827' }}>
                 <div className="p-2">
                   <div className="font-semibold mb-2">Required Documents</div>
                   <div className="ml-2">
                     <div>☐ Commercial Invoice: {data.documents.commercialInvoice ? '☑' : '☐'}</div>
                     <div>☐ Packing List: {data.documents.packingList ? '☑' : '☐'}</div>
                     <div>☐ Certificate of Origin: {data.documents.certificateOfOrigin ? '☑' : '☐'}</div>
                     <div>☐ Phytosanitary Certificate: {data.documents.phytosanitaryCertificate ? '☑' : '☐'}</div>
                   </div>
                 </div>
                 <div className="p-2">
                   <div className="font-semibold mb-2">Other Documents</div>
                   <div className="ml-2">{data.documents.otherDocuments || 'N/A'}</div>
                 </div>
               </div>
             </div>

             {/* Insurance and Liability */}
             <div className="border border-gray-900 border-t-0">
               <div className="border-b border-gray-900 p-2">
                 <div className="font-semibold text-xs" style={{ color: '#111827' }}>INSURANCE AND LIABILITY</div>
               </div>
               <div className="grid grid-cols-2 text-xs" style={{ color: '#111827' }}>
                 <div className="p-2">
                   <div className="font-semibold mb-2">Insurance Required</div>
                   <div className="ml-2">{data.insurance.insuranceRequired ? 'Yes' : 'No'}</div>
                   <div className="font-semibold mb-2 mt-2">Insurance Value</div>
                   <div className="ml-2">{data.insurance.insuranceValue}</div>
                 </div>
                 <div className="p-2">
                   <div className="font-semibold mb-2">Insurance Type</div>
                   <div className="ml-2">{data.insurance.insuranceType}</div>
                   <div className="font-semibold mb-2 mt-2">Claims Procedure</div>
                   <div className="ml-2">{data.insurance.claimsProcedure}</div>
                 </div>
               </div>
             </div>

             {/* Customs Information */}
             <div className="border border-gray-900 border-t-0">
               <div className="border-b border-gray-900 p-2">
                 <div className="font-semibold text-xs" style={{ color: '#111827' }}>CUSTOMS INFORMATION</div>
               </div>
               <div className="grid grid-cols-3 text-xs" style={{ color: '#111827' }}>
                 <div className="p-2">
                   <div className="font-semibold mb-2">HS Codes</div>
                   <div className="ml-2">{data.customs.hsCodes}</div>
                   <div className="font-semibold mb-2 mt-2">Customs Value</div>
                   <div className="ml-2">{data.customs.customsValue}</div>
                 </div>
                 <div className="p-2">
                   <div className="font-semibold mb-2">Import License</div>
                   <div className="ml-2">{data.customs.importLicense || 'N/A'}</div>
                   <div className="font-semibold mb-2 mt-2">Export License</div>
                   <div className="ml-2">{data.customs.exportLicense || 'N/A'}</div>
                 </div>
                 <div className="text-xs text-gray-900 p-2">
                  <div className="font-semibold mb-2">Duty and Tax Information</div>
                  <div className="ml-2">{data.customs.dutyTaxInfo}</div>
                </div>
               </div>
             </div>

             {/* Special Handling */}
             <div className="border border-gray-900 border-t-0">
               <div className="border-b border-gray-900 p-2">
                 <div className="font-semibold text-xs" style={{ color: '#111827' }}>SPECIAL HANDLING REQUIREMENTS</div>
               </div>
               <div className="grid grid-cols-2 text-xs" style={{ color: '#111827' }}>
                 <div className="p-2">
                   <div className="font-semibold mb-2">Special Cargo Types</div>
                   <div className="ml-2">
                     <div>☐ Temperature Controlled: {data.temperatureControlled ? '☑' : '☐'} {data.temperatureRange && `(${data.temperatureRange})`}</div>
                     <div>☐ Hazardous Goods: {data.hazardousGoods ? '☑' : '☐'}</div>
                     <div>☐ Oversized Cargo: {data.oversizedCargo ? '☑' : '☐'}</div>
                     <div>☐ Heavy Lift: {data.heavyLift ? '☑' : '☐'}</div>
                     <div>☐ Perishable Goods: {data.perishableGoods ? '☑' : '☐'}</div>
                   </div>
                 </div>
                 <div className="p-2">
                   <div className="font-semibold mb-2">Special Instructions</div>
                   <div className="ml-2">
                     {data.hazardousDetails && <div className="mb-2"><strong>Hazardous Details:</strong> {data.hazardousDetails}</div>}
                     <div>{data.specialInstructions || 'N/A'}</div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Totals Section */}
             <div className="border border-gray-900 border-t-0">
               <div className="grid grid-cols-2 text-xs" style={{ color: '#111827' }}>
                 <div className="border-r border-gray-900 p-2">
                   <div className="font-semibold mb-2">Total This Page</div>
                   <div className="ml-2">{data.totalThisPage}</div>
                 </div>
                 <div className="p-2">
                   <div className="font-semibold mb-2">Consignment Total</div>
                   <div className="ml-2">{data.consignmentTotal}</div>
                 </div>
               </div>
             </div>

                         {/* Special Information Section */}
             <div className="border border-gray-900 border-t-0">
               <div className="grid grid-cols-12 text-xs" style={{ color: '#111827' }}>
                 <div className="col-span-5 border-r border-gray-900 p-2">
                   <div className="font-semibold mb-2">Does this shipment contain HAZARDOUS / DANGEROUS goods? If you answered YES, please also enclose your Letter of Credit notification</div>  
                 </div>
                 <div className="col-span-1 border-r border-gray-900 p-2">
                   <div className="ml-2">{data.dangerousGoods || ''}</div>
                 </div>
                 <div className="col-span-5 border-r border-gray-900 p-2">
                   <div className="font-semibold mb-2">Is this shipment on Letter of Credit? If you answered YES, please also enclose your Letter of Credit notification</div>
                 </div>
                 <div className="col-span-1 p-2">
                   <div className="ml-2">{data.creditInfo || ''}</div>
                 </div>
               </div>
             </div>

              {/* Special Instructions and Signature Section */}
               <div className="border border-gray-900 border-t-0">
                 <div className="grid grid-cols-2 text-xs" style={{ color: '#111827' }}>
                   {/* Left Column - Special Instructions */}
                   <div className="col-span-1 border-r border-gray-900 p-2">
                     <div className="font-semibold mb-2">Special Instructions</div>
                     <div className="ml-2">{data.specialInstructions || ''}</div>
                   </div>
                   
                   {/* Right Column - Signature Section */}
                   <div className="col-span-1">
                     <div className="flex flex-col h-full">
                       <div className="border-b border-gray-900 p-2">
                         <div className="font-semibold mb-2">Place and Date of Issue</div>
                         <div className="ml-2">{data.placeAndDateOfIssue}</div>
                       </div>
                       <div className="border-b border-gray-900 p-2">
                         <div className="font-semibold mb-2">Signatory Company</div>
                         <div className="ml-2">{data.signatoryCompany}</div>
                       </div>
                       <div className="border-b border-gray-900 p-2">
                         <div className="font-semibold mb-2">Name of Authorized Signatory</div>
                         <div className="ml-2">{data.nameOfAuthorizedSignatory}</div>
                       </div>
                       <div className="p-2 flex-1">
                         <div className="font-semibold mb-2">Signature</div>
                         <div className="ml-2 flex-1" style={{ minHeight: '100px' }}>{data.signature || ''}</div>
                       </div>
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

export default OceanSIFormat;

