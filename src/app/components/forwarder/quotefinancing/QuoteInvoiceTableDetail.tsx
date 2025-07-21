import React from 'react';
import { Plus } from 'lucide-react';

const QuoteInvoiceDetail = ({
  isEditing,
  isManualQuotation,
  tableRows,
  addTableRow,
  removeTableRow,
  updateTableRow,
  additionalCost,
  setAdditionalCost,
  additionalCostDescription,
  setAdditionalCostDescription,
  totalAmount,
  currency,
  selectedQuoteDetails,
  setSelectedQuoteDetails,
  currentDraftQuote,
  setCurrentDraftQuote
}: any) => {
  return (
    <div className="mt-8 bg-white border-t border-gray-200 pt-4">
      <div className="font-semibold text-gray-900 mb-2 text-md">Quote detail</div>
      {(isManualQuotation || isEditing) && (
        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={addTableRow}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </button>
        </div>
      )}
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
              {(isManualQuotation || isEditing) && <th className="px-4 py-3 font-semibold text-center">Actions</th>}
            </tr>
          </thead>
          <tbody className="text-gray-900">
            {tableRows.map((row: any, idx: number) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="px-4 py-3">
                  {(isManualQuotation || isEditing) ? (
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-xs"
                      value={row.chargeType || ''}
                      onChange={(e) => updateTableRow(idx, 'chargeType', e.target.value)}
                    />
                  ) : (
                    row.chargeType
                  )}
                </td>
                <td className="px-4 py-3">
                  {(isManualQuotation || isEditing) ? (
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-xs"
                      value={row.item || ''}
                      onChange={(e) => updateTableRow(idx, 'item', e.target.value)}
                    />
                  ) : (
                    row.item
                  )}
                </td>
                <td className="px-4 py-3">
                  {(isManualQuotation || isEditing) ? (
                    <input
                      type="text"
                      className="w-full px-2 py-1 border border-gray-900 rounded text-xs text-gray-900"
                      value={row.description}
                      onChange={e => updateTableRow(idx, 'description', e.target.value)}
                      placeholder="e.g. 12 kg / 23 cbm"
                    />
                  ) : (
                    row.description
                  )}
                </td>
                <td className="px-4 py-3">
                  {(isManualQuotation || isEditing) ? (
                    <input
                      type="text"
                      className="w-full border rounded px-2 py-1 text-xs"
                      value={row.calculation || ''}
                      onChange={(e) => updateTableRow(idx, 'calculation', e.target.value)}
                    />
                  ) : (
                    row.calculation
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {(isManualQuotation || isEditing) ? (
                    <input
                      type="number"
                      className="w-20 border rounded px-2 py-1 text-xs text-right"
                      value={row.qty || 1}
                      onChange={(e) => updateTableRow(idx, 'qty', parseFloat(e.target.value) || 0)}
                    />
                  ) : (
                    row.qty
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {(isManualQuotation || isEditing) ? (
                    <input
                      type="number"
                      step="0.01"
                      className="w-20 border rounded px-2 py-1 text-xs text-right"
                      value={row.baseRate || 0}
                      onChange={(e) => updateTableRow(idx, 'baseRate', parseFloat(e.target.value) || 0)}
                    />
                  ) : (
                    row.baseRate
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {(isManualQuotation || isEditing) ? (
                    <select
                      className="w-20 border rounded px-2 py-1 text-xs text-right"
                      value={row.currency || 'USD'}
                      onChange={(e) => {
                        const newCurrency = e.target.value;
                        // Update currency for all rows
                        const updatedTableRows = tableRows.map((r: any) => ({ ...r, currency: newCurrency }));
                        setSelectedQuoteDetails({
                          ...selectedQuoteDetails,
                          tableRows: updatedTableRows,
                          currency: newCurrency,
                        });
                        setCurrentDraftQuote({
                          ...currentDraftQuote,
                          currency: newCurrency,
                          id: currentDraftQuote?.id || '',
                          lane: currentDraftQuote?.lane || '',
                          mode: currentDraftQuote?.mode || 'ocean',
                          containertype: currentDraftQuote?.containertype || [],
                          truckType: currentDraftQuote?.truckType || [],
                          weightVolume: currentDraftQuote?.weightVolume || [],
                          baseRate: typeof currentDraftQuote?.baseRate === 'number' ? currentDraftQuote.baseRate : 0,
                          price: currentDraftQuote?.price || '',
                          transitTime: currentDraftQuote?.transitTime || '',
                          provider: currentDraftQuote?.provider || '',
                          validity: currentDraftQuote?.validity || '',
                          status: currentDraftQuote?.status || 'draft',
                          origin: currentDraftQuote?.origin || '',
                          destination: currentDraftQuote?.destination || '',
                          transitPort: currentDraftQuote?.transitPort || '',
                          serviceType: currentDraftQuote?.serviceType || '',
                          incoterms: currentDraftQuote?.incoterms || '',
                          remark: currentDraftQuote?.remark || '',
                          from: currentDraftQuote?.from || { company: '', address: '', phone: '', preparedBy: '', mobile: '', email: '' },
                          to: currentDraftQuote?.to || { company: '', address: '', phone: '', contact: '' },
                          tableRows: currentDraftQuote?.tableRows || [],
                          additionalInfo: currentDraftQuote?.additionalInfo || { shipmentType: '', cargoReadyDate: '', etd: '', incoterms: '', freightTerms: '', ofPriceFeedback: '', notes: '', companyBranch: '', commodities: '', isTariff: false },
                        });
                      }}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="SGD">SGD</option>
                    </select>
                  ) : (
                    row.currency
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {(row.qty * row.baseRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                {(isManualQuotation || isEditing) && (
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => removeTableRow(idx)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {/* Additional Cost Section for Manual Quotations */}
        {(isManualQuotation || isEditing) && (
          <div className="mt-4 px-4 py-3 border-t border-gray-200">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-sm font-medium text-gray-700">Additional Cost:</span>
              <input
                type="number"
                step="0.01"
                className="w-32 border rounded px-2 py-1 text-xs text-gray-900"
                placeholder="0.00"
                value={additionalCost}
                onChange={(e) => setAdditionalCost(parseFloat(e.target.value) || 0)}
              />
              <input
                type="text"
                className="flex-1 border rounded px-2 py-1 text-xs text-gray-900"
                placeholder="Description (optional)"
                value={additionalCostDescription}
                onChange={(e) => setAdditionalCostDescription(e.target.value)}
              />
            </div>
          </div>
        )}
        {/* Subtotal and Total Rows */}
        <div className="flex flex-col items-end mt-2 px-4 text-sm">
          <div className="flex w-full justify-end mb-2">
            <div className="w-32 text-right font-semibold text-gray-700">SUB-TOTAL :</div>
            <div className="w-16 text-right font-semibold text-gray-700">{currency}</div>
            <div className="w-24 text-right font-semibold text-gray-900">{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
          </div>
          {(isManualQuotation || isEditing) && additionalCost > 0 && (
            <div className="flex w-full justify-end mb-2">
              <div className="w-32 text-right font-semibold text-gray-700">ADDITIONAL :</div>
              <div className="w-16 text-right font-semibold text-gray-700">{currency}</div>
              <div className="w-24 text-right font-semibold text-gray-900">{additionalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          )}
          <div className="flex w-full justify-end border-t border-gray-200 pt-2">
            <div className="w-32 text-right font-bold text-gray-900">TOTAL :</div>
            <div className="w-16 text-right font-bold text-gray-900">{currency}</div>
            <div className="w-24 text-right font-bold text-gray-900">{(totalAmount + additionalCost).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteInvoiceDetail; 