'use client';

import ShipmentTable from "@/app/components/shipmentsbooking/ShipmentTable";
import { Upload, Download, Plus } from 'lucide-react';


const ClientUI = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2 md:gap-0">
        <h1 className="text-2xl font-bold text-gray-900">Your Shipments</h1>
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
          <button className="w-full md:w-auto flex items-center text-sm text-gray-900 gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-200">
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button className="w-full md:w-auto flex items-center text-sm text-gray-900 gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-200">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="w-full md:w-auto flex items-center px-4 py-2 text-sm font-semibold text-white bg-[#007bff] rounded-md hover:bg-blue-700 transition-colors">
            <Plus size={16} className="mr-2" />
            Create Booking
          </button>
        </div>
      </div>
      <ShipmentTable view="full"/>
    </div>
  );
};

const ForwarderUI = () => {
  return (
    <div className="p-4">
        <ShipmentTable view="full"/>
    </div>
  );
};

const LogisticsProviderUI = () => {
  return (
    <div>
      <h2>Logistics Provider Invoice Interface</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const AdminUI = () => {
  return (
    <div>
      <h2>Admin Invoice Interface</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const ShipmentsUI = ({ userType }: { userType: string }) => {
  // Manually set userType for testing - change this value to test different UIs
  const testUserType: string = 'client'; // Change to: 'client', 'forwarder', 'logistics', 'admin'
  
  if (testUserType === 'client') return <ClientUI />;
  if (testUserType === 'forwarder') return <ForwarderUI />;
  if (testUserType === 'logistics') return <LogisticsProviderUI />;
  if (testUserType === 'admin') return <AdminUI />;
  
  return <div>Access denied</div>;
};

export default ShipmentsUI;