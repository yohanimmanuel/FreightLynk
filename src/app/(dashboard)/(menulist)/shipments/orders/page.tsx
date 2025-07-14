'use client';

import { useEffect, useState } from 'react';
import { Download, Plus, Upload } from "lucide-react";
import BookingManage from "@/app/components/forwarder/shipmentmanagement/BookingManage";
import ForwarderBookingCalendar from '@/app/components/forwarder/shipmentmanagement/ForwarderBookingCalendar';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const ClientUI = () => {
  return (
    <div>
      <h2>Client Orders Page</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const ForwarderUI = () => {
  const handleExportCSV = () => {
    // Implement export logic here
    console.log('Exporting CSV...');
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4 -mt-4">
      <div className="md:col-span-2 col-span-1">
        <div className="flex flex-col">
          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 mt-3 pb-3 border-b border-gray-200 gap-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
              <p className="text-sm text-gray-600 mt-1">View and manage your received shipment bookings from clients.</p>
            </div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-200"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
          {/* Table */}
          <BookingManage />
        </div>
      </div>
      <div className="md:col-span-1 col-span-1 p-0 md:p-2 mt-4 md:mt-0">
        <ForwarderBookingCalendar/>
      </div>
    </div>
  );
};

const LogisticsProviderUI = () => {
  return (
    <div>
      <h2>Logistics Provider Orders Page</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const AdminUI = () => {
  return (
    <div>
      <h2>Admin Orders Page</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const OrdersPage = () => {
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

export default OrdersPage;
