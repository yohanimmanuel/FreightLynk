'use client';

import BookingCalendar from "@/app/components/shipmentsbooking/BookingCalendar";
import BookingTable from "@/app/components/shipmentsbooking/BookingTable";
import { Download, Plus, Upload } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { CalendarBooking } from '@/store/types';

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
  transportModeValue?: string;
};

const ClientUI = () => {
  const router = useRouter();
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  
  // Load confirmed bookings from localStorage
  const loadBookings = () => {
    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem('confirmedBookings');
        const bookings = data ? JSON.parse(data) : [];
        console.log('Loading bookings from localStorage:', bookings);
        setConfirmedBookings(bookings);
      } catch (error) {
        console.error('Error loading bookings:', error);
        setConfirmedBookings([]);
      }
    }
  };

  // Load bookings on mount and when storage changes
  useEffect(() => {
    // Initial load
    loadBookings();

    // Add event listeners
    window.addEventListener('storage', loadBookings);

    // Set up interval to check localStorage every second
    const interval = setInterval(loadBookings, 1000);

    // Cleanup
    return () => {
      window.removeEventListener('storage', loadBookings);
      clearInterval(interval);
    };
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
    const bookingStore = useBookingStore.getState();
    bookingStore.clearBooking();
    bookingStore.setBookingSubmitted(false);
    // Debug log to confirm state is empty
    console.log('After clearBooking:', bookingStore.formData, bookingStore.selectedPOs, bookingStore.bookingSubmitted);
    router.push('/bookings/create');
  };

  // Remove bookings handler
  const handleRemoveBookings = (ids: string[]) => {
    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem('confirmedBookings');
        const bookings = data ? JSON.parse(data) : [];
        const updated = bookings.filter((b: Booking) => !ids.includes(b.id));
        localStorage.setItem('confirmedBookings', JSON.stringify(updated));
        setConfirmedBookings(updated);
        console.log('Removed bookings:', ids);
        console.log('Updated bookings:', updated);
      } catch (error) {
        console.error('Error removing bookings:', error);
      }
    }
  };

  // Map confirmedBookings to CalendarBooking[]
  const calendarBookings: CalendarBooking[] = confirmedBookings.map(b => ({
    bookingId: b.id,
    status: b.status,
    originPort: b.origin,
    destinationPort: b.destination,
    cargoReadyDate: b.cargoReadyDate,
    weight: b.weight,
    volume: b.volume,
    cargoValue: b.status === 'Booked' ? 'awaiting pricing' : '',
    transportMode: b.transportModeValue || '',
  }));

  const bookingsWithTransportMode = confirmedBookings.map(b => ({
    ...b,
    transportMode: b.transportModeValue || '',
  }));

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
          <BookingTable bookings={bookingsWithTransportMode} onRemoveBookings={handleRemoveBookings} />
        </div>
        <div className="md:col-span-1 col-span-1 p-0 md:p-2 mt-4 md:mt-0">
          <BookingCalendar bookings={calendarBookings} />
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