import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuoteSearchStore } from '../../../../store/quotesearchdata';
import { useQuoteStore } from '../../../../store/forwarderquote';

const TABS = ['Export', 'Import', 'Domestic', 'Other'];
const SHIPMENT_MODES = ['SEA FCL', 'SEA LCL', 'AIR LCL', 'LAND FTL', 'LAND LTL'];
const INCOTERMS = ['FOB', 'CIF', 'EXW', 'DAP', 'DDP'];
const FREIGHT_TERMS = ['Prepaid', 'Collect', 'Third Party'];

export default function QuoteAdditionalInfo() {
  const { setAdditionalInfo, shipmentType, setShipmentType, shipmentTypeDescription, setShipmentTypeDescription, selectedQuoteDetails, setSelectedQuoteDetails } = useQuoteSearchStore();
  const updateQuote = useQuoteStore(state => state.updateQuote);
  const [tab, setTab] = useState('Export');
  const [showShipmentModeDropdown, setShowShipmentModeDropdown] = useState(false);
  const [shipmentMode, setShipmentMode] = useState(SHIPMENT_MODES[0]);
  const [showIncotermDropdown, setShowIncotermDropdown] = useState(false);
  const [incoterm, setIncoterm] = useState('');
  const [showFreightTermDropdown, setShowFreightTermDropdown] = useState(false);
  const [freightTerm, setFreightTerm] = useState('');

  // Initialize dropdown states with existing values
  React.useEffect(() => {
    if (selectedQuoteDetails?.additionalInfo) {
      const info = selectedQuoteDetails.additionalInfo;
      if (info.shipmentMode) setShipmentMode(info.shipmentMode);
      if (info.incoterm) setIncoterm(info.incoterm);
      if (info.freightTerm) setFreightTerm(info.freightTerm);
    }
  }, [selectedQuoteDetails]);

  // Define formState to hold all form values
  const [formState, setFormState] = useState({
    companyBranch: '',
    etd: '',
    cargoReadyDate: '',
    ofPriceFeedback: '',
    note: '',
    commodities: '',
    incoterm: '',
    freightTerm: '',
    isTariff: 'No', // Add default value
    shipmentMode: SHIPMENT_MODES[0],
    // ...add other fields as needed
  });

  // Initialize form state with existing additional info when component mounts
  React.useEffect(() => {
    if (selectedQuoteDetails?.additionalInfo) {
      setFormState(prevState => ({
        ...prevState,
        ...selectedQuoteDetails.additionalInfo
      }));
    }
  }, [selectedQuoteDetails]);

  // Dropdown close on outside click
  const shipmentModeRef = useRef<HTMLDivElement>(null);
  const incotermRef = useRef<HTMLDivElement>(null);
  const freightTermRef = useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (showShipmentModeDropdown && shipmentModeRef.current && !shipmentModeRef.current.contains(e.target as Node)) setShowShipmentModeDropdown(false);
      if (showIncotermDropdown && incotermRef.current && !incotermRef.current.contains(e.target as Node)) setShowIncotermDropdown(false);
      if (showFreightTermDropdown && freightTermRef.current && !freightTermRef.current.contains(e.target as Node)) setShowFreightTermDropdown(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showShipmentModeDropdown, showIncotermDropdown, showFreightTermDropdown]);

  // Sync tab with Zustand store
  React.useEffect(() => {
    setTab(shipmentType || 'Export');
  }, [shipmentType]);

  // When tab changes, update Zustand store
  const handleTabChange = (t: string) => {
    setTab(t);
    setShipmentType(t);
    if (t !== 'Other') setShipmentTypeDescription('');
  };

  const router = useRouter();

  // When the form is submitted or updated, call setAdditionalInfo
  const handleFormChange = (updatedFields: Partial<typeof formState>) => {
    const newState = { ...formState, ...updatedFields };
    setFormState(newState);
    setAdditionalInfo(newState);
    
    // Also update the quote's additionalInfo field
    if (selectedQuoteDetails) {
      setSelectedQuoteDetails({
        ...selectedQuoteDetails,
        additionalInfo: newState
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
      <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Additional Info for Quotation</h1>
          <p className="text-gray-600 text-sm">Fill this additional info to fulfill a detailed requirements.</p>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map(t => (
          <button
            key={t}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${tab === t ? 'bg-[#007bff] text-white border-[#007bff]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            onClick={() => handleTabChange(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {/* If 'Other' is selected, show description input */}
      {tab === 'Other' && (
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-1">Please specify the type of shipment or describe your case <span className="text-red-500">*</span></label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your shipment type..."
            value={shipmentTypeDescription}
            onChange={e => setShipmentTypeDescription(e.target.value)}
            required
          />
        </div>
      )}
      {/* Form */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Company Branch</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search"
            value={formState.companyBranch}
            onChange={e => handleFormChange({ companyBranch: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Shipment Mode</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedQuoteDetails?.modeLabel || selectedQuoteDetails?.mode || ''}
            readOnly
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Cargo ready date</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formState.cargoReadyDate}
            onChange={e => handleFormChange({ cargoReadyDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">ETD</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formState.etd}
            onChange={e => handleFormChange({ etd: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Incoterms</label>
          <div className="relative" ref={incotermRef}>
            <button
              type="button"
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
              onClick={() => setShowIncotermDropdown(v => !v)}
            >
              {incoterm || 'Select'}
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showIncotermDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showIncotermDropdown && (
              <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-full z-50">
                <div className="p-2">
                  {INCOTERMS.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { setIncoterm(opt); setShowIncotermDropdown(false); handleFormChange({ incoterm: opt }); }}
                      className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${incoterm === opt ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Commodities</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formState.commodities}
            onChange={e => handleFormChange({ commodities: e.target.value })}
            placeholder="Commodities"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">OF price feedback</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formState.ofPriceFeedback}
            onChange={e => handleFormChange({ ofPriceFeedback: e.target.value })}
            placeholder="Feedback"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Freight terms</label>
          <div className="relative" ref={freightTermRef}>
            <button
              type="button"
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
              onClick={() => setShowFreightTermDropdown(v => !v)}
            >
              {freightTerm || 'Select'}
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFreightTermDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showFreightTermDropdown && (
              <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 w-full z-50">
                <div className="p-2">
                  {FREIGHT_TERMS.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => { setFreightTerm(opt); setShowFreightTermDropdown(false); handleFormChange({ freightTerm: opt }); }}
                      className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${freightTerm === opt ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Is Tariff</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formState.isTariff}
            onChange={e => handleFormChange({ isTariff: e.target.value })}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Note</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 text-xs text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[60px]"
            value={formState.note}
            onChange={e => handleFormChange({ note: e.target.value })}
            placeholder="Add any notes here..."
          />
        </div>
      </form>
      {/* Buttons */}
      <div className="flex justify-between gap-2 mt-6">
        <button
          type="button"
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200"
          onClick={() => router.push('/quotes/list/search')}
        >
          Back
        </button>
        <button 
          onClick={async () => {
            // Ensure shipmentType and shipmentTypeDescription are set on both the quote and additionalInfo
            if (selectedQuoteDetails) {
              const updatedQuote = {
                ...selectedQuoteDetails,
                shipmentType: tab,
                shipmentTypeDescription: tab === 'Other' ? shipmentTypeDescription : '',
                additionalInfo: {
                  ...formState,
                  shipmentType: tab,
                  shipmentTypeDescription: tab === 'Other' ? shipmentTypeDescription : '',
                }
              };
              setSelectedQuoteDetails(updatedQuote);
              
              // Just update the quote details in the search store
              // Don't save to database yet - wait until final submission in QuoteInvoice
              console.log('Updated quote details in search store:', selectedQuoteDetails.id);
            }
            router.push('/quotes/list/invoice');
          }}
          type="button" 
          className="px-4 py-2 text-sm text-white bg-[#007bff] rounded-lg hover:bg-blue-700">
          Next
        </button>
      </div>
    </div>
  );
}
