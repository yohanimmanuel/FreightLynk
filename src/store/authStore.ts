import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  role: UserRole;
  permissions?: string[];
}

// Define auth store interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
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
          // In a real app, you would make an API call here
          // For demo purposes, we'll simulate a successful login with mock data
          
          // Mock response based on email prefix
          let role = UserRole.CLIENT; // default role
          if (email.startsWith('admin')) {
            role = UserRole.ADMIN;
          } else if (email.startsWith('forwarder')) {
            role = UserRole.FORWARDER;
          } else if (email.startsWith('logistics')) {
            role = UserRole.LOGISTICS_PROVIDER;
          }
          
          // Mock user data
          const userData: User = {
            id: '123456',
            email,
            fullName: 'Demo User',
            companyName: 'Demo Company',
            role,
            permissions: rolePermissions[role]
          };
          
          // Mock token
          const token = 'mock-jwt-token';
          
          // Update state
          set({ 
            user: userData, 
            isAuthenticated: true,
            token
          });
          
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },

      // Register function
      register: async (userData: any) => {
        try {
          // In a real app, you would make an API call here
          // For demo purposes, we'll simulate a successful registration
          
          // Determine role based on userType from registration
          let role = UserRole.CLIENT;
          if (userData.userType === 'Freight Forwarder') {
            role = UserRole.FORWARDER;
          } else if (userData.userType === 'Logistics Provider') {
            role = UserRole.LOGISTICS_PROVIDER;
          }
          
          // Create user with role
          const newUser: User = {
            id: 'new-user-123',
            email: userData.email,
            fullName: userData.fullName,
            companyName: userData.companyName,
            role,
            permissions: rolePermissions[role]
          };
          
          // Mock token
          const token = 'mock-jwt-token';
          
          // Update state
          set({ 
            user: newUser, 
            isAuthenticated: true,
            token
          });
          
          return true;
        } catch (error) {
          console.error('Registration failed:', error);
          return false;
        }
      },

      // Logout function
      logout: () => {
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