import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AirwayBillData {
  // Header Information
  mawbNumber: string;
  hawbNumber: string;
  issuedBy: string;
  
  // Shipper Information
  shipper: {
    name: string;
    address: string;
    phone: string;
    email: string;
    account: string;
  };
  
  // Consignee Information
  consignee: {
    name: string;
    address: string;
    phone: string;
    email: string;
    account: string;
  };
  
  // Agent Information
  agent: {
    name: string;
    iataCode: string;
    accountNumber: string;
    accountingInfo: string;
  };
  
  // Routing Information
  airportDeparture: string;
  airportDestination: string;
  requestedRouting: string;
  referenceNumber: string;
  optionalShippingInfo: string;
  airportOfDeparture: string;
  airportOfDestination: string;
  firstCarrier: string;
  flightDate: string;
  carrierUseOnly: string;
  flightDate2: string;
  amountOfInsurance: string;
  handlingInformation: string;
  
  // Currency and Charges
  currency: string;
  chgsCode: string;
  declaredValueCarriage: string;
  declaredValueCustoms: string;
  amountInsurance: string;
  
  // Goods Information
  goods: Array<{
    pieces: string;
    grossWeight: string;
    weightUnit: string;
    rateClass: string;
    commodityItemNo: string;
    chargeableWeight: string;
    rateCharge: string;
    total: string;
    description: string;
    measurements: string;
  }>;
  
  // Charges Summary
  prepaid: {
    weightCharge: string;
    valuationCharge: string;
    tax: string;
    totalOtherChargesAgent: string;
    totalOtherChargesCarrier: string;
    totalPrepaid: string;
  };
  
  collect: {
    weightCharge: string;
    valuationCharge: string;
    tax: string;
    totalOtherChargesAgent: string;
    totalOtherChargesCarrier: string;
    totalCollect: string;
  };
  
  // Additional Information
  currencyConversionRates: string;
  ccChargesDestCurrency: string;
  chargesAtDestination: string;
  totalCollectCharges: string;
  
  // Execution Details
  executedDate: string;
  executedPlace: string;
  shipperSignature: string;
  carrierSignature: string;
}

interface AirwayBillFormatProps {
  data?: AirwayBillData;
  blType?: 'hawb' | 'mawb';
  onClose?: () => void;
}

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

const AirwayBillFormat: React.FC<AirwayBillFormatProps> = ({ data, blType = 'mawb', onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    try {
      const element = printRef.current;
      if (!element) {
        alert('Air Waybill content not found');
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
      pdf.save(`AWB-${airwayBillData.mawbNumber}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error generating PDF: ${errorMessage}`);
    }
  };

  // Component requires data to be passed from parent
  if (!data) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">No Data Available</h2>
          <p className="text-gray-600 mb-4">Airway bill data must be provided from the parent component.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const airwayBillData = data;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Air Waybill Preview</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={generatePDF}
              className="px-4 py-2 bg-[#007bff] text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Air Waybill Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(95vh-140px)]">
          <div ref={printRef} className="bg-white max-w-5xl mx-auto text-xs font-sans text-gray-900">
            
            {/* Main AWB Container */}
             <div className="border border-gray-900">
              
              {/* HAWB and MAWB Numbers - Top Section */}
              <div className="border-b border-gray-900 p-2 bg-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    {airwayBillData.hawbNumber && airwayBillData.mawbNumber ? (
                      // Show both for HAWB documents
                      <>
                        <div>
                          <div className="text-xs font-bold text-gray-700">HAWB Number:</div>
                          <div className="text-sm font-semibold text-gray-900">{airwayBillData.hawbNumber}</div>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-700">MAWB Number:</div>
                          <div className="text-sm font-semibold text-gray-900">{airwayBillData.mawbNumber}</div>
                        </div>
                      </>
                    ) : (
                      // Show only MAWB for MAWB-only documents
                      <div>
                        <div className="text-xs font-bold text-gray-700">MAWB Number:</div>
                        <div className="text-sm font-semibold text-gray-900">{airwayBillData.mawbNumber}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Header Section - Left and Right Split */}
              <div className="flex grid grid-cols-2">
                
                                 {/* Left Column */}
                 <div className="col-span-1 border-r border-gray-900">
                  
                                     {/* Shipper's Name and Address */}
                   <div className="border-b border-gray-900 p-1 h-30">
                    <div className="text-xs font-bold mb-1">Shipper's Name and Address</div>
                    <div className="text-xs leading-tight">
                      <div className="font-medium">{airwayBillData.shipper.name}</div>
                      <div>{airwayBillData.shipper.address}</div>
                    </div>
                  </div>

                                     {/* Consignee's Name and Address */}
                   <div className="border-b border-gray-900 p-1 h-30">
                    <div className="text-xs font-bold mb-1">Consignee's Name and Address</div>
                    <div className="text-xs leading-tight">
                      <div className="font-medium">{airwayBillData.consignee.name}</div>
                      <div>{airwayBillData.consignee.address}</div>
                    </div>
                  </div>

                                     {/* Issuing Carrier's Agent Name and City */}
                   <div className="border-b border-gray-900 p-1 h-30">
                    <div className="text-xs font-bold mb-1">Issuing Carrier's Agent Name and City</div>
                    <div className="text-xs">{airwayBillData.agent.name}</div>
                  </div>

                                     {/* Agent's IATA Code and Account No. */}
                   <div className="flex">
                     <div className="w-48 border-r border-gray-900 p-1">
                      <div className="text-xs font-bold">Agent's IATA Code</div>
                      <div className="text-xs">{airwayBillData.agent.iataCode}</div>
                    </div>
                    <div className="w-48 p-1 mb-2">
                      <div className="text-xs font-bold">Account No.</div>
                      <div className="text-xs">{airwayBillData.agent.accountNumber}</div>
                    </div>
                  </div>

                </div>

                {/* Right Column */}
                <div className="flex-1 col-span-1">
                  
                                     {/* Not Negotiable - Air Waybill Header */}
                   <div className="border-b border-gray-900 p-1 text-center">
                    <div className="text-sm font-bold">Not Negotiable</div>
                    <div className="text-lg font-bold my-1">
                      {blType === 'hawb' ? 'House Air Waybill' : 'Master Air Waybill'}
                    </div>
                    <div className="text-xs mb-1">Issued By: <span className="font-semibold">{airwayBillData.issuedBy}</span></div>
                  </div>

                                     {/* Copies Statement */}
                   <div className="border-b border-gray-900 p-2 text-center">
                    <div className="text-xs">
                      Copies 1, 2 and 3 of this Air Waybill are originals and have the same validity
                    </div>
                  </div>

                                     {/* Terms and Conditions */}
                   <div className="border-b border-gray-900 p-1 text-xs text-justify">
                    <div className="mb-2"> It is agreed that the goods described herein are accepted in apparent good order and condition (except as noted) for carriage SUBJECT TO THE CONDITIONS OF CONTRACT ON THE REVERSE HEREOF, ALL GOODS MAY BE CARRIED BY ANY OTHER MEANS INCLUDING ROAD OR ANY OTHER CARRIER UNLESS SPECIFIC CONTRARY INSTRUCTIONS ARE GIVEN HEREON BY THE SHIPPER, AND SHIPPER AGREES THAT THE SHIPMENT MAY BE CARRIED VIA INTERMEDIATE STOPPING PLACES WHICH THE CARRIER DEEMS APPROPRIATE THE SHIPPER'S ATTENTION IS DRAWN TO THE NOTICE CONCERNING CARRIER'S LIMITATION OF LIABILITY. Shipper may increase such limitation of liability by declaring a higher value for carriage and paying a supplemental charge if required.</div>
                  </div>

                                     {/* Accounting Information */}
                   <div className="p-1">
                    <div className="text-xs font-bold mb-1">Accounting Information:</div>
                    <div className="text-xs">{airwayBillData.agent.accountingInfo}</div>
                  </div>

                </div>
                {/* End Right Column */}
                
              </div>
              {/* End Header Section */}

                             {/* Airport of Departure and Reference Number Row */}
                 <div className="border-b border-gray-900 flex">
                   {/* Airport of Departure Section */}
                   <div className="border-t border-gray-900 w-1/2 border-r border-gray-900 p-1">
                    <div className="text-xs font-semibold">Airport of Departure (Addr. of First Carrier) and Requested Routing</div>
                    <div className="text-xs flex items-center">
                      {airwayBillData.airportOfDeparture}
                    </div>
                  </div>
                  {/* Reference Number and Optional Shipping */}
                  <div className="border-t border-gray-900 w-1/2 flex">
                      <div className="w-1/3 border-r border-gray-900 p-1">
                      <div className="text-xs font-semibold">Reference Number</div>
                      <div className="text-xs flex items-center">
                        {airwayBillData.referenceNumber}
                      </div>
                    </div>
                    <div className="w-2/3 p-1 mb-2">
                      <div className="text-xs font-semibold text-center">Optional Shipping Information</div>
                      <div className="text-xs flex items-center justify-center">
                        {airwayBillData.optionalShippingInfo}
                      </div>
                    </div>
                  </div>
                </div>

                                 {/* To/By/To/By and Currency/CHGS Row */}
                 <div className="border-b border-gray-900 flex h-20">
                   {/* Left side - To/By routing */}
                   <div className="w-1/2 border-r border-gray-900 flex">
                     <div className="w-1/12 border-r border-gray-900 p-1 text-center">
                      <div className="text-xs font-semibold">To</div>
                    </div>
                                         <div className="w-4/12 border-r border-gray-900 p-1">
                       <div className="text-xs font-semibold">By First Carrier</div>
                       <div className="text-xs">{airwayBillData.firstCarrier}</div>
                     </div>
                     <div className="w-1/12 border-r border-gray-900 p-1 text-center">
                       <div className="text-xs font-semibold">to</div>
                     </div>
                     <div className="w-2/12 border-r border-gray-900 p-1">
                       <div className="text-xs font-semibold">by</div>
                     </div>
                     <div className="w-1/12 border-r border-gray-900 p-1 text-center">
                       <div className="text-xs font-semibold">to</div>
                     </div>
                     <div className="w-3/12 p-1">
                       <div className="text-xs font-semibold">by</div>
                     </div>
                   </div>
                   {/* Right side - Currency and CHGS */}
                   <div className="w-1/2 flex">
                     <div className="w-1/6 border-r border-gray-900 p-1">
                      <div className="text-xs font-semibold">Currency</div>
                      <div className="text-xs">{airwayBillData.currency}</div>
                    </div>
                     <div className="w-1/6 border-r border-gray-900 p-1 text-center">
                       <div className="text-xs font-semibold">CHGS Code</div>
                       <div className="text-xs">{airwayBillData.chgsCode}</div>
                     </div>
                     <div className="w-1/6 border-r border-gray-900 p-1 text-center">
                       <div className="text-xs font-semibold">WT/VAL</div>
                       <div className="flex text-xs">
                         <div className="w-1/2 text-center border-r border-gray-900">PPD</div>
                         <div className="w-1/2 text-center">COLL</div>
                       </div>
                     </div>
                     <div className="w-1/6 border-r border-gray-900 p-1 text-center">
                       <div className="text-xs font-semibold">Other</div>
                       <div className="flex text-xs">
                         <div className="w-1/2 text-center border-r border-gray-900">PPD</div>
                         <div className="w-1/2 text-center">COLL</div>
                       </div>
                     </div>
                    <div className="w-1/3 p-1">
                      <div className="text-xs font-semibold">Declared Value for Carriage</div>
                      <div className="text-xs">{airwayBillData.declaredValueCarriage}</div>
                    </div>
                  </div>
                </div>

                    {/* Airport of Destination and Flight Info Row */}
                 <div className="border-b border-gray-900 flex grid grid-cols-6">
                   {/* Airport of Destination */}
                   <div className="col-span-1 border-r border-gray-900 p-1">
                    <div className="text-xs font-semibold">Airport of Destination</div>
                    <div className="text-xs h-12 flex items-center">
                      {airwayBillData.airportOfDestination}
                    </div>
                  </div>
                                     {/* Flight Date */}
                   <div className="col-span-1 border-r border-gray-900 p-1">
                     <div className="text-xs font-semibold">Flight Date</div>
                     <div className="text-xs h-12 flex items-center">
                       {airwayBillData.flightDate}
                     </div>
                   </div>
                   {/* For Carrier Use Only */}
                   <div className="col-span-1 border-r border-gray-900 p-1">
                     <div className="text-xs font-semibold">For Carrier Use Only</div>
                     <div className="text-xs h-12">
                       {airwayBillData.carrierUseOnly}
                     </div>
                   </div>
                   {/* Flight Date (second) */}
                   <div className="col-span-1 border-r border-gray-900 p-1">
                     <div className="text-xs font-semibold">Flight Date</div>
                     <div className="text-xs h-12 flex items-center">
                       {airwayBillData.flightDate2}
                     </div>
                   </div>
                   {/* Amount of Insurance */}
                   <div className="col-span-1 border-r border-gray-900 p-1">
                    <div className="text-xs font-semibold">Amount of Insurance (if carrier offers insurance)</div>
                    <div className="text-xs h-12 flex items-center">
                      {airwayBillData.amountOfInsurance}
                    </div>
                  </div>
                  {/* Declared Value for Customs */}
                  <div className="col-span-1 p-1">
                    <div className="text-xs font-semibold">Declared Value for Customs</div>
                    <div className="text-xs h-12 flex items-center">
                      {airwayBillData.declaredValueCustoms}
                    </div>
                  </div>
                </div>

                 {/* Handling Information Row */}
                 <div className="border-b border-gray-900">
                  <div className="p-1">
                    <div className="text-xs font-semibold mb-1">Handling Information (SCI)</div>
                    <div className="text-xs h-12">
                      {airwayBillData.handlingInformation}
                    </div>
                  </div>
                </div>

              {/* Goods Table Header */}
              <div className="grid grid-cols-22">
                <div className="col-span-2 border-r border-black">
                  <div className="text-xs font-bold w-20 p-1">No. of Pieces RCP</div>
                </div>
                <div className="border-r border-black p-1 col-span-2">
                    <div className="text-xs font-bold mb-2">Gross Weight</div>
                </div>
                <div className="border-r border-black p-1 text-center col-span-1">
                    <div className="text-xs font-bold mb-2">kg/lb</div>
                  </div>
                <div className="col-span-3 border-r border-black p-1">
                  <div className="text-xs font-bold mb-2">Rate Class & Commodity No.</div>
                </div>
                <div className="col-span-2 border-r border-black p-1">
                  <div className="text-xs font-bold mb-2">Chargeable Weight</div>
                </div>
                <div className="col-span-2 border-r border-black p-1">
                  <div className="text-xs font-bold mb-2">Rate / Charge</div>
                </div>
                <div className="col-span-3 border-r border-black p-1">
                  <div className="text-xs font-bold mb-2">Total</div>
                </div>
                <div className="col-span-5 p-1 w-80">
                  <div className="text-xs font-bold mb-2">Nature and Quantity of Goods (inc. Dimensions or Volume)</div>
                </div>
              </div>

              {/* Goods Data */}
              <div className="grid grid-cols-22 h-90 border-t border-black">
                <div className="col-span-2 p-1 border-r border-black">
                    {airwayBillData.goods.map((good, index) => (
                      <div key={index} className="text-xs mb-1">{good.pieces}</div>
                    ))}
                </div>
                <div className="border-r border-black p-1 col-span-2">
                    {airwayBillData.goods.map((good, index) => (
                      <div key={index} className="text-xs mb-1">{good.grossWeight}</div>
                    ))}
                </div>
                <div className="border-r border-black p-1 col-span-1">
                  {airwayBillData.goods.map((good, index) => (
                    <div key={index} className="text-xs mb-1">{good.weightUnit}</div>
                  ))}
                </div>
                <div className="col-span-3 border-r border-black p-1">
                  {airwayBillData.goods.map((good, index) => (
                    <div key={index} className="text-xs mb-1">({good.rateClass}) {good.commodityItemNo}</div>
                  ))}
                </div>
                <div className="col-span-2 border-r border-black p-1">
                  {airwayBillData.goods.map((good, index) => (
                    <div key={index} className="text-xs mb-1">{good.chargeableWeight}</div>
                  ))}
                </div>
                <div className="col-span-2 border-r border-black p-1">
                  {airwayBillData.goods.map((good, index) => (
                    <div key={index} className="text-xs mb-1">{good.rateCharge}</div>
                  ))}
                </div>
                <div className="col-span-3 border-r border-black p-1">
                  {airwayBillData.goods.map((good, index) => (
                    <div key={index} className="text-xs mb-1">{good.total}</div>
                  ))}
                </div>
                <div className="col-span-5 p-1">
                  {airwayBillData.goods.map((good, index) => (
                    <div key={index} className="text-xs mb-1">{good.description} {good.measurements && `(${good.measurements} cbm)`}</div>
                  ))}
                </div>
              </div>

              {/* Bottom Section - Charges and Certification */}
               <div className="flex grid grid-cols-13 border-t border-gray-900">
                 
                 {/* Left Column - Charges Table */}
                 <div className="col-span-5 border-r border-gray-900">
                   
                    {/* Charges Header Row */}
                    <div className="grid grid-cols-2 border-b border-gray-900 flex">
                      <div className="col-span-1 border-r border-gray-900 p-1 text-center">
                        <div className="text-xs font-semibold mb-2">Prepaid</div>
                      </div>
                      <div className="col-span-1 p-1 text-center">
                        <div className="text-xs font-semibold mb-2">Collect</div>
                      </div>
                    </div>

                    {/* Weight Charge Row */}
                    <div className="border-b border-gray-900 flex h-12">
                      <div className="w-1/2 border-r border-gray-900 p-1">
                        <div className="text-xs font-semibold">Weight Charge</div>
                        <div className="text-xs">{airwayBillData.prepaid.weightCharge}</div>
                      </div>
                      <div className="w-1/2 p-1">
                        <div className="text-xs font-semibold">Weight Charge</div>
                        <div className="text-xs">{airwayBillData.collect.weightCharge}</div>
                      </div>
                    </div>

                                       {/* Valuation Charge Row */}
                    <div className="border-b border-gray-900 flex h-12">
                      <div className="w-1/2 border-r border-gray-900 p-1">
                        <div className="text-xs font-semibold">Valuation Charge</div>
                        <div className="text-xs">{airwayBillData.prepaid.valuationCharge}</div>
                      </div>
                      <div className="w-1/2 p-1">
                        <div className="text-xs font-semibold">Valuation Charge</div>
                        <div className="text-xs">{airwayBillData.collect.valuationCharge}</div>
                      </div>
                    </div>

                                       {/* Tax Row */}
                    <div className="border-b border-gray-900 flex h-12">
                      <div className="w-1/2 border-r border-gray-900 p-1">
                        <div className="text-xs font-semibold">Tax</div>
                        <div className="text-xs">{airwayBillData.prepaid.tax}</div>
                      </div>
                      <div className="w-1/2 p-1">
                        <div className="text-xs font-semibold">Tax</div>
                        <div className="text-xs">{airwayBillData.collect.tax}</div>
                      </div>
                    </div>

                                         {/* Total Other Charges Due Agent Row */}
                     <div className="border-b border-gray-900 flex h-12">
                       <div className="w-1/2 border-r border-gray-900 p-1">
                         <div className="text-xs font-semibold">Total Other Charges Due Agent</div>
                         <div className="text-xs">{airwayBillData.prepaid.totalOtherChargesAgent}</div>
                       </div>
                       <div className="w-1/2 p-1">
                         <div className="text-xs font-semibold">Total Other Charges Due Agent</div>
                         <div className="text-xs">{airwayBillData.collect.totalOtherChargesAgent}</div>
                       </div>
                     </div>

                                         {/* Total Other Charges Due Carrier Row */}
                     <div className="border-b-4 border-gray-900 flex h-12">
                       <div className="w-1/2 border-r border-gray-900 p-1">
                         <div className="text-xs font-semibold">Total Other Charges Due Carrier</div>
                         <div className="text-xs">{airwayBillData.prepaid.totalOtherChargesCarrier}</div>
                       </div>
                       <div className="w-1/2 p-1">
                         <div className="text-xs font-semibold">Total Other Charges Due Carrier</div>
                         <div className="text-xs">{airwayBillData.collect.totalOtherChargesCarrier}</div>
                       </div>
                     </div>

                    {/* Total Prepaid/Collect Row */}
                     <div className="border-b border-gray-900 flex h-21">
                       <div className="w-1/2 border-r border-gray-900 p-1">
                         <div className="text-xs font-semibold">Total Prepaid</div>
                         <div className="text-xs font-semibold">{airwayBillData.prepaid.totalPrepaid}</div>
                       </div>
                       <div className="w-1/2 p-1">
                         <div className="text-xs font-semibold">Total Collect</div>
                         <div className="text-xs font-semibold">{airwayBillData.collect.totalCollect}</div>
                       </div>
                     </div>

                    {/* Currency Conversion Rates Row */}
                     <div className="border-b-4 border-gray-900 flex h-20">
                       <div className="w-1/2 border-r border-gray-900 p-1">
                         <div className="text-xs font-semibold">Currency Conversion Rates</div>
                         <div className="text-xs">{airwayBillData.currencyConversionRates}</div>
                       </div>
                       <div className="w-1/2 p-1">
                         <div className="text-xs font-semibold">CC Charges in Dest. Currency</div>
                         <div className="text-xs">{airwayBillData.ccChargesDestCurrency}</div>
                       </div>
                     </div>

                      {/* For Carrier's Use and Charges at Destination Row */}
                     <div className="flex h-21">
                       <div className="w-1/2 border-r border-gray-900 p-1">
                         <div className="text-xs font-semibold">For Carrier's Use only at Destination</div>
                         <div className="text-xs"></div>
                       </div>
                       <div className="w-1/2 p-1">
                         <div className="text-xs font-semibold">Charges at Destination</div>
                         <div className="text-xs">{airwayBillData.chargesAtDestination}</div>
                       </div>
                     </div>

                  </div>

                    {/* Right Column - Certification and Signatures */}
                   <div className="col-span-8">
                     
                      {/* Other Charges */}
                      <div className="border-b border-gray-900 p-2 h-30">
                       <div className="text-xs font-semibold">Other Charges</div>
                     </div>

                     {/* Shipper Certification */}
                     <div className="p-2 text-xs leading-tight mb-15">
                       <div>
                         Shipper certifies that the particulars on the face hereof are correct and that insofar as any part of the consignment contains dangerous goods, such part is properly described by name and is in proper condition for carriage by air according to the applicable Dangerous Goods Regulations.
                       </div>
                     </div>

                      {/* Shipper Signature */}
                      <div className="border-b border-gray-900 p-2 items-center text-center">
                       <div className="text-xs">____________________________________________________________________________________________</div>
                       <div className="text-xs">Signature of Shipper or his Agent</div>
                     </div>

                     {/* Execution Details Row */}
                     <div>
                       <div className="flex justify-center grid grid-cols-3 -mb-4 mt-21">
                          <div className="col-span-1 p-1">
                            <div className="text-xs">{airwayBillData.executedDate}</div>
                          </div>  
                          <div className="col-span-1 p-1">
                            <div className="text-xs">{airwayBillData.executedPlace}</div>
                          </div>  
                          <div className="col-span-1 p-1">
                            <div className="text-xs">{airwayBillData.shipperSignature}</div>
                          </div>  
                       </div>                     
                          <div className="p-2 text-center">____________________________________________________________________________________________</div>
                       </div>
                     
                                           {/* Execution Details */}
                      <div className="grid grid-cols-5 border-b-4 border-gray-900 flex -mt-2">
                       <div className="col-span-1 p-1 mb-1">
                         <div className="text-xs">Executed on (date)</div>
                       </div>
                       <div className="flex justify-center col-span-2 p-1">
                         <div className="text-xs mb-1">At place</div>
                       </div>
                       <div className="flex justify-end col-span-2 p-1">
                         <div className="text-xs mb-1">Signature of Issuing Carrier or its Agent</div>
                       </div>
                     </div>
                     

                     {/* Total Collect Charges */}
                     <div className="p-2">
                       <div className="text-xs font-semibold">Total Collect Charges</div>
                       <div className="text-xs">{airwayBillData.totalCollectCharges}</div>
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

export default AirwayBillFormat;