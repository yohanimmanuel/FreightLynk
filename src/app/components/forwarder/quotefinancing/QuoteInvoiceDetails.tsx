import React from 'react';

const QuoteInvoiceDetails = ({
  isEditing,
  isManualQuotation,
  quote,
  editQuote,
  setEditQuote,
  editAdditionalInfo,
  setEditAdditionalInfo,
  editRemark,
  setEditRemark,
  shipmentTypeDescription,
  user,
}: any) => {
  return (
    <div className="mb-8">
      <div className="font-semibold text-gray-900 mb-2 text-md">Quote Details</div>
      <div className="bg-white rounded-lg border p-4">
        {/* Location Details with border-b */}
        <div className="pb-4 mb-4 border-b">
          <div className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wider mb-2">Location Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-900">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Origin:</span>
              {!isEditing ? (
                <span className="font-semibold">{quote.origin}</span>
              ) : (
                <input
                  className="border rounded px-2 py-1 text-xs w-32"
                  value={editQuote.origin}
                  onChange={e => setEditQuote((prev: any) => ({ ...prev, origin: e.target.value }))}
                  placeholder="e.g. Singapore"
                />
              )}
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Destination:</span>
              {!isEditing ? (
                <span className="font-semibold">{quote.destination}</span>
              ) : (
                <input
                  className="border rounded px-2 py-1 text-xs w-32"
                  value={editQuote.destination}
                  onChange={e => setEditQuote((prev: any) => ({ ...prev, destination: e.target.value }))}
                  placeholder="e.g. Los Angeles"
                />
              )}
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Port of Loading:</span>
              {!isEditing ? (
                <span className="font-semibold">{quote.portOfLoading || quote.origin}</span>
              ) : (
                <input
                  className="border rounded px-2 py-1 text-xs w-32"
                  value={editQuote.portOfLoading || editQuote.origin}
                  onChange={e => setEditQuote((prev: any) => ({ ...prev, portOfLoading: e.target.value }))}
                  placeholder="e.g. Singapore Port"
                />
              )}
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Port of Discharge:</span>
              {!isEditing ? (
                <span className="font-semibold">{quote.portOfDischarge || quote.destination}</span>
              ) : (
                <input
                  className="border rounded px-2 py-1 text-xs w-32"
                  value={editQuote.portOfDischarge || editQuote.destination}
                  onChange={e => setEditQuote((prev: any) => ({ ...prev, portOfDischarge: e.target.value }))}
                  placeholder="e.g. Los Angeles Port"
                />
              )}
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Port of Delivery:</span>
              {!isEditing ? (
                <span className="font-semibold">{quote.destination}</span>
              ) : (
                <input
                  className="border rounded px-2 py-1 text-xs w-32"
                  value={editQuote.destination}
                  onChange={e => setEditQuote((prev: any) => ({ ...prev, destination: e.target.value }))}
                  placeholder="e.g. Los Angeles Port"
                />
              )}
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Transit Port:</span>
              {!isEditing ? (
                <span className="font-semibold">{quote.transitPort || '-'}</span>
              ) : (
                <input
                  className="border rounded px-2 py-1 text-xs w-32"
                  value={editQuote.transitPort}
                  onChange={e => setEditQuote((prev: any) => ({ ...prev, transitPort: e.target.value }))}
                  placeholder="e.g. Yokohama"
                />
              )}
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Location Type:</span>
              {!isEditing ? (
                <span className="font-semibold">{quote.serviceType || '-'}</span>
              ) : (
                <input
                  className="border rounded px-2 py-1 text-xs w-32"
                  value={editQuote.serviceType}
                  onChange={e => setEditQuote((prev: any) => ({ ...prev, serviceType: e.target.value }))}
                  placeholder="e.g. Port to Port"
                />
              )}
            </div>
          </div>
        </div>
        {/* Additional Information */}
        <div>
          <div className="font-semibold text-gray-900 mb-2 text-xs uppercase tracking-wider">Additional Information</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-900">
            {/* Shipment Type */}
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">Shipment Type:</span>
              {!isEditing ? (
                <span className="font-semibold">{quote.shipmentType || '-'}</span>
              ) : (
                <select
                  className="border rounded px-2 py-1 text-xs"
                  value={editAdditionalInfo.shipmentType || quote.shipmentType || ''}
                  onChange={e => {
                    const value = e.target.value;
                    setEditAdditionalInfo((info: any) => ({
                      ...info,
                      shipmentType: value,
                      shipmentTypeDescription: value === 'Other' ? info.shipmentTypeDescription : '',
                    }));
                  }}
                >
                  <option value="">Select</option>
                  <option value="Export">Export</option>
                  <option value="Import">Import</option>
                  <option value="Domestic">Domestic</option>
                  <option value="Other">Other</option>
                </select>
              )}
            </div>
            {/* Description (if Other) */}
            {((!isEditing && (quote.shipmentType === 'Other')) || (isEditing && (editAdditionalInfo.shipmentType === 'Other'))) && (
              <div className="flex justify-between text-xs items-center">
                <span className="text-gray-500">Description:</span>
                {!isEditing ? (
                  <span className="font-semibold">{quote.shipmentTypeDescription || '-'}</span>
                ) : (
                  <input
                    className="border rounded px-2 py-1 text-xs"
                    value={editAdditionalInfo.shipmentTypeDescription || ''}
                    onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, shipmentTypeDescription: e.target.value }))}
                  />
                )}
              </div>
            )}
            {/* Mode (editable only in edit mode) */}
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">Mode:</span>
              {!isEditing ? (
                <span className="font-semibold">{editQuote.modeLabel || editQuote.mode || '-'}</span>
              ) : (
                <select
                  className="border rounded px-2 py-1 text-xs"
                  value={editQuote.modeLabel || editQuote.mode || ''}
                  onChange={e => setEditQuote((prev: any) => ({ ...prev, modeLabel: e.target.value }))}
                >
                  <option value="">Select</option>
                  <option value="SEA FCL">SEA FCL</option>
                  <option value="SEA LCL">SEA LCL</option>
                  <option value="AIR LCL">AIR LCL</option>
                  <option value="LAND FTL">LAND FTL</option>
                  <option value="LAND LTL">LAND LTL</option>
                </select>
              )}
            </div>
            {/* Transit Time */}
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">Transit Time:</span>
              {!isEditing ? (
                <span className="font-semibold">{quote.transitTime || '-'}</span>
              ) : (
                <input
                  className="border rounded px-2 py-1 text-xs"
                  value={editQuote.transitTime}
                  onChange={e => setEditQuote((prev: any) => ({ ...prev, transitTime: e.target.value }))}
                  placeholder="e.g. 25 days"
                />
              )}
            </div>
            {/* Remark */}
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">Remark:</span>
              {!isEditing ? (
                <span className="font-semibold">{editRemark}</span>
              ) : (
                <input
                  className="border rounded px-2 py-1 text-xs"
                  value={editRemark || ''}
                  onChange={e => setEditRemark(e.target.value)}
                />
              )}
            </div>
            {/* Cargo Ready Date */}
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">Cargo Ready Date:</span>
              {!isEditing ? (
                <span className="font-semibold">{editAdditionalInfo.cargoReadyDate || '-'}</span>
              ) : (
                <input
                  type="date"
                  className="border rounded px-2 py-1 text-xs"
                  value={editAdditionalInfo.cargoReadyDate || ''}
                  onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, cargoReadyDate: e.target.value }))}
                />
              )}
            </div>
            {/* ETD */}
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">ETD:</span>
              {!isEditing ? (
                <span className="font-semibold">{editAdditionalInfo.etd || '-'}</span>
              ) : (
                <input
                  type="date"
                  className="border rounded px-2 py-1 text-xs"
                  value={editAdditionalInfo.etd || ''}
                  onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, etd: e.target.value }))}
                />
              )}
            </div>
            {/* Incoterms */}
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">Incoterms:</span>
              {!isEditing ? (
                <span className="font-semibold">{editAdditionalInfo.incoterm || '-'}</span>
              ) : (
                <select
                  className="border rounded px-2 py-1 text-xs"
                  value={editAdditionalInfo.incoterm || ''}
                  onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, incoterm: e.target.value }))}
                >
                  <option value="">Select</option>
                  <option value="FOB">FOB</option>
                  <option value="CIF">CIF</option>
                  <option value="EXW">EXW</option>
                  <option value="DAP">DAP</option>
                  <option value="DDP">DDP</option>
                </select>
              )}
            </div>
            {/* Freight Terms */}
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">Freight Terms:</span>
              {!isEditing ? (
                <span className="font-semibold">{editAdditionalInfo.freightTerm || '-'}</span>
              ) : (
                <select
                  className="border rounded px-2 py-1 text-xs"
                  value={editAdditionalInfo.freightTerm || ''}
                  onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, freightTerm: e.target.value }))}
                >
                  <option value="">Select</option>
                  <option value="Prepaid">Prepaid</option>
                  <option value="Collect">Collect</option>
                  <option value="Third Party">Third Party</option>
                </select>
              )}
            </div>
            {/* OF Price Feedback */}
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">OF Price Feedback:</span>
              {!isEditing ? (
                <span className="font-semibold">{editAdditionalInfo.ofPriceFeedback || '-'}</span>
              ) : (
                <input
                  className="border rounded px-2 py-1 text-xs"
                  value={editAdditionalInfo.ofPriceFeedback || ''}
                  onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, ofPriceFeedback: e.target.value }))}
                />
              )}
            </div>
            {/* Note */}
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">Note:</span>
              {!isEditing ? (
                <span className="font-semibold">{editAdditionalInfo.note || '-'}</span>
              ) : (
                <input
                  className="border rounded px-2 py-1 text-xs"
                  value={editAdditionalInfo.note || ''}
                  onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, note: e.target.value }))}
                />
              )}
            </div>
            {/* Company Branch */}
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">Company Branch:</span>
              {!isEditing ? (
                <span className="font-semibold">{editAdditionalInfo.companyBranch || '-'}</span>
              ) : (
                <input
                  className="border rounded px-2 py-1 text-xs"
                  value={editAdditionalInfo.companyBranch || ''}
                  onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, companyBranch: e.target.value }))}
                />
              )}
            </div>
            {/* Commodities */}
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">Commodities:</span>
              {!isEditing ? (
                <span className="font-semibold">{editAdditionalInfo.commodities || '-'}</span>
              ) : (
                <input
                  className="border rounded px-2 py-1 text-xs"
                  value={editAdditionalInfo.commodities || ''}
                  onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, commodities: e.target.value }))}
                />
              )}
            </div>
            {/* Is Tariff */}
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500">Is Tariff:</span>
              {!isEditing ? (
                <span className="font-semibold">{editAdditionalInfo.isTariff === true || editAdditionalInfo.isTariff === 'Yes' ? 'Yes' : 'No'}</span>
              ) : (
                <select
                  className="border rounded px-2 py-1 text-xs"
                  value={editAdditionalInfo.isTariff === true || editAdditionalInfo.isTariff === 'Yes' ? 'Yes' : 'No'}
                  onChange={e => setEditAdditionalInfo((info: any) => ({ ...info, isTariff: e.target.value === 'Yes' ? true : false }))}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteInvoiceDetails; 