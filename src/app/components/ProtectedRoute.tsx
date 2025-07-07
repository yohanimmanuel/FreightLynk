'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, UserRole } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
}

const roleBasedRedirects = {
  [UserRole.ADMIN]: '/admin',
  [UserRole.CLIENT]: '/client',
  [UserRole.FORWARDER]: '/forwarder',
  [UserRole.LOGISTICS_PROVIDER]: '/logisticsprovider',
};

export default function ProtectedRoute({
  children,
  allowedRoles,
  requiredPermissions,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, checkPermission } = useAuthStore();
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    // If authenticated but no role matches, redirect to appropriate dashboard
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push(roleBasedRedirects[user.role] || '/');
      return;
    }

    // If permissions are required, check them
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasAllPermissions = requiredPermissions.every(permission => 
        checkPermission(permission)
      );
      
      if (!hasAllPermissions) {
        // Redirect to appropriate dashboard if missing permissions
        router.push(roleBasedRedirects[user.role] || '/');
        return;
      }
    }
  }, [isAuthenticated, user, allowedRoles, requiredPermissions, router, pathname, checkPermission]);

  // If we're checking authentication, show nothing
  if (!isAuthenticated || !user) {
    return null;
  }

  // If role check fails, show nothing while redirecting
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  // If permission check fails, show nothing while redirecting
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      checkPermission(permission)
    );
    
    if (!hasAllPermissions) {
      return null;
    }
  }

  // If all checks pass, render children
  return <>{children}</>;
} 