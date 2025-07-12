import React, { useState, useRef } from 'react';
import { ChevronDown, Check, CloudUpload } from 'lucide-react';

const initialCompanyInfo = {
  companyName: 'Sisyphus Ventures',
  companyUrl: 'sisyphusventures.com',
  tagline: 'Sisyphus Ventures is the ultimate startup venture to kickstart any project, startup, or freelance business.',
  description: 'We are a forward-thinking venture capital firm specializing in early-stage technology startups. Our mission is to identify and support innovative entrepreneurs who are building the future through disruptive technologies and scalable business models. With a focus on AI, fintech, and sustainable technology, we provide not just capital but strategic guidance and industry connections to help our portfolio companies achieve exponential growth.',
  logo: '', // Placeholder for logo URL
  includeInReports: true,
  includeInEmails: true,
  socialProfiles: {
    instagram: 'sisyphusvc',
    facebook: 'sisyphusvc',
    linkedin: 'sisyphusvc'
  }
};

const CompanyInfoCard: React.FC = () => {
  const [companyInfo, setCompanyInfo] = useState(initialCompanyInfo);
  const [editing, setEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setCompanyInfo(prev => ({
      ...prev,
      socialProfiles: { ...prev.socialProfiles, [platform]: value }
    }));
  };

  const handleCheckboxChange = (name: string) => {
    setCompanyInfo(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogoPreview(ev.target?.result as string);
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
        setLogoPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setEditing(false);
    // TODO: Save company info to backend/store
    alert('Company info saved!');
  };

  const handleCancel = () => {
    setEditing(false);
    setLogoPreview(null);
    // Reset form to original state
    setCompanyInfo(initialCompanyInfo);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-md font-semibold text-gray-900 mb-2">Company Info</h2>
            <p className="text-gray-500 text-xs">Update your company photo and details here</p>
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
                  type="button"
                  className="px-4 py-2 rounded-lg bg-[#007bff] text-white text-sm font-semibold hover:bg-blue-700"
                  onClick={handleSave}
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

        {/* Company Profile Section */}
        <div className="space-y-6">
          {/* Company Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={companyInfo.companyName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!editing}
              placeholder="Enter company name"
            />
          </div>

          {/* Company URL */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Company URL</label>
            <div className="flex items-center">
              <span className="text-xs text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2">
                https://
              </span>
              <input
                type="text"
                name="companyUrl"
                value={companyInfo.companyUrl}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!editing}
                placeholder="yourcompany.com"
              />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tagline</label>
            <textarea
              name="tagline"
              value={companyInfo.tagline}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              disabled={!editing}
              placeholder="A quick snapshot of your company"
            />
            <p className="text-xs text-gray-400 mt-1">
              {companyInfo.tagline.length}/200 characters
            </p>
          </div>

          {/* Company Description */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Company Description</label>
            <textarea
              name="description"
              value={companyInfo.description}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              disabled={!editing}
              placeholder="Describe what your company does, your mission, and what makes you unique"
            />
            <p className="text-xs text-gray-400 mt-1">
              {companyInfo.description.length}/500 characters
            </p>
          </div>

          {/* Company Logo */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Company Logo</label>
            <p className="text-xs text-gray-400 mb-3">Update your company logo and then choose where you want it to display.</p>
            <div className="flex items-center gap-6">
              {/* Logo Preview */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-500 overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Company Logo" className="w-13 h-13 rounded-full object-cover" />
                  ) : companyInfo.logo ? (
                    <img src={companyInfo.logo} alt="Company Logo" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <span>{companyInfo.companyName.charAt(0)}</span>
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-2 w-50 text-center">This logo will be displayed on your company profile</span>
              </div>
              <label
                htmlFor="logo-upload"
                className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${editing ? 'border-gray-300 hover:border-blue-400 bg-gray-50' : 'border-gray-200 bg-gray-100 cursor-not-allowed'}`}
                onDrop={editing ? handleDrop : undefined}
                onDragOver={e => editing && e.preventDefault()}
              >
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={!editing}
                  ref={fileInputRef}
                  onChange={editing ? handleLogoChange : undefined}
                />
                <div className="flex flex-col items-center py-6">
                  <CloudUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs font-medium text-gray-700">Click to upload</span>
                  <span className="text-xs text-gray-500">or drag and drop</span>
                  <span className="text-xs text-gray-400 mt-1">SVG, PNG or JPG (max. 800x400px)</span>
                </div>
              </label>
            </div>
          </div>

          {/* Branding Options */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-3">Branding</label>
            <p className="text-xs text-gray-400 mb-3">Add your logo to reports and emails.</p>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={companyInfo.includeInReports}
                    onChange={() => handleCheckboxChange('includeInReports')}
                    disabled={!editing}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    companyInfo.includeInReports 
                      ? 'bg-[#007bff] border-[#007bff]' 
                      : 'bg-white border-gray-300'
                  } ${!editing ? 'opacity-50' : ''}`}>
                    {companyInfo.includeInReports && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-900">Reports</span>
                  <p className="text-xs text-gray-500">Include my logo in summary reports.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={companyInfo.includeInEmails}
                    onChange={() => handleCheckboxChange('includeInEmails')}
                    disabled={!editing}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    companyInfo.includeInEmails 
                      ? 'bg-[#007bff] border-[#007bff]' 
                      : 'bg-white border-gray-300'
                  } ${!editing ? 'opacity-50' : ''}`}>
                    {companyInfo.includeInEmails && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-900">Emails</span>
                  <p className="text-xs text-gray-500">Include my logo in customer emails.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="mb-10">
            <label className="block text-xs font-medium text-gray-500 mb-3">Social Profiles</label>
            <div className="space-y-3">
              {/* Instagram */}
              <div className="flex items-center">
                <span className="text-xs text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2 w-40">
                  instagram.com/
                </span>
                <input
                  type="text"
                  value={companyInfo.socialProfiles.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!editing}
                  placeholder="username"
                />
              </div>

              {/* Facebook */}
              <div className="flex items-center">
                <span className="text-xs text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2 w-40">
                  facebook.com/
                </span>
                <input
                  type="text"
                  value={companyInfo.socialProfiles.facebook}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!editing}
                  placeholder="username"
                />
              </div>

              {/* LinkedIn */}
              <div className="flex items-center">
                <span className="text-xs text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg px-3 py-2 w-40">
                  linkedin.com/company/
                </span>
                <input
                  type="text"
                  value={companyInfo.socialProfiles.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!editing}
                  placeholder="company-name"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoCard;