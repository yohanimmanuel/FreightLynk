import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShipmentMilestone {
  step: string;
  date: string;
  location: string;
  completed: boolean;
  description: string;
}

export interface ShipmentData {
  id: string;                    // FL-XXXXX format
  bookingId: string;            // Reference to booking
  poNumbers: string[];          // Purchase order numbers
  goods: {
    description: string;
    type: string;
    quantity: number;
    weight: number;
  };
  carrier: string;
  origin: {
    city: string;
    country: string;
  };
  destination: {
    city: string;
    country: string;
  };
  dates: {
    booking: string;
    departure: string;
    arrival: string;
  };
  status: 'In Transit' | 'Delayed' | 'Delivered' | 'Pending' | 'Cancelled';
  transportMode: 'Air' | 'Sea' | 'Road' | 'Rail';
  shipmentType: string;
  incoterms: string;
  container: string;
  milestones: ShipmentMilestone[];
  lastUpdate: string;
  shipper: string;
  consignee: string;
  forwarderCompany: string;
  progress: number; // 0-100, for progress bar
}

// Single mock data entry for design visualization
const mockShipment: ShipmentData = {
  id: 'FLYNK-SH42581',
  bookingId: 'FLYNK-42581',
  poNumbers: ['PO12345', 'PO12346'],
  goods: {
    description: 'Electronics Components',
    type: 'Electronics',
    quantity: 250,
    weight: 2500
  },
  carrier: 'Maersk Line',
  origin: {
    city: 'Shanghai',
    country: 'China'
  },
  destination: {
    city: 'Los Angeles',
    country: 'USA'
  },
  dates: {
    booking: '2025-06-10',
    departure: '2025-06-15',
    arrival: '2025-06-28'
  },
  status: 'In Transit',
  transportMode: 'Sea',
  shipmentType: 'FCL',
  incoterms: 'FOB',
  container: '1 x 40ft HC',
  milestones: [
    {
      step: 'Booking Confirmed',
      date: '2025-06-10 09:00',
      location: 'Shanghai, China',
      completed: true,
      description: 'Booking confirmed at origin office.'
    },
    {
      step: 'Container Picked Up',
      date: '2025-06-12 14:30',
      location: 'Shanghai, China',
      completed: true,
      description: 'Container picked up from shipper warehouse.'
    },
    {
      step: 'Gate In',
      date: '2025-06-13 16:45',
      location: 'Shanghai Port',
      completed: true,
      description: 'Container entered Shanghai Port.'
    },
    {
      step: 'Vessel Departure',
      date: '2025-06-15 10:00',
      location: 'Shanghai, China',
      completed: true,
      description: 'Vessel departed from Shanghai.'
    },
    {
      step: 'In Transit',
      date: '2025-06-18 10:30',
      location: 'Pacific Ocean',
      completed: true,
      description: 'Container is currently in transit across the Pacific Ocean.'
    }
  ],
  lastUpdate: '2025-06-18 10:30',
  shipper: 'Shanghai Electronics Ltd.',
  consignee: 'LA Tech Imports',
  forwarderCompany: 'Maersk Forwarding',
  progress: 70 // Example: fully completed
};

// Zustand store interface
export interface ShipmentStore {
  shipments: ShipmentData[];
  selectedShipment: ShipmentData | null;
  setSelectedShipment: (shipment: ShipmentData) => void;
  clearSelectedShipment: () => void;
  updateShipment: (updatedShipment: ShipmentData) => void;
  addShipment: (newShipment: ShipmentData) => void;
  deleteShipment: (id: string) => void;
  setShipments: (shipments: ShipmentData[]) => void;
}

// Create the store
export const useShipmentStore = create<ShipmentStore>()(
  persist(
    (set) => ({
      shipments: [mockShipment], // Initialize with single mock entry
      selectedShipment: null,
      setSelectedShipment: (shipment: ShipmentData) => set({ selectedShipment: shipment }),
      clearSelectedShipment: () => set({ selectedShipment: null }),
      updateShipment: (updatedShipment: ShipmentData) => 
        set((state) => ({
          shipments: state.shipments.map(shipment => 
            shipment.id === updatedShipment.id ? updatedShipment : shipment
          )
        })),
      addShipment: (newShipment: ShipmentData) => 
        set((state) => ({
          shipments: [...state.shipments, newShipment]
        })),
      deleteShipment: (id: string) => 
        set((state) => ({
          shipments: state.shipments.filter(shipment => shipment.id !== id)
        })),
      setShipments: (shipments: ShipmentData[]) => set({ shipments })
    }),
    {
      name: 'shipment-storage'
    }
  )
);
