import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Package, X, Ship, Truck, Plane } from 'lucide-react';

interface Booking {
  bookingId: string;
  origin: string;
  destination: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'In Transit';
  date: string;
  shipmentType?: 'ocean' | 'air' | 'truck';
  weight?: string;
  value?: string;
}

const BookingCalendarBig = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Updated booking data to match BookingCalendar.tsx
  const bookings: Booking[] = [
    {
      bookingId: "BL-239181",
      origin: "Jakarta, ID",
      destination: "Los Angeles, US",
      status: "Confirmed",
      date: "2025-06-18",
      shipmentType: "air",
      weight: "2.5 tons",
      value: "$12,000"
    },
    {
      bookingId: "BL-832794",
      origin: "Singapore, SG",
      destination: "Bangkok, TH",
      status: "Pending",
      date: "2025-06-18",
      shipmentType: "truck",
      weight: "15 tons",
      value: "$8,500"
    },
    {
      bookingId: "BL-445123",
      origin: "Hong Kong, HK",
      destination: "Rotterdam, NL",
      status: "Confirmed",
      date: "2025-06-20",
      shipmentType: "ocean",
      weight: "25 TEU",
      value: "$45,000"
    },
    {
      bookingId: "BL-667890",
      origin: "Shanghai, CN",
      destination: "Hamburg, DE",
      status: "In Transit",
      date: "2025-06-22",
      shipmentType: "ocean",
      weight: "18 TEU",
      value: "$35,000"
    },
    {
      bookingId: "BL-778901",
      origin: "Manila, PH",
      destination: "Tokyo, JP",
      status: "Pending",
      date: "2025-06-25",
      shipmentType: "ocean",
      weight: "8 TEU",
      value: "$18,000"
    },
    {
      bookingId: "BL-889012",
      origin: "Mumbai, IN",
      destination: "Dubai, AE",
      status: "Cancelled",
      date: "2025-06-28",
      shipmentType: "air",
      weight: "3.2 tons",
      value: "$15,500"
    },
    {
      bookingId: "BL-990123",
      origin: "Kuala Lumpur, MY",
      destination: "Sydney, AU",
      status: "Confirmed",
      date: "2025-06-30",
      shipmentType: "air",
      weight: "2.8 tons",
      value: "$13,200"
    }
  ];

  const statusColors = {
    'Confirmed': 'bg-green-100 text-green-800 border-green-200',
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Cancelled': 'bg-red-100 text-red-800 border-red-200',
    'In Transit': 'bg-blue-100 text-blue-800 border-blue-200'
  };

  const statusIcons = {
    'Confirmed': '✓',
    'Pending': '⏳',
    'Cancelled': '✕',
    'In Transit': '🚢'
  };

  const transportIcons = {
    ocean: Ship,
    air: Plane,
    truck: Truck
  };

  // Get calendar days for current month
  const getCalendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, [currentDate]);

  // Get week days for current week
  const getWeekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentDate]);

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(booking => booking.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (view === 'month') {
        newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      } else {
        newDate.setDate(prev.getDate() + (direction === 'next' ? 7 : -7));
      }
      return newDate;
    });
  };

  const formatDateHeader = () => {
    if (view === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else {
      const weekDays = getWeekDays;
      const start = weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const end = weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${start} - ${end}, ${weekDays[0].getFullYear()}`;
    }
  };

  const renderBookingBadge = (booking: Booking) => {
    const TransportIcon = transportIcons[booking.shipmentType || 'ocean'];
    return (
      <div
        key={booking.bookingId}
        className={`text-xs px-1 py-0.5 rounded border cursor-pointer hover:shadow-sm transition-shadow ${statusColors[booking.status]}`}
        onClick={() => setSelectedBooking(booking)}
      >
        <div className="flex items-center gap-1">
          <TransportIcon size={8} />
          <span className="font-medium text-xs">{booking.bookingId}</span>
        </div>
        <div className="truncate text-xs">{booking.destination.split(',')[0]}</div>
      </div>
    );
  };

  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-0.5">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="p-1 text-center font-medium text-gray-600 text-xs">
          {day}
        </div>
      ))}
      {getCalendarDays.map((date, index) => (
        <div key={index} className="min-h-16 p-1 border border-gray-100">
          {date && (
            <>
              <div className="text-xs font-medium text-gray-700 mb-1">
                {date.getDate()}
              </div>
              <div className="space-y-0.5">
                {getBookingsForDate(date).slice(0, 2).map(booking => renderBookingBadge(booking))}
                {getBookingsForDate(date).length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{getBookingsForDate(date).length - 2}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );

  const renderWeekView = () => (
    <div className="space-y-1">
      <div className="grid grid-cols-7 gap-0.5">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-1 text-center font-medium text-gray-600 text-xs">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {getWeekDays.map((date, index) => (
          <div key={index} className="min-h-20 p-1 border border-gray-100 rounded">
            <div className="text-xs font-medium text-gray-700 mb-1">
              {date.getDate()}
            </div>
            <div className="space-y-0.5">
              {getBookingsForDate(date).map(booking => renderBookingBadge(booking))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm relative overflow-hidden">
      {/* Main Calendar Container - Full Width */}
      <div className="w-full">
        {/* Header */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              Booking Calendar
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-200 text-gray-500 rounded transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <h4 className="text-sm font-medium text-gray-900">{formatDateHeader()}</h4>
            <button
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-200 text-gray-500 rounded transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Calendar Body */}
        <div className="p-3">
          {view === 'month' ? renderMonthView() : renderWeekView()}
        </div>

        {/* Legend */}
        <div className="p-2 border-t border-gray-200 bg-white grid grid-cols-8">
          <div className="flex flex-wrap gap-3 text-xs col-span-7">
            <div className="flex items-center gap-1 text-green-500">
              <div className="w-2 h-2 bg-green-100 border border-green-200 rounded"></div>
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              <div className="w-2 h-2 bg-yellow-100 border border-yellow-200 rounded"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-1 text-[#007bff]">
              <div className="w-2 h-2 bg-blue-100 border border-blue-200 rounded"></div>
              <span>In Transit</span>
            </div>
            <div className="flex items-center gap-1 text-red-500">
              <div className="w-2 h-2 bg-red-100 border border-red-200 rounded"></div>
              <span>Cancelled</span>
            </div>
          </div>
          <div className="flex items-center gap-1 col-span-1">
              <div className="flex bg-gray-100 rounded p-0.5">
                <button
                  onClick={() => setView('month')}
                  className={`px-4 py-2 text-xs rounded transition-colors ${
                    view === 'month' 
                      ? 'bg-[#007bff] text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-4 py-2 text-xs rounded transition-colors ${
                    view === 'week' 
                      ? 'bg-[#007bff] text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Week
                </button>
              </div>
            </div>
        </div>
      </div>

      {/* Booking Details Sidebar - Left Overlay */}
      <div className={`absolute top-0 left-0 w-96 h-full bg-white shadow-xl border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
        selectedBooking ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {selectedBooking && (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-md text-gray-900 font-semibold">Booking Details</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1 text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Booking ID</label>
                  <p className="text-md font-semibold text-[#007bff]">{selectedBooking.bookingId}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedBooking.status]}`}>
                    {statusIcons[selectedBooking.status]} {selectedBooking.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                      <MapPin size={12} /> Origin
                    </label>
                    <p className="font-medium text-xs text-gray-900">{selectedBooking.origin}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                      <MapPin size={12} /> Destination
                    </label>
                    <p className="font-medium text-xs text-gray-900">{selectedBooking.destination}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                    <Clock size={12} /> Departure Date
                  </label>
                  <p className="font-medium text-xs text-gray-900">{new Date(selectedBooking.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>

                {selectedBooking.weight && (
                  <div>
                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                      <Package size={12} /> Weight/Volume
                    </label>
                    <p className="font-medium text-xs text-gray-900">{selectedBooking.weight}</p>
                  </div>
                )}

                {selectedBooking.value && (
                  <div>
                    <label className="text-xs font-medium text-gray-600">Cargo Value</label>
                    <p className="font-medium text-green-600 text-sm">{selectedBooking.value}</p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-gray-600">Transport Mode</label>
                  <div className="flex items-center gap-2 text-gray-900 mt-1">
                    {selectedBooking.shipmentType && (
                      <>
                        {React.createElement(transportIcons[selectedBooking.shipmentType], { size: 14, className: "text-[#007bff]" })}
                        <span className="font-medium capitalize text-sm">{selectedBooking.shipmentType}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay backdrop when sidebar is open */}
      {selectedBooking && (
        <div 
          className="absolute inset-0 bg-black/25 z-40"
          onClick={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default BookingCalendarBig;