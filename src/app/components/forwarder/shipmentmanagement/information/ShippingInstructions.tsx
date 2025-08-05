'use client';

import React, { useState, useCallback } from 'react';
import { 
  Download, 
  Copy, 
  Edit, 
  FileText,
  X,
  Save,
  Trash2,
  Plus
} from 'lucide-react';

interface ShippingInstructionsProps {
  shipmentId?: string;
}

const ShippingInstructions: React.FC<ShippingInstructionsProps> = ({ shipmentId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
    preCarriageBy: '-',
    cfsTerminal: '-',
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

  const [editData, setEditData] = useState(shipmentData);

  const handleEdit = () => {
    setEditData(shipmentData);
    setShowEditModal(true);
  };

  const handleSave = () => {
    // Update the shipment data with edited data
    Object.assign(shipmentData, editData);
    setShowEditModal(false);
  };

  const handleCancel = () => {
    setEditData(shipmentData);
    setShowEditModal(false);
  };

  const renderInput = useCallback((field: string, label: string, type = 'text', placeholder = '') => (
    <div key={field}>
      <label className="block text-gray-500 mb-1 text-xs">{label}</label>
      <input
        type={type}
        value={type === 'datetime-local' ? (editData as any)[field]?.replace(' ', 'T') || '' : (editData as any)[field] || ''}
        onChange={(e) => {
          const value = type === 'datetime-local' ? e.target.value.replace('T', ' ') : e.target.value;
          setEditData(prev => ({ ...prev, [field]: value }));
        }}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
      />
    </div>
  ), [editData]);

  const renderTextarea = useCallback((field: string, label: string, rows = 3) => (
    <div key={field}>
      <label className="block text-gray-500 mb-1 text-xs">{label}</label>
      <textarea
        value={(editData as any)[field] || ''}
        onChange={(e) => setEditData(prev => ({ ...prev, [field]: e.target.value }))}
        rows={rows}
        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
      />
    </div>
  ), [editData]);

  const renderSelect = useCallback((field: string, label: string, options: string[]) => (
    <div key={field}>
      <label className="block text-gray-500 mb-1 text-xs">{label}</label>
      <select
        value={(editData as any)[field] || ''}
        onChange={(e) => setEditData(prev => ({ ...prev, [field]: e.target.value }))}
        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
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

    {/* Edit Modal */}
    {showEditModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Edit Shipping Instructions</h2>
            <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
            >
            <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-4">
            {/* General Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-semibold text-gray-900 mb-4">General Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">HBL Number</label>
                    <input
                        type="text"
                        value={editData.hblNumber}
                        onChange={(e) => setEditData(prev => ({ ...prev, hblNumber: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">MBL Number</label>
                    <input
                        type="text"
                        value={editData.mblNumber}
                        onChange={(e) => setEditData(prev => ({ ...prev, mblNumber: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Booking Number</label>
                    <input
                        type="text"
                        value={editData.bookingNumber}
                        onChange={(e) => setEditData(prev => ({ ...prev, bookingNumber: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Port of Loading</label>
                    <input
                        type="text"
                        value={editData.portOfLoading}
                        onChange={(e) => setEditData(prev => ({ ...prev, portOfLoading: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Port of Discharge</label>
                    <input
                        type="text"
                        value={editData.portOfDischarge}
                        onChange={(e) => setEditData(prev => ({ ...prev, portOfDischarge: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">ETD</label>
                    <input
                        type="datetime-local"
                        value={editData.etd.replace(' ', 'T')}
                        onChange={(e) => setEditData(prev => ({ ...prev, etd: e.target.value.replace('T', ' ') }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">ETA</label>
                    <input
                        type="datetime-local"
                        value={editData.eta.replace(' ', 'T')}
                        onChange={(e) => setEditData(prev => ({ ...prev, eta: e.target.value.replace('T', ' ') }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                </div>
                <div className="space-y-3">
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Place of Receipt</label>
                    <input
                        type="text"
                        value={editData.placeOfReceipt}
                        onChange={(e) => setEditData(prev => ({ ...prev, placeOfReceipt: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Place of Delivery</label>
                    <input
                        type="text"
                        value={editData.placeOfDelivery}
                        onChange={(e) => setEditData(prev => ({ ...prev, placeOfDelivery: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Final Destination</label>
                    <input
                        type="text"
                        value={editData.finalDestination}
                        onChange={(e) => setEditData(prev => ({ ...prev, finalDestination: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Shipped on Board Date</label>
                    <input
                        type="datetime-local"
                        value={editData.shippedOnBoardDate.replace(' ', 'T')}
                        onChange={(e) => setEditData(prev => ({ ...prev, shippedOnBoardDate: e.target.value.replace('T', ' ') }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Date of Issue</label>
                    <input
                        type="datetime-local"
                        value={editData.dateOfIssue.replace(' ', 'T')}
                        onChange={(e) => setEditData(prev => ({ ...prev, dateOfIssue: e.target.value.replace('T', ' ') }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Place of Issue</label>
                    <input
                        type="text"
                        value={editData.placeOfIssue}
                        onChange={(e) => setEditData(prev => ({ ...prev, placeOfIssue: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                </div>
                </div>
            </div>

            {/* Parties Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Parties Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="space-y-3">
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Shipper Name</label>
                    <input
                        type="text"
                        value={editData.shipper.name}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        shipper: { ...prev.shipper, name: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Shipper Address</label>
                    <textarea
                        value={editData.shipper.address}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        shipper: { ...prev.shipper, address: e.target.value }
                        }))}
                        rows={2}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Shipper Contact</label>
                    <input
                        type="text"
                        value={editData.shipper.contact}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        shipper: { ...prev.shipper, contact: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                </div>
                <div className="space-y-3">
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Consignee Name</label>
                    <input
                        type="text"
                        value={editData.consignee.name}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        consignee: { ...prev.consignee, name: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Consignee Address</label>
                    <textarea
                        value={editData.consignee.address}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        consignee: { ...prev.consignee, address: e.target.value }
                        }))}
                        rows={2}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Consignee Contact</label>
                    <input
                        type="text"
                        value={editData.consignee.contact}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        consignee: { ...prev.consignee, contact: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                </div>
                <div className="space-y-3">
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Notify Party Name</label>
                    <input
                        type="text"
                        value={editData.notifyParty.name}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        notifyParty: { ...prev.notifyParty, name: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Notify Party Address</label>
                    <textarea
                        value={editData.notifyParty.address}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        notifyParty: { ...prev.notifyParty, address: e.target.value }
                        }))}
                        rows={2}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Notify Party Contact</label>
                    <input
                        type="text"
                        value={editData.notifyParty.contact}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        notifyParty: { ...prev.notifyParty, contact: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                </div>
                </div>
            </div>

                      {/* Container Details Table */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-semibold text-gray-900">Container Details</h3>
              <button
                onClick={() => {
                  const newContainer = {
                    number: '',
                    type: '',
                    sealNumber: '',
                    grossWeight: '',
                    measurement: '',
                    packages: '',
                    packageType: '',
                    tare: '',
                    vgm: '',
                    marks: '',
                    description: ''
                  };
                  setEditData(prev => ({
                    ...prev,
                    containers: [...prev.containers, newContainer]
                  }));
                }}
                className="flex items-center gap-2 px-3 py-2 bg-[#007bff] text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Row
              </button>
            </div>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Container No.</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seal No.</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Weight</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Measurement</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tare</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No of Pkgs</th>
                                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VGM</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {editData.containers.map((container, index) => (
                        <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{index + 1}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.type}
                            onChange={(e) => {
                                const newContainers = [...editData.containers];
                                newContainers[index] = { ...container, type: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers }));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.number}
                            onChange={(e) => {
                                const newContainers = [...editData.containers];
                                newContainers[index] = { ...container, number: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers }));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs font-mono"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.sealNumber}
                            onChange={(e) => {
                                const newContainers = [...editData.containers];
                                newContainers[index] = { ...container, sealNumber: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers }));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.grossWeight}
                            onChange={(e) => {
                                const newContainers = [...editData.containers];
                                newContainers[index] = { ...container, grossWeight: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers }));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.measurement}
                            onChange={(e) => {
                                const newContainers = [...editData.containers];
                                newContainers[index] = { ...container, measurement: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers }));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.tare}
                            onChange={(e) => {
                                const newContainers = [...editData.containers];
                                newContainers[index] = { ...container, tare: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers }));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.packageType}
                            onChange={(e) => {
                                const newContainers = [...editData.containers];
                                newContainers[index] = { ...container, packageType: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers }));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.packages}
                            onChange={(e) => {
                                const newContainers = [...editData.containers];
                                newContainers[index] = { ...container, packages: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers }));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.vgm}
                            onChange={(e) => {
                                const newContainers = [...editData.containers];
                                newContainers[index] = { ...container, vgm: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers }));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          <input
                            type="text"
                            value={container.marks}
                            onChange={(e) => {
                              const newContainers = [...editData.containers];
                              newContainers[index] = { ...container, marks: e.target.value };
                              setEditData(prev => ({ ...prev, containers: newContainers }));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          <button
                            onClick={() => {
                              const newContainers = editData.containers.filter((_, i) => i !== index);
                              setEditData(prev => ({ ...prev, containers: newContainers }));
                            }}
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete container"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Shipping Information and Freight & Charges */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Shipping Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Shipping Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Pre-Carriage By</label>
                    <input
                        type="text"
                        value={editData.preCarriageBy || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, preCarriageBy: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Vessel Name</label>
                    <input
                        type="text"
                        value={editData.vessel.name}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        vessel: { ...prev.vessel, name: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">B/L Place of Issue</label>
                    <input
                        type="text"
                        value={editData.placeOfIssue}
                        onChange={(e) => setEditData(prev => ({ ...prev, placeOfIssue: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">CFS Terminal</label>
                    <input
                        type="text"
                        value={editData.cfsTerminal || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, cfsTerminal: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Shipping Marks</label>
                    <input
                        type="text"
                        value={editData.cargo.shippingMarks}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        cargo: { ...prev.cargo, shippingMarks: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Signature By</label>
                    <input
                        type="text"
                        value={editData.blDetails.signatureBy}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        blDetails: { ...prev.blDetails, signatureBy: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Description of Goods</label>
                    <input
                        type="text"
                        value={editData.cargo.description}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        cargo: { ...prev.cargo, description: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                </div>
                <div className="space-y-3">
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Feeder Voyage No.</label>
                    <input
                        type="text"
                        value={editData.vessel.feederVoyage}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        vessel: { ...prev.vessel, feederVoyage: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Voyage No.</label>
                    <input
                        type="text"
                        value={editData.vessel.voyageNumber}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        vessel: { ...prev.vessel, voyageNumber: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Date of Issue B/L</label>
                    <input
                        type="datetime-local"
                        value={editData.dateOfIssue.replace(' ', 'T')}
                        onChange={(e) => setEditData(prev => ({ ...prev, dateOfIssue: e.target.value.replace('T', ' ') }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Direct MBL</label>
                    <input
                        type="text"
                        value={editData.blDetails.directMbl}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        blDetails: { ...prev.blDetails, directMbl: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Shipped on Board Date</label>
                    <input
                        type="datetime-local"
                        value={editData.shippedOnBoardDate.replace(' ', 'T')}
                        onChange={(e) => setEditData(prev => ({ ...prev, shippedOnBoardDate: e.target.value.replace('T', ' ') }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Commodity</label>
                    <input
                        type="text"
                        value={editData.cargo.commodity}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        cargo: { ...prev.cargo, commodity: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Service Mode</label>
                    <input
                        type="text"
                        value={editData.cargo.serviceMode}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        cargo: { ...prev.cargo, serviceMode: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                </div>
                </div>
                </div>

                {/* Freight & Charges */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Freight & Charges</h3>
                <div className="space-y-3">
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Total Freight</label>
                    <input
                        type="text"
                        value={editData.freightCharges.totalFreight}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        freightCharges: { ...prev.freightCharges, totalFreight: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Currency</label>
                    <input
                        type="text"
                        value={editData.freightCharges.currency}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        freightCharges: { ...prev.freightCharges, currency: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Payment Terms</label>
                    <input
                        type="text"
                        value={editData.freightCharges.paymentTerms}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        freightCharges: { ...prev.freightCharges, paymentTerms: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Payable At</label>
                    <input
                        type="text"
                        value={editData.freightCharges.payableAt}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        freightCharges: { ...prev.freightCharges, payableAt: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Prepaid At</label>
                    <input
                        type="text"
                        value={editData.freightCharges.prepaidAt}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        freightCharges: { ...prev.freightCharges, prepaidAt: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Total Prepaid</label>
                    <input
                        type="text"
                        value={editData.freightCharges.totalPrepaid}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        freightCharges: { ...prev.freightCharges, totalPrepaid: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">No. of Original B/L</label>
                    <input
                        type="text"
                        value={editData.blDetails.numberOfOriginals}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        blDetails: { ...prev.blDetails, numberOfOriginals: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
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
    )}

    </div>
  );
};

export default ShippingInstructions;
