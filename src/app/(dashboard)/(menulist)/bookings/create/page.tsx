'use client';

import BookingCreation from "@/app/components/clients/shipmentsbooking/BookingCreation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const ClientUI = () => {
  const router = useRouter();
  const setBookingSubmitted = useBookingStore(state => state.setBookingSubmitted);

  const handleSubmitBooking = () => {
    router.push('/bookings/review');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('bookingSubmitted');
    }
    setBookingSubmitted(false);
  }, [setBookingSubmitted]);

  return (
    <div>
      <BookingCreation onSubmitBooking={handleSubmitBooking} />
    </div>
  );
};

const ForwarderUI = () => {
  return (
    <div>
      <h2>Forwarder Booking Creation</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const LogisticsProviderUI = () => {
  return (
    <div>
      <h2>Logistics Provider Booking Creation</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const AdminUI = () => {
  return (
    <div>
      <h2>Admin Booking Creation</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const CreateBookingPage = () => {
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

export default CreateBookingPage;