import React, { useState, useEffect, useRef } from 'react';
import { useQuoteSearchStore, QuoteSearchResult } from '../../../../store/quotesearchdata';
import { useAuthStore } from '../../../../store/authStore';
import { Edit, Send, Plus, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuoteRateStore } from '../../../../store/forwarderquote';

// Utility to generate a unique Quote ID
function generateQuoteId() {
  const now = new Date();
  return `QT-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000)}`;
}

// Utility to format date as YYYY-MM-DD
function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

const QuoteInvoice = () => {
  const { searchCriteria, selectedQuoteDetails, additionalInfo, shipmentType, shipmentTypeDescription } = useQuoteSearchStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const quote = selectedQuoteDetails;
  const addQuote = useQuoteRateStore(state => state.addQuote);
  const quotes = useQuoteRateStore(state => state.quotes);
  
  // If no quote is selected, show a message
  if (!quote) return <div className="text-center text-gray-500 py-12">No quote selected. Please select a quote from the search results.</div>;

  // --- Edit mode state ---
  const [isEditing, setIsEditing] = useState(false);
  const [editFrom, setEditFrom] = useState({
    company: user?.companyName || 'Demo Company (FreightLynk LLC)',
    address: '1000 20th Street NW, Suite 400, Washington D.C. 20036',
    phone: '(028) 1208 281055',
    preparedBy: user?.fullName || 'Demo User',
    mobile: '(028) 1208 281055',
    email: user?.email || 'demo123@gmail.com',
  });
  const [editTo, setEditTo] = useState({
    company: 'Sample Client Company',
    address: '123 Client St, City, Country',
    phone: '(028) 39105532',
    contact: 'THUY NGUYEN',
  });
  const [editRemark, setEditRemark] = useState(quote.remark);
  const [originalState, setOriginalState] = useState<any>(null);

  // Update edit fields when selected quote changes
  useEffect(() => {
    setEditRemark(quote.remark);
    // Optionally update editFrom/editTo if those fields are part of the quote in the future
  }, [quote]);

  // Generate quoteId ONCE for both invoice and table
  const [quoteId] = useState(() => typeof quote.id === 'string' ? quote.id : generateQuoteId());
  const hasAddedQuote = useRef<string | null>(null);

  // --- Handlers ---
  const handleEdit = () => {
    setOriginalState({ from: { ...editFrom }, to: { ...editTo }, remark: editRemark });
    setIsEditing(true);
  };
  const handleCancel = () => {
    if (originalState) {
      setEditFrom(originalState.from);
      setEditTo(originalState.to);
      setEditRemark(originalState.remark);
    }
    setIsEditing(false);
  };
  const handleSave = () => {
    // Here you would update the store or backend
    setIsEditing(false);
  };

  // Use tableRows from selectedQuoteDetails for the quote table
  const tableRows = selectedQuoteDetails?.tableRows || [];

  const totalAmount = tableRows.reduce((sum: number, row: any) => sum + (typeof row.amount === 'number' ? row.amount : 0), 0);
  const currency = tableRows[0]?.currency || quote.currency;

  // Dates
  const createdOn = formatDate(new Date());
  const validUntil = quote.validUntil;

  // Extract additional info fields
  const etd = additionalInfo?.etd || selectedQuoteDetails?.etd || '-';
  const cargoReadyDate = additionalInfo?.cargoReadyDate || selectedQuoteDetails?.cargoReadyDate || '-';
  const incoterms = additionalInfo?.incoterm || selectedQuoteDetails?.incoterms || '-';
  const schedule = additionalInfo?.schedule || '-';
  const note = additionalInfo?.note || '-';
  const freightTerms = additionalInfo?.freightTerm || '-';
  const ofPriceFeedback = additionalInfo?.ofPriceFeedback || '-';
  const companyBranch = additionalInfo?.companyBranch || '-';
  const shipmentMode = additionalInfo?.shipmentMode || selectedQuoteDetails?.shipmentMode || '-';
  const commodities = additionalInfo?.commodities || '-';

  // Auto-map and send main invoice data to QuoteTable on mount or when quote changes
  useEffect(() => {
    if (!quote) return;
    if (hasAddedQuote.current === quoteId) return;
    const mappedQuote = {
      id: quoteId,
      lane: `${quote.origin} - ${quote.destination}`,
      mode: (() => {
        const label = (quote.modeLabel || '').toUpperCase();
        if (label.includes('SEA') && label.includes('FCL')) return 'FCL';
        if (label.includes('SEA') && label.includes('LCL')) return 'LCL';
        if (label.includes('AIR')) return 'AIR';
        if (label.includes('LAND') && label.includes('FTL')) return 'FTL';
        if (label.includes('LAND') && label.includes('LTL')) return 'LTL';
        return 'FCL';
      })() as import('../../../../store/forwarderquote').Quote['mode'],
      containertype: quote.containertype || '',
      currency: quote.currency || '',
      baseRate: Number(quote.tableRows?.[0]?.baseRate) || 0,
      price: quote.tableRows?.[0]?.baseRate?.toString() || '',
      transitTime: quote.transitTime || '',
      provider: quote.provider || '',
      validity: quote.validUntil || '',
      status: 'draft' as 'draft',
      origin: quote.origin || '',
      destination: quote.destination || '',
      incoterms: quote.incoterms || '',
      remark: quote.remark || '',
      serviceType: quote.serviceType || '',
      transitPort: quote.transitPort || '',
      client: quote.client || '',
      isTariff: quote.isTariff || false,
      profit: quote.profit || '',
      createdBy: quote.createdBy || '',
      createdDate: quote.createdDate || '',
      notes: quote.notes || '',
      details: quote.details || '',
      truckType: quote.truckType || '',
      weightVolume: quote.weightVolume || '',
    };
    addQuote(mappedQuote);
    hasAddedQuote.current = quoteId;
  }, [quoteId, quote]);

  return (
    <>
      {/* Button Row */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center gap-2" onClick={handleEdit}>
                <Edit className="w-4 h-4" /> Edit
              </button>
              <button className="px-4 py-2 rounded-lg bg-white text-gray-900 font-medium hover:bg-gray-200 border border-gray-300 transition-colors flex items-center gap-2" onClick={() => router.push('/quotes/list')}>
                View All Quotes
              </button>
              <button className="px-4 py-2 rounded-lg bg-[#FFA726] text-white font-medium hover:bg-[#fb8c00] transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" /> Send
              </button>
            </>
          ) : (
            <>
              <button className="px-4 py-2 rounded-lg bg-[#007bff] text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2" onClick={handleSave}>
                Save
              </button>
              <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center gap-2" onClick={handleCancel}>
                Cancel
              </button>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg bg-[#007bff] text-white font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Shipment
          </button>
          <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 p-8 mt-8">
        {/* Header */}
        <div className="flex flex-row justify-between items-start border-b pb-6 mb-6 gap-6">
          {/* Left: From/To stacked */}
          <div className="flex flex-col gap-6 flex-1 max-w-2xl">
            <div className="flex flex-col gap-3">
              <div className="font-semibold text-gray-900 text-md mb-1">From:</div>
              {!isEditing ? (
                <>
                  <div className="text-xs text-gray-700 font-bold">{editFrom.company}</div>
                  <div className="text-xs text-gray-700">Address: {editFrom.address}</div>
                  <div className="text-xs text-gray-700">Phone: {editFrom.phone}</div>
                  <div className="text-xs text-gray-700">Prepared By: {editFrom.preparedBy}</div>
                  <div className="text-xs text-gray-700">Mobile: {editFrom.mobile}</div>
                  <div className="text-xs text-gray-700">Email: {editFrom.email}</div>
                </>
              ) : (
                <>
                  <input className="text-xs text-gray-700 font-bold border rounded px-2 py-1 mb-1" value={editFrom.company} onChange={e => setEditFrom(f => ({ ...f, company: e.target.value }))} />
                  <input className="text-xs text-gray-700 border rounded px-2 py-1 mb-1" value={editFrom.address} onChange={e => setEditFrom(f => ({ ...f, address: e.target.value }))} />
                  <input className="text-xs text-gray-700 border rounded px-2 py-1 mb-1" value={editFrom.phone} onChange={e => setEditFrom(f => ({ ...f, phone: e.target.value }))} />
                  <input className="text-xs text-gray-700 border rounded px-2 py-1 mb-1" value={editFrom.preparedBy} onChange={e => setEditFrom(f => ({ ...f, preparedBy: e.target.value }))} />
                  <input className="text-xs text-gray-700 border rounded px-2 py-1 mb-1" value={editFrom.mobile} onChange={e => setEditFrom(f => ({ ...f, mobile: e.target.value }))} />
                  <input className="text-xs text-gray-700 border rounded px-2 py-1 mb-1" value={editFrom.email} onChange={e => setEditFrom(f => ({ ...f, email: e.target.value }))} />
                </>
              )}
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <div className="font-semibold text-gray-900 text-md mb-1">To:</div>
              {!isEditing ? (
                <>
                  <div className="text-xs text-gray-700 font-bold">{editTo.company}</div>
                  <div className="text-xs text-gray-700">Address: {editTo.address}</div>
                  <div className="text-xs text-gray-700">Phone: {editTo.phone}</div>
                  <div className="text-xs text-gray-700">Contact Person: {editTo.contact}</div>
                </>
              ) : (
                <>
                  <input className="text-xs text-gray-700 font-bold border rounded px-2 py-1 mb-1" value={editTo.company} onChange={e => setEditTo(t => ({ ...t, company: e.target.value }))} />
                  <input className="text-xs text-gray-700 border rounded px-2 py-1 mb-1" value={editTo.address} onChange={e => setEditTo(t => ({ ...t, address: e.target.value }))} />
                  <input className="text-xs text-gray-700 border rounded px-2 py-1 mb-1" value={editTo.phone} onChange={e => setEditTo(t => ({ ...t, phone: e.target.value }))} />
                  <input className="text-xs text-gray-700 border rounded px-2 py-1 mb-1" value={editTo.contact} onChange={e => setEditTo(t => ({ ...t, contact: e.target.value }))} />
                </>
              )}
            </div>
          </div>
          {/* Right: Logo and Quotation */}
          <div className="flex flex-col gap-3 items-end">
            <div className="p-8 border border-gray-200 rounded-lg shadow-xs flex flex-col items-center justify-center w-full mt-8">
              <img src={quote.logo} alt="Logo" className="w-32 h-16 object-contain mx-auto" />
            </div>
            <div className="text-3xl text-gray-900 font-semibold uppercase mt-2 text-right w-full">Quotation</div>
            <div className="text-md text-gray-700 font-semibold mt-1 text-right w-full">{quote.provider}</div>
            <div className="text-xs text-gray-600 mt-2 text-right w-full">Created on: <span className="font-medium text-gray-900">{createdOn}</span></div>
            <div className="text-xs text-gray-600 text-right w-full">Valid until: <span className="font-medium text-gray-900">{validUntil}</span></div>
            <div className="text-xs text-gray-600 text-right w-full">Quote ID: <span className="font-medium text-gray-900">{quoteId}</span></div>
          </div>
        </div>

        {/* Combined Quote Details Section with border-b divider */}
        <div className="mb-8">
          <div className="font-semibold text-gray-900 mb-2 text-md">Quote Details</div>
          <div className="bg-white rounded-lg border p-4">
            {/* Location Details with border-b */}
            <div className="pb-4 mb-4 border-b">
              <div className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wider mb-2">Location Details</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-900">
                <div className="flex justify-between text-xs"><span className="text-gray-500">Origin:</span><span className="font-semibold">{quote.origin}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Destination:</span><span className="font-semibold">{quote.destination}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Port of Loading:</span><span className="font-semibold">{quote.origin}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Port of Discharge:</span><span className="font-semibold">{quote.destination}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Port of Delivery:</span><span className="font-semibold">{quote.destination}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Transit Port:</span><span className="font-semibold">{quote.transitPort || '-'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Location Type:</span><span className="font-semibold">{quote.serviceType || '-'}</span></div>
              </div>
            </div>
            {/* Additional Information */}
            <div>
              <div className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wider">Additional Information</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-900">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Shipment Type:</span>
                  <span className="font-semibold">{shipmentType}</span>
                </div>
                {shipmentType === 'Other' && shipmentTypeDescription && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Description:</span>
                    <span className="font-semibold">{shipmentTypeDescription}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs"><span className="text-gray-500">Mode:</span><span className="font-semibold">{selectedQuoteDetails?.modeLabel || '-'}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Transit Time:</span><span className="font-semibold">{quote.transitTime}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Remark:</span><span className="font-semibold">{editRemark}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Cargo Ready Date:</span><span className="font-semibold">{cargoReadyDate}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">ETD:</span><span className="font-semibold">{etd}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Incoterms:</span><span className="font-semibold">{incoterms}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Freight Terms:</span><span className="font-semibold">{freightTerms}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">OF Price Feedback:</span><span className="font-semibold">{ofPriceFeedback}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Note:</span><span className="font-semibold">{note}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Company Branch:</span><span className="font-semibold">{companyBranch}</span></div>
                <div className="flex justify-between text-xs"><span className="text-gray-500">Commodities:</span><span className="font-semibold">{commodities}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Details Table - Redesigned with border and new columns */}
        <div className="mt-8 bg-white">
          <div className="font-semibold text-gray-900 mb-2 text-md">Quote detail</div>
          <div className="overflow-x-auto rounded-lg px-0 pb-2 border border-gray-200 rounded-lg">
            <table className="min-w-full text-xs text-left border-0">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Charge Type</th>
                  <th className="px-4 py-3 font-semibold">Item Name</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Calculated by</th>
                  <th className="px-4 py-3 font-semibold text-right">Quantity</th>
                  <th className="px-4 py-3 font-semibold text-right">Price</th>
                  <th className="px-4 py-3 font-semibold text-right">Currency</th>
                  <th className="px-4 py-3 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-gray-900">
                {tableRows.map((row: any, idx: number) => (
                  <tr key={row.item + idx} className="border-b border-gray-200">
                    <td className="px-4 py-3">{row.chargeType}</td>
                    <td className="px-4 py-3">{row.item}</td>
                    <td className="px-4 py-3">{row.description}</td>
                    <td className="px-4 py-3">{row.calculation}</td>
                    <td className="px-4 py-3 text-right">{row.qty}</td>
                    <td className="px-4 py-3 text-right">{row.baseRate}</td>
                    <td className="px-4 py-3 text-right">{row.currency}</td>
                    <td className="px-4 py-3 text-right">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Subtotal and Total Rows */}
            <div className="flex flex-col items-end mt-2 px-4 text-sm">
              <div className="flex w-full justify-end mb-2">
                <div className="w-32 text-right font-semibold text-gray-700">SUB-TOTAL :</div>
                <div className="w-16 text-right font-semibold text-gray-700">{currency}</div>
                <div className="w-24 text-right font-semibold text-gray-900">{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
              </div>
              <div className="flex w-full justify-end border-t border-gray-200 pt-2">
                <div className="w-32 text-right font-bold text-gray-900">TOTAL :</div>
                <div className="w-16 text-right font-bold text-gray-900">{currency}</div>
                <div className="w-24 text-right font-bold text-gray-900">{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Invoice Footer */}
        <div className="mt-8 text-center text-xs text-gray-500 border-t pt-4">
          <div>&copy; {new Date().getFullYear()} FreightLynk. All rights reserved.</div>
          <div className="mt-2">Terms & Conditions: All rates are subject to change without prior notice. Quotation is valid until the date specified above. Please refer to our website for full terms.</div>
          <div className="mt-2">Payment is due within 14 days of invoice date unless otherwise agreed in writing. Late payments may incur additional charges.</div>
          <div className="mt-2">For questions or support, contact us at support@freightlynk.com.</div>
        </div>
      </div>
    </>
  );
};

export default QuoteInvoice;

