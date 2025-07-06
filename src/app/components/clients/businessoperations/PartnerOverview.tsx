import React from 'react';
import { Partner } from '@/store/partnerCompanyData';
import { MapPin, Globe, Clock, Mail, Phone, Calendar, TrendingUp, Package, DollarSign, Star, MessageCircle, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

interface PartnerOverviewProps {
  partner: Partner;
}

const PartnerOverview: React.FC<PartnerOverviewProps> = ({ partner }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Card 1: Company Information */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Company Information</h3>
        
        <div className="space-y-3">
          {/* Address */}
          <div className="flex items-start">
            <MapPin className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-700">{partner.address}</p>
            </div>
          </div>
          
          {/* Operating Regions */}
          <div className="flex items-start">
            <Globe className="w-4 h-4 text-gray-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-700">Operating Regions</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {partner.operatingRegions.map((region, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Specializations */}
          <div className="flex items-start">
            <Package className="w-4 h-4 text-gray-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-700">Specializations</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {partner.specializations.map((spec, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Working Hours */}
          <div className="flex items-start">
            <Clock className="w-4 h-4 text-gray-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-700">Working Hours</p>
              <p className="text-xs text-gray-600">{partner.workingHours}</p>
            </div>
          </div>
          
          {/* Website */}
          <div className="flex items-start">
            <Globe className="w-4 h-4 text-gray-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-700">Website</p>
              <a 
                href={`https://${partner.website}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-blue-600 hover:underline -mt-1"
              >
                {partner.website}
              </a>
            </div>
          </div>
          
          {/* Email */}
          <div className="flex items-start">
            <Mail className="w-4 h-4 text-gray-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-700">Email</p>
              <a 
                href={`mailto:${partner.email}`} 
                className="text-xs text-blue-600 hover:underline -mt-1"
              >
                {partner.email}
              </a>
            </div>
          </div>
          
          {/* Phone */}
          <div className="flex items-start">
            <Phone className="w-4 h-4 text-gray-500 mt-1 mr-3 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-700">Phone</p>
              <a 
                href={`tel:${partner.phone}`} 
                className="text-xs text-blue-600 hover:underline -mt-1"
              >
                {partner.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card 2: Business Information */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Business Information</h3>
        
        <div className="space-y-4">
          {/* Connected Since */}
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-500 mr-3" />
            <div>
              <p className="text-xs font-medium text-gray-700">Connected Since</p>
              <p className="text-xs text-gray-600">{partner.connectedSince}</p>
            </div>
          </div>
          
          {/* Active Bookings */}
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 text-gray-500 mr-3" />
            <div>
              <p className="text-xs font-medium text-gray-700">Active Bookings</p>
              <p className="text-xs text-gray-600">{partner.activeBookings} bookings</p>
            </div>
          </div>
          
          {/* Latest Shipment */}
          <div className="flex items-start">
            <Package className="w-4 h-4 text-gray-500 mt-1 mr-3" />
            <div>
              <p className="text-xs font-medium text-gray-700">Latest Shipment</p>
              <div className="mt-1">
                <p className="text-xs text-gray-600">ID: {partner.latestShipment.id}</p>
                <p className="text-xs text-gray-600">Date: {partner.latestShipment.date}</p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  {partner.latestShipment.status}
                </span>
              </div>
            </div>
          </div>
          
          {/* Payment Terms */}
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 text-gray-500 mr-3" />
            <div>
              <p className="text-xs font-medium text-gray-700">Payment Terms</p>
              <p className="text-xs text-gray-600">{partner.paymentTerms}</p>
            </div>
          </div>
          
          {/* Rating */}
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-3" />
            <div>
              <p className="text-xs font-medium text-gray-700">Rating</p>
              <div className="flex items-center">
                <p className="text-xs text-gray-600 mr-1">{partner.rating}</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < Math.floor(partner.rating) ? 'text-yellow-500' : 'text-gray-300'}`} 
                      fill={i < Math.floor(partner.rating) ? 'currentColor' : 'none'} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* View All Button */}
          <div className="pt-2">
            <Link href="/billings">
              <button className="w-full px-4 py-2 bg-[#007bff] text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
                View All Billings & Payments
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Card 3: Contact Persons */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 md:col-span-2 lg:col-span-1">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Contact Persons</h3>
        
        <div className="max-h-[300px] overflow-y-auto pr-1 hide-scrollbar">
          <div className="space-y-4">
            {partner.contactPersons.map((person) => (
              <div 
                key={person.id} 
                className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">{person.initials}</span>
                  </div>
                </div>
                
                {/* Contact Details */}
                <div className="ml-3 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{person.name}</h4>
                      <div className="flex items-center mt-0.5">
                        <span className="text-xs text-gray-600">{person.role}</span>
                        {person.isAdmin && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Admin
                          </span>
                        )}
                        {!person.isAdmin && (
                          <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Member
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 text-gray-500 mr-1.5" />
                      <a 
                        href={`mailto:${person.email}`} 
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {person.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 text-gray-500 mr-1.5" />
                      <a 
                        href={`tel:${person.phone}`} 
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {person.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerOverview; 