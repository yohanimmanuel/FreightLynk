'use client';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { UserRole } from '@/store/authStore';

export default function LogisticsProviderDashboard() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.LOGISTICS_PROVIDER]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Logistics Provider Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Asset Overview</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Trucks Available:</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span>Trucks In Use:</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between">
                <span>Warehouses:</span>
                <span className="font-medium">5</span>
              </div>
              <div className="flex justify-between">
                <span>Warehouse Utilization:</span>
                <span className="font-medium">78%</span>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
              Manage Assets
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Shipment Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Pending Pickup:</span>
                <span className="font-medium text-yellow-600">12</span>
              </div>
              <div className="flex justify-between">
                <span>In Transit:</span>
                <span className="font-medium text-blue-600">28</span>
              </div>
              <div className="flex justify-between">
                <span>At Warehouse:</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Delivery:</span>
                <span className="font-medium text-yellow-600">15</span>
              </div>
              <div className="flex justify-between">
                <span>Delivered Today:</span>
                <span className="font-medium text-green-600">8</span>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
              View All Shipments
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Warehouse Inventory</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total SKUs:</span>
                <span className="font-medium">1,245</span>
              </div>
              <div className="flex justify-between">
                <span>Items Received Today:</span>
                <span className="font-medium">78</span>
              </div>
              <div className="flex justify-between">
                <span>Items Shipped Today:</span>
                <span className="font-medium">92</span>
              </div>
              <div className="flex justify-between">
                <span>Low Stock Items:</span>
                <span className="font-medium text-red-600">14</span>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
              Inventory Management
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Driver Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Active Drivers</span>
                </div>
                <span className="font-medium">16</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span>On Break</span>
                </div>
                <span className="font-medium">4</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>Off Duty</span>
                </div>
                <span className="font-medium">8</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                  <span>Maintenance</span>
                </div>
                <span className="font-medium">2</span>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
              Driver Management
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="text-sm font-medium">08:00 - Warehouse A Pickup</p>
                <p className="text-xs text-gray-500">3 pallets - Driver: John D.</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">09:30 - Port Container Pickup</p>
                <p className="text-xs text-gray-500">2 containers - Driver: Mike S.</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">11:00 - Customer Delivery</p>
                <p className="text-xs text-gray-500">5 packages - Driver: Sarah L.</p>
              </div>
              <div>
                <p className="text-sm font-medium">14:00 - Cross-Dock Operation</p>
                <p className="text-xs text-gray-500">12 pallets - Warehouse B</p>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
              Full Schedule
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Performance Metrics</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>On-Time Pickups:</span>
                <span className="font-medium">94%</span>
              </div>
              <div className="flex justify-between">
                <span>On-Time Deliveries:</span>
                <span className="font-medium">91%</span>
              </div>
              <div className="flex justify-between">
                <span>Warehouse Processing Time:</span>
                <span className="font-medium">1.2 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Fuel Efficiency:</span>
                <span className="font-medium">8.4 mpg</span>
              </div>
              <div className="flex justify-between">
                <span>Customer Satisfaction:</span>
                <span className="font-medium text-green-600">4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}