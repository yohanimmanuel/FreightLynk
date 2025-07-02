'use client';

import BookingConfirm from "@/app/components/shipmentsbooking/BookingConfirm";
import { useSearchParams } from 'next/navigation';

const ClientUI = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id') || undefined;
  return (
    <div>
      <BookingConfirm bookingId={bookingId} />
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

const Confirmation = ({ userType }: { userType: string }) => {
  // Manually set userType for testing - change this value to test different UIs
  const testUserType: string = 'client'; // Change to: 'client', 'forwarder', 'logistics', 'admin'
  
  if (testUserType === 'client') return <ClientUI />;
  if (testUserType === 'forwarder') return <ForwarderUI />;
  if (testUserType === 'logistics') return <LogisticsProviderUI />;
  if (testUserType === 'admin') return <AdminUI />;
  
  return <div>Access denied</div>;
};

export default Confirmation;