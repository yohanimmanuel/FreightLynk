'use client';

import BookingCreation from "@/app/components/clients/shipmentsbooking/BookingCreation";
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { useBookingStore } from '@/store/bookingStore';

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

const Create = ({ userType }: { userType: string }) => {
  const testUserType: string = 'client';
  if (testUserType === 'client') return <ClientUI />;
  if (testUserType === 'forwarder') return <ForwarderUI />;
  if (testUserType === 'logistics') return <LogisticsProviderUI />;
  if (testUserType === 'admin') return <AdminUI />;
  return <div>Access denied</div>;
};

export default Create;