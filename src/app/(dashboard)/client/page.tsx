'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Ship, Clock, DollarSign, AlertTriangle, Bell, TrendingUp, Package, Calendar, FileText, Navigation, Truck } from 'lucide-react';
import ShipmentMapTracker from '@/app/components/clients/shipmentsbooking/ShipmentMapTracker';
import BookingCalendar from '@/app/components/clients/shipmentsbooking/BookingCalendar';
import Image from 'next/image';
import ShipmentTable from '@/app/components/clients/shipmentsbooking/ShipmentTable';
import ShipmentMilestone from '@/app/components/clients/shipmentsbooking/ShipmentMilestone';
import IndustryNews from '@/app/components/clients/shipmentsbooking/IndustryNews';
import ShipmentAlert from '@/app/components/clients/shipmentsbooking/ShipmentAlert';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { UserRole } from '@/store/authStore';
import { CalendarBooking } from '@/store/types';
import { useBookingStore } from '@/store/bookingStore';

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


const FreightLynkDashboard = () => {
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

  
  const handleSeeAllTracking = () => {
    router.push('/shipments/track');
  };

  const handleSeeAllShipments = () => {
    router.push('/shipments/all');
  };

  const handleSeeAllMilestone = () => {
    router.push('/shipments/track');
  };
  
  return (
    <ProtectedRoute allowedRoles={[UserRole.CLIENT]}>
      <div className="min-h-screen w-full">
        <div className="flex flex-col w-full px-2 sm:px-4 lg:px-4 py-2">
          {/* Full width title section */}
          <div className="mb-4 sm:mb-6 w-full">
            <div className="relative bg-gradient-to-r from-[#007bff] to-blue-500 text-white p-8 shadow-sm rounded-lg w-full overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-3xl font-semibold mb-2">Welcome back, Jane!</h2>
                <p className="text-white text-md sm:text-md">Here's what's happening with your freight operations today</p>
              </div>
              <Image
                src={"/FreightLynkWLogo.svg"}
                height={300}
                width={300}
                alt="FreightLynk Logo"
                className="absolute inset-10 left-250 m-auto opacity-10 w-48 sm:w-72 md:w-96 h-auto object-contain pointer-events-none z-0"
              />
            </div>
          </div>
          
          {/* Two column layout - left larger than right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
            {/* Left side - Map and Table (75% width on large screens) */}
            <div className="lg:col-span-2 space-y-4">
              <ShipmentMapTracker onSeeAll={handleSeeAllTracking} />     
              <ShipmentTable 
                view="summary" 
                onSeeAll={handleSeeAllShipments}
              />  
              <ShipmentMilestone onSeeAll={handleSeeAllMilestone} />
            </div>
            
            {/* Right side - Calendar (25% width on large screens) */}
            <div className="lg:col-span-1 space-y-4">
              <BookingCalendar bookings={calendarBookings} />
              <IndustryNews />
              <ShipmentAlert />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default FreightLynkDashboard;