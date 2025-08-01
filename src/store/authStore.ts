import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '@/utils/auth';

// Define user roles
export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
  FORWARDER = 'forwarder',
  LOGISTICS_PROVIDER = 'logisticsprovider'
}

// Define permissions for each role
export const rolePermissions = {
  [UserRole.ADMIN]: [
    'view_all_users',
    'manage_users',
    'view_all_bookings',
    'manage_all_bookings',
    'view_all_shipments',
    'manage_all_shipments',
    'view_analytics',
    'manage_system_settings'
  ],
  [UserRole.CLIENT]: [
    'view_own_bookings',
    'create_booking',
    'manage_own_bookings',
    'view_own_shipments',
    'view_quotes',
    'request_quotes',
    'view_own_billings',
    'manage_own_account'
  ],
  [UserRole.FORWARDER]: [
    'view_assigned_bookings',
    'manage_assigned_bookings',
    'view_assigned_shipments',
    'manage_assigned_shipments',
    'create_quotes',
    'manage_quotes',
    'view_own_billings',
    'manage_own_account'
  ],
  [UserRole.LOGISTICS_PROVIDER]: [
    'view_assigned_shipments',
    'manage_assigned_shipments',
    'view_warehouse_inventory',
    'manage_warehouse_inventory',
    'view_transportation_assets',
    'manage_transportation_assets',
    'view_own_billings',
    'manage_own_account'
  ]
};

// Define user interface
export interface User {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  companyAddress?: string;
  companyWebsite?: string;
  companySize?: string;
  userType?: string;
  otherUserType?: string;
  businessOperations?: string;
  goodsTypes?: string;
  shippingFrequency?: string;
  primaryRoutes?: string;
  jobTitle?: string;
  phone?: string;
  role: UserRole;
  permissions?: string[];
}

// Define auth store interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

// Create auth store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

      // Login function
      login: async (email: string, password: string) => {
        try {
          const res = await apiLogin(email, password);
          if (res.success) {
            const userRes = await getCurrentUser();
            if (userRes.user) {
              const role = userRes.user.role as UserRole;
              set({ user: {
                id: userRes.user.id,
                email: userRes.user.username, // username is used as email in this demo
                fullName: userRes.user.fullName || '',
                companyName: userRes.user.companyName || '',
                companyAddress: userRes.user.companyAddress,
                companyWebsite: userRes.user.companyWebsite,
                companySize: userRes.user.companySize,
                userType: userRes.user.userType,
                otherUserType: userRes.user.otherUserType,
                businessOperations: userRes.user.businessOperations,
                goodsTypes: userRes.user.goodsTypes,
                shippingFrequency: userRes.user.shippingFrequency,
                primaryRoutes: userRes.user.primaryRoutes,
                jobTitle: userRes.user.jobTitle,
                phone: userRes.user.phone,
                role,
                permissions: rolePermissions[role]
              }, isAuthenticated: true, token: null });
              return true;
            }
          }
          return false;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },

      // Register function
      register: async (userData: any) => {
        try {
          let role: 'client' | 'forwarder' | 'logisticsprovider' = 'client';
          if (userData.userType === 'Freight Forwarder') {
            role = 'forwarder';
          } else if (userData.userType === 'Logistics Provider') {
            role = 'logisticsprovider';
          }
          const res = await apiRegister(
  userData.email,
  userData.password,
  role,
  userData.fullName,
  userData.companyName,
  userData.companyAddress,
  userData.companyWebsite,
  userData.companySize,
  userData.userType,
  userData.otherUserType,
  userData.businessOperations,
  userData.goodsTypes,
  userData.shippingFrequency,
  userData.primaryRoutes,
  userData.jobTitle,
  userData.phone
);
          if (res.success) {
            const userRes = await getCurrentUser();
            if (userRes.user) {
              const storeRole = userRes.user.role as UserRole;
              set({ user: {
                id: userRes.user.id,
                email: userRes.user.username, // username is used as email in this demo
                fullName: userRes.user.fullName,
                companyName: userRes.user.companyName,
                companyAddress: userRes.user.companyAddress,
                companyWebsite: userRes.user.companyWebsite,
                companySize: userRes.user.companySize,
                userType: userRes.user.userType,
                otherUserType: userRes.user.otherUserType,
                businessOperations: userRes.user.businessOperations,
                goodsTypes: userRes.user.goodsTypes,
                shippingFrequency: userRes.user.shippingFrequency,
                primaryRoutes: userRes.user.primaryRoutes,
                jobTitle: userRes.user.jobTitle,
                phone: userRes.user.phone,
                role: storeRole,
                permissions: rolePermissions[storeRole]
              }, isAuthenticated: true, token: null });
              return { success: true };
            }
          }
          return { success: false, error: res.error || 'Registration failed.' };
        } catch (error) {
          console.error('Registration failed:', error);
          return { success: false, error: 'An error occurred during registration.' };
        }
      },

      // Logout function
      logout: () => {
        apiLogout();
        set({ 
          user: null, 
          isAuthenticated: false,
          token: null
        });
      },

      // Check if user has a specific permission
      checkPermission: (permission: string) => {
        const { user } = get();
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permission);
      }
    }),
    {
      name: 'auth-storage', // name for localStorage key
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
); 