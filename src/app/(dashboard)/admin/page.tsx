'use client';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { UserRole } from '@/store/authStore';

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">System Overview</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Users:</span>
                <span className="font-medium">1,245</span>
              </div>
              <div className="flex justify-between">
                <span>Active Bookings:</span>
                <span className="font-medium">328</span>
              </div>
              <div className="flex justify-between">
                <span>Active Shipments:</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between">
                <span>System Health:</span>
                <span className="text-green-600 font-medium">Excellent</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">User Management</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>New Users (Today):</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Approvals:</span>
                <span className="font-medium text-yellow-600">7</span>
              </div>
              <div className="flex justify-between">
                <span>Support Tickets:</span>
                <span className="font-medium text-red-600">15</span>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
              Manage Users
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">System Alerts</h2>
            <div className="space-y-3">
              <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-800">Database backup scheduled in 2 hours</p>
              </div>
              <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                <p className="text-sm text-red-800">Failed login attempts detected</p>
              </div>
              <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                <p className="text-sm text-green-800">System update completed successfully</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">API Health</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Response Time:</span>
                <span className="font-medium">124ms</span>
              </div>
              <div className="flex justify-between">
                <span>Uptime:</span>
                <span className="font-medium">99.98%</span>
              </div>
              <div className="flex justify-between">
                <span>Error Rate:</span>
                <span className="font-medium">0.02%</span>
              </div>
              <div className="flex justify-between">
                <span>Rate Limits:</span>
                <span className="text-green-600 font-medium">Normal</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="border-b pb-2">
                <p className="text-sm font-medium">User account created</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">System settings updated</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">Database backup completed</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
              <div>
                <p className="text-sm font-medium">New API key generated</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-100 p-3 rounded text-blue-800 hover:bg-blue-200 transition-colors">
                System Settings
              </button>
              <button className="bg-purple-100 p-3 rounded text-purple-800 hover:bg-purple-200 transition-colors">
                User Management
              </button>
              <button className="bg-green-100 p-3 rounded text-green-800 hover:bg-green-200 transition-colors">
                API Settings
              </button>
              <button className="bg-yellow-100 p-3 rounded text-yellow-800 hover:bg-yellow-200 transition-colors">
                Backup System
              </button>
              <button className="bg-red-100 p-3 rounded text-red-800 hover:bg-red-200 transition-colors col-span-2">
                Security Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}