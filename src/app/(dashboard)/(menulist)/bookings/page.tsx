'use client';

import BookingCalendar from "@/app/components/shipmentsbooking/BookingCalendar";
import BookingTable from "@/app/components/shipmentsbooking/BookingTable";
import { Download, Plus, Upload } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Booking type (should match BookingTable)
type Booking = {
  id: string;
  shipmentId?: string;
  poNumber: string;
  productName: string;
  hsCode: string;
  consignee: string;
  shipper: string;
  origin: string;
  destination: string;
  shipmentType: string;
  containerType: string;
  incoterms: string;
  cargoReadyDate: string;
  dangerousGoods: boolean;
  weight: string;
  volume: string;
  pieces: number;
  status: string;
  eta: string;
};

const ClientUI = () => {
  const router = useRouter();
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  
  // Load confirmed bookings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('confirmedBookings');
      if (data) {
        setConfirmedBookings(JSON.parse(data));
      }
    }
  }, []);
  
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-2 md:px-4">
        <div className="md:col-span-2 col-span-1">
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 mt-3 pb-3 border-b border-gray-200 gap-2">
              <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
              <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-2">
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
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#007bff] rounded-lg hover:bg-blue-700"
              >
                  <Plus className="w-4 h-4" />
                  Create Booking
              </button>
              </div>
          </div>
          <BookingTable bookings={confirmedBookings} />
        </div>
        <div className="md:col-span-1 col-span-1 p-0 md:p-2 mt-4 md:mt-0">
          <BookingCalendar />
        </div>
      </div>
    </div>
  );
};

const ForwarderUI = () => {
  return (
    <div>
      <h2>Forwarder Invoice Interface</h2>
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