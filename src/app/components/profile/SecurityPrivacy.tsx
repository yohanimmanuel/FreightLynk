import React, { useState } from 'react';
import { Eye, EyeOff, Smartphone, LogOut, Trash2, Shield, Key, Activity } from 'lucide-react';

const mockSessions = [
  { id: 1, device: 'Chrome on Windows', location: 'Jakarta, Indonesia', lastActive: 'Just now', current: true },
  { id: 2, device: 'Safari on iPhone', location: 'Singapore', lastActive: '2 days ago', current: false },
];
const mockActivity = [
  { id: 1, type: 'login', date: '2024-06-01', ip: '192.168.1.1', device: 'Chrome on Windows' },
  { id: 2, type: 'password_change', date: '2024-05-30', ip: '192.168.1.1', device: 'Chrome on Windows' },
  { id: 3, type: '2fa_enabled', date: '2024-05-28', ip: '192.168.1.1', device: 'Safari on iPhone' },
];

const SecurityPrivacy: React.FC = () => {
  // Edit state
  const [editing, setEditing] = useState(false);
  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  // Sessions
  const [sessions, setSessions] = useState(mockSessions);
  // Activity
  const [activity] = useState(mockActivity);
  // Danger zone
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Password change logic (mock)
  const handlePasswordSave = () => {
    setPasswordChanged(true);
    setTimeout(() => setPasswordChanged(false), 3000);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setEditing(false);
  };

  // 2FA logic (mock)
  const handle2FAToggle = () => {
    if (!twoFAEnabled) setShow2FASetup(true);
    else setTwoFAEnabled(false);
  };
  const handle2FASetup = () => {
    setTwoFAEnabled(true);
    setShow2FASetup(false);
  };

  // Session logic (mock)
  const handleLogoutSession = (id: number) => {
    setSessions(sessions => sessions.filter(s => s.id !== id));
  };

  // Delete account logic (mock)
  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false);
    alert('Account deleted (mock)!');
  };

  const handleCancel = () => {
    setEditing(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShow2FASetup(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        {/* Section Title and Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-md font-semibold text-gray-900 mb-2">Security & Privacy</h2>
            <p className="text-gray-500 text-xs">Manage your password, 2FA, sessions, and account security</p>
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
                  onClick={handlePasswordSave}
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
        <form className="space-y-6">
          {/* Change Password */}
          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    required
                    disabled={!editing}
                  />
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowCurrent(v => !v)} tabIndex={-1}>
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    required
                    disabled={!editing}
                  />
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowNew(v => !v)} tabIndex={-1}>
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    required
                    disabled={!editing}
                  />
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            {passwordChanged && <span className="text-xs text-green-600 ml-2">Password changed!</span>}
          </div>
          {/* 2FA */}
          <div>
            <h3 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">User Authentication</h3>
            <div className="flex items-center gap-4 mb-2">
              <button className={`px-4 py-2 rounded-lg text-xs font-medium ${twoFAEnabled ? 'bg-gray-200 text-gray-700' : 'bg-[#007bff] text-white hover:bg-blue-700'}`} onClick={editing ? handle2FAToggle : undefined} disabled={!editing}>
                {twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${twoFAEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{twoFAEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
            {show2FASetup && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-xs text-gray-700 mb-2">Scan this QR code with your authenticator app, then enter the code to enable 2FA.</p>
                <div className="w-24 h-24 bg-gray-200 rounded mb-2 flex items-center justify-center text-gray-400">QR</div>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 mb-2" placeholder="Enter code" />
                <button className="px-4 py-2 rounded-lg bg-[#007bff] text-white text-xs font-medium hover:bg-blue-700 w-full" onClick={handle2FASetup}>Verify & Enable</button>
              </div>
            )}
          </div>
          {/* Sessions */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-2 -mt-3">
            <h3 className="text-xs font-semibold text-gray-700 mb-4 flex items-center gap-2"><Smartphone className="w-4 h-4 text-blue-500" /> Active Sessions</h3>
            <div className="divide-y divide-gray-100">
              {sessions.map(session => (
                <div key={session.id} className="flex items-center gap-4 py-3">
                  <div className="flex-1">
                    <div className="text-xs text-gray-900 font-medium">{session.device}</div>
                    <div className="text-xs text-gray-500">{session.location} • {session.lastActive} {session.current && <span className="ml-2 text-blue-500">(This device)</span>}</div>
                  </div>
                  {!session.current && (
                    <button className="px-3 py-1 rounded-lg border border-red-200 bg-red-50 text-xs text-red-700 font-medium hover:bg-red-100" onClick={editing ? () => handleLogoutSession(session.id) : undefined} disabled={!editing}>
                      <LogOut className="w-3 h-3 inline mr-1" /> Log Out
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Security Activity */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-2">
            <h3 className="text-xs font-semibold text-gray-700 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" /> Recent Security Activity</h3>
            <div className="divide-y divide-gray-100">
              {activity.map(log => (
                <div key={log.id} className="flex items-center gap-4 py-2 text-xs text-gray-600">
                  <span className="w-32 inline-block font-medium text-gray-700">{log.type.replace('_', ' ').toUpperCase()}</span>
                  <span>{log.date}</span>
                  <span>{log.device}</span>
                  <span className="text-gray-400">{log.ip}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Danger Zone */}
          <div className="mt-8 mb-8">
            <h3 className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-2"><Trash2 className="w-4 h-4 text-red-500" /> Danger Zone</h3>
            <p className="text-xs text-gray-500 mb-2">Deleting your account is irreversible. All your data will be permanently removed.</p>
            <button className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700" type="button" onClick={editing ? () => setShowDeleteConfirm(true) : undefined} disabled={!editing}>Delete Account</button>
            {showDeleteConfirm && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700 mb-2">Are you sure you want to delete your account? This action cannot be undone.</p>
                <div className="flex gap-2 justify-end">
                  <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-100" type="button" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                  <button className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700" type="button" onClick={handleDeleteAccount}>Delete</button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecurityPrivacy;
