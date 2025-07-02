'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface BookingSubmittedProps {
  userType?: string;
}

const ClientUI = () => {
  const router = useRouter();
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

const BookingSubmitted: React.FC<BookingSubmittedProps> = ({ userType = 'client' }) => {
  if (userType === 'client') return <ClientUI />;
  if (userType === 'forwarder') return <ForwarderUI />;
  if (userType === 'logistics') return <LogisticsProviderUI />;
  if (userType === 'admin') return <AdminUI />;
  return <div>Access denied</div>;
};

export default BookingSubmitted; 