'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, UserRole } from '@/store/authStore';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import ShipmentCardInfo from '@/app/components/forwarder/shipmentmanagement/ShipmentCardInfo';
import ShipmentDetails from '@/app/components/forwarder/shipmentmanagement/ShipmentDetails';
import ActionRequired from '@/app/components/forwarder/shipmentmanagement/ActionRequired';

const ClientUI = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipment Details</h2>
      <p className="text-gray-600">Client view - Coming Soon...</p>
    </div>
  );
};

const ForwarderUI = ({ shipmentId }: { shipmentId?: string }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shipment Details</h1>
            <p className="text-sm text-gray-600 mt-1">
              Shipments {'>>'} {shipmentId || 'FCL-S-2305-E-FCL-000'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 font-mono">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto p-4">
        {/* Top Section - Action Required (Overall Progress) */}
        <ActionRequired shipmentId={shipmentId} />
        
        {/* Middle Section - ShipmentCardInfo (Collapsible) */}
        <ShipmentCardInfo />
        
        {/* Bottom Section - ShipmentDetails */}
        <ShipmentDetails shipmentId={shipmentId} />
      </div>
    </div>
  );
};

const LogisticsProviderUI = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipment Details</h2>
      <p className="text-gray-600">Logistics Provider view - Coming Soon...</p>
    </div>
  );
};

const AdminUI = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipment Details</h2>
      <p className="text-gray-600">Admin view - Coming Soon...</p>
    </div>
  );
};

const OrdersDetailsPage = () => {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get('id');
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
        setRoleBasedUI(<ForwarderUI shipmentId={shipmentId || undefined} />);
        break;
      case UserRole.LOGISTICS_PROVIDER:
        setRoleBasedUI(<LogisticsProviderUI />);
        break;
      default:
        setRoleBasedUI(<div>Access denied</div>);
    }
  }, [user, shipmentId]);

  return (
    <ProtectedRoute 
      allowedRoles={[UserRole.ADMIN, UserRole.CLIENT, UserRole.FORWARDER, UserRole.LOGISTICS_PROVIDER]} 
    >
      {roleBasedUI}
    </ProtectedRoute>
  );
};

export default OrdersDetailsPage;
