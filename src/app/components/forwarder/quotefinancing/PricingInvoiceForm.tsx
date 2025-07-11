import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown, X as XIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

// DropdownMenu component for consistent dropdown styling
type DropdownOption = { value: string; label: string };

interface DropdownMenuProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ options, value, onChange, className = "" }) => {
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  const selected = options.find((opt) => opt.value === value);

  // The dropdown menu rendered as a portal
  const dropdownContent = open
    ? ReactDOM.createPortal(
        <div
          className="absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[6rem]"
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            position: 'absolute',
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left p-2 hover:bg-gray-50 rounded cursor-pointer text-xs transition-colors ${
                value === opt.value ? "bg-blue-50 text-blue-600" : "text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>,
        document.body
      )
    : null;

  return (
    <div className={`relative w-full ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 text-gray-900 text-xs rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        {selected ? selected.label : "Select"}
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {dropdownContent}
    </div>
  );
};

// Types
interface ChargeLine {
  id: string;
  feeCode: string;
  feeName: string;
  comment: string;
  units: number;
  unitPrice: number;
  amount: number;
  currency: string;
  manualAmount: boolean;
}

interface ChargeGroup {
  id: string;
  title: string;
  charges: ChargeLine[];
}

const defaultCurrency = 'USD';
const today = new Date().toISOString().slice(0, 10);

const currencyOptions = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'IDR', label: 'IDR' },
  { value: 'SGD', label: 'SGD' },
  { value: 'CNY', label: 'CNY' },
];

const PricingInvoiceForm: React.FC = () => {
  const router = useRouter();
  // Meta fields
  const [meta, setMeta] = useState({
    invoiceId: '',
    carrier: '',
    bookingRef: '',
    dateIssued: today,
    validUntil: '',
    currency: defaultCurrency,
    taxes: 0,
  });

  // Charge groups state
  const [chargeGroups, setChargeGroups] = useState<ChargeGroup[]>([{
    id: Date.now().toString(),
    title: '',
    charges: [{
      id: (Date.now() + Math.random()).toString(),
      feeCode: '',
      feeName: '',
      comment: '',
      units: 1,
      unitPrice: 0,
      amount: 0,
      currency: defaultCurrency,
      manualAmount: false,
    }],
  }]);

  // Handlers for meta fields
  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeta(prev => ({ ...prev, [name]: value }));
  };

  // Handlers for charge group title
  const handleGroupTitleChange = (groupId: string, value: string) => {
    setChargeGroups(prev => prev.map(g => g.id === groupId ? { ...g, title: value } : g));
  };

  // Handlers for charge lines in groups
  const handleChargeChange = (groupId: string, lineId: string, field: keyof ChargeLine, value: string | number | boolean) => {
    setChargeGroups(prev => prev.map(group => {
      if (group.id !== groupId) return group;
      return {
        ...group,
        charges: group.charges.map(line => {
          if (line.id !== lineId) return line;
          let updated = { ...line, [field]: value } as ChargeLine;
          // Auto-calc amount unless manual override
          if ((field === 'units' || field === 'unitPrice') && !updated.manualAmount) {
            const units = Number(field === 'units' ? value : updated.units);
            const unitPrice = Number(field === 'unitPrice' ? value : updated.unitPrice);
            updated.amount = units * unitPrice;
          }
          // If manualAmount is unchecked, recalc
          if (field === 'manualAmount' && value === false) {
            updated.amount = updated.units * updated.unitPrice;
          }
          return updated;
        })
      };
    }));
  };

  const addCharge = (groupId: string) => {
    setChargeGroups(prev => prev.map(group =>
      group.id === groupId
        ? {
            ...group,
            charges: [
              ...group.charges,
              {
                id: (Date.now() + Math.random()).toString(),
                feeCode: '',
                feeName: '',
                comment: '',
                units: 1,
                unitPrice: 0,
                amount: 0,
                currency: meta.currency,
                manualAmount: false,
              },
            ],
          }
        : group
    ));
  };

  const removeCharge = (groupId: string, lineId: string) => {
    setChargeGroups(prev => prev.map(group =>
      group.id === groupId
        ? {
            ...group,
            charges: group.charges.length === 1 ? group.charges : group.charges.filter(line => line.id !== lineId),
          }
        : group
    ));
  };

  // Add new charge group
  const addChargeGroup = () => {
    setChargeGroups(prev => [
      ...prev,
      {
        id: (Date.now() + Math.random()).toString(),
        title: 'New Charges',
        charges: [{
          id: (Date.now() + Math.random()).toString(),
          feeCode: '',
          feeName: '',
          comment: '',
          units: 1,
          unitPrice: 0,
          amount: 0,
          currency: meta.currency,
          manualAmount: false,
        }],
      },
    ]);
  };

  // Delete charge group
  const removeChargeGroup = (groupId: string) => {
    setChargeGroups(prev => prev.length === 1 ? prev : prev.filter(g => g.id !== groupId));
  };

  // Subtotal, taxes, total
  const subtotal = chargeGroups.reduce((sum, group) => sum + group.charges.reduce((gSum, line) => gSum + (Number(line.amount) || 0), 0), 0);
  const taxes = Number(meta.taxes) || 0;
  const total = subtotal + taxes;

  // Validation (update to check all groups)
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    chargeGroups.forEach(group => {
      group.charges.forEach((line, idx) => {
        if (!line.feeName.trim()) newErrors[`feeName-${group.id}-${line.id}`] = 'Fee name required';
        if (Number(line.units) <= 0) newErrors[`units-${group.id}-${line.id}`] = 'Units must be > 0';
        if (Number(line.unitPrice) < 0) newErrors[`unitPrice-${group.id}-${line.id}`] = 'Unit price must be >= 0';
        if (Number(line.amount) < 0) newErrors[`amount-${group.id}-${line.id}`] = 'Amount must be >= 0';
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Here you would send data to backend or parent handler
    alert('Invoice/Quote submitted!');
  };

  // Currency change for invoice updates all lines
  const handleCurrencyChange = (value: string) => {
    setMeta(prev => ({ ...prev, currency: value }));
    setChargeGroups(prev => prev.map(group => ({ ...group, charges: group.charges.map(line => ({ ...line, currency: value })) })));
  };

  // Currency change for a single charge line
  const handleChargeCurrencyChange = (groupId: string, lineId: string, value: string) => {
    setChargeGroups(prev => prev.map(group =>
      group.id === groupId
        ? {
            ...group,
            charges: group.charges.map(line => line.id === lineId ? { ...line, currency: value } : line),
          }
        : group
    ));
  };

  return (
    <form className="w-full bg-white" onSubmit={handleSubmit}>
      {/* Meta/Reference Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-b border-gray-200 pb-6">
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-500">Invoice/Quote ID</label>
          <input name="invoiceId" value={meta.invoiceId} onChange={handleMetaChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900" placeholder="Auto or manual" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-500">Carrier/Service Provider</label>
          <input name="carrier" value={meta.carrier} onChange={handleMetaChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900" placeholder="Carrier name" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-500">Booking Reference</label>
          <input name="bookingRef" value={meta.bookingRef} onChange={handleMetaChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900" placeholder="Booking ref" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-500">Date Issued</label>
          <input name="dateIssued" type="date" value={meta.dateIssued} onChange={handleMetaChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-500">Valid Until</label>
          <input name="validUntil" type="date" value={meta.validUntil} onChange={handleMetaChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1 text-gray-500">Currency</label>
          <DropdownMenu
            options={currencyOptions}
            value={meta.currency}
            onChange={handleCurrencyChange}
          />
        </div>
      </div>
      {/* Charges Table */}
      <div className="mb-6 w-full">
        {chargeGroups.map((group) => (
          <div key={group.id} className="mb-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={group.title}
                  onChange={e => handleGroupTitleChange(group.id, e.target.value)}
                  className="text-lg font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none px-1 py-0.5 mb-1 w-auto min-w-[500px]"
                  placeholder="Enter group title (e.g. Origin Charges)"
                />
                {chargeGroups.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChargeGroup(group.id)}
                    className="ml-1 flex items-center bg-red-50 gap-1 px-3 py-1 rounded-lg hover:bg-red-100 text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label="Delete Charge Group"
                    title="Delete this charge group"
                  >
                    <XIcon className="w-5 h-5" />
                    <span className="text-xs font-semibold">Delete Group</span>
                  </button>
                )}
              </div>
              <button type="button" onClick={() => addCharge(group.id)} className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-300 rounded hover:bg-blue-200 text-xs font-medium">+ Add Charge</button>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="min-w-full text-xs w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 border border-gray-300 font-medium text-gray-500 text-left">Fee Code</th>
                    <th className="p-2 border border-gray-300 font-medium text-gray-500 text-left">Fee Name<span className="text-red-500">*</span></th>
                    <th className="p-2 border border-gray-300 font-medium text-gray-500 text-left">Comment</th>
                    <th className="p-2 border border-gray-300 font-medium text-gray-500 text-left">Units<span className="text-red-500">*</span></th>
                    <th className="p-2 border border-gray-300 font-medium text-gray-500 text-left">Unit Price<span className="text-red-500">*</span></th>
                    <th className="p-2 border border-gray-300 font-medium text-gray-500 text-left">Amount<span className="text-red-500">*</span></th>
                    <th className="p-2 border border-gray-300 font-medium text-gray-500 text-left">Manual?</th>
                    <th className="p-2 border border-gray-300 font-medium text-gray-500 text-left">Currency</th>
                    <th className="p-2 border border-gray-300 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {group.charges.map((line, idx) => (
                    <tr key={line.id} className="bg-white">
                      <td className="p-2 border border-gray-300">
                        <input type="text" value={line.feeCode} onChange={e => handleChargeChange(group.id, line.id, 'feeCode', e.target.value)} className="w-20 border border-gray-300 rounded-sm px-1 py-1 text-gray-900" />
                      </td>
                      <td className="p-2 border border-gray-300">
                        <input type="text" value={line.feeName} onChange={e => handleChargeChange(group.id, line.id, 'feeName', e.target.value)} className="w-32 border border-gray-300 rounded-sm px-1 py-1 text-gray-900" />
                        {errors[`feeName-${group.id}-${line.id}`] && <div className="text-red-500 text-xs">{errors[`feeName-${group.id}-${line.id}`]}</div>}
                      </td>
                      <td className="p-2 border border-gray-300">
                        <input type="text" value={line.comment} onChange={e => handleChargeChange(group.id, line.id, 'comment', e.target.value)} className="w-28 border border-gray-300 rounded-sm px-1 py-1 text-gray-900" />
                      </td>
                      <td className="p-2 border border-gray-300">
                        <input type="number" min={1} value={line.units} onChange={e => handleChargeChange(group.id, line.id, 'units', Number(e.target.value))} className="w-16 border border-gray-300 rounded-sm px-1 py-1 text-gray-900" />
                        {errors[`units-${group.id}-${line.id}`] && <div className="text-red-500 text-xs">{errors[`units-${group.id}-${line.id}`]}</div>}
                      </td>
                      <td className="p-2 border border-gray-300">
                        <input type="number" min={0} value={line.unitPrice} onChange={e => handleChargeChange(group.id, line.id, 'unitPrice', Number(e.target.value))} className="w-20 border border-gray-300 rounded-sm px-1 py-1 text-gray-900" />
                        {errors[`unitPrice-${group.id}-${line.id}`] && <div className="text-red-500 text-xs">{errors[`unitPrice-${group.id}-${line.id}`]}</div>}
                      </td>
                      <td className="p-2 border border-gray-300">
                        <input type="number" min={0} value={line.amount} onChange={e => handleChargeChange(group.id, line.id, 'amount', Number(e.target.value))} className="w-24 border border-gray-300 rounded-sm px-1 py-1 text-gray-900" disabled={!line.manualAmount} />
                        {errors[`amount-${group.id}-${line.id}`] && <div className="text-red-500 text-xs">{errors[`amount-${group.id}-${line.id}`]}</div>}
                      </td>
                      <td className="p-2 border border-gray-300 text-center">
                        <input type="checkbox" checked={line.manualAmount} onChange={e => handleChargeChange(group.id, line.id, 'manualAmount', e.target.checked)} />
                      </td>
                      <td className="p-2 border border-gray-300">
                        <DropdownMenu
                          options={currencyOptions}
                          value={line.currency}
                          onChange={(val: string) => handleChargeCurrencyChange(group.id, line.id, val)}
                        />
                      </td>
                      <td className="p-2 border border-gray-300 text-center">
                        <button type="button" onClick={() => removeCharge(group.id, line.id)} className="text-red-500 hover:text-red-700 font-bold text-lg" disabled={group.charges.length === 1}>×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        <button type="button" onClick={addChargeGroup} className="px-4 py-2 border border-gray-300 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs font-medium">+ Add Charge Group</button>
      </div>
      {/* Summary Section */}
      <div className="flex flex-col md:flex-row justify-end items-end gap-4 mb-6 w-full">
        <div className="flex flex-col gap-1 w-full md:w-1/3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal:</span>
            <span className="font-medium text-gray-900">{meta.currency} {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Taxes:</span>
            <input
              type="number"
              name="taxes"
              value={meta.taxes}
              min={0}
              onChange={handleMetaChange}
              className="w-24 border border-gray-300 rounded-lg px-2 py-1 text-right text-gray-900"
              placeholder="0"
            />
          </div>
          <div className="flex justify-between text-base font-bold border-t pt-2">
            <span className="text-gray-900">Total:</span>
            <span className="text-gray-900">{meta.currency} {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 w-full">
        <button
          type="button"
          className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 font-medium hover:bg-gray-100"
          onClick={() => router.push('/bookings')}
        >
          Cancel
        </button>
        <button type="button" className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 font-medium hover:bg-gray-100">Save</button>
        <button type="submit" className="px-5 py-2 rounded-lg bg-[#007bff] text-sm text-white font-semibold hover:bg-blue-700">Submit</button>
      </div>
    </form>
  );
};

export default PricingInvoiceForm; 