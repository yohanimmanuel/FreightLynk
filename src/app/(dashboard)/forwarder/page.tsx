'use client';

import React, { useState } from 'react';
import { MapPin, Ship, Clock, DollarSign, AlertTriangle, Bell, TrendingUp, Package, Calendar, FileText, Navigation, Truck } from 'lucide-react';
import ShipmentMapTracker from '@/app/components/shipmentsbooking/ShipmentMapTracker';
import BookingCalendar from '@/app/components/shipmentsbooking/BookingCalendar';
import Image from 'next/image';
import ShipmentTable from '@/app/components/shipmentsbooking/ShipmentTable';
import ShipmentMilestone from '@/app/components/shipmentsbooking/ShipmentMilestone';
import IndustryNews from '@/app/components/shipmentsbooking/IndustryNews';
import ShipmentAlert from '@/app/components/shipmentsbooking/ShipmentAlert';
import { useRouter } from 'next/navigation';

const FreightLynkDashboard = () => {
  const router = useRouter();
  
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
            <BookingCalendar bookings={[]} />
            <IndustryNews />
            <ShipmentAlert />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreightLynkDashboard;