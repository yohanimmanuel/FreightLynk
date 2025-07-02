'use client';

import BookingCreation from "@/app/components/shipmentsbooking/BookingCreation";
import { useRouter } from "next/navigation";

const ClientUI = () => {
  const router = useRouter();
  const handleSubmitBooking = () => {
    router.push('/bookings/review');
  };

  return (
    <div>
      <BookingCreation onSubmitBooking={handleSubmitBooking} />
    </div>
  );
};

const ForwarderUI = () => <div></div>;
const LogisticsProviderUI = () => <div><h2>Logistics Provider Invoice Interface</h2><p>Coming Soon...</p></div>;
const AdminUI = () => <div><h2>Admin Invoice Interface</h2><p>Coming Soon...</p></div>;

const Create = ({ userType }: { userType: string }) => {
  const testUserType: string = 'client';
  if (testUserType === 'client') return <ClientUI />;
  if (testUserType === 'forwarder') return <ForwarderUI />;
  if (testUserType === 'logistics') return <LogisticsProviderUI />;
  if (testUserType === 'admin') return <AdminUI />;
  return <div>Access denied</div>;
};

export default Create;