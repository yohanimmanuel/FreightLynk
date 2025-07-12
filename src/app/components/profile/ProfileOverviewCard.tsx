import React, { useState, useRef } from 'react';
import { ChevronDown, CloudUpload } from 'lucide-react';

const initialProfile = {
  avatar: '', // Placeholder for avatar URL
  name: 'Demo',
  surname: 'User',
  email: 'user@email.com',
  phone: '',
  company: '',
  address: '',
  role: 'Forwarder',
  country: 'United States',
  countryCode: 'US',
};

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  // Add more as needed
];

// Shared Dropdown component (inline, no ReactDOM.createPortal)
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

  // Close dropdown on outside click
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

const ProfileOverviewCard: React.FC = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value: string) => {
    const country = countries.find(c => c.name === value);
    if (country) {
      setProfile(prev => ({ ...prev, country: country.name, countryCode: country.code }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setEditing(false);
    // TODO: Save profile to backend/store
    alert('Profile saved!');
  };

  return (
    <form className="w-full" onSubmit={e => { e.preventDefault(); handleSave(); }}>
      <div className="flex flex-col gap-6">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-md font-semibold text-gray-900 mb-2">Personal Info</h2>
            <p className="text-gray-500 text-xs">Update your photo and personal details here</p>
          </div>
          <div className="flex gap-2 md:mt-0">
            {editing ? (
              <>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-100"
                  onClick={() => { setEditing(false); setAvatarPreview(null); }}
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
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900"
                disabled={!editing}
                placeholder="First name"
              />
              <input
                type="text"
                name="surname"
                value={profile.surname}
                onChange={handleChange}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900"
                disabled={!editing}
                placeholder="Last name"
              />
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900"
              disabled={!editing}
            />
          </div>
          {/* Photo Upload */}
          <div className="col-span-1 md:col-span-2 flex items-center gap-6 mt-2">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-13 h-13 rounded-full object-cover" />
                ) : profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <span>{profile.name.charAt(0)}</span>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-2">This photo will be displayed on your profile</span>
            </div>
            <label
              htmlFor="avatar-upload"
              className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${editing ? 'border-gray-300 hover:border-blue-400 bg-gray-50' : 'border-gray-200 bg-gray-100 cursor-not-allowed'}`}
              onDrop={editing ? handleDrop : undefined}
              onDragOver={e => editing && e.preventDefault()}
            >
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={!editing}
                ref={fileInputRef}
                onChange={editing ? handlePhotoChange : undefined}
              />
              <div className="flex flex-col items-center py-6">
                <CloudUpload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-xs font-medium text-gray-700">Click to upload</span>
                <span className="text-xs text-gray-500">or drag and drop</span>
                <span className="text-xs text-gray-400 mt-1">SVG, PNG or JPG (max. 800x400px)</span>
              </div>
            </label>
          </div>
          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900"
              disabled={!editing}
            />
          </div>
          {/* Company */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Company</label>
            <input
              type="text"
              name="company"
              value={profile.company}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900"
              disabled={!editing}
            />
          </div>
          {/* Role (disabled) */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
            <input
              type="text"
              name="role"
              value={profile.role}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          {/* Country (Dropdown) */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
            <Dropdown
              options={countries.map(c => ({ value: c.name, label: `${c.flag} ${c.name}` }))}
              value={profile.country}
              placeholder="Select country"
              onChange={handleCountryChange}
              dropdownKey="country"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              disabled={!editing}
            />
          </div>
          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900"
              disabled={!editing}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProfileOverviewCard; 