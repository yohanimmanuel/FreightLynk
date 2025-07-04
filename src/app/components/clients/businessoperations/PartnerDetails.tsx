import React, { useState } from 'react';
import { MessageCircle, Archive, MoreVertical, Phone, Mail, MapPin, Star, Calendar, CheckCircle, XCircle, Menu, ChevronDown } from 'lucide-react';

const PartnerDetails = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    'Overview',
    'Bookings', 
    'Orders',
    'Documents',
    'Company Ratings & Reviews'
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="p-4 md:p-6 bg-white rounded-lg">
            <p className="text-gray-500">Overview content will be displayed here</p>
          </div>
        );
      case 'Bookings':
        return (
          <div className="p-4 md:p-6 bg-white rounded-lg">
            <p className="text-gray-500">Bookings content will be displayed here</p>
          </div>
        );
      case 'Orders':
        return (
          <div className="p-4 md:p-6 bg-white rounded-lg">
            <p className="text-gray-500">Orders content will be displayed here</p>
          </div>
        );
      case 'Documents':
        return (
          <div className="p-4 md:p-6 bg-white rounded-lg">
            <p className="text-gray-500">Documents content will be displayed here</p>
          </div>
        );
      case 'Company Ratings & Reviews':
        return (
          <div className="p-4 md:p-6 bg-white rounded-lg">
            <p className="text-gray-500">Company Ratings & Reviews content will be displayed here</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-white border border-gray-200 rounded-lg sshadow-sm">
        <div className="container mx-auto px-4">
          <div className="py-4 md:py-6">
            {/* Mobile Header */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-4 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-semibold text-blue-600">TO</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">TransOcean Freight Ltd.</h1>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Company Description Section */}
              <div className="px-4 pb-4">
                <div className="flex items-center mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Freight Forwarder
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 leading-relaxed">
                  Global freight forwarding and logistics solutions provider specializing in ocean, air, and ground transportation with over 15 years of experience serving international trade routes.
                </p>
              </div>

              {/* Contact Person Section */}
              <div className="px-4 py-4 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">JD</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Jane Doe</h2>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Partner Since Mar 2024</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Section */}
              <div className="px-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                  <button className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </button>
                  <button className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-start justify-between">
              {/* Left Column - Company Info */}
              <div className="flex-1 pr-8">
                <div className="flex items-start space-x-4">
                  {/* Company Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl font-semibold text-blue-600">TO</span>
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">TransOcean Freight Ltd.</h1>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Freight Forwarder
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Global freight forwarding and logistics solutions provider specializing in ocean, air, and ground transportation with over 15 years of experience serving international trade routes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Vertical Border */}
              <div className="border-l border-gray-200 h-24"></div>

              {/* Right Column - Contact Person Info */}
              <div className="flex-shrink-0 pl-8 w-90">
                <div className="flex items-start space-x-4">
                  {/* Contact Person Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">JD</span>
                    </div>
                  </div>

                  {/* Contact Person Details */}
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Jane Doe</h2>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Partner Since Mar 2024</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Message
                      </button>
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <Archive className="w-4 h-4 mr-1" />
                        Archive
                      </button>
                      <button className="inline-flex items-center p-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          {/* Mobile Dropdown */}
          <div className="md:hidden relative">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {activeTab}
              <ChevronDown className="w-4 h-4" />
            </button>
            {isMobileMenuOpen && (
              <div className="absolute z-10 w-full bg-white shadow-lg rounded-md">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      activeTab === tab 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Tabs */}
          <nav className="hidden md:flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-[#007bff] text-[#007bff]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PartnerDetails;