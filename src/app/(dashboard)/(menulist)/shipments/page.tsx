'use client';

import { useRouter } from 'next/navigation';
import IndustryNews from "@/app/components/clients/shipmentsbooking/IndustryNews";
import ShipmentAlerts from "@/app/components/clients/shipmentsbooking/ShipmentAlert";
import ShipmentMapTracker from "@/app/components/clients/shipmentsbooking/ShipmentMapTracker";
import ShipmentTable from "@/app/components/clients/shipmentsbooking/ShipmentTable";
import ShipmentMilestone from '@/app/components/clients/shipmentsbooking/ShipmentMilestone';

const ClientUI = () => {
   const router = useRouter();

  // Handle navigation to the shipments/all page
  const handleSeeAllShipments = () => {
    router.push('/shipments/all');
  };

  // Handle navigation to the tracking page
  const handleSeeAllTracking = () => {
    router.push('/shipments/track');
  };

  const handleSeeAllMilestone = () => {
    router.push('/shipments/track');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Shipments</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full mb-4">
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
              <ShipmentAlerts />
              <IndustryNews />
            </div>
        </div>
    </div>
  );
};

const ForwarderUI = () => {
  const router = useRouter();

  // Handle navigation to the shipments/all page
  const handleSeeAllShipments = () => {
    router.push('/shipments/all');
  };

  // Handle navigation to the tracking page
  const handleSeeAllTracking = () => {
    router.push('/shipments/track');
  };

  const handleSeeAllMilestone = () => {
    router.push('/shipments/track');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Shipments</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full mb-4">
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
              <ShipmentAlerts />
              <IndustryNews />
            </div>
        </div>
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

const ShipmentsUI = ({ userType }: { userType: string }) => {
  // Manually set userType for testing - change this value to test different UIs
  const testUserType: string = 'client'; // Change to: 'client', 'forwarder', 'logistics', 'admin'
  
  if (testUserType === 'client') return <ClientUI />;
  if (testUserType === 'forwarder') return <ForwarderUI />;
  if (testUserType === 'logistics') return <LogisticsProviderUI />;
  if (testUserType === 'admin') return <AdminUI />;
  
  return <div>Access denied</div>;
};

export default ShipmentsUI;