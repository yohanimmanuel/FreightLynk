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
    rateClass: string;
    chargeableWeight: string;
    rateCharge: string;
    total: string;
    description: string;
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
  onClose?: () => void;
}

function replaceUnsupportedColors(root: HTMLElement) {
  const elements = root.querySelectorAll('*');
  elements.forEach((element) => {
    const style = window.getComputedStyle(element);
    if (style.backgroundColor === 'rgb(249, 250, 251)') {
      (element as HTMLElement).style.backgroundColor = '#ffffff';
    }
  });
}

const AirwayBillFormat: React.FC<AirwayBillFormatProps> = ({ data, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!printRef.current) return;

    const element = printRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('airway-bill.pdf');
  };

  // Default data if none provided
  const defaultData: AirwayBillData = {
    mawbNumber: '123-12345678',
    hawbNumber: 'HAWB-2024-001',
    issuedBy: 'FreightLynk Airlines',
    shipper: {
      name: 'ABC Manufacturing Co.',
      address: '123 Industrial Park, Ho Chi Minh City, Vietnam',
      phone: '+84 28 1234 5678',
      email: 'shipper@abc.com',
      account: 'ACC001'
    },
    consignee: {
      name: 'XYZ Importers LLC',
      address: '456 Business District, Houston, TX 77001, USA',
      phone: '+1 713 987 6543',
      email: 'consignee@xyz.com',
      account: 'ACC002'
    },
    agent: {
      name: 'FreightLynk Agent',
      iataCode: 'FLK001',
      accountNumber: 'AG001',
      accountingInfo: 'FREIGHT PREPAID'
    },
    airportDeparture: 'TAN SON NHAT INTERNATIONAL AIRPORT (SGN)',
    airportDestination: 'GEORGE BUSH INTERCONTINENTAL AIRPORT (IAH)',
    requestedRouting: 'SGN-IAH',
    referenceNumber: 'REF-2024-001',
    optionalShippingInfo: 'HANDLE WITH CARE',
    currency: 'USD',
    chgsCode: 'PPD',
    declaredValueCarriage: '50,000.00',
    declaredValueCustoms: '50,000.00',
    amountInsurance: '50,000.00',
    goods: [
      {
        pieces: '100',
        grossWeight: '500.0',
        rateClass: 'G',
        chargeableWeight: '500.0',
        rateCharge: '5.50',
        total: '2,750.00',
        description: 'ELECTRONICS AND MACHINERY'
      }
    ],
    prepaid: {
      weightCharge: '2,750.00',
      valuationCharge: '0.00',
      tax: '275.00',
      totalOtherChargesAgent: '150.00',
      totalOtherChargesCarrier: '100.00',
      totalPrepaid: '3,275.00'
    },
    collect: {
      weightCharge: '0.00',
      valuationCharge: '0.00',
      tax: '0.00',
      totalOtherChargesAgent: '0.00',
      totalOtherChargesCarrier: '0.00',
      totalCollect: '0.00'
    },
    currencyConversionRates: '1.00',
    ccChargesDestCurrency: '0.00',
    chargesAtDestination: '0.00',
    totalCollectCharges: '0.00',
    executedDate: '2024-05-12',
    executedPlace: 'Ho Chi Minh City',
    shipperSignature: 'ABC Manufacturing Co.',
    carrierSignature: 'FreightLynk Airlines'
  };

  const airwayBillData = data || defaultData;

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
            <div className="border border-gray-400">
              
              {/* Header Section - Left and Right Split */}
              <div className="flex">
                
                {/* Left Column */}
                <div className="w-96 border-r border-gray-400">
                  
                  {/* Shipper's Name and Address */}
                  <div className="border-b border-gray-400 p-1 h-28">
                    <div className="text-xs font-bold mb-1">Shipper's Name and Address</div>
                    <div className="text-xs leading-tight">
                      <div className="font-medium">{airwayBillData.shipper.name}</div>
                      <div>{airwayBillData.shipper.address}</div>
                    </div>
                  </div>

                  {/* Consignee's Name and Address */}
                  <div className="border-b border-gray-400 p-1 h-28">
                    <div className="text-xs font-bold mb-1">Consignee's Name and Address</div>
                    <div className="text-xs leading-tight">
                      <div className="font-medium">{airwayBillData.consignee.name}</div>
                      <div>{airwayBillData.consignee.address}</div>
                    </div>
                  </div>

                  {/* Issuing Carrier's Agent Name and City */}
                  <div className="border-b border-gray-400 p-1 h-28">
                    <div className="text-xs font-bold mb-1">Issuing Carrier's Agent Name and City</div>
                    <div className="text-xs">{airwayBillData.agent.name}</div>
                  </div>

                  {/* Agent's IATA Code and Account No. */}
                  <div className="border-b border-gray-400 flex h-10">
                    <div className="w-48 border-r border-gray-400 p-1">
                      <div className="text-xs font-bold mb-1">Agent's IATA Code</div>
                      <div className="text-xs">{airwayBillData.agent.iataCode}</div>
                    </div>
                    <div className="w-48 p-1">
                      <div className="text-xs font-bold mb-1">Account No.</div>
                      <div className="text-xs">{airwayBillData.agent.accountNumber}</div>
                    </div>
                  </div>

                  {/* Airport of Departure */}
                  <div className="border-b border-gray-400 p-1 h-10">
                    <div className="text-xs font-bold mb-1">Airport of Departure (Addr. of First Carrier) and Requested Routing</div>
                    <div className="text-xs">{airwayBillData.airportDeparture}</div>
                  </div>

                  {/* Routing Row - To, By First Carrier, to, by, to, by */}
                  <div className="border-b border-gray-400 flex h-10">
                    <div className="w-8 border-r border-gray-400 p-1">
                      <div className="text-xs font-bold">To</div>
                    </div>
                    <div className="w-48 border-r border-gray-400 p-1">
                      <div className="text-xs font-bold">By First Carrier</div>
                    </div>
                    <div className="w-8 border-r border-gray-400 p-1">
                      <div className="text-xs font-bold">to</div>
                    </div>
                    <div className="w-7 border-r border-gray-400 p-1">
                      <div className="text-xs font-bold">by</div>
                    </div>
                    <div className="w-8 border-r border-gray-400 p-1">
                      <div className="text-xs font-bold">to</div>
                    </div>
                    <div className="w-7 p-1">
                      <div className="text-xs font-bold">by</div>
                    </div>
                  </div>

                  {/* Airport of Destination and Flight Date */}
                  <div className="border-b border-gray-400 flex h-10">
                    <div className="w-48 border-r border-gray-400 p-1">
                      <div className="text-xs font-bold mb-1">Airport of Destination</div>
                      <div className="text-xs">{airwayBillData.airportDestination}</div>
                    </div>
                    <div className="w-24 border-r border-gray-400 p-1 relative">
                      <div className="text-xs font-bold mb-1">Flight Date</div>
                      <div className="absolute top-6 left-14 right-0 text-center text-xs bg-white border border-gray-400 px-1">For Carrier Use Only</div>
                    </div>
                    <div className="w-24 p-1 text-right">
                      <div className="text-xs font-bold mb-1">Flight Date</div>
                    </div>
                  </div>

                </div>

                {/* Right Column */}
                <div className="flex-1">
                  
                  {/* Not Negotiable - Air Waybill Header */}
                  <div className="border-b border-gray-400 p-1 h-20 text-center">
                    <div className="text-sm font-bold">Not Negotiable</div>
                    <div className="text-lg font-bold my-1">Air Waybill</div>
                    <div className="text-xs mb-1">Issued By: <span className="font-semibold">{airwayBillData.issuedBy}</span></div>
                  </div>

                  {/* Copies Statement */}
                  <div className="border-b border-gray-400 p-1 h-8 text-center">
                    <div className="text-xs leading-8">
                      Copies 1, 2 and 3 of this Air Waybill are originals and have the same validity
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="border-b border-gray-400 p-1 h-28 text-xs leading-3 text-justify">
                    It is agreed that the goods described herein are accepted in apparent good order and condition (except as noted) for carriage SUBJECT TO THE CONDITIONS OF CONTRACT ON THE REVERSE HEREOF, ALL GOODS MAY BE CARRIED BY ANY OTHER MEANS INCLUDING ROAD OR ANY OTHER CARRIER UNLESS SPECIFIC CONTRARY INSTRUCTIONS ARE GIVEN HEREON BY THE SHIPPER, AND SHIPPER AGREES THAT THE SHIPMENT MAY BE CARRIED VIA INTERMEDIATE STOPPING PLACES WHICH THE CARRIER DEEMS APPROPRIATE THE SHIPPER'S ATTENTION IS DRAWN TO THE NOTICE CONCERNING CARRIER'S LIMITATION OF LIABILITY. Shipper may increase such limitation of liability by declaring a higher value for carriage and paying a supplemental charge if required.
                  </div>

                  {/* Accounting Information */}
                  <div className="border-b border-gray-400 p-1 h-38">
                    <div className="text-xs font-bold mb-1">Accounting Information:</div>
                    <div className="text-xs">{airwayBillData.agent.accountingInfo}</div>
                  </div>

                  {/* Reference Number and Optional Shipping */}
                  <div className="border-b border-black grid grid-cols-3 h-8">
                    <div className="border-r border-black p-2 relative">
                      <div className="text-xs font-bold mb-1">Reference Number</div>
                      <div className="absolute top-3 left-24 right-0 text-center text-xs bg-white">Optional Shipping Information</div>
                      <div className="border border-black p-1 text-xs h-4">
                        {airwayBillData.referenceNumber}
                      </div>
                    </div>
                    <div className="border-r border-black p-2">
                      <div className="border border-black p-1 text-xs h-4 mt-3">
                        {airwayBillData.optionalShippingInfo}
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="border border-black p-1 text-xs h-4 mt-3"></div>
                    </div>
                  </div>

                  {/* Currency and Charges Row */}
                  <div className="border-b border-black grid grid-cols-12 h-9">
                    <div className="border-r border-black p-1 col-span-2">
                      <div className="text-xs font-bold">Currency</div>
                      <div className="border border-black p-1 text-xs h-4">
                        {airwayBillData.currency}
                      </div>
                    </div>
                    <div className="border-r border-black p-1 col-span-1">
                      <div className="text-xs font-bold text-center">CHGS Code</div>
                      <div className="border border-black p-1 text-xs h-4 text-center">
                        {airwayBillData.chgsCode}
                      </div>
                    </div>
                    <div className="border-r border-black col-span-2">
                      <div className="border-b border-black text-center p-1">
                        <div className="text-xs font-bold">WT/VAL</div>
                      </div>
                      <div className="grid grid-cols-2 h-6">
                        <div className="border-r border-black text-center">
                          <div className="text-xs font-bold">PPD</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-bold">COLL</div>
                        </div>
                      </div>
                    </div>
                    <div className="border-r border-black col-span-2">
                      <div className="border-b border-black text-center p-1">
                        <div className="text-xs font-bold">Other</div>
                      </div>
                      <div className="grid grid-cols-2 h-6">
                        <div className="border-r border-black text-center">
                          <div className="text-xs font-bold">PPD</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-bold">COLL</div>
                        </div>
                      </div>
                    </div>
                    <div className="border-r border-black p-1 col-span-2">
                      <div className="text-xs font-bold">Declared Value for Carriage</div>
                      <div className="border border-black p-1 text-xs h-4 mt-1">
                        {airwayBillData.declaredValueCarriage}
                      </div>
                    </div>
                    <div className="p-1 col-span-2">
                      <div className="text-xs font-bold">Declared Value for Customs</div>
                      <div className="border border-black p-1 text-xs h-4 mt-1">
                        {airwayBillData.declaredValueCustoms}
                      </div>
                    </div>
                  </div>

                  {/* Amount of Insurance */}
                  <div className="border-b border-black grid grid-cols-4 h-8">
                    <div className="border-r border-black p-2">
                      <div className="text-xs font-bold text-center">Amount of Insurance</div>
                      <div className="border border-black p-1 text-xs h-4 mt-1">
                        {airwayBillData.amountInsurance}
                      </div>
                    </div>
                    <div className="p-2 col-span-3 text-xs leading-tight text-justify">
                      INSURANCE - If carrier offers insurance, and such insurance is requested in accordance with the conditions thereof, indicate amount to be insured in figures in box marked "Amount of Insurance."
                    </div>
                  </div>

                </div>
              </div>

              {/* Handling Information */}
              <div className="border-b border-black p-2 h-12 relative">
                <div className="text-xs font-bold">Handling Information</div>
                <div className="absolute top-6 right-4 border border-black p-2 bg-white">
                  <div className="text-xs font-bold">SCI</div>
                </div>
              </div>

              {/* Goods Table Header */}
              <div className="grid grid-cols-12 border-b border-black">
                <div className="col-span-2 grid grid-cols-3 border-r border-black">
                  <div className="border-r border-black p-1 col-span-1">
                    <div className="text-xs font-bold">No. of Pieces RCP</div>
                  </div>
                  <div className="border-r border-black p-1 col-span-2">
                    <div className="text-xs font-bold">Gross Weight</div>
                  </div>
                  <div className="border-r border-black p-1 text-center">
                    <div className="text-xs font-bold">kg<br/>lb</div>
                  </div>
                </div>
                <div className="col-span-1 border-r border-black p-1">
                  <div className="text-xs font-bold">Rate Class</div>
                  <div className="border-t border-black mt-2 text-xs font-bold">Commodity Item No.</div>
                </div>
                <div className="col-span-1 border-r border-black p-1">
                  <div className="text-xs font-bold">Chargeable Weight</div>
                </div>
                <div className="col-span-1 border-r border-black p-1">
                  <div className="text-xs font-bold">Rate / Charge</div>
                </div>
                <div className="col-span-1 border-r border-black p-1">
                  <div className="text-xs font-bold">Total</div>
                </div>
                <div className="col-span-6 p-1">
                  <div className="text-xs font-bold">Nature and Quantity of Goods (inc. Dimensions or Volume)</div>
                </div>
              </div>

              {/* Goods Data */}
              <div className="grid grid-cols-12 h-48">
                <div className="col-span-2 grid grid-cols-3 border-r border-black">
                  <div className="border-r border-black p-1">
                    {airwayBillData.goods.map((good, index) => (
                      <div key={index} className="text-xs mb-1">{good.pieces}</div>
                    ))}
                  </div>
                  <div className="border-r border-black p-1 col-span-2">
                    {airwayBillData.goods.map((good, index) => (
                      <div key={index} className="text-xs mb-1">{good.grossWeight}</div>
                    ))}
                  </div>
                  <div className="border-r border-black"></div>
                </div>
                <div className="col-span-1 border-r border-black p-1">
                  {airwayBillData.goods.map((good, index) => (
                    <div key={index} className="text-xs mb-1">{good.rateClass}</div>
                  ))}
                </div>
                <div className="col-span-1 border-r border-black p-1">
                  {airwayBillData.goods.map((good, index) => (
                    <div key={index} className="text-xs mb-1">{good.chargeableWeight}</div>
                  ))}
                </div>
                <div className="col-span-1 border-r border-black p-1">
                  {airwayBillData.goods.map((good, index) => (
                    <div key={index} className="text-xs mb-1">{good.rateCharge}</div>
                  ))}
                </div>
                <div className="col-span-1 border-r border-black p-1">
                  {airwayBillData.goods.map((good, index) => (
                    <div key={index} className="text-xs mb-1">{good.total}</div>
                  ))}
                </div>
                <div className="col-span-6 p-1">
                  {airwayBillData.goods.map((good, index) => (
                    <div key={index} className="text-xs mb-1">{good.description}</div>
                  ))}
                </div>
              </div>

              {/* Bottom Section with Charges */}
              <div className="grid grid-cols-5">
                
                {/* Charges Table */}
                <div className="col-span-2 border-r border-black">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 text-xs font-bold">Prepaid</td>
                        <td className="border-r border-black p-1 text-xs font-bold w-24">Weight Charge</td>
                        <td className="p-1 text-xs font-bold">Collect</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 text-xs h-5">{airwayBillData.prepaid.weightCharge}</td>
                        <td className="border-r border-black p-1 text-xs h-5"></td>
                        <td className="p-1 text-xs h-5">{airwayBillData.collect.weightCharge}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 text-xs"></td>
                        <td className="border-r border-black p-1 text-xs font-bold">Valuation Charge</td>
                        <td className="p-1 text-xs"></td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 text-xs h-5">{airwayBillData.prepaid.valuationCharge}</td>
                        <td className="border-r border-black p-1 text-xs h-5"></td>
                        <td className="p-1 text-xs h-5">{airwayBillData.collect.valuationCharge}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 text-xs"></td>
                        <td className="border-r border-black p-1 text-xs font-bold">Tax</td>
                        <td className="p-1 text-xs"></td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 text-xs h-5">{airwayBillData.prepaid.tax}</td>
                        <td className="border-r border-black p-1 text-xs h-5"></td>
                        <td className="p-1 text-xs h-5">{airwayBillData.collect.tax}</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black p-1 text-xs font-bold">Total Prepaid</td>
                        <td className="border-r border-black p-1 text-xs"></td>
                        <td className="p-1 text-xs font-bold">Total Collect</td>
                      </tr>
                      <tr>
                        <td className="border-r border-black p-1 text-xs font-bold h-5">{airwayBillData.prepaid.totalPrepaid}</td>
                        <td className="border-r border-black p-1 text-xs h-5"></td>
                        <td className="p-1 text-xs font-bold h-5">{airwayBillData.collect.totalCollect}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Right Section - Other Charges and Signatures */}
                <div className="col-span-3">
                  
                  {/* Other Charges */}
                  <div className="border-b border-black border-l border-black p-2 h-20">
                    <div className="text-xs font-bold">Other Charges</div>
                  </div>

                  {/* Shipper Declaration */}
                  <div className="border-b border-dashed border-l border-black p-2 h-20 text-xs leading-tight">
                    <div>
                      Shipper certifies that the particulars on the face hereof are correct and that insofar as any part of the consignment contains dangerous goods, such part is properly described by name and is in proper condition for carriage by air according to the applicable Dangerous Goods Regulations.
                    </div>
                  </div>

                  {/* Signature Section */}
                  <div className="border-b border-black border-l border-black p-2 h-3 text-center">
                    <div className="text-xs">Signature of Shipper or his Agent</div>
                  </div>

                  {/* Shipper Signature Box */}
                  <div className="border-b border-dashed border-l border-black p-2 h-10">
                    <div className="text-xs">{airwayBillData.shipperSignature}</div>
                  </div>

                  {/* Execution Details Header */}
                  <div className="border-b border-black border-l border-black p-2 h-3 grid grid-cols-3 text-center">
                    <div className="text-xs">Executed on (date)</div>
                    <div className="text-xs">at (place)</div>
                    <div className="text-xs">Signature of Issuing Carrier or its Agent</div>
                  </div>

                  {/* Execution Details Values */}
                  <div className="grid grid-cols-3 border-l border-black">
                    <div className="border-r border-black border-b border-black p-2 h-8">
                      <div className="text-xs">{airwayBillData.executedDate}</div>
                    </div>
                    <div className="border-r border-black border-b border-black p-2 h-8">
                      <div className="text-xs">{airwayBillData.executedPlace}</div>
                    </div>
                    <div className="border-b border-black p-2 h-8">
                      <div className="text-xs">{airwayBillData.carrierSignature}</div>
                    </div>
                  </div>

                  {/* Total Collect Charges */}
                  <div className="w-1/3 border-l border-black">
                    <div className="border-t-2 border-black border-r border-black p-2 h-3 text-center">
                      <div className="text-xs font-bold">Total Collect Charges</div>
                    </div>
                    <div className="border-r border-black border-b border-black p-2 h-5">
                      <div className="text-xs">{airwayBillData.totalCollectCharges}</div>
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

export default AirwayBillFormat;