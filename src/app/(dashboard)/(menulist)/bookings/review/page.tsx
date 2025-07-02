'use client';

import React, { useEffect } from 'react';
import BookingReview from "@/app/components/shipmentsbooking/BookingReview";
import { useRouter } from "next/navigation";
import { useBookingStore } from '@/store/bookingStore';

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
      <h2>Forwarder</h2>
      <p>Coming Soon...</p>
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

const Review = ({ userType }: { userType: string }) => {
  // Manually set userType for testing - change this value to test different UIs
  const testUserType: string = 'client'; // Change to: 'client', 'forwarder', 'logistics', 'admin'
  
  if (testUserType === 'client') return <ClientUI />;
  if (testUserType === 'forwarder') return <ForwarderUI />;
  if (testUserType === 'logistics') return <LogisticsProviderUI />;
  if (testUserType === 'admin') return <AdminUI />;
  
  return <div>Access denied</div>;
};

export default Review;