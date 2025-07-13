import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


// You may want to adapt this type to your actual booking data
export type CalendarBooking = {
  bookingId: string;
  status: string;
  originPort: string;
  destinationPort: string;
  cargoReadyDate: string; // YYYY-MM-DD
  weight?: string;
  volume?: string;
  transportMode?: string;
};

interface ForwarderBookingCalendarProps {
  bookings?: CalendarBooking[];
}

const ForwarderBookingCalendar: React.FC<ForwarderBookingCalendarProps> = ({ bookings }) => {

  const calendarBookings: CalendarBooking[] = bookings || [];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Get calendar days for current month
  const getCalendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Make Monday = 0
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(new Date(year, month, day));
    return days;
  }, [currentDate]);

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const hasBooking = (date: Date) => {
    const dateKey = formatDateKey(date);
    return calendarBookings.some(booking => booking.cargoReadyDate === dateKey);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(formatDateKey(date));
  };

  const getBookingsForDate = (dateKey: string) => {
    return calendarBookings.filter(booking => booking.cargoReadyDate === dateKey);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
    setSelectedDate(null);
  };

  const formatDateHeader = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Quick action: count bookings needing quotes
  const pendingQuotes = calendarBookings.filter(b => b.status.toLowerCase() === 'pending').length;

  const selectedBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm w-full">
      {/* Quick Actions */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Calendar</h3>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-600">{pendingQuotes} bookings need quotes</span>
          <button className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-medium">View Pending Quotes</button>
        </div>
      </div>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronLeft size={15} className="text-gray-600" />
        </button>
        <h2 className="text-sm font-medium text-gray-900">{formatDateHeader()}</h2>
        <button
          onClick={() => navigateMonth('next')}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronRight size={15} className="text-gray-600" />
        </button>
      </div>
      {/* Calendar Grid */}
      <div className="mb-2">
        <div className="grid grid-cols-7">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center py-2">
              <span className="text-xs font-medium text-gray-500">{day}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {getCalendarDays.map((date, index) => (
            <div key={index} className="aspect-square flex items-center justify-center relative">
              {date && (
                <button
                  onClick={() => handleDateClick(date)}
                  className={`w-10 h-10 flex flex-col items-center justify-center text-xs rounded transition-all
                    ${selectedDate === formatDateKey(date)
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'}
                    cursor-pointer`}
                >
                  <div className="flex flex-col items-center justify-center space-y-1 leading-none">
                    <span>{date.getDate()}</span>
                    {hasBooking(date) && (
                      <div className="w-1.5 h-1.5 bg-[#007bff] rounded-full" />
                    )}
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Events Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">
            {selectedDate
              ? `Bookings for ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
              : 'Events'}
          </h3>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {selectedBookings.length > 0 ? (
            selectedBookings.map((booking) => (
              <div key={booking.bookingId} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-xs text-gray-900">{booking.bookingId}</div>
                    <div className="text-xs text-gray-500">{booking.originPort} → {booking.destinationPort}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-medium ml-2">{booking.status}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400 text-center py-4">Select a date to view bookings</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForwarderBookingCalendar; 