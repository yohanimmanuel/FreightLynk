'use client';

import React, { useEffect, useState } from 'react';
import BookingReview from "@/app/components/clients/shipmentsbooking/BookingReview";
import { useRouter } from "next/navigation";
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const ClientUI = () => {
  const router = useRouter();
  const flNumber = useBookingStore(state => state.flNumber);
  const bookingSubmitted = useBookingStore(state => state.bookingSubmitted);

  useEffect(() => {
    // Check if we're coming from confirmation page or if booking is already submitted
    if (typeof window !== 'undefined') {
      const confirmedBookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
      if (bookingSubmitted || (flNumber && confirmedBookings.some((b: any) => b.id === flNumber))) {
        router.replace('/bookings/submitted');
        return;
      }
    }
  }, [router, flNumber, bookingSubmitted]);

  const handleConfirmBooking = () => {
    router.push('/bookings/confirmation');
  };

  return (
    <div>
      <BookingReview onConfirmBooking={handleConfirmBooking} />
    </div>
  );
};

const ForwarderUI = () => {
  return (
    <div>
      <h2>Forwarder Booking Review</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const LogisticsProviderUI = () => {
  return (
    <div>
      <h2>Logistics Provider Booking Review</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const AdminUI = () => {
  return (
    <div>
      <h2>Admin Booking Review</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const ReviewBookingPage = () => {
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

export default ReviewBookingPage;