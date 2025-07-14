import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, X } from 'lucide-react';
import { CalendarBooking } from '@/store/types';

// Import the existing BookingCalendarBig component
import BookingCalendarBig from './BookingCalendarBig';

interface BookingCalendarProps {
  bookings: CalendarBooking[];
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showBigCalendar, setShowBigCalendar] = useState(false);

  // Get calendar days for current month
  const getCalendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Make Monday = 0

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

  // Helper to format a Date object as YYYY-MM-DD in local time
  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const hasBooking = (date: Date) => {
    const dateKey = formatDateKey(date);
    return bookings.some(booking => booking.cargoReadyDate === dateKey);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const handleDateClick = (date: Date) => {
    const dateKey = formatDateKey(date);
    setSelectedDate(dateKey);
  };

  const getBookingsForDate = (dateKey: string) => {
    return bookings.filter(booking => booking.cargoReadyDate === dateKey);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Booked':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Payment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const selectedBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  return (
    <>
      <div className="bg-white p-3 border border-gray-200 rounded-lg mx-auto">
        <div className="flex items-center justify-between mb-3 mt-1">
          <h3 className="text-base font-semibold text-gray-900">
            Calendar
          </h3>
          <button
            onClick={() => setShowBigCalendar(true)}
            className="px-5 py-1.5 text-sm bg-[#007bff] text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            See All
          </button>
        </div>
        <div className="border-b border-gray-200 mb-4"></div>
        
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
          {/* Day Headers */}
          <div className="grid grid-cols-7">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center py-2">
                <span className="text-xs font-medium text-gray-500">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {getCalendarDays.map((date, index) => (
              <div key={index} className="aspect-square flex items-center justify-center relative">
                {date && (
                  <button
                    onClick={() => handleDateClick(date)}
                    className={`
                      w-10 h-10 flex flex-col items-center justify-center text-xs rounded transition-all
                      ${isToday(date) 
                        ? 'bg-[#007bff] text-white font-medium' 
                        : selectedDate === formatDateKey(date)
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : isWeekend(date)
                        ? 'text-red-500 hover:bg-gray-50'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                      cursor-pointer
                    `}
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
                : 'Events'
              }
            </h3>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <MoreHorizontal size={16} className="text-gray-400" />
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {selectedBookings.length > 0 ? (
              selectedBookings.map((booking) => {
                const [year, month, day] = booking.cargoReadyDate.split('-').map(Number);
                const date = new Date(year, month - 1, day);
                return (
                  <div key={booking.bookingId} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-xs text-gray-900">{booking.bookingId}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {booking.originPort} → {booking.destinationPort}
                    </p>
                  </div>
                );
              })
            ) : selectedDate ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-xs">No bookings scheduled for this date</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-xs">Select a date to view bookings</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Big Calendar Modal */}
      {showBigCalendar && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="relative w-full max-w-6xl mx-auto">
            <BookingCalendarBig bookings={bookings} />
            <button
              className="absolute top-2 right-2 p-2 bg-white rounded-lg text-gray-700 hover:bg-gray-100"
              onClick={() => setShowBigCalendar(false)}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCalendar;