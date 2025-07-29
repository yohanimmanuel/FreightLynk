'use client';

import BookingCreation from "@/app/components/clients/shipmentsbooking/BookingCreation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import PricingInvoiceForm from '@/app/components/forwarder/quotefinancing/PricingInvoiceForm';

const ClientUI = () => {
  const router = useRouter();
  const setBookingSubmitted = useBookingStore(state => state.setBookingSubmitted);
  const bookingSubmitted = useBookingStore(state => state.bookingSubmitted);

  const handleSubmitBooking = () => {
    router.push('/bookings/review');
  };

  useEffect(() => {
    // If booking is submitted, redirect to submitted page
    if (bookingSubmitted) {
      router.replace('/bookings/submitted');
      return;
    }

    // Reset booking state when starting a new booking
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('bookingSubmitted');
      localStorage.removeItem('bookingSubmitted');
      localStorage.removeItem('bookingFlNumber');
    }
    setBookingSubmitted(false);
  }, [setBookingSubmitted, bookingSubmitted, router]);

  return (
    <div>
      <BookingCreation onSubmitBooking={handleSubmitBooking} />
    </div>
  );
};

const ForwarderUI = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2 text-gray-900">Create Pricing/Invoice</h2>
      <PricingInvoiceForm />
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