import React, { useState } from 'react';
import { User, Mail, Crown, Plus, Trash2, Shield, Download, Search } from 'lucide-react';

// Mock data for demonstration
const initialMembers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@email.com', role: 'admin', department: 'Operations', avatar: '', lastActive: 'Online' },
  { id: 2, name: 'Bob Lee', email: 'bob@email.com', role: 'member', department: 'Sales', avatar: '', lastActive: '2h ago' },
  { id: 3, name: 'Charlie Kim', email: 'charlie@email.com', role: 'member', department: 'Warehouse', avatar: '', lastActive: '5m ago' },
];
const initialInvites = [
  { id: 101, email: 'pending1@email.com', invitedBy: 'Alice Johnson', invitedAt: '2024-06-01' },
  { id: 102, email: 'pending2@email.com', invitedBy: 'Alice Johnson', invitedAt: '2024-06-02' },
];
const initialActivity = [
  { id: 201, type: 'joined', user: 'Bob Lee', date: '2024-06-01' },
  { id: 202, type: 'admin_change', user: 'Alice Johnson', target: 'Bob Lee', date: '2024-06-02' },
  { id: 203, type: 'left', user: 'Charlie Kim', date: '2024-06-03' },
];

const currentUserId = 1; // Assume Alice is the current user and admin

const TeamsOrganization: React.FC = () => {
  const [members, setMembers] = useState(initialMembers);
  const [invites, setInvites] = useState(initialInvites);
  const [activity, setActivity] = useState(initialActivity);
  const [search, setSearch] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const currentUser = members.find(m => m.id === currentUserId);
  const isAdmin = currentUser?.role === 'admin';

  // Filtered members by search
  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    (m.department && m.department.toLowerCase().includes(search.toLowerCase()))
  );

  const handleMakeAdmin = (id: number) => {
    setMembers(members => members.map(m =>
      m.id === id ? { ...m, role: 'admin' } : m.role === 'admin' ? { ...m, role: 'member' } : m
    ));
    setActivity(a => [
      { id: Date.now(), type: 'admin_change', user: currentUser?.name || '', target: members.find(m => m.id === id)?.name || '', date: new Date().toISOString().slice(0, 10) },
      ...a
    ]);
  };

  const handleRemove = (id: number) => {
    const removed = members.find(m => m.id === id);
    setMembers(members => members.filter(m => m.id !== id));
    setActivity(a => [
      { id: Date.now(), type: 'left', user: removed?.name || '', date: new Date().toISOString().slice(0, 10) },
      ...a
    ]);
  };

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      setInvites(invites => [
        { id: Date.now(), email: inviteEmail, invitedBy: currentUser?.name || '', invitedAt: new Date().toISOString().slice(0, 10) },
        ...invites
      ]);
      setInviteEmail('');
    }
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['Name', 'Email', 'Role', 'Department'],
      ...members.map(m => [m.name, m.email, m.role, m.department || ''])
    ];
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'team_members.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col gap-4">
        {/* Section Title and Invite */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-md font-semibold text-gray-900 mb-2">Team Members</h2>
            <p className="text-gray-500 text-xs">Manage your organization members, roles, and invites</p>
          </div>
          <div className="flex gap-2 items-center md:mt-0">
            <input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="Invite by email"
              className="border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!isAdmin}
            />
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-[#007bff] text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
              onClick={handleInvite}
              disabled={!isAdmin || !inviteEmail.trim()}
            >
              <Plus className="w-4 h-4 inline mr-1" /> Invite
            </button>
          </div>
        </div>  
        <hr className="border-gray-200" />
        {/* Pending Invites */}
        {invites.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-4 py-2 text-xs font-semibold text-gray-700 border-b border-gray-100">Pending Invites</div>
            {invites.map(invite => (
              <div key={invite.id} className="flex items-center gap-4 px-4 py-3 text-xs text-gray-600">
                <Mail className="w-3 h-3" /> {invite.email}
                <span className="ml-2 text-gray-400">Invited by {invite.invitedBy} on {invite.invitedAt}</span>
              </div>
            ))}
          </div>
        )}
        {/* Activity Log */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
          <div className="px-4 py-2 text-xs font-semibold text-gray-700 border-b border-gray-100">Activity Log</div>
          <div className="divide-y divide-gray-100">
            {activity.map(log => (
              <div key={log.id} className="px-4 py-2 text-xs text-gray-600 flex items-center gap-2">
                {log.type === 'joined' && <span>👤 <b>{log.user}</b> joined the team ({log.date})</span>}
                {log.type === 'left' && <span>🚪 <b>{log.user}</b> left the team ({log.date})</span>}
                {log.type === 'admin_change' && <span>🛡️ <b>{log.user}</b> made <b>{log.target}</b> an admin ({log.date})</span>}
              </div>
            ))}
          </div>
        </div>
        <hr className="border-gray-200" />
        <h2 className="text-md font-semibold text-gray-900">Members List</h2>
        {/* Search and Export Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
          <div className="relative w-full md:w-1/2">
            <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search members..."
              className="border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-[#007bff] text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4 inline mr-1" /> Export CSV
          </button>
        </div>
        {/* Members List */}
        <div className="-mt-3 bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-100 mb-8">
          {filteredMembers.map(member => (
            <div key={member.id} className="flex items-center gap-4 px-4 py-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-base font-bold text-gray-500 overflow-hidden">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <span>{member.name.charAt(0)}</span>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 text-xs truncate">{member.name}</span>
                  {member.role === 'admin' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 ml-1">
                      <Crown className="w-3 h-3 mr-1" /> Admin
                    </span>
                  )}
                  {member.department && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 ml-1">
                      {member.department}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail className="w-3 h-3" /> {member.email}
                  <span className="ml-2">{member.lastActive}</span>
                </div>
              </div>
              {/* Actions */}
              {isAdmin && member.id !== currentUserId && (
                <div className="flex gap-2">
                  {member.role !== 'admin' && (
                    <button
                      type="button"
                      className="px-3 py-1 rounded-lg border border-blue-200 bg-blue-50 text-xs text-blue-700 font-medium hover:bg-blue-100"
                      onClick={() => handleMakeAdmin(member.id)}
                    >
                      <Shield className="w-3 h-3 inline mr-1" /> Make Admin
                    </button>
                  )}
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg border border-red-200 bg-red-50 text-xs text-red-700 font-medium hover:bg-red-100"
                    onClick={() => handleRemove(member.id)}
                  >
                    <Trash2 className="w-3 h-3 inline mr-1" /> Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamsOrganization;
