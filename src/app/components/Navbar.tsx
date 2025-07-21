'use client';

import Image from "next/image";
import { Search, MessageCircle, Bell, User, LogOut } from 'lucide-react';
import { Menu as MenuIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useMenuContext } from '@/app/(dashboard)/layout';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { toggleMenu } = useMenuContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Format role for display
  const formatRole = (role: string) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  return (
    <div className="flex items-center justify-between p-4 z-30 relative">
      {/* MENU COLLAPSE BUTTON */}
      <button
        onClick={toggleMenu}
        className="mr-4 p-2 rounded-lg hover:bg-gray-200 transition-all duration-100 flex-shrink-0 group"
        aria-label="Toggle menu"
      >
        <MenuIcon size={20} className="text-gray-700 transition-colors duration-100" />
      </button>
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-1 text-black text-xs rounded-full ring-[1.5px] ring-gray-300 px-3">
        <Search size={15} className="text-gray-500" />
        <input
          type="text"
          placeholder="Quick Search..."
          className="w-[500px] p-2 bg-transparent outline-none"
        />
      </div>
      {/* ICONS AND USER */}
      <div className="flex items-center gap-7 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <MessageCircle size={20} className="text-gray-900" />
        </div>
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Bell size={20} className="text-gray-900" />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
            1
          </div>
        </div>
        <div className="flex flex-col text-black">
          <span className="text-xs leading-3 font-medium">{user?.fullName || 'User'}</span>
          <span className="text-[10px] text-gray-500 text-right">{formatRole(user?.role || '')}</span>
        </div>
        <div className="relative" ref={dropdownRef}>
          <div 
            className="bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <User size={20} className="text-gray-900" />
          </div>
          
          {/* User dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 min-w-[230px] max-w-[350px] border border-gray-200 bg-white rounded-lg shadow-lg py-1 z-10 break-words">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900 truncate" title={user?.fullName}>{user?.fullName}</p>
                <p className="text-xs text-gray-500 break-all" title={user?.email}>{user?.email}</p>
              </div>
              <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Account Settings
              </a>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;