import Image from "next/image";
import { Search, MessageCircle, Bell, User } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-4">
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
          <span className="text-xs leading-3 font-medium">John Doe</span>
          <span className="text-[10px] text-gray-500 text-right">Admin</span>
        </div>
        <div className="bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center">
          <User size={20} className="text-gray-900" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;