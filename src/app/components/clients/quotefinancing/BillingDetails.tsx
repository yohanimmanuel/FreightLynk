import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useBillingStore } from '@/store/billingData';
import { formatBillingForDisplay } from '@/utils/billingApi';

const BillingDetailsPage = ({ billingId, onBack }: { billingId: string, onBack: () => void }) => {
  const [expandedCharges, setExpandedCharges] = useState(true);
  const { selectedBilling, setSelectedBilling, loadBillings } = useBillingStore();
  
  // Load billing data if not already loaded
  useEffect(() => {
    if (!selectedBilling || selectedBilling.id !== billingId) {
      loadBillings();
    }
  }, [billingId, selectedBilling, loadBillings]);
  
  // Find the billing data for the given ID
  const billingData = selectedBilling?.id === billingId ? selectedBilling : null;

  if (!billingData) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Unpaid':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'Failed':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'Unpaid': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'Failed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalAmount = billingData.charges?.reduce((sum: number, charge: any) => sum + charge.amount, 0) || 0;

  return (
    <div>
      {/* Main Content */}
      <div className="w-full">
        <div>
          {/* Summary Section */}
          <div className="border border-gray-200 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Column 1: Booking ID + Issuer */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Booking ID</label>
                  <p className="text-sm font-semibold text-[#007bff]">{billingData.booking_id}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Issuer</label>
                  <p className="text-sm text-gray-900">{billingData.issuer}</p>
                </div>
              </div>
              {/* Column 2: Billing Date + Due Date */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Billing Date</label>
                  <p className="text-sm text-gray-900">{formatDate(billingData.billing_date)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Due Date</label>
                  <p className="text-sm text-gray-900">{formatDate(billingData.due_date)}</p>
                </div>
              </div>
              {/* Column 3: Invoice Number + Payment Method */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Invoice Number</label>
                  <p className="text-sm text-gray-900">{billingData.invoice_number}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Payment Method</label>
                  <p className="text-sm text-gray-900">{billingData.payment_method}</p>
                </div>
              </div>
              {/* Column 4: Status + Amount Due */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">Status</label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(billingData.status)}
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(billingData.status)}`}>
                      {billingData.status}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Amount Due</label>
                  <p className={`text-lg font-bold ${billingData.status === 'Paid' ? 'text-green-500' : 'text-red-600'}`}>{formatCurrency(billingData.amount_due)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Freight Charges Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-md font-semibold text-gray-900">Freight Charges</h3>
              <button
                onClick={() => setExpandedCharges(!expandedCharges)}
                className="text-[#007bff] hover:text-blue-800 text-sm font-medium"
              >
                {expandedCharges ? 'Collapse' : 'Expand'}
              </button>
            </div>
            
            {expandedCharges && (
              <div className="overflow-x-auto">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-4 font-medium text-gray-500 text-xs uppercase">Charge Type</th>
                        <th className="text-left py-2 px-4 font-medium text-gray-500 text-xs uppercase">Description</th>
                        <th className="text-right py-2 px-4 font-medium text-gray-500 text-xs uppercase">Amount (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {billingData.charges?.map((charge: any, index: number) => (
                        <tr key={index}>
                          <td className="py-4 px-4 text-xs font-medium text-gray-900">{charge.type}</td>
                          <td className="py-4 px-4 text-xs text-gray-600">{charge.description}</td>
                          <td className="py-4 px-4 text-xs text-gray-900 text-right">{formatCurrency(charge.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300">
                        <td className="py-4 px-4 text-sm font-bold text-gray-900" colSpan={2}>Total</td>
                        <td className={`py-4 px-4 text-sm font-bold text-right ${billingData.status === 'Paid' ? 'text-green-500' : 'text-red-600'}`}>{formatCurrency(totalAmount)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 border border-gray-200 p-4 rounded-lg">
              <div>
                <label className="text-xs font-medium text-gray-500">Currency</label>
                <p className="text-sm text-gray-900 mt-1">{billingData.currency}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Invoice Notes</label>
                <p className="text-sm text-gray-900 mt-1">{billingData.invoice_notes || 'No additional notes'}</p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {billingData.paymentHistory && billingData.paymentHistory.length > 0 && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
              <div className="space-y-3">
                {billingData.paymentHistory.map((payment: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{formatDate(payment.date)}</p>
                        <p className="text-sm text-gray-600">{payment.method}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                      <p className={`text-xs ${payment.status === 'Completed' ? 'text-green-600' : 'text-red-600'}`}>
                        {payment.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingDetailsPage;