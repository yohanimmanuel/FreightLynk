import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { partnerDirectory } from '../../../../store/partnerCompanyData';
import { useRouter } from 'next/navigation';

// Filter only clients
const clients = partnerDirectory.filter(p => p.type === 'Client');

export default function QuoteNewClient() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const clientDropdownRef = useRef<HTMLDivElement>(null);
  const contactDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Get selected client and contacts
  const selectedClient = clients.find(c => c.id === selectedClientId);
  const contactOptions = selectedClient ? selectedClient.contactPersons : [];
  const selectedContact = contactOptions.find(c => c.id === selectedContactId);

  // Close dropdowns on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (showClientDropdown && clientDropdownRef.current && !clientDropdownRef.current.contains(e.target as Node)) setShowClientDropdown(false);
      if (showContactDropdown && contactDropdownRef.current && !contactDropdownRef.current.contains(e.target as Node)) setShowContactDropdown(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showClientDropdown, showContactDropdown]);

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 mt-20">
      <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Select your Client for Quotation</h1>
          <p className="text-gray-600 text-sm">Find your client through the directory.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Client Dropdown */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Select Lead/Client<span className="text-red-500">*</span></label>
          <div className="relative" ref={clientDropdownRef}>
            <button
              type="button"
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-left"
              onClick={() => setShowClientDropdown(v => !v)}
            >
              {selectedClient ? selectedClient.name : 'Select client...'}
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showClientDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showClientDropdown && (
              <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-full z-50">
                <div className="p-2">
                  {clients.map(client => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => { setSelectedClientId(client.id); setSelectedContactId(null); setShowClientDropdown(false); }}
                      className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${selectedClientId === client.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      {client.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Contact Person Dropdown */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Contact persons</label>
          <div className="relative" ref={contactDropdownRef}>
            <button
              type="button"
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-left"
              onClick={() => setShowContactDropdown(v => !v)}
              disabled={!selectedClient}
            >
              {selectedContact ? selectedContact.name : 'Select contact...'}
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showContactDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showContactDropdown && selectedClient && (
              <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-full z-50">
                <div className="p-2">
                  {contactOptions.length === 0 && <div className="text-xs text-gray-400 px-2 py-1">No contacts</div>}
                  {contactOptions.map(contact => (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => { setSelectedContactId(contact.id); setShowContactDropdown(false); }}
                      className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${selectedContactId === contact.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      {contact.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button type="button" className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200">Cancel</button>
        <button
          type="button"
          className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${!selectedClientId || !selectedContactId
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-[#007bff] text-white hover:bg-blue-700 cursor-pointer'}`}
          disabled={!selectedClientId || !selectedContactId}
          onClick={() => {
            if (selectedClientId && selectedContactId) {
              router.push('/quotes/list/search');
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
