import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ShipmentAlert = {
  id: string; // unique alert id
  shipmentID: string; // link to shipment
  code: string; // e.g., FL-298765
  title: string; // e.g., "Vessel Delay - Port Congestion"
  description: string; // e.g., "Expected delay of 3-5 days due to port congestion"
  location: string; // e.g., "Los Angeles, CA"
  timeAgo: string; // e.g., "2 hours ago"
  status: "active" | "resolved";
  priority: "high" | "medium" | "low";
  icon: "delay" | "customs" | "weather" | "delivery";
  resolvedText?: string; // e.g., "Resolved"
};

interface ShipmentAlertStore {
  alerts: ShipmentAlert[];
  addAlert: (alert: ShipmentAlert) => void;
  updateAlert: (alert: ShipmentAlert) => void;
  deleteAlert: (id: string) => void;
  setAlerts: (alerts: ShipmentAlert[]) => void;
}

const initialAlerts: ShipmentAlert[] = [
  {
    id: "1",
    shipmentID: "FLYNK-SH42581",
    code: "FL-298765",
    title: "Vessel Delay - Port Congestion",
    description: "Expected delay of 3-5 days due to port congestion",
    location: "Los Angeles, CA",
    timeAgo: "2 hours ago",
    status: "active",
    priority: "high",
    icon: "delay",
  },
];

export const useShipmentAlertStore = create<ShipmentAlertStore>()(
  persist(
    (set) => ({
      alerts: initialAlerts,
      addAlert: (alert) => set((state) => ({ alerts: [...state.alerts, alert] })),
      updateAlert: (alert) => set((state) => ({
        alerts: state.alerts.map((a) => (a.id === alert.id ? alert : a)),
      })),
      deleteAlert: (id) => set((state) => ({
        alerts: state.alerts.filter((a) => a.id !== id),
      })),
      setAlerts: (alerts) => set({ alerts }),
    }),
    {
      name: 'shipment-alert-storage',
    }
  )
); 