'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
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
  NotebookText,
  DollarSign,
  Wallet,
  CreditCard,
  BriefcaseBusiness,
  Earth,
  Globe,
  CircleDollarSign,
  Search,
  List,
  Plane,
  Banknote
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
            icon: CircleDollarSign,
            label: "Rates",
            href: "/rates",
            visible: ["admin", "forwarder", "logisticsprovider"],
          },
          {
            icon: BriefcaseBusiness,
            label: "Quotes",
            href: "/quotes",
            visible: ["admin"],
          },
          {
            icon: NotebookText,
            label: "Orders",
            href: "/orders",
            visible: ["admin", "client"],
          },
          {
            icon: CalendarCheck,
            label: "Bookings",
            href: "/bookings",
            visible: ["admin", "client"],
          },
          {
            icon: BriefcaseBusiness,
            label: "Quotes",
            href: "#",
            visible: ["forwarder", "client", "logisticsprovider"],
            hasSubmenu: true,
            submenu: [
              {
                icon: List,
                label: "List",
                href: "/quotes/list",
              },
              {
                icon: List,
                label: "Requests",
                href: "/quotes/request",
              },
            ]
          },
          {
            icon: Package,
            label: "Shipments",
            href: "#",
            visible: ["forwarder"],
            hasSubmenu: true,
            submenu: [
              {
                icon: List,
                label: "Orders",
                href: "/shipments/orders",
              },
              {
                icon: List,
                label: "Pre-alerts",
                href: "/shipments/pre-alerts",
              },
              {
                icon: List,
                label: "Customs",
                href: "/shipments/customs",
              },
              {
                icon: List,
                label: "Consolidation",
                href: "/shipments/consolidation",
              },
              {
                icon: List,
                label: "Merge",
                href: "/shipments/merge",
              },
              {
                icon: List,
                label: "Group",
                href: "/shipments/group",
              },
            ]
          },
          {
            icon: Package,
            label: "Shipments",
            href: "/shipments",
            visible: ["admin", "client", "logisticsprovider"],
          },
          {
            icon: Globe,
            label: "Freight",
            href: "#",
            visible: ["forwarder"],
            hasSubmenu: true,
            submenu: [
              {
                icon: List,
                label: "Ocean",
                href: "/freight/ocean",
              },
              {
                icon: List,
                label: "Air",
                href: "/freight/air",
              },
              {
                icon: List,
                label: "Road",
                href: "/freight/road",
              },
              {
                icon: List,
                label: "Warehouse",
                href: "/freight/warehouse",
              },
            ]
          },
          {
            icon: Globe,
            label: "Freight",
            href: "/freight",
            visible: ["logisticsprovider"],
          },
          {
            icon: Banknote,
            label: "Accounting",
            href: "/accounting",
            visible: ["forwarder"],
          },
          {
            icon: FileText,
            label: "Documents",
            href: "/documents",
            visible: ["forwarder", "logisticsprovider"],
          },
          {
            icon: CreditCard,
            label: "Billings",
            href: "/billings",
            visible: ["admin", "client"],
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
            icon: Settings,
            label: "Settings",
            href: "/settings",
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
  // Floating submenu state
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState<{top: number, left: number}>({top: 0, left: 0});
  const submenuTimeout = useRef<NodeJS.Timeout | null>(null);
  // Store refs for each menu item
  const menuItemRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  
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
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
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
    <div className="p-4 text-sm h-full flex flex-col bg-white relative" data-menu>
      {/* Logo Section */}
      <div className={`${isCollapsed ? 'mb-2' : 'mb-2'}`}>
        {/* Logo and (optionally) title */}
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <Link href="/landing" className="flex items-center min-w-0 group">
              <div className="flex items-center min-w-0 group-hover:text-blue-700 transition-colors duration-200">
                <div className="bg-white">
                  <Image
                    src="/FreightLynkLogo.svg"
                    alt="FreightLynk Logo"
                    width={40}
                    height={40}
                    className=""
                  />
                </div>
                <span className="font-bold text-[#007bff] text-2xl menu-text animate-fade-in-up whitespace-nowrap ml-1 transition-colors duration-100">
                FreightLynk. 
                </span>
              </div>   
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <Link href="/landing" className="flex items-center justify-center group">
              <div className="bg-white">
                <Image
                  src="/FreightLynkLogo.svg"
                  alt="FreightLynk Logo"
                  width={45}
                  height={45}
                  className=""
                />
              </div>
            </Link>
          </div>
        )}
        {/* Always show border below logo/title */}
        <div className="w-full border-b border-gray-200 my-2"></div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {menuItems.map(i => (
          i.title === "MENU" && (
            <div className="flex flex-col space-y-2" key={i.title}>
              {/* Create Booking Button - Show for all client section pages */}
              {isClientSection && (
                isCollapsed ? (
                  <Link
                    href="/bookings/create"
                    className="flex items-center justify-center p-2 rounded-lg bg-[#007bff] text-white hover:bg-blue-600 transition-colors duration-200 shadow-sm"
                    title="Create Booking"
                  >
                    <Plus size={22} />
                  </Link>
                ) : (
                  <Link
                    href="/bookings/create"
                    className="flex items-center justify-center px-4 py-2.5 rounded-lg
                             bg-[#007bff] text-white font-medium w-full
                             hover:bg-blue-600 transition-colors duration-200
                             shadow-sm"
                  >
                    <Plus size={18} className="mr-2" />
                    Create Booking
                  </Link>
                )
              )}
              {i.items
              .filter(item => {
                // Exclude Business and Settings from main menu
                return item.visible.length > 0 && item.visible.includes(currentUserType) && item.label !== "Business" && item.label !== "Settings";
              })
              .map(item => {
                const isActive = isParentMenuActive(item);
                const href = item.label === 'Dashboard' ? getDashboardHref() : item.href;
                const isExpanded = expandedMenus[item.label];
                const hasSubmenu = item.hasSubmenu && item.submenu;
                // For collapsed sidebar, handle hover for floating submenu
                const handleMouseEnter = () => {
                  if (isCollapsed && hasSubmenu) {
                    if (submenuTimeout.current) clearTimeout(submenuTimeout.current);
                    setHoveredMenu(item.label);
                    // Get the position of the menu icon
                    const ref = menuItemRefs.current[item.label];
                    if (ref) {
                      const rect = ref.getBoundingClientRect();
                      setSubmenuPosition({
                        top: rect.top,
                        left: rect.right,
                      });
                    }
                  }
                };
                const handleMouseLeave = () => {
                  if (isCollapsed && hasSubmenu) {
                    // Add a small delay before hiding
                    submenuTimeout.current = setTimeout(() => {
                      setHoveredMenu(null);
                    }, 150);
                  }
                };
                const handleSubmenuEnter = () => {
                  if (submenuTimeout.current) clearTimeout(submenuTimeout.current);
                };
                const handleSubmenuLeave = () => {
                  submenuTimeout.current = setTimeout(() => {
                    setHoveredMenu(null);
                  }, 150);
                };
                return (
                  <div
                    key={item.label}
                    className="overflow-hidden relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    ref={el => { if (hasSubmenu) menuItemRefs.current[item.label] = el; }}
                  >
                    {/* Main Menu Item */}
                    <div 
                      className={`flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all duration-100 group relative
                        ${isActive 
                          ? 'bg-blue-100 text-[#007bff] shadow-sm' 
                          : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                        }`}
                    >
                      {/* For items with submenu, make entire row clickable for dropdown */}
                      {hasSubmenu ? (
                        <button
                          onClick={() => !isCollapsed && toggleSubmenu(item.label)}
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
                    {/* Floating Submenu Panel (collapsed mode) */}
                    {isCollapsed && hasSubmenu && hoveredMenu === item.label && (
                      <div
                        className="fixed z-50 min-w-[180px] bg-white shadow-xl rounded-lg py-2 px-2 border border-gray-100 animate-fade-in-up"
                        style={{ top: submenuPosition.top, left: submenuPosition.left + 4 }}
                        onMouseEnter={handleSubmenuEnter}
                        onMouseLeave={handleSubmenuLeave}
                      >
                        {(item.submenu ?? []).map(subItem => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-[#007bff] transition-colors duration-100 whitespace-nowrap"
                          >
                            <subItem.icon size={16} className="mr-1" />
                            <span className="font-medium">{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                    {/* Submenu Items (expanded mode) */}
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
        {/* Separated Section for Business and Settings */}
        <div className="border-t border-gray-200 pt-4 mt-4 flex flex-col space-y-2">
          {/* Business Menu Item */}
          {menuItems[0].items.filter(item => item.label === "Business").map(item => {
            const isActive = isParentMenuActive(item);
            const href = item.href;
            return (
              <Link
                key={item.label}
                href={href as unknown as never}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all duration-100 group relative
                  ${isActive 
                    ? 'bg-blue-100 text-[#007bff] shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                  }`}
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
            );
          })}
          {/* Settings Menu Item */}
          {menuItems[0].items.filter(item => item.label === "Settings").map(item => {
            const isActive = isParentMenuActive(item);
            const href = item.href;
            return (
              <Link
                key={item.label}
                href={href as unknown as never}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all duration-100 group relative
                  ${isActive 
                    ? 'bg-blue-100 text-[#007bff] shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'
                  }`}
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Menu;