'use client';

import ShipmentTable from "@/app/components/clients/shipmentsbooking/ShipmentTable";
import { Upload, Download, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const ClientUI = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2 md:gap-0">
        <h1 className="text-2xl font-bold text-gray-900">Your Shipments</h1>
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto mt-2 md:mt-0">
          <button className="w-full md:w-auto flex items-center text-sm text-gray-900 gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200">
            <Download className="w-4 h-4" />
            Export CSV
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
      <h2>Logistics Provider All Shipments</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const AdminUI = () => {
  return (
    <div>
      <h2>Admin All Shipments</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const ShipmentsAllPage = () => {
  const { user } = useAuthStore();
  const [roleBasedUI, setRoleBasedUI] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    if (!user) return;

    switch (user.role) {
      case UserRole.ADMIN:
        setRoleBasedUI(<AdminUI />);
        break;
      case UserRole.CLIENT:
        setRoleBasedUI(<ClientUI />);
        break;
      case UserRole.FORWARDER:
        setRoleBasedUI(<ForwarderUI />);
        break;
      case UserRole.LOGISTICS_PROVIDER:
        setRoleBasedUI(<LogisticsProviderUI />);
        break;
      default:
        setRoleBasedUI(<div>Access denied</div>);
    }
  }, [user]);

  return (
    <ProtectedRoute 
      allowedRoles={[UserRole.ADMIN, UserRole.CLIENT, UserRole.FORWARDER, UserRole.LOGISTICS_PROVIDER]} 
    >
      {roleBasedUI}
    </ProtectedRoute>
  );
};

export default ShipmentsAllPage;