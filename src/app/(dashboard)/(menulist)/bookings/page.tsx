'use client';

import BookingCalendar from "@/app/components/shipmentsbooking/BookingCalendar";
import BookingTable from "@/app/components/shipmentsbooking/BookingTable";
import { Download, Plus, Upload } from "lucide-react";
import { useRouter } from 'next/navigation';

const ClientUI = () => {
  const router = useRouter();
  
  const handleExportCSV = () => {
    // In a real app, this would generate and download a CSV file
    console.log('Exporting CSV...');
  };
  
  const handleImportCSV = () => {
    // In a real app, this would open a file dialog and process the CSV
    console.log('Importing CSV...');
  };

  const handleCreateBooking = () => {
    router.push('/bookings/create');
  };
 
  return (
    <div>
      {/* Header and Calendar Layout */}
      <div className="grid grid-cols-3 gap-4 px-4">
        <div className="col-span-2">
          {/* Header Controls */}
          <div className="flex items-center justify-between mb-6 mt-3 pb-3 border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
              <div className="flex items-center space-x-2">
              <button
                  onClick={handleImportCSV}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-200"
              >
                  <Upload className="w-4 h-4" />
                  Import CSV
              </button>
              <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-200"
              >
                  <Download className="w-4 h-4" />
                  Export CSV
              </button>
              <button
                  onClick={handleCreateBooking}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#007bff] rounded-lg hover:bg-blue-700"
              >
                  <Plus className="w-4 h-4" />
                  Create Booking
              </button>
              </div>
          </div>
          <BookingTable />
        </div>
        <div className="col-span-1 p-2">
          <BookingCalendar />
        </div>
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
  const testUserType: string = 'client'; // Change to: 'client', 'forwarder', 'logistics', 'admin'
  
  if (testUserType === 'client') return <ClientUI />;
  if (testUserType === 'forwarder') return <ForwarderUI />;
  if (testUserType === 'logistics') return <LogisticsProviderUI />;
  if (testUserType === 'admin') return <AdminUI />;
  
  return <div>Access denied</div>;
};

export default BookingPage;