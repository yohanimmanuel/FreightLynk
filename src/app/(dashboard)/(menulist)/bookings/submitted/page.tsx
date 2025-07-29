'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserRole } from '@/store/authStore';
import ProtectedRoute from '@/app/components/ProtectedRoute';

const ClientUI = () => {
  const router = useRouter();
  
  // Clear booking state when user reaches submitted page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bookingSubmitted');
      localStorage.removeItem('bookingFlNumber');
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-md flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Submitted</h1>
        <p className="text-gray-700 mb-6 text-center">Your booking has been submitted.<br/>Please go to the Bookings menu to view your booking details.</p>
        <button
          className="px-6 py-2 bg-[#007bff] text-white rounded-lg font-semibold hover:bg-blue-700"
          onClick={() => router.push('/bookings')}
        >
          Go to Bookings
        </button>
      </div>
    </div>
  );
};

const ForwarderUI = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-md flex flex-col items-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Forwarder Submission</h1>
      <p className="text-gray-700 mb-6 text-center">Your booking as a forwarder has been submitted.</p>
    </div>
  </div>
);

const LogisticsProviderUI = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-md flex flex-col items-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Logistics Provider Submission</h1>
      <p className="text-gray-700 mb-6 text-center">Your booking as a logistics provider has been submitted.</p>
    </div>
  </div>
);

const AdminUI = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-white">
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-md flex flex-col items-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Submission</h1>
      <p className="text-gray-700 mb-6 text-center">Your booking as an admin has been submitted.</p>
    </div>
  </div>
);

const BookingSubmittedPage = () => {
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

export default BookingSubmittedPage; 