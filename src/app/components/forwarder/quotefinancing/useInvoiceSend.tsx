import { useState } from 'react';

export function useInvoiceSend() {
  const [showSendConfirm, setShowSendConfirm] = useState(false);
  const [invoiceSent, setInvoiceSent] = useState(false);
  const [toCompany, setToCompany] = useState<string | null>(null);

  const openSendConfirm = (company: string) => {
    setToCompany(company);
    setShowSendConfirm(true);
  };

  const confirmSend = () => {
    setShowSendConfirm(false);
    setInvoiceSent(true);
    setTimeout(() => setInvoiceSent(false), 2500); // Auto-hide overlay
  };

  return {
    showSendConfirm,
    invoiceSent,
    toCompany,
    openSendConfirm,
    confirmSend,
    cancelSend: () => setShowSendConfirm(false),
  };
}
