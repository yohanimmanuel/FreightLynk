'use client';

import BookingCalendar from "@/app/components/shipmentsbooking/BookingCalendar";
import BookingTable from "@/app/components/shipmentsbooking/BookingTable";
import { useRouter } from 'next/navigation';

const ClientUI = () => {
  const router = useRouter();
  
  const handleCreateBooking = () => {
    router.push('/bookings/create');
  };
 
  return (
    <div className="grid grid-cols-3 gap-4 px-4">
      <div className="col-span-2">
        <BookingTable 
         onCreateBooking={handleCreateBooking}
        />
      </div>
      <div className="col-span-1 p-2">
        <BookingCalendar />
      </div>
    </div>
  );
};

const ForwarderUI = () => {
  const router = useRouter();
  
  const handleCreateBooking = () => {
    router.push('/bookings/create');
  };
 
  return (
    <div className="grid grid-cols-3 gap-4 px-4">
      <div className="col-span-2">
        <BookingTable 
         onCreateBooking={handleCreateBooking}
        />
      </div>
      <div className="col-span-1 p-2">
        <BookingCalendar />
      </div>
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

const BookingPage = ({ userType }: { userType: string }) => {
  // Manually set userType for testing - change this value to test different UIs
  const testUserType: string = 'forwarder'; // Change to: 'client', 'forwarder', 'logistics', 'admin'
  
  if (testUserType === 'client') return <ClientUI />;
  if (testUserType === 'forwarder') return <ForwarderUI />;
  if (testUserType === 'logistics') return <LogisticsProviderUI />;
  if (testUserType === 'admin') return <AdminUI />;
  
  return <div>Access denied</div>;
};

export default BookingPage;