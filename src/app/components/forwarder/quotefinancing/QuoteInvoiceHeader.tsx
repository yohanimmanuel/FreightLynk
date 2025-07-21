import React from 'react';

const QuoteInvoiceHeader = ({
  isEditing,
  editFrom,
  setEditFrom,
  editTo,
  setEditTo,
  editQuote,
  setEditQuote,
  quote,
  user,
  createdOn,
  isManualQuotation,
  editRemark,
  setEditRemark
}: any) => {
  return (
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
              <div className="flex items-center gap-2 mb-1">
                <label className="text-xs text-gray-500 w-28">Company Name</label>
                <input className="text-xs text-gray-700 font-bold border rounded px-2 py-1 flex-1" value={editFrom.company} onChange={e => setEditFrom((f: any) => ({ ...f, company: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <label className="text-xs text-gray-500 w-28">Address</label>
                <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editFrom.address} onChange={e => setEditFrom((f: any) => ({ ...f, address: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <label className="text-xs text-gray-500 w-28">Phone</label>
                <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editFrom.phone} onChange={e => setEditFrom((f: any) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <label className="text-xs text-gray-500 w-28">Prepared By</label>
                <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editFrom.preparedBy} onChange={e => setEditFrom((f: any) => ({ ...f, preparedBy: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <label className="text-xs text-gray-500 w-28">Mobile</label>
                <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editFrom.mobile} onChange={e => setEditFrom((f: any) => ({ ...f, mobile: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <label className="text-xs text-gray-500 w-28">Email</label>
                <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editFrom.email} onChange={e => setEditFrom((f: any) => ({ ...f, email: e.target.value }))} />
              </div>
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
              <div className="flex items-center gap-2 mb-1">
                <label className="text-xs text-gray-500 w-28">Company Name</label>
                <input className="text-xs text-gray-700 font-bold border rounded px-2 py-1 flex-1" value={editTo.company} onChange={e => setEditTo((t: any) => ({ ...t, company: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <label className="text-xs text-gray-500 w-28">Address</label>
                <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editTo.address} onChange={e => setEditTo((t: any) => ({ ...t, address: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <label className="text-xs text-gray-500 w-28">Phone</label>
                <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editTo.phone} onChange={e => setEditTo((t: any) => ({ ...t, phone: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <label className="text-xs text-gray-500 w-28">Contact Person</label>
                <input className="text-xs text-gray-700 border rounded px-2 py-1 flex-1" value={editTo.contact} onChange={e => setEditTo((t: any) => ({ ...t, contact: e.target.value }))} />
              </div>
            </>
          )}
        </div>
      </div>
      {/* Right: Logo and Quotation */}
      <div className="flex flex-col gap-3 items-end">
        <div className="p-8 border border-gray-200 rounded-lg shadow-xs flex flex-col items-center justify-center w-full mt-8">
          {quote.companyLogo ? (
            <img src={quote.companyLogo} alt="Logo" className="w-32 h-16 object-contain mx-auto" />
          ) : quote.logo ? (
          <img src={quote.logo} alt="Logo" className="w-32 h-16 object-contain mx-auto" />
          ) : (
            <div className="w-32 h-16 flex items-center justify-center text-gray-400 text-xs">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-xs">Logo</span>
                </div>
                <span className="text-gray-500 text-xs">Logo</span>
              </div>
            </div>
          )}
        </div>
        <div className="text-3xl text-gray-900 font-semibold uppercase mt-2 text-right w-full">Quotation</div>
        {isEditing ? (
          <div className="w-full flex flex-col items-end mt-2">
            <label className="text-xs text-gray-500 mb-1">Provider</label>
            <input
              className="border border-gray-700 rounded px-2 py-1 text-xs text-gray-900 w-50 text-right"
              value={editQuote.provider}
              onChange={e => setEditQuote((prev: any) => ({ ...prev, provider: e.target.value }))}
              placeholder="e.g. MAERSK"
            />
          </div>
        ) : (
          <div className="w-full flex flex-col items-end mt-2">
            <span className="text-md text-gray-700 font-semibold mt-1 text-right w-full">{editQuote.provider || quote.provider || '-'}</span>
          </div>
        )}
        <div className="text-xs text-gray-600 text-right w-full">Created on: <span className="font-medium text-gray-900">{createdOn}</span></div>
        <div className="text-xs text-gray-600 text-right w-full">Valid until: {!isEditing && !isManualQuotation ? (
          <span className="font-medium text-gray-900">{quote.validUntil}</span>
        ) : (
          <input
            type="date"
            className="border rounded px-2 py-1 text-xs"
            value={editQuote.validUntil}
            onChange={e => setEditQuote((prev: any) => ({ ...prev, validUntil: e.target.value }))}
          />
        )}
        </div>
        <div className="text-xs text-gray-600 text-right w-full">Quote ID: <span className="font-medium text-gray-900">{quote.id}</span></div>
      </div>
    </div>
  );
};

export default QuoteInvoiceHeader; 