'use client';
import { Metadata } from "next";
import { useState, createContext, useContext } from "react";
import Menu from "@/app/components/Menu";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuthStore } from "@/store/authStore";

// Create context for menu collapse state
const MenuContext = createContext({
  isCollapsed: false,
  toggleMenu: () => {}
});

export const useMenuContext = () => useContext(MenuContext);

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuthStore();

  const toggleMenu = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <ProtectedRoute>
      <MenuContext.Provider value={{ isCollapsed, toggleMenu }}>
        <div className="h-screen flex overflow-hidden" data-layout>
          {/* left */}
          <div className={`${
            isCollapsed ? 'w-[70px]' : 'w-[15%]'
          } bg-white transition-all duration-300 border border-gray-200 min-w-[70px]`}>
            <Menu />
          </div>
          {/* right */}
          <div className={`${
            isCollapsed ? 'w-[calc(100%-70px)]' : 'w-[85%]'
          } bg-white transition-all duration-300 flex flex-col overflow-hidden`}>
            <div className="flex-shrink-0">
              <Navbar />
            </div>
            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </div>
        </div>
      </MenuContext.Provider>
    </ProtectedRoute>
  );
}