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
import OceanBLFormat from './OceanBLFormat';
import OceanSIFormat from './OceanSIFormat';
import AirSIFormat from './AirSIFormat';
import AirwayBillFormat from './AirwayBillFormat';

interface ShippingInstructionsProps {
  shipmentId?: string;
}

// Type definitions for different service modes
interface BaseShipmentData {
  // Common fields
  bookingNumber: string;
  buyerReference: string;
  etd: string;
  eta: string;
  shippedOnBoardDate: string;
  issuedBy: string;
  dateOfIssue: string;
  placeOfIssue: string;
  placeOfReceipt: string;
  placeOfDelivery: string;
  finalDestination: string;
  
  // Parties
  shipper: {
    name: string;
    address: string;
    contact: string;
  };
  consignee: {
    name: string;
    address: string;
    contact: string;
  };
  notifyParty: {
    name: string;
    address: string;
    contact: string;
  };
  
  // Freight charges
  freightCharges: {
    paymentTerms: string;
    payableAt: string;
    prepaidAt: string;
    totalPrepaid: string;
    incoterm: string;
  };
  
  // BL details
  blDetails: {
    numberOfOriginals: string;
    blPlaceOfIssue: string;
    directMbl: string;
    signatureBy: string;
  };
  
  // Additional
  documentInstructions: string;
  dangerousGoods: string;
  creditInfo: string;
  
  // Service mode specific
  serviceMode: 'FCL' | 'LCL' | 'AIR';
}

interface FCLShipmentData extends BaseShipmentData {
  serviceMode: 'FCL';
  hblNumber: string;
  mblNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
  vessel: {
    name: string;
    voyageNumber: string;
    feederVessel: string;
    feederVoyage: string;
  };
  containers: Array<{
    number: string;
    type: string;
    quantity: string;
    sealNumber: string;
    grossWeight: string;
    measurement: string;
    packages: string;
    packageType: string;
    tare: string;
    vgm: string;
    temperature: string;
    marks: string;
    description: string;
    commercialInvoiceNo?: string;
    lcNumber?: string;
    hsCode?: string;
  }>;
  cargo: {
    description: string;
    freightTerms: string;
    shippingMarks: string;
    clause: string;
  };
  totalCargo: {
    totalPackages: string;
    totalGrossWeight: string;
    totalMeasurement: string;
    totalContainers: string;
  };
}

interface LCLShipmentData extends BaseShipmentData {
  serviceMode: 'LCL';
  hblNumber: string;
  mblNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
  vessel: {
    name: string;
    voyageNumber: string;
    feederVessel: string;
    feederVoyage: string;
  };
  consolidation: {
    consolidator: string;
    containerNumber: string;
  };
  lclCargoDetails: Array<{
    marks: string;
    description: string;
    packageType: string;
    packages: string;
    grossWeight: string;
    measurement: string;
    chargeableWeight: string;
  }>;
  cargo: {
    description: string;
    freightTerms: string;
    shippingMarks: string;
    clause: string;
  };
  totalCargo: {
    totalPackages: string;
    totalGrossWeight: string;
    totalMeasurement: string;
    totalContainers: string;
  };
}

interface AIRShipmentData extends BaseShipmentData {
  serviceMode: 'AIR';
  hawbNumber: string;
  mawbNumber: string;
  airportOfDeparture: string;
  airportOfArrival: string;
  aircraftName: string;
  flightNumber: string;
  feederAircraft: string;
  feederFlight: string;
  consolidation: {
    consolidator: string;
    uldNumber: string;
  };
  ulds: Array<{
    number: string;
    type: string;
    awbNumber: string;
    description: string;
    packageType: string;
    packages: string;
    grossWeight: string;
    volume: string;
    chargeableWeight: string;
    temperature: string;
    specialEquipment: string;
  }>;
  cargo: {
    description: string;
    freightTerms: string;
    shippingMarks: string;
    clause: string;
  };
  totalCargo: {
    totalPackages: string;
    totalGrossWeight: string;
    totalMeasurement: string;
    totalContainers: string;
  };
}

type ShipmentData = FCLShipmentData | LCLShipmentData | AIRShipmentData;

// Helper functions to determine which fields to show based on service mode
const getServiceModeConfig = (serviceMode: 'FCL' | 'LCL' | 'AIR') => {
  switch (serviceMode) {
    case 'FCL':
      return {
        showContainerDetails: true,
        showVesselInfo: true,
        showPorts: true,
        showULDInfo: false,
        showAircraftInfo: false,
        showAirports: false,
        showConsolidationInfo: false,
        showLCLCargoDetails: false,
        documentType: 'ocean' as const,
        blTypes: ['hbl'] as const
      };
    case 'LCL':
      return {
        showContainerDetails: false,
        showVesselInfo: true,
        showPorts: true,
        showULDInfo: false,
        showAircraftInfo: false,
        showAirports: false,
        showConsolidationInfo: true,
        showLCLCargoDetails: true,
        documentType: 'ocean' as const,
        blTypes: ['hbl'] as const
      };
    case 'AIR':
      return {
        showContainerDetails: false,
        showVesselInfo: false,
        showPorts: false,
        showULDInfo: true,
        showAircraftInfo: true,
        showAirports: true,
        showConsolidationInfo: true,
        showLCLCargoDetails: false,
        documentType: 'air' as const,
        blTypes: ['hawb', 'mawb'] as const
      };
  }
};

const ShippingInstructions: React.FC<ShippingInstructionsProps> = ({ shipmentId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBLModal, setShowBLModal] = useState(false);
  const [showSIModal, setShowSIModal] = useState(false);
  const [blType, setBlType] = useState<'hbl' | 'hawb'>('hbl');

  // Mock data for different service modes
const getFCLMockData = (): FCLShipmentData => ({
  serviceMode: 'FCL',
    bookingNumber: 'BKEXFR2303003',
    buyerReference: 'BUYERREF2303003',
    etd: '2024-05-12T07:00:00',
    eta: '2024-06-22T00:00:00',
    shippedOnBoardDate: '2024-05-12T07:00:00',
    issuedBy: 'FreightLynk',
    dateOfIssue: '2024-05-12T10:00:00',
    placeOfIssue: 'HO CHI MINH CITY, VN (VNSGN)',
  placeOfReceipt: 'HO CHI MINH CITY, VN (VNSGN)',
  placeOfDelivery: 'HOUSTON, TX, US (USHOU)',
  finalDestination: 'HOUSTON, TX, US (USHOU)',
  
  hblNumber: 'HBLEX230300023',
  mblNumber: 'MAEU123456789',
  portOfLoading: 'HO CHI MINH CITY, VN (VNSGN)',
  portOfDischarge: 'HOUSTON, TX, US (USHOU)',
  
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
  
  containers: [{
        number: 'ABCD1234567',
        type: '40HC',
        quantity: '1',
        sealNumber: 'SEAL001',
        grossWeight: '25,000',
        measurement: '67.5',
        packages: '500',
        packageType: 'CTNS',
        tare: '3,800',
        vgm: '28,800',
        temperature: '20°C',
        marks: 'FCL/FCL-CY/CY',
        description: 'Electronics and Machinery',
        commercialInvoiceNo: 'INV-2024-001',
        lcNumber: 'LC-2024-001',
        hsCode: '8517.13.00'
  }],
  
    freightCharges: {
      paymentTerms: 'FREIGHT PREPAID',
      payableAt: 'HO CHI MINH CITY, VN (VNSGN)',
      prepaidAt: 'HO CHI MINH CITY, VN (VNSGN)',
      totalPrepaid: 'USD',
    incoterm: 'FOB'
    },
  
    blDetails: {
      numberOfOriginals: 'THREE/3',
      blPlaceOfIssue: 'HO CHI MINH CITY, VN (VNSGN)',
      directMbl: 'Yes',
      signatureBy: 'FreightLynk'
    },
  
  documentInstructions: 'Original BL Required',
  dangerousGoods: 'NO',
  creditInfo: 'NO',
  
    cargo: {
      description: 'GENERAL CARGO',
      freightTerms: 'FREIGHT PREPAID',
      shippingMarks: 'FCL/FCL-CY/CY',
      clause: 'SHIPPER\'S LOAD, COUNT, STOW & SEAL'
    },
  
  totalCargo: {
    totalPackages: '500 CTNS',
    totalGrossWeight: '25,000 KGS',
    totalMeasurement: '67.5 CBM',
    totalContainers: 'ONE CONTAINER(S) ONLY'
  }
});

const getLCLMockData = (): LCLShipmentData => ({
  serviceMode: 'LCL',
  bookingNumber: 'BKEXFR2303004',
  buyerReference: 'BUYERREF2303004',
  etd: '2024-05-12T07:00:00',
  eta: '2024-06-22T00:00:00',
  shippedOnBoardDate: '2024-05-12T07:00:00',
  issuedBy: 'FreightLynk',
  dateOfIssue: '2024-05-12T10:00:00',
  placeOfIssue: 'HO CHI MINH CITY, VN (VNSGN)',
  placeOfReceipt: 'HO CHI MINH CITY, VN (VNSGN)',
  placeOfDelivery: 'HOUSTON, TX, US (USHOU)',
  finalDestination: 'HOUSTON, TX, US (USHOU)',
  
  hblNumber: 'HBLEX230300024',
  mblNumber: 'MAEU123456790',
  portOfLoading: 'HO CHI MINH CITY, VN (VNSGN)',
  portOfDischarge: 'HOUSTON, TX, US (USHOU)',
  
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
    voyageNumber: 'MV-2024-002',
    feederVessel: 'FEEDER VESSEL 002',
    feederVoyage: 'FV-002'
  },
  
  consolidation: {
    consolidator: 'ABC Company Consolidation',
    containerNumber: 'ABCD1234568'
  },
  
  lclCargoDetails: [
    {
      marks: 'LCL001',
      description: 'Electronics and Machinery',
      packageType: 'CTNS',
      packages: '100',
      grossWeight: '500',
      measurement: '2.5',
      chargeableWeight: '500'
    },
    {
      marks: 'LCL002',
      description: 'Textiles and Apparel',
      packageType: 'BALES',
      packages: '50',
      grossWeight: '300',
      measurement: '1.8',
      chargeableWeight: '300'
    },
    {
      marks: 'LCL003',
      description: 'Automotive Parts',
      packageType: 'PALLETS',
      packages: '25',
      grossWeight: '800',
      measurement: '3.2',
      chargeableWeight: '800'
    }
  ],
  
  freightCharges: {
    paymentTerms: 'FREIGHT PREPAID',
    payableAt: 'HO CHI MINH CITY, VN (VNSGN)',
    prepaidAt: 'HO CHI MINH CITY, VN (VNSGN)',
    totalPrepaid: 'USD',
    incoterm: 'FOB'
  },
  
  blDetails: {
    numberOfOriginals: 'THREE/3',
    blPlaceOfIssue: 'HO CHI MINH CITY, VN (VNSGN)',
    directMbl: 'Yes',
    signatureBy: 'FreightLynk'
  },
  
    documentInstructions: 'Original BL Required',
    dangerousGoods: 'NO',
    creditInfo: 'NO',
  
  cargo: {
    description: 'GENERAL CARGO',
    freightTerms: 'FREIGHT PREPAID',
    shippingMarks: 'LCL/LCL-CFS/CFS',
    clause: 'SHIPPER\'S LOAD, COUNT, STOW & SEAL'
  },
  
    totalCargo: {
    totalPackages: '175 PACKAGES',
    totalGrossWeight: '1,600 KGS',
    totalMeasurement: '7.5 CBM',
    totalContainers: 'LCL CONSOLIDATION'
  }
});

const getAIRMockData = (): AIRShipmentData => ({
  serviceMode: 'AIR',
  bookingNumber: 'BKEXFR2303005',
  buyerReference: 'BUYERREF2303005',
  etd: '2024-05-12T07:00:00',
  eta: '2024-06-22T00:00:00',
  shippedOnBoardDate: '2024-05-12T07:00:00',
  issuedBy: 'FreightLynk',
  dateOfIssue: '2024-05-12T10:00:00',
  placeOfIssue: 'HO CHI MINH CITY, VN (VNSGN)',
  placeOfReceipt: 'HO CHI MINH CITY, VN (VNSGN)',
  placeOfDelivery: 'HOUSTON, TX, US (USHOU)',
  finalDestination: 'HOUSTON, TX, US (USHOU)',
  
  hawbNumber: 'HAWB123456789',
  mawbNumber: 'MAWB12345678',
  airportOfDeparture: 'TAN SON NHAT INTERNATIONAL AIRPORT (SGN)',
  airportOfArrival: 'GEORGE BUSH INTERCONTINENTAL AIRPORT (IAH)',
  aircraftName: 'BOEING 747-400F',
  flightNumber: 'AA1234',
  feederAircraft: 'BOEING 737-800F',
  feederFlight: 'AA5678',
  
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
  
  consolidation: {
    consolidator: 'MiniCraft Consolidation',
    uldNumber: 'AKE12345AB'
  },
  
  ulds: [{
    number: 'AKE12345AB',
    type: 'AKE',
    awbNumber: 'HAWB123456789',
    description: 'Electronics and Machinery',
    packageType: 'CTNS',
    packages: '200',
    grossWeight: '800',
    volume: '4.5',
    chargeableWeight: '500',
    temperature: '20°C',
    specialEquipment: 'None'
  }],
  
  freightCharges: {
    paymentTerms: 'FREIGHT PREPAID',
    payableAt: 'HO CHI MINH CITY, VN (VNSGN)',
    prepaidAt: 'HO CHI MINH CITY, VN (VNSGN)',
    totalPrepaid: 'USD',
    incoterm: 'FOB'
  },
  
  blDetails: {
    numberOfOriginals: 'THREE/3',
    blPlaceOfIssue: 'HO CHI MINH CITY, VN (VNSGN)',
    directMbl: 'Yes',
    signatureBy: 'FreightLynk'
  },
  
  documentInstructions: 'Original AWB Required',
  dangerousGoods: 'NO',
  creditInfo: 'NO',
  
  cargo: {
    description: 'GENERAL CARGO',
    freightTerms: 'FREIGHT PREPAID',
    shippingMarks: 'AIR/AIR-AWB/AWB',
    clause: 'SHIPPER\'S LOAD, COUNT & SEAL'
  },
  
  totalCargo: {
    totalPackages: '200 CTNS',
    totalGrossWeight: '800 KGS',
    totalMeasurement: '4.5 CBM',
    totalContainers: 'ONE ULD(S) ONLY'
  }
});

// Function to get mock data by service mode
const getMockDataByServiceMode = (serviceMode: 'FCL' | 'LCL' | 'AIR'): ShipmentData => {
  switch (serviceMode) {
    case 'FCL': return getFCLMockData();
    case 'LCL': return getLCLMockData();
    case 'AIR': return getAIRMockData();
  }
};

  // Current shipment data - can be dynamically changed
  const [currentServiceMode, setCurrentServiceMode] = useState<'FCL' | 'LCL' | 'AIR'>('AIR');
  const shipmentData = getMockDataByServiceMode(currentServiceMode);

  // Get field visibility based on service mode
  const fieldConfig = getServiceModeConfig(shipmentData.serviceMode);

  const handleDownloadHBL = () => {
    setShowBLModal(true);
    setBlType('hbl');
  };

  const handleDownloadHAWB = () => {
    setShowBLModal(true);
    setBlType('hawb');
  };

  const handleDownloadSI = () => {
    setShowSIModal(true);
  };

  const handleCopyData = () => {
    let formattedData = '';

    // Common header section
    const commonSection = `SHIPPING INSTRUCTIONS DATA

GENERAL INFORMATION:
Booking Number: ${shipmentData.bookingNumber}
Buyer Reference: ${shipmentData.buyerReference}
Place of Receipt: ${shipmentData.placeOfReceipt}
Place of Delivery: ${shipmentData.placeOfDelivery}
Final Destination: ${shipmentData.finalDestination}
ETD: ${new Date(shipmentData.etd).toLocaleDateString()}
ETA: ${new Date(shipmentData.eta).toLocaleDateString()}
Shipped on Board: ${new Date(shipmentData.shippedOnBoardDate).toLocaleDateString()}
Issued By: ${shipmentData.issuedBy}
Date of Issue: ${new Date(shipmentData.dateOfIssue).toLocaleDateString()}
Place of Issue: ${shipmentData.placeOfIssue}

PARTIES INFORMATION:
Shipper:
  Name: ${shipmentData.shipper.name}
  Address: ${shipmentData.shipper.address}
  Contact: ${shipmentData.shipper.contact}

Consignee:
  Name: ${shipmentData.consignee.name}
  Address: ${shipmentData.consignee.address}
  Contact: ${shipmentData.consignee.contact}

Notify Party:
  Name: ${shipmentData.notifyParty.name}
  Address: ${shipmentData.notifyParty.address}
  Contact: ${shipmentData.notifyParty.contact}

FREIGHT & CHARGES:
Payment Terms: ${shipmentData.freightCharges.paymentTerms}
Payable At: ${shipmentData.freightCharges.payableAt}
Prepaid At: ${shipmentData.freightCharges.prepaidAt}
Total Prepaid: ${shipmentData.freightCharges.totalPrepaid}
Incoterm: ${shipmentData.freightCharges.incoterm}
Number of Originals: ${shipmentData.blDetails.numberOfOriginals}

ADDITIONAL INFORMATION:
Document Instructions: ${shipmentData.documentInstructions}
Dangerous Goods: ${shipmentData.dangerousGoods}
Credit Info: ${shipmentData.creditInfo}
Direct MBL: ${shipmentData.blDetails.directMbl}
Signature By: ${shipmentData.blDetails.signatureBy}

CARGO INFORMATION:
Description: ${shipmentData.cargo.description}
Service Mode: ${shipmentData.serviceMode}
Freight Terms: ${shipmentData.cargo.freightTerms}
Shipping Marks: ${shipmentData.cargo.shippingMarks}
Clause: ${shipmentData.cargo.clause}

TOTAL CARGO:
Total Packages: ${shipmentData.totalCargo.totalPackages}
Total Gross Weight: ${shipmentData.totalCargo.totalGrossWeight}
Total Measurement: ${shipmentData.totalCargo.totalMeasurement}
Total Containers: ${shipmentData.totalCargo.totalContainers}

`;

    // Service mode specific sections
    switch (shipmentData.serviceMode) {
      case 'FCL':
        const fclData = shipmentData as FCLShipmentData;
        formattedData = commonSection + `FCL SPECIFIC INFORMATION:
HBL Number: ${fclData.hblNumber}
MBL Number: ${fclData.mblNumber}
Port of Loading: ${fclData.portOfLoading}
Port of Discharge: ${fclData.portOfDischarge}

VESSEL INFORMATION:
Vessel Name: ${fclData.vessel.name}
Voyage Number: ${fclData.vessel.voyageNumber}
Feeder Vessel: ${fclData.vessel.feederVessel}
Feeder Voyage: ${fclData.vessel.feederVoyage}

CONTAINER DETAILS:
${fclData.containers.map((container, index) => `
Container ${index + 1}:
  Container Number: ${container.number}
  Type: ${container.type}
  Quantity: ${container.quantity}
  Seal Number: ${container.sealNumber}
  Gross Weight: ${container.grossWeight} KGS
  Measurement: ${container.measurement} CBM
  Tare: ${container.tare} KGS
  Package Type: ${container.packageType}
  Number of Packages: ${container.packages}
  VGM: ${container.vgm} KGS
  Marks: ${container.marks}
  Description: ${container.description}
`).join('')}`;
        break;

      case 'LCL':
        const lclData = shipmentData as LCLShipmentData;
        formattedData = commonSection + `LCL SPECIFIC INFORMATION:
HBL Number: ${lclData.hblNumber}
MBL Number: ${lclData.mblNumber}
Port of Loading: ${lclData.portOfLoading}
Port of Discharge: ${lclData.portOfDischarge}

VESSEL INFORMATION:
Vessel Name: ${lclData.vessel.name}
Voyage Number: ${lclData.vessel.voyageNumber}
Feeder Vessel: ${lclData.vessel.feederVessel}
Feeder Voyage: ${lclData.vessel.feederVoyage}

CONSOLIDATION INFORMATION:
Consolidator: ${lclData.consolidation.consolidator}
Container Number: ${lclData.consolidation.containerNumber}

LCL CARGO DETAILS:
${lclData.lclCargoDetails.map((cargo, index) => `
Cargo ${index + 1}:
  Marks: ${cargo.marks}
  Description: ${cargo.description}
  Package Type: ${cargo.packageType}
  Packages: ${cargo.packages}
  Gross Weight: ${cargo.grossWeight} KGS
  Measurement: ${cargo.measurement} CBM
  Chargeable Weight: ${cargo.chargeableWeight} KGS
`).join('')}`;
        break;

      case 'AIR':
        const airData = shipmentData as AIRShipmentData;
        formattedData = commonSection + `AIR SPECIFIC INFORMATION:
HAWB Number: ${airData.hawbNumber}
MAWB Number: ${airData.mawbNumber}
Airport of Departure: ${airData.airportOfDeparture}
Airport of Arrival: ${airData.airportOfArrival}

AIRCRAFT INFORMATION:
Aircraft Name: ${airData.aircraftName}
Flight Number: ${airData.flightNumber}
Feeder Aircraft: ${airData.feederAircraft}
Feeder Flight: ${airData.feederFlight}

CONSOLIDATION INFORMATION:
Consolidator: ${airData.consolidation.consolidator}
ULD Number: ${airData.consolidation.uldNumber}

ULD DETAILS:
${airData.ulds.map((uld, index) => `
ULD ${index + 1}:
  ULD Number: ${uld.number}
  Type: ${uld.type}
  AWB Number: ${uld.awbNumber}
  Description: ${uld.description}
  Package Type: ${uld.packageType}
  Packages: ${uld.packages}
  Gross Weight: ${uld.grossWeight} KGS
  Volume: ${uld.volume} CBM
  Chargeable Weight: ${uld.chargeableWeight} KGS
  Temperature: ${uld.temperature}
  Special Equipment: ${uld.specialEquipment}
`).join('')}`;
        break;
    }

    // Copy to clipboard
    navigator.clipboard.writeText(formattedData).then(() => {
      console.log(`${shipmentData.serviceMode} shipment data copied to clipboard successfully!`);
    }).catch((err) => {
      console.error('Failed to copy data to clipboard:', err);
    });
  };

  const [editData, setEditData] = useState<ShipmentData>(shipmentData);

  const handleEdit = () => {
    setEditData(shipmentData);
    setShowEditModal(true);
  };

  const handleSave = () => {
    // Note: In a real application, this would make an API call to save the data
    setShowEditModal(false);
    // Refresh the component by updating the service mode to trigger re-render
    setCurrentServiceMode(currentServiceMode);
  };

  const handleCancel = () => {
    setEditData(shipmentData);
    setShowEditModal(false);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Service Mode Selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <label className="text-sm font-medium text-gray-700">Service Mode:</label>
          <select 
            value={currentServiceMode} 
            onChange={(e) => setCurrentServiceMode(e.target.value as 'FCL' | 'LCL' | 'AIR')}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="FCL">FCL</option>
            <option value="LCL">LCL</option>
            <option value="AIR">AIR</option>
          </select>
        </div>
      </div>

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
        {shipmentData.serviceMode === 'AIR' ? (
          <>
            <button
              onClick={handleDownloadHAWB}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Download HAWB</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleDownloadHBL}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Download HBL</span>
            </button>
          </>
        )}
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
                 <span className="text-gray-500">{fieldConfig.documentType === 'air' ? 'HAWB Number:' : 'HBL Number:'}</span>
                 <span className="font-mono text-gray-900">
                   {shipmentData.serviceMode === 'AIR' ? (shipmentData as AIRShipmentData).hawbNumber : (shipmentData as FCLShipmentData | LCLShipmentData).hblNumber}
                 </span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">{fieldConfig.documentType === 'air' ? 'MAWB Number:' : 'MBL Number:'}</span>
                 <span className="font-mono text-gray-900">
                   {shipmentData.serviceMode === 'AIR' ? (shipmentData as AIRShipmentData).mawbNumber : (shipmentData as FCLShipmentData | LCLShipmentData).mblNumber}
                 </span>
               </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Booking Number:</span>
                  <span className="font-mono text-gray-900">{shipmentData.bookingNumber}</span>
                </div>
               {fieldConfig.showPorts && (
                 <>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">Port of Loading:</span>
                     <span className="text-gray-900">{(shipmentData as FCLShipmentData | LCLShipmentData).portOfLoading}</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-gray-500">Port of Discharge:</span>
                     <span className="text-gray-900">{(shipmentData as FCLShipmentData | LCLShipmentData).portOfDischarge}</span>
               </div>
                 </>
               )}
               {fieldConfig.showAirports && (
                 <>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Airport of Departure:</span>
                     <span className="text-gray-900">{(shipmentData as AIRShipmentData).airportOfDeparture}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Airport of Arrival:</span>
                     <span className="text-gray-900">{(shipmentData as AIRShipmentData).airportOfArrival}</span>
                   </div>
                 </>
               )}
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
                 <span className="text-gray-500">Issued By:</span>
                 <span className="text-gray-900">{shipmentData.issuedBy}</span>
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

            {/* Second Row - Container/Cargo Details Tables */}
      {/* FCL Container Details Table */}
      {fieldConfig.showContainerDetails && shipmentData.serviceMode === 'FCL' && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 min-w-0">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Container Details</h3>
          <div className="w-full overflow-x-auto rounded-lg">
            <table className="w-full min-w-max table-auto border border-gray-200">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">No</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Type</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Quantity</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Container No.</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Seal No.</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Gross Weight</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Measurement</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Tare</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Package Type</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">No of Pkgs</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">VGM</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Temperature</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Note</th>
                </tr>
              </thead>
              <tbody>
                {(shipmentData as FCLShipmentData).containers.map((container, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-xs text-gray-900">{index + 1}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{container.type}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{container.quantity}</td>
                    <td className="py-4 px-4 text-xs font-mono text-gray-900">{container.number}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{container.sealNumber}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{container.grossWeight} KGS</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{container.measurement}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{container.tare} KGS</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{container.packageType}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{container.packages}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{container.vgm} KGS</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{container.temperature}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{shipmentData.totalCargo.totalContainers}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AIR ULD Details Table */}
      {fieldConfig.showULDInfo && shipmentData.serviceMode === 'AIR' && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 min-w-0">
          <h3 className="text-md font-semibold text-gray-900 mb-4">ULD Details</h3>
          <div className="w-full overflow-x-auto rounded-lg">
            <table className="w-full min-w-max table-auto border border-gray-200">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">No</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">ULD No.</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">HAWB No.</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Type</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Description of Goods</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Package Type</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">No of Pkgs</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Gross Weight (kg)</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Volume (cbm)</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Chargeable Weight (kg)</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Temperature</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Special Equipment</th>
                </tr>
              </thead>
              <tbody>
                {(shipmentData as AIRShipmentData).ulds.map((uld, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-xs text-gray-900">{index + 1}</td>
                    <td className="py-4 px-4 text-xs font-mono text-gray-900">{uld.number}</td>
                    <td className="py-4 px-4 text-xs font-mono text-gray-900">{uld.awbNumber}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{uld.type}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{uld.description}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{uld.packageType}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{uld.packages}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{uld.grossWeight}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{uld.volume}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{uld.chargeableWeight}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{uld.temperature}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{uld.specialEquipment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LCL Cargo Details Table */}
      {fieldConfig.showLCLCargoDetails && shipmentData.serviceMode === 'LCL' && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 min-w-0">
          <h3 className="text-md font-semibold text-gray-900 mb-4">LCL Cargo Details</h3>
          <div className="w-full overflow-x-auto rounded-lg">
            <table className="w-full min-w-max table-auto border border-gray-200">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">No</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Marks & Numbers</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Description of Goods</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Package Type</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">No of Pkgs</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Gross Weight (kg)</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Measurement (cbm)</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2 px-4">Chargeable Weight (kg)</th>
                </tr>
              </thead>
              <tbody>
                {(shipmentData as LCLShipmentData).lclCargoDetails.map((cargo, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-xs text-gray-900">{index + 1}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{cargo.marks}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{cargo.description}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{cargo.packageType}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{cargo.packages}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{cargo.grossWeight}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{cargo.measurement}</td>
                    <td className="py-4 px-4 text-xs text-gray-900">{cargo.chargeableWeight}</td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={8} className="text-center text-xs text-gray-500 py-4">
                      No LCL cargo details available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

       {/* Third Row - Freight & Charges and Additional Information */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Vessel/Aircraft Information */}
        {(fieldConfig.showVesselInfo || fieldConfig.showAircraftInfo) && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-semibold text-gray-900 mb-4">
              {fieldConfig.showAircraftInfo ? 'Aircraft Information' : 'Vessel Information'}
            </h3>
            <div className="space-y-3 text-xs">
              {fieldConfig.showVesselInfo && (shipmentData.serviceMode === 'FCL' || shipmentData.serviceMode === 'LCL') && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Vessel Name:</span>
                    <span className="text-gray-900">{(shipmentData as FCLShipmentData | LCLShipmentData).vessel.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Voyage Number:</span>
                    <span className="text-gray-900">{(shipmentData as FCLShipmentData | LCLShipmentData).vessel.voyageNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Feeder Vessel:</span>
                    <span className="text-gray-900">{(shipmentData as FCLShipmentData | LCLShipmentData).vessel.feederVessel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Feeder Voyage:</span>
                    <span className="text-gray-900">{(shipmentData as FCLShipmentData | LCLShipmentData).vessel.feederVoyage}</span>
                  </div>
                  {/* Consolidation info for LCL */}
                  {fieldConfig.showConsolidationInfo && shipmentData.serviceMode === 'LCL' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Consolidator:</span>
                        <span className="text-gray-900">{(shipmentData as LCLShipmentData).consolidation.consolidator}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Container Number:</span>
                        <span className="text-gray-900">{(shipmentData as LCLShipmentData).consolidation.containerNumber}</span>
                      </div>
                    </>
                  )}
                </>
              )}
              {fieldConfig.showAircraftInfo && shipmentData.serviceMode === 'AIR' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Aircraft Name:</span>
                    <span className="text-gray-900">{(shipmentData as AIRShipmentData).aircraftName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Flight Number:</span>
                    <span className="text-gray-900">{(shipmentData as AIRShipmentData).flightNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Feeder Aircraft:</span>
                    <span className="text-gray-900">{(shipmentData as AIRShipmentData).feederAircraft}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Feeder Flight:</span>
                    <span className="text-gray-900">{(shipmentData as AIRShipmentData).feederFlight}</span>
                  </div>
                  {/* Consolidation info for AIR */}
                  {fieldConfig.showConsolidationInfo && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Consolidator:</span>
                        <span className="text-gray-900">{(shipmentData as AIRShipmentData).consolidation.consolidator}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">ULD Number:</span>
                        <span className="text-gray-900">{(shipmentData as AIRShipmentData).consolidation.uldNumber}</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Freight & Charges */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Freight & Charges</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
               <span className="text-gray-500">Incoterms:</span>
               <span className="text-gray-900">{shipmentData.freightCharges.incoterm}</span>
             </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Payment Terms:</span>
              <span className="text-gray-900">{shipmentData.freightCharges.paymentTerms}</span>
            </div>
            {shipmentData.serviceMode === 'FCL' && (shipmentData as FCLShipmentData).containers[0]?.lcNumber && (
                     <div className="flex items-center justify-between">
                       <span className="text-gray-500">L/C Number:</span>
                       <span className="text-gray-900">{(shipmentData as FCLShipmentData).containers[0].lcNumber}</span>
                     </div>
                   )}
             <div className="flex items-center justify-between">
               <span className="text-gray-500">Payable At:</span>
               <span className="text-gray-900">{shipmentData.freightCharges.payableAt}</span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-gray-500">Prepaid At:</span>
               <span className="text-gray-900">{shipmentData.freightCharges.prepaidAt}</span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-gray-500">Total Prepaid in:</span>
               <span className="text-gray-900">{shipmentData.freightCharges.totalPrepaid}</span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-gray-500">No. of Original B/L:</span>
               <span className="text-gray-900">{shipmentData.blDetails.numberOfOriginals}</span>
             </div>
          </div>
        </div>
      </div>
          
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
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Document Instructions:</span>
                     <span className="text-gray-900">{shipmentData.documentInstructions}</span>
                   </div>
                   {shipmentData.serviceMode === 'FCL' && (shipmentData as FCLShipmentData).containers[0]?.commercialInvoiceNo && (
                     <div className="flex items-center justify-between">
                       <span className="text-gray-500">Commercial Invoice No:</span>
                       <span className="text-gray-900">{(shipmentData as FCLShipmentData).containers[0].commercialInvoiceNo}</span>
                     </div>
                   )}
                 </div>
                
                {/* Right Column */}
                 <div className="space-y-3 text-xs">
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
                     <span className="text-gray-500">Clause:</span>
                     <span className="text-gray-900">{shipmentData.cargo.clause}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Shipment Type:</span>
                     <span className="text-gray-900">{shipmentData.serviceMode}</span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-gray-500">Dangerous Goods:</span>
                     <span className="text-gray-900">{shipmentData.dangerousGoods}</span>
                   </div>
                               <div className="flex items-center justify-between">
                     <span className="text-gray-500">Credit Information:</span>
                     <span className="text-gray-900">{shipmentData.creditInfo}</span>
                   </div>
                   {shipmentData.serviceMode === 'FCL' && (shipmentData as FCLShipmentData).containers[0]?.hsCode && (
                     <div className="flex items-center justify-between">
                       <span className="text-gray-500">HS Code:</span>
                       <span className="text-gray-900">{(shipmentData as FCLShipmentData).containers[0].hsCode}</span>
                     </div>
                   )}
            </div>
        </div>
      </div>

    {/* Edit Modal */}
    {showEditModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Shipping Instructions - {editData.serviceMode}
            </h2>
            <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
            >
            <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)] hide-scrollbar">
            <div className="space-y-4">
            {/* General Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-md font-semibold text-gray-900 mb-4">General Information - {editData.serviceMode}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                    {/* Common fields */}
                    <div>
                      <label className="block text-gray-500 mb-1 text-xs">Booking Number</label>
                    <input
                        type="text"
                          value={editData.bookingNumber}
                          onChange={(e) => setEditData(prev => ({ ...prev, bookingNumber: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>

                    {/* Service mode specific fields */}
                    {(editData.serviceMode === 'FCL' || editData.serviceMode === 'LCL') && (
                      <>
                    <div>
                          <label className="block text-gray-500 mb-1 text-xs">HBL Number</label>
                    <input
                        type="text"
                              value={(editData as FCLShipmentData | LCLShipmentData).hblNumber}
                              onChange={(e) => setEditData(prev => ({ ...prev, hblNumber: e.target.value }) as ShipmentData)}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                          <label className="block text-gray-500 mb-1 text-xs">MBL Number</label>
                    <input
                        type="text"
                              value={(editData as FCLShipmentData | LCLShipmentData).mblNumber}
                              onChange={(e) => setEditData(prev => ({ ...prev, mblNumber: e.target.value }) as ShipmentData)}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Port of Loading</label>
                    <input
                        type="text"
                              value={(editData as FCLShipmentData | LCLShipmentData).portOfLoading}
                              onChange={(e) => setEditData(prev => ({ ...prev, portOfLoading: e.target.value }) as ShipmentData)}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Port of Discharge</label>
                    <input
                        type="text"
                              value={(editData as FCLShipmentData | LCLShipmentData).portOfDischarge}
                              onChange={(e) => setEditData(prev => ({ ...prev, portOfDischarge: e.target.value }) as ShipmentData)}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                      </>
                    )}

                    {editData.serviceMode === 'AIR' && (
                      <>
                        <div>
                          <label className="block text-gray-500 mb-1 text-xs">HAWB Number</label>
                          <input
                              type="text"
                              value={(editData as AIRShipmentData).hawbNumber}
                              onChange={(e) => setEditData(prev => ({ ...prev, hawbNumber: e.target.value }) as ShipmentData)}
                              className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1 text-xs">MAWB Number</label>
                          <input
                              type="text"
                              value={(editData as AIRShipmentData).mawbNumber}
                              onChange={(e) => setEditData(prev => ({ ...prev, mawbNumber: e.target.value }) as ShipmentData)}
                              className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1 text-xs">Airport of Departure</label>
                          <input
                              type="text"
                              value={(editData as AIRShipmentData).airportOfDeparture}
                              onChange={(e) => setEditData(prev => ({ ...prev, airportOfDeparture: e.target.value }) as ShipmentData)}
                              className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 mb-1 text-xs">Airport of Arrival</label>
                          <input
                              type="text"
                              value={(editData as AIRShipmentData).airportOfArrival}
                              onChange={(e) => setEditData(prev => ({ ...prev, airportOfArrival: e.target.value }) as ShipmentData)}
                              className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                          />
                        </div>
                      </>
                    )}
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

            {/* Service Mode Specific Details Tables */}
            
            {/* FCL Container Details Table */}
            {editData.serviceMode === 'FCL' && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-semibold text-gray-900">FCL Container Details</h3>
              <button
                onClick={() => {
                  const newContainer = {
                    number: '',
                    quantity: '',
                    type: '',
                    sealNumber: '',
                    grossWeight: '',
                    measurement: '',
                    packages: '',
                    packageType: '',
                    tare: '',
                    vgm: '',
                    temperature: '',
                    marks: '',
                    description: ''
                  };
                  setEditData(prev => ({
                    ...prev,
                        containers: [...(prev as FCLShipmentData).containers, newContainer]
                      } as FCLShipmentData));
                }}
                className="flex items-center gap-2 px-3 py-2 bg-[#007bff] text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Row
              </button>
            </div>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full min-w-max table-auto border border-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Container No.</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seal No.</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Weight</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Measurement</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tare</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No of Pkgs</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VGM</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {(editData as FCLShipmentData).containers.map((container, index) => (
                        <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{index + 1}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.type}
                            onChange={(e) => {
                                const newContainers = [...(editData as FCLShipmentData).containers];
                                newContainers[index] = { ...container, type: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers } as FCLShipmentData));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.quantity}
                            onChange={(e) => {
                                const newContainers = [...(editData as FCLShipmentData).containers];
                                newContainers[index] = { ...container, quantity: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers } as FCLShipmentData));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.number}
                            onChange={(e) => {
                                const newContainers = [...(editData as FCLShipmentData).containers];
                                newContainers[index] = { ...container, number: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers } as FCLShipmentData));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs font-mono"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.sealNumber}
                            onChange={(e) => {
                                const newContainers = [...(editData as FCLShipmentData).containers];
                                newContainers[index] = { ...container, sealNumber: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers } as FCLShipmentData));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.grossWeight}
                            onChange={(e) => {
                                const newContainers = [...(editData as FCLShipmentData).containers];
                                newContainers[index] = { ...container, grossWeight: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers } as FCLShipmentData));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.measurement}
                            onChange={(e) => {
                                const newContainers = [...(editData as FCLShipmentData).containers];
                                newContainers[index] = { ...container, measurement: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers } as FCLShipmentData));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.tare}
                            onChange={(e) => {
                                const newContainers = [...(editData as FCLShipmentData).containers];
                                newContainers[index] = { ...container, tare: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers } as FCLShipmentData));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.packageType}
                            onChange={(e) => {
                                const newContainers = [...(editData as FCLShipmentData).containers];
                                newContainers[index] = { ...container, packageType: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers } as FCLShipmentData));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.packages}
                            onChange={(e) => {
                                const newContainers = [...(editData as FCLShipmentData).containers];
                                newContainers[index] = { ...container, packages: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers } as FCLShipmentData));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.vgm}
                            onChange={(e) => {
                                const newContainers = [...(editData as FCLShipmentData).containers];
                                newContainers[index] = { ...container, vgm: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers } as FCLShipmentData));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={container.temperature}
                            onChange={(e) => {
                                const newContainers = [...(editData as FCLShipmentData).containers];
                                newContainers[index] = { ...container, temperature: e.target.value };
                                setEditData(prev => ({ ...prev, containers: newContainers } as FCLShipmentData));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                            type="text"
                            value={editData.totalCargo.totalContainers}
                            onChange={(e) => {
                                const newTotalCargo = { ...editData.totalCargo, totalContainers: e.target.value };
                                setEditData(prev => ({ ...prev, totalCargo: newTotalCargo } as FCLShipmentData));
                            }}
                            className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                          />
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                          <button
                            onClick={() => {
                              const newContainers = (editData as FCLShipmentData).containers.filter((_, i) => i !== index);
                              setEditData(prev => ({ ...prev, containers: newContainers } as FCLShipmentData));
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
            )}

            {/* LCL Cargo Details Table */}
            {editData.serviceMode === 'LCL' && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 min-w-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-semibold text-gray-900">LCL Cargo Details</h3>
                  <button
                    onClick={() => {
                      const newCargo = {
                        marks: '',
                        description: '',
                        packageType: '',
                        packages: '',
                        grossWeight: '',
                        measurement: '',
                        chargeableWeight: ''
                      };
                      setEditData(prev => ({
                        ...prev,
                        lclCargoDetails: [...(prev as LCLShipmentData).lclCargoDetails, newCargo]
                      } as LCLShipmentData));
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-[#007bff] text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Row
                  </button>
                </div>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full min-w-max table-auto border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No of Pkgs</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Weight (kg)</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Measurement (cbm)</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chargeable Weight (kg)</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(editData as LCLShipmentData).lclCargoDetails.map((cargo, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{index + 1}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={cargo.marks}
                              onChange={(e) => {
                                const newCargo = [...(editData as LCLShipmentData).lclCargoDetails];
                                newCargo[index] = { ...cargo, marks: e.target.value };
                                setEditData(prev => ({ ...prev, lclCargoDetails: newCargo } as LCLShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={cargo.description}
                              onChange={(e) => {
                                const newCargo = [...(editData as LCLShipmentData).lclCargoDetails];
                                newCargo[index] = { ...cargo, description: e.target.value };
                                setEditData(prev => ({ ...prev, lclCargoDetails: newCargo } as LCLShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={cargo.packageType}
                              onChange={(e) => {
                                const newCargo = [...(editData as LCLShipmentData).lclCargoDetails];
                                newCargo[index] = { ...cargo, packageType: e.target.value };
                                setEditData(prev => ({ ...prev, lclCargoDetails: newCargo } as LCLShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={cargo.packages}
                              onChange={(e) => {
                                const newCargo = [...(editData as LCLShipmentData).lclCargoDetails];
                                newCargo[index] = { ...cargo, packages: e.target.value };
                                setEditData(prev => ({ ...prev, lclCargoDetails: newCargo } as LCLShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={cargo.grossWeight}
                              onChange={(e) => {
                                const newCargo = [...(editData as LCLShipmentData).lclCargoDetails];
                                newCargo[index] = { ...cargo, grossWeight: e.target.value };
                                setEditData(prev => ({ ...prev, lclCargoDetails: newCargo } as LCLShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={cargo.measurement}
                              onChange={(e) => {
                                const newCargo = [...(editData as LCLShipmentData).lclCargoDetails];
                                newCargo[index] = { ...cargo, measurement: e.target.value };
                                setEditData(prev => ({ ...prev, lclCargoDetails: newCargo } as LCLShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={cargo.chargeableWeight}
                              onChange={(e) => {
                                const newCargo = [...(editData as LCLShipmentData).lclCargoDetails];
                                newCargo[index] = { ...cargo, chargeableWeight: e.target.value };
                                setEditData(prev => ({ ...prev, lclCargoDetails: newCargo } as LCLShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <button
                              onClick={() => {
                                const newCargo = (editData as LCLShipmentData).lclCargoDetails.filter((_, i) => i !== index);
                                setEditData(prev => ({ ...prev, lclCargoDetails: newCargo } as LCLShipmentData));
                              }}
                              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              title="Delete cargo"
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
            )}

            {/* AIR ULD Details Table */}
            {editData.serviceMode === 'AIR' && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 min-w-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-semibold text-gray-900">AIR ULD Details</h3>
                  <button
                    onClick={() => {
                      const newULD = {
                        number: '',
                        awbNumber: '',
                        type: '',
                        description: '',
                        packageType: '',
                        packages: '',
                        grossWeight: '',
                        volume: '',
                        chargeableWeight: '',
                        temperature: '',
                        specialEquipment: ''
                      };
                      setEditData(prev => ({
                        ...prev,
                        ulds: [...(prev as AIRShipmentData).ulds, newULD]
                      } as AIRShipmentData));
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-[#007bff] text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Row
                  </button>
                </div>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full min-w-max table-auto border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ULD Number</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AWB Number</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packages Qty</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Weight (kg)</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume (cbm)</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chargeable Weight (kg)</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Temperature</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Special Equipment</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(editData as AIRShipmentData).ulds.map((uld, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{index + 1}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={uld.number}
                              onChange={(e) => {
                                const newUlds = [...(editData as AIRShipmentData).ulds];
                                newUlds[index] = { ...uld, number: e.target.value };
                                setEditData(prev => ({ ...prev, ulds: newUlds } as AIRShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs font-mono"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={uld.awbNumber}
                              onChange={(e) => {
                                const newUlds = [...(editData as AIRShipmentData).ulds];
                                newUlds[index] = { ...uld, awbNumber: e.target.value };
                                setEditData(prev => ({ ...prev, ulds: newUlds } as AIRShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs font-mono"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={uld.type}
                              onChange={(e) => {
                                const newUlds = [...(editData as AIRShipmentData).ulds];
                                newUlds[index] = { ...uld, type: e.target.value };
                                setEditData(prev => ({ ...prev, ulds: newUlds } as AIRShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={uld.packageType}
                              onChange={(e) => {
                                const newUlds = [...(editData as AIRShipmentData).ulds];
                                newUlds[index] = { ...uld, packageType: e.target.value };
                                setEditData(prev => ({ ...prev, ulds: newUlds } as AIRShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={uld.packages}
                              onChange={(e) => {
                                const newUlds = [...(editData as AIRShipmentData).ulds];
                                newUlds[index] = { ...uld, packages: e.target.value };
                                setEditData(prev => ({ ...prev, ulds: newUlds } as AIRShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={uld.grossWeight}
                              onChange={(e) => {
                                const newUlds = [...(editData as AIRShipmentData).ulds];
                                newUlds[index] = { ...uld, grossWeight: e.target.value };
                                setEditData(prev => ({ ...prev, ulds: newUlds } as AIRShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={uld.volume}
                              onChange={(e) => {
                                const newUlds = [...(editData as AIRShipmentData).ulds];
                                newUlds[index] = { ...uld, volume: e.target.value };
                                setEditData(prev => ({ ...prev, ulds: newUlds } as AIRShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={uld.chargeableWeight}
                              onChange={(e) => {
                                const newUlds = [...(editData as AIRShipmentData).ulds];
                                newUlds[index] = { ...uld, chargeableWeight: e.target.value };
                                setEditData(prev => ({ ...prev, ulds: newUlds } as AIRShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={uld.description}
                              onChange={(e) => {
                                const newUlds = [...(editData as AIRShipmentData).ulds];
                                newUlds[index] = { ...uld, description: e.target.value };
                                setEditData(prev => ({ ...prev, ulds: newUlds } as AIRShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={uld.temperature}
                              onChange={(e) => {
                                const newUlds = [...(editData as AIRShipmentData).ulds];
                                newUlds[index] = { ...uld, temperature: e.target.value };
                                setEditData(prev => ({ ...prev, ulds: newUlds } as AIRShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <input
                              type="text"
                              value={uld.specialEquipment}
                              onChange={(e) => {
                                const newUlds = [...(editData as AIRShipmentData).ulds];
                                newUlds[index] = { ...uld, specialEquipment: e.target.value };
                                setEditData(prev => ({ ...prev, ulds: newUlds } as AIRShipmentData));
                              }}
                              className="w-full p-1 border border-gray-300 rounded text-gray-900 text-xs"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                            <button
                              onClick={() => {
                                const newUlds = (editData as AIRShipmentData).ulds.filter((_, i) => i !== index);
                                setEditData(prev => ({ ...prev, ulds: newUlds } as AIRShipmentData));
                              }}
                              className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              title="Delete ULD"
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
            )}

            {/* Vessel/Aircraft Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-4">
                {editData.serviceMode === 'AIR' ? 'Aircraft Information' : 'Vessel Information'}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {/* Ocean/LCL Vessel Fields */}
                  {(editData.serviceMode === 'FCL' || editData.serviceMode === 'LCL') && (
                    <>
                      <div>
                        <label className="block text-gray-500 mb-1 text-xs">Vessel Name</label>
                        <input
                          type="text"
                          value={(editData as FCLShipmentData | LCLShipmentData).vessel.name}
                          onChange={(e) => setEditData(prev => ({ 
                            ...prev, 
                            vessel: { ...(prev as FCLShipmentData | LCLShipmentData).vessel, name: e.target.value }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1 text-xs">Voyage Number</label>
                        <input
                          type="text"
                          value={(editData as FCLShipmentData | LCLShipmentData).vessel.voyageNumber}
                          onChange={(e) => setEditData(prev => ({ 
                            ...prev, 
                            vessel: { ...(prev as FCLShipmentData | LCLShipmentData).vessel, voyageNumber: e.target.value }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                      </div>
                      {/* LCL Consolidator in left column */}
                      {editData.serviceMode === 'LCL' && (
                        <div>
                          <label className="block text-gray-500 mb-1 text-xs">Consolidator</label>
                          <input
                            type="text"
                            value={(editData as LCLShipmentData).consolidation.consolidator}
                            onChange={(e) => setEditData(prev => ({ 
                              ...prev, 
                              consolidation: { ...(prev as LCLShipmentData).consolidation, consolidator: e.target.value }
                            } as LCLShipmentData))}
                            className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* Air Fields */}
                  {editData.serviceMode === 'AIR' && (
                    <>
                      <div>
                        <label className="block text-gray-500 mb-1 text-xs">Aircraft Name</label>
                        <input
                          type="text"
                          value={(editData as AIRShipmentData).aircraftName}
                          onChange={(e) => setEditData(prev => ({ ...prev, aircraftName: e.target.value } as AIRShipmentData))}
                          className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1 text-xs">Flight Number</label>
                        <input
                          type="text"
                          value={(editData as AIRShipmentData).flightNumber}
                          onChange={(e) => setEditData(prev => ({ ...prev, flightNumber: e.target.value } as AIRShipmentData))}
                          className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1 text-xs">Consolidator</label>
                        <input
                          type="text"
                          value={(editData as AIRShipmentData).consolidation.consolidator}
                          onChange={(e) => setEditData(prev => ({ 
                            ...prev, 
                            consolidation: { ...(prev as AIRShipmentData).consolidation, consolidator: e.target.value }
                          } as AIRShipmentData))}
                          className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Ocean/LCL Vessel Fields */}
                  {(editData.serviceMode === 'FCL' || editData.serviceMode === 'LCL') && (
                    <>
                      <div>
                        <label className="block text-gray-500 mb-1 text-xs">Feeder Vessel</label>
                        <input
                          type="text"
                          value={(editData as FCLShipmentData | LCLShipmentData).vessel.feederVessel}
                          onChange={(e) => setEditData(prev => ({ 
                            ...prev, 
                            vessel: { ...(prev as FCLShipmentData | LCLShipmentData).vessel, feederVessel: e.target.value }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1 text-xs">Feeder Voyage</label>
                        <input
                          type="text"
                          value={(editData as FCLShipmentData | LCLShipmentData).vessel.feederVoyage}
                          onChange={(e) => setEditData(prev => ({ 
                            ...prev, 
                            vessel: { ...(prev as FCLShipmentData | LCLShipmentData).vessel, feederVoyage: e.target.value }
                          }))}
                          className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                      </div>
                      {/* LCL Container Number in right column */}
                      {editData.serviceMode === 'LCL' && (
                        <div>
                          <label className="block text-gray-500 mb-1 text-xs">Container Number</label>
                          <input
                            type="text"
                            value={(editData as LCLShipmentData).consolidation.containerNumber}
                            onChange={(e) => setEditData(prev => ({ 
                              ...prev, 
                              consolidation: { ...(prev as LCLShipmentData).consolidation, containerNumber: e.target.value }
                            } as LCLShipmentData))}
                            className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* Air Fields */}
                  {editData.serviceMode === 'AIR' && (
                    <>
                      <div>
                        <label className="block text-gray-500 mb-1 text-xs">Feeder Aircraft</label>
                        <input
                          type="text"
                          value={(editData as AIRShipmentData).feederAircraft}
                          onChange={(e) => setEditData(prev => ({ ...prev, feederAircraft: e.target.value } as AIRShipmentData))}
                          className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1 text-xs">Feeder Flight</label>
                        <input
                          type="text"
                          value={(editData as AIRShipmentData).feederFlight}
                          onChange={(e) => setEditData(prev => ({ ...prev, feederFlight: e.target.value } as AIRShipmentData))}
                          className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-500 mb-1 text-xs">ULD Number</label>
                        <input
                          type="text"
                          value={(editData as AIRShipmentData).consolidation.uldNumber}
                          onChange={(e) => setEditData(prev => ({ 
                            ...prev, 
                            consolidation: { ...(prev as AIRShipmentData).consolidation, uldNumber: e.target.value }
                          } as AIRShipmentData))}
                          className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                        />
                      </div>

                    </>
                  )}
                </div>
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
                        value={(editData as any).preCarriageBy || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, preCarriageBy: e.target.value } as any))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
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
                    <label className="block text-gray-500 mb-1 text-xs">CFS Terminal</label>
                    <input
                        type="text"
                        value={(editData as any).cfsTerminal || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, cfsTerminal: e.target.value } as any))}
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
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Document Instructions</label>
                    <input
                        type="text"
                        value={editData.documentInstructions}
                        onChange={(e) => setEditData(prev => ({ ...prev, documentInstructions: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Credit Information</label>
                    <select
                        value={editData.creditInfo}
                        onChange={(e) => setEditData(prev => ({ ...prev, creditInfo: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    >
                        <option value="NO">NO</option>
                        <option value="YES">YES</option>
                    </select>
                    </div>
                </div>
                <div className="space-y-3">
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
                    <label className="block text-gray-500 mb-1 text-xs">Freight Terms</label>
                    <input
                        type="text"
                        value={editData.cargo.freightTerms}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        cargo: { ...prev.cargo, freightTerms: e.target.value }
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
                    <label className="block text-gray-500 mb-1 text-xs">Clause</label>
                    <input
                        type="text"
                        value={editData.cargo.clause}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        cargo: { ...prev.cargo, clause: e.target.value }
                        }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Shipment Type</label>
                    <input
                        type="text"
                        value={editData.serviceMode}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        serviceMode: e.target.value as 'FCL' | 'LCL' | 'AIR'
                        } as ShipmentData))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    />
                    </div>
                    <div>
                    <label className="block text-gray-500 mb-1 text-xs">Dangerous Goods</label>
                    <select
                        value={editData.dangerousGoods}
                        onChange={(e) => setEditData(prev => ({ ...prev, dangerousGoods: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                    >
                        <option value="NO">NO</option>
                        <option value="YES">YES</option>
                    </select>
                    </div>
                      <div>
                       <label className="block text-gray-500 mb-1 text-xs">Commercial Invoice No</label>
                       <input
                         type="text"
                         value={(editData as FCLShipmentData).containers[0]?.commercialInvoiceNo || ''}
                         onChange={(e) => {
                           const newContainers = [...(editData as FCLShipmentData).containers];
                           newContainers[0] = { ...newContainers[0], commercialInvoiceNo: e.target.value };
                           setEditData(prev => ({ ...prev, containers: newContainers } as FCLShipmentData));
                         }}
                         className="w-full p-2 border border-gray-300 rounded text-gray-900 text-xs"
                       />
                     </div>
                     <div>
                       <label className="block text-gray-500 mb-1 text-xs">HS Code</label>
                       <input
                         type="text"
                         value={(editData as FCLShipmentData).containers[0]?.hsCode || ''}
                         onChange={(e) => {
                           const newContainers = [...(editData as FCLShipmentData).containers];
                           newContainers[0] = { ...newContainers[0], hsCode: e.target.value };
                           setEditData(prev => ({ ...prev, containers: newContainers } as FCLShipmentData));
                         }}
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
                       <label className="block text-gray-500 mb-1 text-xs">L/C Number</label>
                       <input
                         type="text"
                         value={(editData as FCLShipmentData).containers[0]?.lcNumber || ''}
                         onChange={(e) => {
                           const newContainers = [...(editData as FCLShipmentData).containers];
                           newContainers[0] = { ...newContainers[0], lcNumber: e.target.value };
                           setEditData(prev => ({ ...prev, containers: newContainers } as FCLShipmentData));
                         }}
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
                    <label className="block text-gray-500 mb-1 text-xs">Total Prepaid in</label>
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
                    <label className="block text-gray-500 mb-1 text-xs">Incoterm</label>
                    <input
                        type="text"
                        value={editData.freightCharges.incoterm}
                        onChange={(e) => setEditData(prev => ({ 
                        ...prev, 
                        freightCharges: { ...prev.freightCharges, incoterm: e.target.value }
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
                className="px-4 py-2 bg-[#007bff] text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
                <Save className="w-4 h-4" />
                Save
            </button>
            </div>
        </div>
        </div>
    </div>
    )}

    {/* BL Generation Modal */}
    {showBLModal && (
      (shipmentData.serviceMode === 'AIR' && blType === 'hawb') ? (
        <AirwayBillFormat 
          data={{
            mawbNumber: (shipmentData as AIRShipmentData).mawbNumber,
            hawbNumber: (shipmentData as AIRShipmentData).hawbNumber,
            issuedBy: shipmentData.issuedBy,
            shipper: {
              name: shipmentData.shipper.name,
              address: shipmentData.shipper.address,
              phone: shipmentData.shipper.contact,
            },
            consignee: {
              name: shipmentData.consignee.name,
              address: shipmentData.consignee.address,
              phone: shipmentData.consignee.contact,
            },
            agent: {
              name: 'FreightLynk Agent',
              iataCode: 'FLK001',
              accountNumber: 'AG001',
              accountingInfo: 'FREIGHT PREPAID'
            },
            airportDeparture: (shipmentData as AIRShipmentData).airportOfDeparture,
            airportDestination: (shipmentData as AIRShipmentData).airportOfArrival,
            requestedRouting: 'SGN-IAH',
            referenceNumber: shipmentData.bookingNumber,
            optionalShippingInfo: 'HANDLE WITH CARE',
            airportOfDeparture: (shipmentData as AIRShipmentData).airportOfDeparture,
            airportOfDestination: (shipmentData as AIRShipmentData).airportOfArrival,
            firstCarrier: 'FreightLynk Airlines',
            flightDate: new Date(shipmentData.etd).toLocaleDateString(),
            carrierUseOnly: 'FL001',
            flightDate2: new Date(shipmentData.etd).toLocaleDateString(),
            amountOfInsurance: '50,000.00',
            handlingInformation: 'FRAGILE - HANDLE WITH CARE - THIS SIDE UP',
            currency: 'USD',
            chgsCode: 'PPD',
            declaredValueCarriage: '50,000.00',
            declaredValueCustoms: '50,000.00',
            amountInsurance: '50,000.00',
            goods: (shipmentData as AIRShipmentData).ulds.map(uld => ({
              pieces: uld.packages,
              grossWeight: uld.grossWeight,
              weightUnit: 'kg',
              rateClass: 'G',
              commodityItemNo: '1234567890',
              chargeableWeight: uld.chargeableWeight,
              rateCharge: '5.50',
              total: '2,750.00',
              description: uld.description,
              measurements: uld.volume
            })),
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
            executedDate: new Date(shipmentData.dateOfIssue).toLocaleDateString(),
            executedPlace: shipmentData.placeOfIssue,
            shipperSignature: shipmentData.shipper.name,
            carrierSignature: 'FreightLynk Airlines'
          }}
          blType={blType as 'hawb'}
          onClose={() => setShowBLModal(false)} 
        />
      ) : (blType === 'hbl') ? (
        <OceanBLFormat
        data={{
          serviceType: shipmentData.serviceMode.toLowerCase() as 'fcl' | 'lcl',
          blType: blType as 'hbl',
          blNumber: (shipmentData as FCLShipmentData | LCLShipmentData).hblNumber,
          bookingNumber: shipmentData.bookingNumber,
          dateOfIssue: shipmentData.dateOfIssue,
          shipper: {
            name: shipmentData.shipper.name,
            address: shipmentData.shipper.address,
            city: shipmentData.shipper.address.split(', ').slice(-2, -1)[0] || '',
            country: shipmentData.shipper.address.split(', ').slice(-1)[0] || ''
          },
          consignee: {
            name: shipmentData.consignee.name,
            address: shipmentData.consignee.address,
            city: shipmentData.consignee.address.split(', ').slice(-2, -1)[0] || '',
            country: shipmentData.consignee.address.split(', ').slice(-1)[0] || ''
          },
          notifyParty: {
            name: shipmentData.notifyParty.name,
            address: shipmentData.notifyParty.address,
            city: shipmentData.notifyParty.address.split(', ').slice(-2, -1)[0] || '',
            country: shipmentData.notifyParty.address.split(', ').slice(-1)[0] || ''
          },
          vessel: {
            name: (shipmentData as FCLShipmentData | LCLShipmentData).vessel.name,
            voyageNumber: (shipmentData as FCLShipmentData | LCLShipmentData).vessel.voyageNumber,
            feederVessel: (shipmentData as FCLShipmentData | LCLShipmentData).vessel.feederVessel,
            feederVoyage: (shipmentData as FCLShipmentData | LCLShipmentData).vessel.feederVoyage
          },
          portOfLoading: (shipmentData as FCLShipmentData | LCLShipmentData).portOfLoading,
          portOfDischarge: (shipmentData as FCLShipmentData | LCLShipmentData).portOfDischarge,
          placeOfReceipt: shipmentData.placeOfReceipt,
          placeOfDelivery: shipmentData.placeOfDelivery,
          finalDestination: shipmentData.finalDestination,
          // For FCL shipments
          containers: shipmentData.serviceMode === 'FCL' ? (shipmentData as FCLShipmentData).containers.map(container => ({
            containerNumber: container.number,
            sealNumber: container.sealNumber,
            type: container.type,
            tare: container.tare,
            vgm: container.vgm,
            marks: container.marks,
            description: container.description,
            packages: container.quantity,
            weight: container.grossWeight,
            volume: container.measurement,
            commercialInvoiceNo: container.commercialInvoiceNo,
            lcNumber: container.lcNumber,
            hsCode: container.hsCode
          })) : [],
          // For LCL shipments - use LCL cargo details
          lclCargo: shipmentData.serviceMode === 'LCL' ? (shipmentData as LCLShipmentData).lclCargoDetails.map(cargo => ({
            marks: cargo.marks,
            packages: cargo.packages,
            description: cargo.description,
            weight: cargo.grossWeight,
            volume: cargo.measurement,
            commodity: shipmentData.cargo.description,
            serviceMode: shipmentData.serviceMode
          })) : [],
               // LCL consolidation details
            consolidation: {
              consolidator: shipmentData.serviceMode === 'LCL' ? (shipmentData as LCLShipmentData).consolidation?.consolidator || 'FreightLynk' : 'FreightLynk',
              masterBLNumber: 'MBL' + (shipmentData as FCLShipmentData | LCLShipmentData).mblNumber,
              houseBLNumber: 'HBL' + (shipmentData as FCLShipmentData | LCLShipmentData).hblNumber,
              containerNumber: shipmentData.serviceMode === 'FCL' ? ((shipmentData as FCLShipmentData).containers[0]?.number || '') : ((shipmentData as LCLShipmentData).consolidation?.containerNumber || ''),
              sealNumber: shipmentData.serviceMode === 'FCL' ? ((shipmentData as FCLShipmentData).containers[0]?.sealNumber || '') : ''
            },
          freightCharges: {
            
            paymentTerms: shipmentData.freightCharges.paymentTerms,
            payableAt: shipmentData.freightCharges.payableAt,
            prepaidAt: shipmentData.freightCharges.prepaidAt,
            totalPrepaid: shipmentData.freightCharges.totalPrepaid,
            numberOfOriginals: shipmentData.blDetails.numberOfOriginals,
            incoterm: shipmentData.freightCharges.incoterm
          },
          shippedOnBoardDate: shipmentData.shippedOnBoardDate,
          placeOfIssue: shipmentData.placeOfIssue,
          signatureBy: shipmentData.blDetails.signatureBy,
          cargo: {
            description: shipmentData.cargo.description,
            serviceMode: shipmentData.serviceMode,
            freightTerms: shipmentData.cargo.freightTerms,
            shippingMarks: shipmentData.cargo.shippingMarks
          }
        }}
        onClose={() => setShowBLModal(false)}
      />
      ) : null
    )}

    {/* SI Generation Modal */}
    {showSIModal && (
      shipmentData.serviceMode === 'AIR' ? (
        <AirSIFormat
          data={{
            siNumber: (shipmentData as AIRShipmentData).hawbNumber,
            pageNumber: '1 of 1',
            reference: shipmentData.bookingNumber,
            buyerReference: shipmentData.buyerReference,
            exportDeclarationNumber: 'EXP' + (shipmentData as AIRShipmentData).hawbNumber,
            masterAWBNumber: (shipmentData as AIRShipmentData).mawbNumber,
          
          exporter: {
            name: shipmentData.shipper.name,
            address: shipmentData.shipper.address,
            city: shipmentData.shipper.address.split(', ').slice(-2, -1)[0] || '',
            country: shipmentData.shipper.address.split(', ').slice(-1)[0] || ''
          },
          consignee: {
            name: shipmentData.consignee.name,
            address: shipmentData.consignee.address,
            city: shipmentData.consignee.address.split(', ').slice(-2, -1)[0] || '',
            country: shipmentData.consignee.address.split(', ').slice(-1)[0] || ''
          },
          notifyParty: {
            name: shipmentData.notifyParty.name,
            address: shipmentData.notifyParty.address,
            city: shipmentData.notifyParty.address.split(', ').slice(-2, -1)[0] || '',
            country: shipmentData.notifyParty.address.split(', ').slice(-1)[0] || ''
          },
          
          carrier: (shipmentData as AIRShipmentData).aircraftName,
            methodOfDispatch: 'Air Freight',
            typeOfShipment: 'ULD', // Default to ULD for air freight
            countryOfOriginOfGoods: shipmentData.shipper.address.split(', ').slice(-1)[0] || 'Vietnam',
            countryOfFinalDestination: shipmentData.consignee.address.split(', ').slice(-1)[0] || 'United States',
            
            aircraftOrFlight: (shipmentData as AIRShipmentData).aircraftName,
            flightNo: (shipmentData as AIRShipmentData).flightNumber,
            placeOfReceipt: shipmentData.placeOfReceipt,
            airportOfDeparture: (shipmentData as AIRShipmentData).airportOfDeparture,
            dateOfDeparture: new Date(shipmentData.etd).toLocaleDateString(),
            freightCharges: shipmentData.freightCharges.paymentTerms,
            documentInstructions: shipmentData.documentInstructions,
            airportOfArrival: (shipmentData as AIRShipmentData).airportOfArrival,
            finalDestination: shipmentData.finalDestination,
            incoterms2020: shipmentData.freightCharges.incoterm,
            declaredValue: 'As per Commercial Invoice',
            
            // ULD Specific Information (Equivalent to FCL)
            ulds: (shipmentData as AIRShipmentData).ulds.map(uld => ({
              uldNumber: uld.number,
              awbNumber: uld.awbNumber, // Use the actual AWB number from ULD data
              uldType: uld.type,
              description: uld.description,
              packages: uld.packages,
              grossWeight: uld.grossWeight,
              volume: uld.volume,
              chargeableWeight: uld.chargeableWeight,
              temperature: uld.temperature || 'N/A',
              specialEquipment: uld.specialEquipment || 'N/A'
            })),
            positioningInstructions: '', // Not available in current data structure
            equipmentRequirements: '', // Not available in current data structure
            
            // Consolidation Information (Equivalent to LCL)
            consolidation: {
              masterAWBNumber: (shipmentData as AIRShipmentData).mawbNumber, // MAWB (airline's waybill)
              houseAWBNumber: (shipmentData as AIRShipmentData).hawbNumber, // HAWB (forwarder's waybill)
              consolidator: (shipmentData as AIRShipmentData).consolidation?.consolidator || 'FreightLynk',
              uldNumber: (shipmentData as AIRShipmentData).ulds[0]?.number || '',
              awbNumber: (shipmentData as AIRShipmentData).hawbNumber // HAWB for the specific shipment
            },
            deconsolidationInstructions: '', // Not available in current data structure
            
            cargoDetails: (shipmentData as AIRShipmentData).ulds.map(uld => ({
              marks: uld.description,
              kind: uld.packageType,
              packages: uld.packages,
              description: uld.description,
              grossWeight: uld.grossWeight,
              chargeableWeight: uld.chargeableWeight,
              measurements: uld.volume,
              rateClass: 'G', // General cargo class for air freight
              commodityItemNo: uld.awbNumber, // Use AWB number as commodity item number
              rateCharge: (parseFloat(uld.chargeableWeight) > 0 ? (2750.00 / parseFloat(uld.chargeableWeight)).toFixed(2) : '5.50'), // Calculate rate based on weight
              total: (parseFloat(uld.chargeableWeight) * 5.50).toFixed(2) // Calculate total based on chargeable weight
            })),
            
            totalThisPage: shipmentData.totalCargo.totalPackages,
            consignmentTotal: `${shipmentData.totalCargo.totalGrossWeight} / ${shipmentData.totalCargo.totalMeasurement}`,
            dangerousGoods: shipmentData.dangerousGoods,
            creditInfo: shipmentData.creditInfo,
            specialInstructions: shipmentData.cargo.clause,
            
            placeAndDateOfIssue: `${shipmentData.placeOfIssue}, ${new Date(shipmentData.dateOfIssue).toLocaleDateString()}`,
            signatoryCompany: shipmentData.blDetails.signatureBy,
            nameOfAuthorizedSignatory: shipmentData.blDetails.signatureBy,
            signature: ''
          }}
          onClose={() => setShowSIModal(false)}
        />
      ) : (
        <OceanSIFormat
          data={{
            siNumber: shipmentData.serviceMode === 'FCL' ? (shipmentData as FCLShipmentData).mblNumber : (shipmentData as LCLShipmentData).hblNumber,
            pageNumber: '1 of 1',
            reference: shipmentData.bookingNumber,
            buyerReference: shipmentData.buyerReference,
            exportDeclarationNumber: 'EXP' + (shipmentData.serviceMode === 'FCL' ? (shipmentData as FCLShipmentData).mblNumber : (shipmentData as LCLShipmentData).hblNumber),
            masterBLNumber: shipmentData.serviceMode === 'FCL' ? (shipmentData as FCLShipmentData).mblNumber : undefined,
          
            exporter: {
              name: shipmentData.shipper.name,
              address: shipmentData.shipper.address,
              city: shipmentData.shipper.address.split(', ').slice(-2, -1)[0] || '',
              country: shipmentData.shipper.address.split(', ').slice(-1)[0] || ''
            },
            consignee: {
              name: shipmentData.consignee.name,
              address: shipmentData.consignee.address,
              city: shipmentData.consignee.address.split(', ').slice(-2, -1)[0] || '',
              country: shipmentData.consignee.address.split(', ').slice(-1)[0] || ''
            },
            notifyParty: {
              name: shipmentData.notifyParty.name,
              address: shipmentData.notifyParty.address,
              city: shipmentData.notifyParty.address.split(', ').slice(-2, -1)[0] || '',
              country: shipmentData.notifyParty.address.split(', ').slice(-1)[0] || ''
            },
            
            carrier: (shipmentData as FCLShipmentData | LCLShipmentData).vessel.name,
          methodOfDispatch: 'Ocean Freight',
            typeOfShipment: shipmentData.serviceMode,
          countryOfOriginOfGoods: shipmentData.shipper.address.split(', ').slice(-1)[0] || 'Vietnam',
          countryOfFinalDestination: shipmentData.consignee.address.split(', ').slice(-1)[0] || 'United States',
          
            vesselOrAircraft: (shipmentData as FCLShipmentData | LCLShipmentData).vessel.name,
            voyageNo: (shipmentData as FCLShipmentData | LCLShipmentData).vessel.voyageNumber,
          placeOfReceipt: shipmentData.placeOfReceipt,
            portOfLoading: (shipmentData as FCLShipmentData | LCLShipmentData).portOfLoading,
          dateOfDeparture: new Date(shipmentData.etd).toLocaleDateString(),
          freightCharges: shipmentData.freightCharges.paymentTerms,
          documentInstructions: shipmentData.documentInstructions,
            portOfDischarge: (shipmentData as FCLShipmentData | LCLShipmentData).portOfDischarge,
          finalDestination: shipmentData.finalDestination,
          incoterms2020: shipmentData.freightCharges.incoterm,
          declaredValue: 'As per Commercial Invoice',
          
          // FCL Specific Information
          containers: shipmentData.serviceMode === 'FCL' ? (shipmentData as FCLShipmentData).containers.map(container => ({
            containerNumber: container.number,
            sealNumber: container.sealNumber,
            containerType: container.type,
            tareWeight: container.tare,
            vgm: container.vgm,
            temperature: container.temperature, // Not available in current data structure
            specialEquipment: '' // Not available in current data structure
          })) : undefined,
          stowageInstructions: '', // Not available in current data structure
          equipmentRequirements: '', // Not available in current data structure
          
          // LCL Specific Information
          consolidation: shipmentData.serviceMode === 'LCL' ? {
            masterBLNumber: (shipmentData as LCLShipmentData).mblNumber,
            houseBLNumber: (shipmentData as LCLShipmentData).hblNumber,
            consolidator: (shipmentData as LCLShipmentData).consolidation?.consolidator || '',
            containerNumber: (shipmentData as LCLShipmentData).consolidation?.containerNumber || '',
            sealNumber: ''
          } : undefined,
          breakBulkInstructions: '', // Not available in current data structure
          
          cargoDetails: shipmentData.serviceMode === 'FCL' ? (shipmentData as FCLShipmentData).containers.map(container => ({
            marks: container.marks,
            kind: container.packageType,
            packages: container.packages,
            description: container.description,
            grossWeight: container.grossWeight,
            measurements: container.measurement
          })) : (shipmentData as LCLShipmentData).lclCargoDetails.map(cargo => ({
            marks: cargo.marks,
            kind: cargo.packageType,
            packages: cargo.packages,
            description: cargo.description,
            grossWeight: cargo.grossWeight,
            measurements: cargo.measurement
          })),
          
          totalThisPage: shipmentData.totalCargo.totalPackages,
          consignmentTotal: `${shipmentData.totalCargo.totalGrossWeight} / ${shipmentData.totalCargo.totalMeasurement}`,
          dangerousGoods: shipmentData.dangerousGoods,
          creditInfo: shipmentData.creditInfo,
          specialInstructions: shipmentData.cargo.clause,
          
          placeAndDateOfIssue: `${shipmentData.placeOfIssue}, ${new Date(shipmentData.dateOfIssue).toLocaleDateString()}`,
          signatoryCompany: shipmentData.blDetails.signatureBy,
          nameOfAuthorizedSignatory: shipmentData.blDetails.signatureBy,
          signature: ''
        }}
        onClose={() => setShowSIModal(false)}
      />
      )
    )}

    </div>
  );
};

export default ShippingInstructions;
