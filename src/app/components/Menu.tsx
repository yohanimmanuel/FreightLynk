'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Package, 
  CheckSquare,
  Truck, 
  Warehouse, 
  Ship, 
  FileCheck, 
  Receipt, 
  Settings, 
  HelpCircle, 
  CalendarCheck,
  LogOut,
  Plus,
  Menu as MenuIcon,
  X,
  BarChart3,
  Calendar,
  CalendarDays,
  Building2,
  UserCheck,
  Handshake,
  Network,
  TrendingUp,
  PieChart,
  LineChart,
  Target,
  ChevronDown,
  ChevronRight,
  NotebookText
} from 'lucide-react';

import { useMenuContext } from '@/app/(dashboard)/layout';

type MenuItem = {
  icon: any;
  label: string;
  href: string;
  visible: string[];
  hasSubmenu?: boolean;
  submenu?: Array<{
    icon: any;
    label: string;
    href: string;
  }>;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

const menuItems: MenuSection[] = [
    {
      title: "MENU",
      items: [
          {
            icon: LayoutDashboard,
            label: "Dashboard",
            href: "/", // We'll handle this dynamically
            visible: ["admin", "client", "forwarder", "logisticsprovider"],
          },
          {
            icon: FileText,
            label: "Quotes",
            href: "/quotes",
            visible: ["admin", "forwarder", "logisticsprovider"],
          },
          {
            icon: NotebookText,
            label: "Orders",
            href: "/orders",
            visible: ["admin", "client", "forwarder", "logisticsprovider"],
          },
          {
            icon: CalendarCheck,
            label: "Bookings",
            href: "/bookings",
            visible: ["admin", "client", "forwarder", "logisticsprovider"],
          },
          {
            icon: Package,
            label: "Shipments",
            href: "/shipments",
            visible: ["admin", "client", "forwarder", "logisticsprovider"],
          },
          {
            icon: Warehouse,
            label: "Warehouse",
            href: "/warehouse",
            visible: [],
          },
          {
            icon: Truck,
            label: "Transportation",
            href: "/transportation",
            visible: [],
          },
          {
            icon: Receipt,
            label: "Billings",
            href: "/billings",
            visible: ["admin", "client", "forwarder", "logisticsprovider"],
          },
          {
            icon: BarChart3,
            label: "Analytics",
            href: "#", // Changed to # since it's dropdown only
            visible: [],
            hasSubmenu: true,
            submenu: [
              {
                icon: TrendingUp,
                label: "Performance",
                href: "/analytics/performance",
              },
              {
                icon: Target,
                label: "Reports",
                href: "/analytics/reports",
              }
            ]
          },
          {
            icon: Building2,
            label: "Business",
            href: "/business", // Changed to # since it's dropdown only
            visible: ["admin", "client", "forwarder", "logisticsprovider"],
          },
          {
            icon: HelpCircle,
            label: "Help",
            href: "/menulist/help",
            visible: ["admin", "client", "forwarder", "logisticsprovider"],
          },
          {
            icon: Settings,
            label: "Settings",
            href: "/menulist/settings",
            visible: ["admin", "client", "forwarder", "logisticsprovider"],
          },
      ]
    },
]

// This function will be replaced with real backend auth check later
const useAuthCheck = () => {
  const pathname = usePathname();
  
  // This will be replaced with real backend check
  const isClient = pathname.startsWith('/client');
  
  const userType = isClient ? 'client' : 
            pathname.startsWith('/forwarder') ? 'forwarder' :
            pathname.startsWith('/logisticsprovider') ? 'logisticsprovider' : 
            pathname.startsWith('/admin') ? 'admin' : 'client'; // Default to client instead of null
  
  return {
    canCreateBooking: isClient,
    userType
  };
};

const Menu = () => {
  const pathname = usePathname();
  const { isCollapsed, toggleMenu } = useMenuContext();
  const [expandedMenus, setExpandedMenus] = useState<{[key: string]: boolean}>({});
  const { canCreateBooking, userType } = useAuthCheck();
  
  // Function to get current user type with fallback to localStorage
  const getCurrentUserTypeFromPath = () => {
    if (typeof window === 'undefined') return 'client'; // SSR safety
    
    const pathSegments = pathname.split('/');
    const currentPath = pathSegments[1];
    
    // Return the user type if it's a valid user type path
    if (['client', 'forwarder', 'admin', 'logisticsprovider'].includes(currentPath)) {
      return currentPath;
    }
    
    // If not on a user type path, check localStorage for last known user type
    const lastUserType = localStorage.getItem('lastUserType');
    if (lastUserType) {
      return lastUserType.replace('/', ''); // Remove the leading slash
    }
    
    return 'client'; // Default fallback
  };
  
  // Get the current user type from the first part of the path
  const currentUserType = getCurrentUserTypeFromPath();
  const isClientSection = currentUserType === 'client';

  // Helper function to check if current path matches dashboard for any user type
  const isDashboardActive = (pathname: string) => {
    const userTypes = ['/client', '/forwarder', '/admin', '/logisticsprovider'];
    return userTypes.some(type => pathname === type);
  };

  // Function to get dashboard href based on current user type
  const getDashboardHref = () => {
    const userType = getCurrentUserTypeFromPath();
    return `/${userType}`;
  };

  // Add effect to save user type when navigating to dashboard
  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR safety
    
    const currentPath = pathname.split('/')[1];
    if (['client', 'forwarder', 'admin', 'logisticsprovider'].includes(currentPath)) {
      localStorage.setItem('lastUserType', `/${currentPath}`);
    }
  }, [pathname]);

  // Toggle submenu expansion
  const toggleSubmenu = (label: string) => {
    setExpandedMenus(prev => {
      const isCurrentlyExpanded = prev[label];
      // If clicking on already expanded menu, close it
      if (isCurrentlyExpanded) {
        return { [label]: false };
      }
      // Otherwise, close all others and open this one
      return { [label]: true };
    });
  };

  // Check if submenu item is active
  const isSubmenuItemActive = (submenuHref: string) => {
    return pathname.startsWith(submenuHref);
  };

  // Check if parent menu should be active (if any submenu item is active)
  const isParentMenuActive = (item: any) => {
    if (item.label === 'Dashboard') {
      return isDashboardActive(pathname);
    }
    
    if (item.hasSubmenu && item.submenu) {
      return item.submenu.some((subItem: any) => pathname.startsWith(subItem.href));
    }
    
    return pathname.startsWith(item.href);
  };

  return (
    <div className="text-sm h-full flex flex-col bg-white" data-menu>
      {/* Logo Section */}
      <div className={`${isCollapsed ? 'mb-2' : 'mb-4'} ${!isCollapsed ? 'border-b border-gray-200 pb-4' : ''}`}>
        {/* When expanded: logo and button side by side */}
        {!isCollapsed && (
          <div className="flex items-center justify-between">
            <Link href="/landing" className="flex items-center min-w-0 group">
              <div className="flex items-center min-w-0 group-hover:text-blue-700 transition-colors duration-200">
                <div className="bg-white">
                  <Image
                    src="/FreightLynkLogo.svg"
                    alt="FreightLynk Logo"
                    width={40}
                    height={40}
                    className="animate-fade-in-up flex-shrink-0"
                  />
                </div>
                <span className="font-bold text-[#007bff] text-xl menu-text animate-fade-in-up whitespace-nowrap ml-1 group-hover:text-blue-700 transition-colors duration-100">
                FreightLynk. 
                </span>
              </div>   
            </Link>
            
            {/* Toggle Button beside logo when expanded */}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg hover:bg-gray-200 transition-all duration-100 flex-shrink-0 group"
              aria-label="Collapse menu"
            >
              <X size={16} className="text-gray-500 group-hover:text-gray-700 transition-colors duration-100" />
            </button>
          </div>
        )}

        {/* When collapsed: logo centered, button below */}
        {isCollapsed && (
          <div className="flex flex-col items-center space-y-3">
           <Link href="/landing" className="flex items-center justify-center group">
              <div className="bg-white">
                <Image
                  src="/FreightLynkLogo.svg"
                  alt="FreightLynk Logo"
                  width={40}
                  height={40}
                  className="animate-fade-in-up flex-shrink-0"
                />
              </div>
            </Link>
            
            {/* Toggle Button below logo when collapsed */}
            <button
              onClick={toggleMenu}
              className="p-2.5 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center justify-center group"
              aria-label="Expand menu"
            >
              <MenuIcon size={16} className="text-gray-500 group-hover:text-gray-700 transition-colors duration-100" />
            </button>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto">
        {menuItems.map(i => (
          i.title === "MENU" && (
            <div className="flex flex-col space-y-2" key={i.title}>
              {!isCollapsed && (
                <div>
                  {/* Create Booking Button - Show for all client section pages */}
                  {isClientSection && (
                    <Link
                      href="/bookings/create"
                      className="flex items-center justify-center px-4 py-2.5 rounded-lg
                               bg-[#007bff] text-white font-medium w-full
                               hover:bg-blue-600 transition-colors duration-200
                               shadow-sm mb-2"
                    >
                      <Plus size={18} className="mr-2" />
                      Create Booking
                    </Link>
                  )}
                </div>
              )}
              {i.items
              .filter(item => {
                return item.visible.length > 0 && item.visible.includes(currentUserType);
              })
              .map(item => {
                const isActive = isParentMenuActive(item);
                const href = item.label === 'Dashboard' ? getDashboardHref() : item.href;
                const isExpanded = expandedMenus[item.label];
                
                return (
                  <div key={item.label} className="overflow-hidden">
                    {/* Main Menu Item */}
                    <div 
                      className={`flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all duration-100 group relative
                        ${isActive 
                          ? 'bg-blue-100 text-[#007bff] shadow-sm' 
                          : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                        }`}
                    >
                      {/* For items with submenu, make entire row clickable for dropdown */}
                      {item.hasSubmenu === true && item.submenu ? (
                        <button
                          onClick={() => toggleSubmenu(item.label)}
                          className="flex items-center gap-3 flex-1 w-full text-left"
                          title={isCollapsed ? item.label : undefined}
                        >
                          <div className="w-[20px] h-[20px] flex items-center justify-center flex-shrink-0">
                            <item.icon 
                              size={18}
                              className={`transition-all duration-200 ${
                                isActive 
                                  ? 'text-[#007bff]' 
                                  : 'text-gray-500 group-hover:text-gray-800'
                              }`}
                            />
                          </div>
                          {!isCollapsed && (
                            <span className={`menu-text whitespace-nowrap font-medium transition-all duration-100 ${
                              isActive ? 'text-[#007bff]' : 'group-hover:text-gray-800'
                            }`}>
                              {item.label}
                            </span>
                          )}
                          {/* Chevron icon for dropdown */}
                          {!isCollapsed && (
                            <div className="ml-auto">
                              {isExpanded ? (
                                <ChevronDown size={14} className={`transition-all duration-200 ${
                                  isActive ? 'text-[#007bff]' : 'text-gray-500 group-hover:text-gray-800'
                                }`} />
                              ) : (
                                <ChevronRight size={14} className={`transition-all duration-200 ${
                                  isActive ? 'text-[#007bff]' : 'text-gray-500 group-hover:text-gray-800'
                                }`} />
                              )}
                            </div>
                          )}
                        </button>
                      ) : (
                        /* For regular menu items, keep as Link */
                        <Link 
                          href={href as unknown as never}
                          className="flex items-center gap-3 flex-1"
                          title={isCollapsed ? item.label : undefined}
                        >
                          <div className="w-[20px] h-[20px] flex items-center justify-center flex-shrink-0">
                            <item.icon 
                              size={18}
                              className={`transition-all duration-100 ${
                                isActive 
                                  ? 'text-[#007bff]' 
                                  : 'text-gray-500 group-hover:text-gray-800'
                              }`}
                            />
                          </div>
                          {!isCollapsed && (
                            <span className={`menu-text whitespace-nowrap font-medium transition-all duration-100 ${
                              isActive ? 'text-[#007bff]' : 'group-hover:text-gray-800'
                            }`}>
                              {item.label}
                            </span>
                          )}
                        </Link>
                      )}
                      
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-100 whitespace-nowrap z-50 shadow-lg">
                          {item.label}
                          <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-r-4 border-r-gray-900 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                        </div>
                      )}
                    </div>

                    {/* Submenu Items */}
                    {item.hasSubmenu && item.submenu && !isCollapsed && isExpanded && (
                      <div className="ml-2 mt-1 space-y-1 pl-1">
                        {item.submenu.map(subItem => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-100 text-sm group relative mx-2
                              ${isSubmenuItemActive(subItem.href) 
                                ? 'bg-blue-200 text-[#007bff] shadow-sm' 
                                : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                              }`}
                          >
                            <div className="w-[16px] h-[16px] flex items-center justify-center flex-shrink-0">
                              <subItem.icon 
                                size={15}
                                className={`transition-all duration-100 ${
                                  isSubmenuItemActive(subItem.href) 
                                    ? 'text-[#007bff]' 
                                    : 'text-gray-500 group-hover:text-gray-800'
                                }`}
                              />
                            </div>
                            <span className={`whitespace-nowrap font-medium transition-all duration-100 ${
                              isSubmenuItemActive(subItem.href) ? 'text-[#007bff]' : 'group-hover:text-gray-800'
                            }`}>
                              {subItem.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Menu;