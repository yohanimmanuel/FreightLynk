export interface CalendarBooking {
  bookingId: string;
  status: string;
  originPort: string;
  destinationPort: string;
  cargoReadyDate: string;
  weight: string;
  volume: string;
  cargoValue: string; // If pricing is awaiting, use 'awaiting pricing'
  transportMode: string;
} 