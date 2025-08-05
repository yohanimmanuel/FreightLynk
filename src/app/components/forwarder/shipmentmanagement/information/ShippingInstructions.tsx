'use client';

import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Edit, 
  FileText
} from 'lucide-react';

interface ShippingInstructionsProps {
  shipmentId?: string;
}

const ShippingInstructions: React.FC<ShippingInstructionsProps> = ({ shipmentId }) => {
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - replace with actual data from API
  const shipmentData = {
    hblNumber: 'FL-2024-001234',
    mblNumber: 'MAEU123456789',
    bookingNumber: 'BKEXFR2303003',
    blNumber: 'HBLEX230300023',
    portOfLoading: 'HO CHI MINH CITY, VN (VNSGN)',
    portOfDischarge: 'HOUSTON, TX, US (USHOU)',
    placeOfReceipt: 'HO CHI MINH CITY, VN (VNSGN)',
    placeOfDelivery: 'HOUSTON, TX, US (USHOU)',
    finalDestination: 'HOUSTON, TX, US (USHOU)',
    etd: '2024-05-12T07:00:00',
    eta: '2024-06-22T00:00:00',
    shippedOnBoardDate: '2024-05-12T07:00:00',
    dateOfIssue: '2024-05-12T10:00:00',
    placeOfIssue: 'HO CHI MINH CITY, VN (VNSGN)',
    shipper: {
      name: 'ABC Manufacturing Co.',
      address: '123 Industrial Park, Ho Chi Minh City, Vietnam',
      contact: '+84 28 1234 5678'
    },
    consignee: {
      name: 'XYZ Importers LLC',
      address: '456 Business District, Houston, TX 77001, USA',
      contact: '+1 713 987 6543'
    },
    notifyParty: {
      name: 'XYZ Importers LLC',
      address: '456 Business District, Houston, TX 77001, USA',
      contact: '+1 713 987 6543'
    },
    vessel: {
      name: 'MAERSK SEALAND',
      voyageNumber: 'MV-2024-001',
      feederVessel: 'FEEDER VESSEL 001',
      feederVoyage: 'FV-001'
    },
    containers: [
      {
        number: 'ABCD1234567',
        type: '40HC',
        sealNumber: 'SEAL001',
        grossWeight: '25,000',
        measurement: '67.5',
        packages: '500',
        packageType: 'CTNS',
        tare: '3,800',
        vgm: '28,800',
        marks: 'FCL/FCL-CY/CY',
        description: 'GENERAL CARGO'
      }
    ],
    freightCharges: {
      totalFreight: '2,500.00',
      currency: 'USD',
      paymentTerms: 'FREIGHT PREPAID',
      payableAt: 'HO CHI MINH CITY, VN (VNSGN)',
      prepaidAt: 'HO CHI MINH CITY, VN (VNSGN)',
      totalPrepaid: '2,500.00 USD'
    },
    blDetails: {
      numberOfOriginals: 'THREE/3',
      blPlaceOfIssue: 'HO CHI MINH CITY, VN (VNSGN)',
      directMbl: 'Yes',
      signatureBy: 'FreightLynk'
    },
    cargo: {
      commodity: 'Electronics and Machinery',
      description: 'GENERAL CARGO',
      serviceMode: 'FCL',
      freightTerms: 'FREIGHT PREPAID',
      shippingMarks: 'FCL/FCL-CY/CY',
      clause: 'SHIPPER\'S LOAD, COUNT, STOW & SEAL'
    },
    totalCargo: {
      totalPackages: '1,000 CTNS',
      totalGrossWeight: '20,000 KGS',
      totalMeasurement: '24 CBM',
      totalContainers: 'ONE CONTAINER(S) ONLY'
    }
  };

  const handleDownloadBL = () => {
    // Implement BL download logic
    console.log('Downloading BL...');
  };

  const handleDownloadSI = () => {
    // Implement Shipping Instructions download logic
    console.log('Downloading Shipping Instructions...');
  };

  const handleCopyData = () => {
    // Implement copy data logic
    console.log('Copying shipment data...');
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleCopyData}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Copy className="w-4 h-4" />
          <span className="text-sm font-medium">Copy Data</span>
        </button>
        <button
          onClick={handleDownloadSI}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Download SI</span>
        </button>
        <button
          onClick={handleDownloadBL}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">Download BL</span>
        </button>
        <button
          onClick={handleEdit}
          className="flex items-center gap-2 px-4 py-2 bg-[#007bff] text-white hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" />
          <span className="text-sm font-medium">Edit</span>
        </button>
      </div>

      {/* First Row - General Information and Parties Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 {/* General Information */}
         <div className="bg-white border border-gray-200 rounded-lg p-4">
           <h3 className="text-md font-semibold text-gray-900 mb-4">General Information</h3>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Left Column */}
             <div className="space-y-3 text-xs">
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">HBL Number:</span>
                 <span className="font-mono text-gray-900">{shipmentData.hblNumber}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">MBL Number:</span>
                 <span className="font-mono text-gray-900">{shipmentData.mblNumber}</span>
               </div>
                               <div className="flex items-center justify-between">
                  <span className="text-gray-500">Booking Number:</span>
                  <span className="font-mono text-gray-900">{shipmentData.bookingNumber}</span>
                </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">Port of Loading:</span>
                 <span className="text-gray-900">{shipmentData.portOfLoading}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">Port of Discharge:</span>
                 <span className="text-gray-900">{shipmentData.portOfDischarge}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">ETD:</span>
                 <span className="text-gray-900">{new Date(shipmentData.etd).toLocaleDateString()}</span>
               </div>
             </div>
             
             {/* Right Column */}
             <div className="space-y-3 text-xs">
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">Place of Receipt:</span>
                 <span className="text-gray-900">{shipmentData.placeOfReceipt}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">Place of Delivery:</span>
                 <span className="text-gray-900">{shipmentData.placeOfDelivery}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">Final Destination:</span>
                 <span className="text-gray-900">{shipmentData.finalDestination}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">Shipped on Board:</span>
                 <span className="text-gray-900">{new Date(shipmentData.shippedOnBoardDate).toLocaleDateString()}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">Date of Issue:</span>
                 <span className="text-gray-900">{new Date(shipmentData.dateOfIssue).toLocaleDateString()}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">ETA:</span>
                 <span className="text-gray-900">{new Date(shipmentData.eta).toLocaleDateString()}</span>
               </div>
             </div>
           </div>
         </div>

                 {/* Parties Information */}
         <div className="bg-white border border-gray-200 rounded-lg p-4">
           <h3 className="text-md font-semibold text-gray-900 mb-4">Parties Information</h3>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Left Column */}
             <div className="space-y-4 text-xs">
               <div>
                 <span className="text-gray-500 block mb-1">Shipper:</span>
                 <div className="text-gray-900">
                   <div>{shipmentData.shipper.name}</div>
                   <div>{shipmentData.shipper.address}</div>
                   <div>{shipmentData.shipper.contact}</div>
                 </div>
               </div>
               <div>
                 <span className="text-gray-500 block mb-1">Consignee:</span>
                 <div className="text-gray-900">
                   <div>{shipmentData.consignee.name}</div>
                   <div>{shipmentData.consignee.address}</div>
                   <div>{shipmentData.consignee.contact}</div>
                 </div>
               </div>
             </div>
             
             {/* Right Column */}
             <div className="space-y-4 text-xs">
               <div>
                 <span className="text-gray-500 block mb-1">Notify Party:</span>
                 <div className="text-gray-900">
                   <div>{shipmentData.notifyParty.name}</div>
                   <div>{shipmentData.notifyParty.address}</div>
                   <div>{shipmentData.notifyParty.contact}</div>
                 </div>
               </div>
             </div>
           </div>
         </div>
      </div>

      {/* Second Row - Container Details Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Container Details</h3>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Container No.</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seal No.</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Weight</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Measurement (CBM)</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tare</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No of Pkgs</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VGM</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipmentData.containers.map((container, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{container.type}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs font-mono text-gray-900">{container.number}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{container.sealNumber}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{container.grossWeight} KGS</td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{container.measurement}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{container.tare} KGS</td>
                   <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{container.packageType}</td>
                   <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{container.packages}</td>
                   <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-900">{container.vgm} KGS</td>
                   <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">{container.marks}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900">Method 1</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Third Row - Freight & Charges and Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 {/* Shipping Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Shipping Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                 {/* Left Column */}
                 <div className="space-y-3 text-xs">
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Pre-Carriage By:</span>
                     <span className="text-gray-900">-</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Vessel Name:</span>
                     <span className="text-gray-900">{shipmentData.vessel.name}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">B/L Place of Issue:</span>
                     <span className="text-gray-900">{shipmentData.placeOfIssue}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-gray-500">CFS Terminal:</span>
                      <span className="text-gray-900">-</span>
                    </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Shipping Marks:</span>
                     <span className="text-gray-900">{shipmentData.cargo.shippingMarks}</span>
                   </div>   
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Signature By:</span>
                     <span className="text-gray-900">{shipmentData.blDetails.signatureBy}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Description of Goods:</span>
                     <span className="text-gray-900">{shipmentData.cargo.description}</span>
                   </div>
                 </div>
                
                {/* Right Column */}
                 <div className="space-y-3 text-xs">
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Feeder Voyage No.:</span>
                     <span className="text-gray-900">{shipmentData.vessel.feederVoyage}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Voyage No.:</span>
                     <span className="text-gray-900">{shipmentData.vessel.voyageNumber}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Date of Issue B/L:</span>
                     <span className="text-gray-900">{new Date(shipmentData.dateOfIssue).toLocaleDateString()}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Direct MBL:</span>
                     <span className="text-gray-900">{shipmentData.blDetails.directMbl}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Shipped on Board Date:</span>
                     <span className="text-gray-900">{new Date(shipmentData.shippedOnBoardDate).toLocaleDateString()}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Commodity:</span>
                     <span className="text-gray-900">{shipmentData.cargo.commodity}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Service Mode:</span>
                     <span className="text-gray-900">{shipmentData.cargo.serviceMode}</span>
                   </div>
                 </div>
              </div>
            </div>
        {/* Freight & Charges */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Freight & Charges</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Total Freight:</span>
              <span className="text-gray-900">{shipmentData.freightCharges.totalFreight} {shipmentData.freightCharges.currency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Payment Terms:</span>
              <span className="text-gray-900">{shipmentData.freightCharges.paymentTerms}</span>
            </div>
                         <div className="flex items-center justify-between">
               <span className="text-gray-500">Payable At:</span>
               <span className="text-gray-900">{shipmentData.freightCharges.payableAt}</span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-gray-500">Prepaid At:</span>
               <span className="text-gray-900">{shipmentData.freightCharges.prepaidAt}</span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-gray-500">Total Prepaid:</span>
               <span className="text-gray-900">{shipmentData.freightCharges.totalPrepaid}</span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-gray-500">No. of Original B/L:</span>
               <span className="text-gray-900">{shipmentData.blDetails.numberOfOriginals}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInstructions;
