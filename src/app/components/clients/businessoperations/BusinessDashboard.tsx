import React from 'react';
import { Users, Send, Building } from 'lucide-react';
import PartnerExplore from './PartnerExplore';
import EcosystemGroup from './EcosystemGroup';
import PartnerTable from './PartnerTable';

const BusinessDashboard = () => {
  // Sample data
  const businessStats = {
    totalPartners: 47,
    totalEcosystems: 8,
    pendingInvites: 5,
    connectionRequests: 12,
    messagesUnread: 3
  };

  const partnerDirectory = [
    {
      id: 1,
      name: "Oceanic Freight Services",
      type: "Forwarder",
      status: "Active",
      industry: "Maritime",
      lastContact: "2 days ago",
      avatar: "OF"
    },
    {
      id: 2,
      name: "TechCorp Manufacturing",
      type: "Client",
      status: "Active",
      industry: "Electronics",
      lastContact: "1 week ago",
      avatar: "TC"
    },
    {
      id: 3,
      name: "Regional Customs Agency",
      type: "Provider",
      status: "Pending",
      industry: "Customs",
      lastContact: "3 days ago",
      avatar: "RC"
    },
    {
      id: 4,
      name: "Express Air Cargo",
      type: "Provider",
      status: "Active",
      industry: "Air Freight",
      lastContact: "1 day ago",
      avatar: "EA"
    },
    {
      id: 5,
      name: "Global Trade Solutions",
      type: "Forwarder",
      status: "Active",
      industry: "Multi-modal",
      lastContact: "4 hours ago",
      avatar: "GT"
    }
  ];

  const recentMessages = [
    {
      id: 1,
      sender: "Pacific Logistics Co.",
      message: "Can we schedule a call to discuss the Q4 rates?",
      time: "2 hours ago",
      unread: true,
      avatar: "PL"
    },
    {
      id: 2,
      sender: "Global Exports Inc.",
      message: "Documents are ready for shipment GL-2024-001",
      time: "1 day ago",
      unread: false,
      avatar: "GE"
    },
    {
      id: 3,
      sender: "Customs Solutions",
      message: "Clearance completed for container MSKU-789456",
      time: "2 days ago",
      unread: true,
      avatar: "CS"
    }
  ];

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
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center flex-1">
                <p className="text-xl font-semibold text-yellow-600">{businessStats.pendingInvites}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center flex-1">
                <p className="text-xl font-semibold text-green-600">{businessStats.connectionRequests}</p>
                <p className="text-xs text-gray-500">Requests</p>
              </div>
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-center flex-1">
                <p className="text-xl font-semibold text-red-600">{businessStats.messagesUnread}</p>
                <p className="text-xs text-gray-500">Unread</p>
              </div>
            </div>

            {/* Ecosystem Groups - Grid Style */}
            <div className="mt-4">
              <EcosystemGroup view="grid" />
            </div>
            
            {/* Partner Directory */}
            <div className="mt-4">
              <PartnerTable partners={partnerDirectory} />
            </div>
          </div>
          
          {/* Recent Messages - Right Side */}
          <div>
            {/* Recommended Partners Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <PartnerExplore view="recommended" />
            </div>
            
            {/* Recent Messages */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Messages</h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm">View All</button>
              </div>
              
              <div className="space-y-4">
                {recentMessages.map(message => (
                  <div key={message.id} className={`p-3 rounded-lg ${message.unread ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {message.avatar}
                      </div>
                      <div className="ml-2 flex-grow">
                        <h3 className="text-sm font-medium text-gray-900">{message.sender}</h3>
                        <p className="text-xs text-gray-500">{message.time}</p>
                      </div>
                      {message.unread && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{message.message}</p>
                    <div className="mt-2 flex justify-end">
                      <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center">
                        <Send className="h-3 w-3 mr-1" />
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;