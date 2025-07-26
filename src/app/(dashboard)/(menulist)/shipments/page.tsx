'use client';

import { useRouter } from 'next/navigation';
import IndustryNews from "@/app/components/clients/shipmentsbooking/IndustryNews";
import ShipmentAlerts from "@/app/components/clients/shipmentsbooking/ShipmentAlert";
import ShipmentMapTracker from "@/app/components/clients/shipmentsbooking/ShipmentMapTracker";
import ShipmentMilestone from '@/app/components/clients/shipmentsbooking/ShipmentMilestone';
import { useEffect, useState } from 'react';
import BookingTable from '@/app/components/clients/shipmentsbooking/BookingTable';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const ClientUI = () => {
   const router = useRouter();

   // Use the Zustand store for bookings
   const { confirmedBookings, isLoading, error, loadBookings } = useBookingStore();

   useEffect(() => {
     loadBookings();
   }, [loadBookings]);

  // Handle navigation to the bookings page
  const handleSeeAllBookings = () => {
    router.push('/bookings');
  };

  // Handle navigation to the tracking page
  const handleSeeAllTracking = () => {
    router.push('/shipments/track');
  };

  const handleSeeAllMilestone = () => {
    router.push('/shipments/track');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Shipments</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full mb-4">
            {/* Left side - Map and Table (75% width on large screens) */}
            <div className="lg:col-span-2 space-y-4">
             <ShipmentMapTracker onSeeAll={handleSeeAllTracking} />     

              {/* Booking summary view */}
              <BookingTable
                view="summary"
                bookings={confirmedBookings}
                onSeeAll={handleSeeAllBookings}
                maxRows={5}
                title="Your bookings"
              />
              
              <ShipmentMilestone onSeeAll={handleSeeAllMilestone} />
              </div>
            
            {/* Right side - Calendar (25% width on large screens) */}
            <div className="lg:col-span-1 space-y-4">
              <ShipmentAlerts />
              <IndustryNews />
            </div>
        </div>
    </div>
  );
};

const ForwarderUI = () => {

  return (
    <div className="p-4">
    </div>
  );
};

const LogisticsProviderUI = () => {
  return (
    <div>
      <h2>Logistics Provider Shipments</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const AdminUI = () => {
  return (
    <div>
      <h2>Admin Shipments</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const ShipmentsPage = () => {
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

export default ShipmentsPage;