import React, { useState, useRef } from 'react';
import { ChevronDown, Sun, Moon, Monitor, Bell, Mail } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'zh', label: '中文' },
];

const dashboards = [
  { value: 'bookings', label: 'Bookings' },
  { value: 'shipments', label: 'Shipments' },
  { value: 'analytics', label: 'Analytics' },
];

const currencies = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'IDR', label: 'IDR - Indonesian Rupiah' },
  { value: 'SGD', label: 'SGD - Singapore Dollar' },
];

const initialPrefs = {
  theme: 'system',
  language: 'en',
  dateFormat: 'DD/MM/YYYY',
  emailNotifications: true,
  inAppNotifications: true,
  defaultDashboard: 'bookings',
  defaultCurrency: 'USD',
};

const Dropdown = ({ options, value, placeholder, onChange, dropdownKey, openDropdown, setOpenDropdown, disabled }: {
  options: { value: string; label: string }[];
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  dropdownKey: string;
  openDropdown: string | null;
  setOpenDropdown: (key: string | null) => void;
  disabled?: boolean;
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isOpen = openDropdown === dropdownKey && !disabled;
  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  React.useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen, setOpenDropdown]);

  const handleButtonClick = () => {
    if (disabled) return;
    setOpenDropdown(isOpen ? null : dropdownKey);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        type="button"
        className={`flex items-center justify-between w-full pl-3 pr-8 py-2 text-xs text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          !selectedOption ? 'text-gray-500' : ''
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        disabled={disabled}
      >
        {displayValue}
        <ChevronDown
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-40"
        >
          <div className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpenDropdown(null);
                }}
                className={`block w-full text-left px-3 py-2 text-xs ${
                  value === option.value
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Toggle = ({ checked, onChange, disabled, label, icon }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; label?: string; icon?: React.ReactNode }) => (
  <button
    type="button"
    className={`flex items-center gap-2 px-2 py-1 rounded-full border transition-colors ${checked ? 'bg-blue-50 border-blue-500' : 'bg-gray-100 border-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'}`}
    onClick={() => !disabled && onChange(!checked)}
    disabled={disabled}
    aria-pressed={checked}
  >
    <span className={`inline-block w-4 h-4 rounded-full ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
    {icon}
    <span className="text-xs text-gray-700 font-medium">{label}</span>
  </button>
);

const UserPreferences: React.FC = () => {
  const [prefs, setPrefs] = useState(initialPrefs);
  const [editing, setEditing] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleChange = (field: keyof typeof initialPrefs, value: any) => {
    setPrefs(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setEditing(false);
    // TODO: Save preferences to backend/store
    alert('Preferences saved!');
  };

  const handleCancel = () => {
    setEditing(false);
    setPrefs(initialPrefs);
  };

  return (
    <form className="w-full mx-auto" onSubmit={e => { e.preventDefault(); handleSave(); }}>
      <div className="flex flex-col gap-6">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-md font-semibold text-gray-900 mb-2">Preferences</h2>
            <p className="text-gray-500 text-xs">Customize your experience and defaults</p>
          </div>
          <div className="flex gap-2 md:mt-0">
            {editing ? (
              <>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-100"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#007bff] text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-[#007bff] text-white text-sm font-semibold hover:bg-blue-700"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
        <hr className="border-gray-200" />
        {/* Theme & Appearance */}
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Theme & Appearance</h3>
          <div className="flex gap-3">
            <Toggle
              checked={prefs.theme === 'light'}
              onChange={() => handleChange('theme', 'light')}
              disabled={!editing}
              label="Light"
              icon={<Sun className="w-4 h-4 text-gray-500" />}
            />
            <Toggle
              checked={prefs.theme === 'dark'}
              onChange={() => handleChange('theme', 'dark')}
              disabled={!editing}
              label="Dark"
              icon={<Moon className="w-4 h-4 text-gray-500" />}
            />
            <Toggle
              checked={prefs.theme === 'system'}
              onChange={() => handleChange('theme', 'system')}
              disabled={!editing}
              label="System"
              icon={<Monitor className="w-4 h-4 text-gray-500" />}
            />
          </div>
        </div>
        {/* Language & Region */}
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Language & Region</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Language</label>
              <Dropdown
                options={languages.map(l => ({ value: l.code, label: l.label }))}
                value={prefs.language}
                placeholder="Select language"
                onChange={v => handleChange('language', v)}
                dropdownKey="language"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Date Format</label>
              <Dropdown
                options={[
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                ]}
                value={prefs.dateFormat}
                placeholder="Select format"
                onChange={v => handleChange('dateFormat', v)}
                dropdownKey="dateFormat"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                disabled={!editing}
              />
            </div>
          </div>
        </div>
        {/* Notifications */}
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Notifications</h3>
          <div className="flex gap-4">
            <Toggle
              checked={prefs.emailNotifications}
              onChange={v => handleChange('emailNotifications', v)}
              disabled={!editing}
              label="Email"
              icon={<Mail className="w-4 h-4" />}
            />
            <Toggle
              checked={prefs.inAppNotifications}
              onChange={v => handleChange('inAppNotifications', v)}
              disabled={!editing}
              label="In-App"
              icon={<Bell className="w-4 h-4" />}
            />
          </div>
        </div>
        {/* Defaults */}
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Defaults</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Default Dashboard</label>
              <Dropdown
                options={dashboards}
                value={prefs.defaultDashboard}
                placeholder="Select dashboard"
                onChange={v => handleChange('defaultDashboard', v)}
                dropdownKey="dashboard"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Default Currency</label>
              <Dropdown
                options={currencies}
                value={prefs.defaultCurrency}
                placeholder="Select currency"
                onChange={v => handleChange('defaultCurrency', v)}
                dropdownKey="currency"
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
                disabled={!editing}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserPreferences;
