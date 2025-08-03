'use client';

import { useEffect, useState } from 'react';
import { useAuthStore, UserRole } from '@/store/authStore';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const ClientUI = ({ shipmentId }: { shipmentId?: string }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipment Details</h2>
      {shipmentId && (
        <p className="text-gray-600 mb-4">Shipment ID: {shipmentId}</p>
      )}
      <p className="text-gray-600">Client view - Coming Soon...</p>
    </div>
  );
};

const ForwarderUI = ({ shipmentId }: { shipmentId?: string }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipment Details</h2>
      {shipmentId && (
        <p className="text-gray-600 mb-4">Shipment ID: {shipmentId}</p>
      )}
      <p className="text-gray-600">Forwarder view - Coming Soon...</p>
    </div>
  );
};

const LogisticsProviderUI = ({ shipmentId }: { shipmentId?: string }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipment Details</h2>
      {shipmentId && (
        <p className="text-gray-600 mb-4">Shipment ID: {shipmentId}</p>
      )}
      <p className="text-gray-600">Logistics Provider view - Coming Soon...</p>
    </div>
  );
};

const AdminUI = ({ shipmentId }: { shipmentId?: string }) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipment Details</h2>
      {shipmentId && (
        <p className="text-gray-600 mb-4">Shipment ID: {shipmentId}</p>
      )}
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
        setRoleBasedUI(<AdminUI shipmentId={shipmentId || undefined} />);
        break;
      case UserRole.CLIENT:
        setRoleBasedUI(<ClientUI shipmentId={shipmentId || undefined} />);
        break;
      case UserRole.FORWARDER:
        setRoleBasedUI(<ForwarderUI shipmentId={shipmentId || undefined} />);
        break;
      case UserRole.LOGISTICS_PROVIDER:
        setRoleBasedUI(<LogisticsProviderUI shipmentId={shipmentId || undefined} />);
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
