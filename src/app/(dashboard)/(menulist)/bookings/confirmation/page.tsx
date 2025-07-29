'use client';

import BookingConfirm from "@/app/components/clients/shipmentsbooking/BookingConfirm";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore, UserRole } from '@/store/authStore';
import { useBookingStore } from '@/store/bookingStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const ClientUI = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id') || undefined;
  const router = useRouter();
  const bookingSubmitted = useBookingStore(state => state.bookingSubmitted);

  console.log('Confirmation page loaded with:', { bookingId, bookingSubmitted });

  // Prevent going back to review page after booking submission
  useEffect(() => {
    const handlePopState = () => {
      if (bookingSubmitted) {
        // If user tries to go back and booking is submitted, redirect to submitted page
        router.replace('/bookings/submitted');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [bookingSubmitted, router]);

  return (
    <div>
      <BookingConfirm bookingId={bookingId} />
    </div>
  );
};

const ForwarderUI = () => {
  return (
    <div>
      <h2>Forwarder Booking Confirmation</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const LogisticsProviderUI = () => {
  return (
    <div>
      <h2>Logistics Provider Booking Confirmation</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const AdminUI = () => {
  return (
    <div>
      <h2>Admin Booking Confirmation</h2>
      <p>Coming Soon...</p>
    </div>
  );
};

const ConfirmationPage = () => {
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

export default ConfirmationPage;