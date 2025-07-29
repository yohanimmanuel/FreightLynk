'use client';

import React, { useEffect, useState } from 'react';
import BookingReview from "@/app/components/clients/shipmentsbooking/BookingReview";
import { useRouter, useSearchParams } from "next/navigation";
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const ClientUI = () => {
  const router = useRouter();
  const flNumber = useBookingStore(state => state.flNumber);
  const bookingSubmitted = useBookingStore(state => state.bookingSubmitted);
  const formData = useBookingStore(state => state.formData);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if booking is already submitted, redirect to submitted page
    if (bookingSubmitted) {
      console.log('Booking already submitted, redirecting to submitted page');
      router.replace('/bookings/submitted');
      return;
    }

    // Check if there's no form data, redirect to create page
    if (!formData || Object.keys(formData).length === 0) {
      console.log('No form data, redirecting to create page');
      router.replace('/bookings/create');
      return;
    }
  }, [router, bookingSubmitted, formData]);

  // Additional check on component mount
  useEffect(() => {
    // Check if there's a booking ID in URL (user trying to access existing booking)
    const bookingId = searchParams.get('id');
    if (bookingId) {
      console.log('Booking ID in URL detected, redirecting to confirmation page');
      router.replace(`/bookings/confirmation?id=${bookingId}`);
      return;
    }
  }, [router, searchParams]);

  // Prevent going back to this page after booking submission
  useEffect(() => {
    const handlePopState = () => {
      // Check if bookingSubmitted is true in current state
      if (bookingSubmitted) {
        console.log('Booking submitted detected in state during popstate, redirecting');
        router.replace('/bookings/submitted');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router, bookingSubmitted]);

  // Block browser back button more aggressively
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if bookingSubmitted is true when user tries keyboard navigation
      if (bookingSubmitted && (e.key === 'Backspace' || e.altKey)) {
        e.preventDefault();
        router.replace('/bookings/submitted');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router, bookingSubmitted]);

  const handleConfirmBooking = () => {
    console.log('handleConfirmBooking called, navigating to confirmation page');
    // Add a small delay to ensure state is updated
    setTimeout(() => {
      router.push('/bookings/confirmation');
    }, 100);
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