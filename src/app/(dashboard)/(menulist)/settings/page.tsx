'use client';

import React, { useState } from 'react';
import ProfileOverviewCard from '../../../components/profile/ProfileOverviewCard';
import CompanyInfoCard from '../../../components/profile/CompanyInfo';
import UserPreferences from '../../../components/profile/UserPreferences';
import TeamsOrganization from '../../../components/profile/TeamsOrganization';
import SecurityPrivacy from '../../../components/profile/SecurityPrivacy';
import SupportHelp from '../../../components/profile/SupportHelp';

const SettingsDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile'},
    { id: 'company', label: 'Company Info'},
    { id: 'preferences', label: 'Preferences'},
    { id: 'teams', label: 'Teams'},
    { id: 'security', label: 'Security'},
    { id: 'Support', label: 'Support'},
  ];

  // You can import your components here and use them in the renderContent function
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <div className="mt-6"><ProfileOverviewCard /></div>;
      case 'company':
        return <div className="mt-6"><CompanyInfoCard /></div>;
      case 'preferences':
        return <div className="mt-6"><UserPreferences /></div>;
      case 'teams':
        return <div className="mt-6"><TeamsOrganization /></div>;
      case 'security':
        return <div className="mt-6"><SecurityPrivacy /></div>;
      case 'Support':
        return <div className="mt-6"><SupportHelp /></div>;
      default:
        return <div className="mt-6"><h3 className="text-lg font-medium text-gray-900 mb-2">Select a Tab</h3>
        <p className="text-gray-500">Choose a tab from the navigation</p></div>;
    }
  };

  return (
    <div className="min-h-screen mt-4">
      {/* Header */}
      <div className="bg-white sticky z-10">
        <div className="max-w-7xl px-4">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
      </div>

      {/* Card with Tabs and Content */}
      <div className="w-full mx-auto px-6">
        <div className="bg-white">
          {/* Tabs */}
          <nav className="flex space-x-8 border-b border-gray-200 pt-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors focus:outline-none ${
                    isActive
                      ? 'border-[#007bff] text-[#007bff]'
                      : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
          {/* Content */}
          <div>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDashboard;