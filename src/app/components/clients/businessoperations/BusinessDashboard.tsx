import React from 'react';
import { Users, Send, Building } from 'lucide-react';
import PartnerExplore from './PartnerExplore';
import EcosystemGroup from './EcosystemGroup';
import PartnerTable from './PartnerTable';
import MessageList from './MessageList';
import { businessStats } from '@/store/partnerMockData';

const BusinessDashboard = () => {
  return (
    <div>
      <div className="w-full">
        
        {/* Top Section - Welcome Banner and Business Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Welcome Banner and Stats */}
          <div className="lg:col-span-2">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#007bff] to-blue-500 rounded-xl p-8 text-white mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl text-white font-bold mb-1">Welcome back, Jane!</h1>
                  <p className="text-blue-100 mb-4">Company Name: BlueSky Logistics PTE LTD</p>
                  <p className="text-sm text-blue-200">Last Updates: Today at 9:15 AM</p>
                </div>
                <button className="bg-white text-md text-[#007bff] px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Update Profile
                </button>
              </div>
            </div>

            {/* Stats Cards - Horizontally Aligned */}
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="bg-white p-4 rounded-lg border border-gray-200 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Partners</p>
                    <p className="text-xl font-bold text-gray-900">{businessStats.totalPartners}</p>
                  </div>
                  <Users className="h-7 w-7 text-[#007bff]" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Ecosystems</p>
                    <p className="text-xl font-bold text-gray-900">{businessStats.totalEcosystems}</p>
                  </div>
                  <Building className="h-7 w-7 text-[#007bff]" />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="bg-yellow-50 p-3 rounded-lg border border-gray-200 text-center flex-1">
                <p className="text-xl font-semibold text-yellow-600">{businessStats.pendingInvites}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-gray-200 text-center flex-1">
                <p className="text-xl font-semibold text-green-600">{businessStats.connectionRequests}</p>
                <p className="text-xs text-gray-500">Requests</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-gray-200 text-center flex-1">
                <p className="text-xl font-semibold text-red-600">{businessStats.messagesUnread}</p>
                <p className="text-xs text-gray-500">Unread</p>
              </div>
            </div>

            {/* Ecosystem Groups - Grid Style */}
            <div className="mt-4">
              <EcosystemGroup view="grid" />
            </div>
            
            {/* Partner Directory - Summary View */}
            <div className="mt-4 border border-gray-200 rounded-lg p-4">
              <PartnerTable view="summary" maxRows={5} />
            </div>
          </div>
          
          {/* Right Side */}
          <div>
            {/* Recommended Partners Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <PartnerExplore view="recommended" />
            </div>
            
            {/* Recent Messages (now MessageList summary) */}
            <MessageList view="summary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;