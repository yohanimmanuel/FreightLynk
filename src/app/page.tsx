'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserRole } from '@/store/authStore';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;
    if (isAuthenticated && user) {
      // Redirect based on user role
      switch (user.role) {
        case UserRole.ADMIN:
          router.push('/admin');
          break;
        case UserRole.CLIENT:
          router.push('/client');
          break;
        case UserRole.FORWARDER:
          router.push('/forwarder');
          break;
        case UserRole.LOGISTICS_PROVIDER:
          router.push('/logisticsprovider');
          break;
        default:
          router.push('/login');
      }
    } else {
      // If not authenticated, redirect to landing page
      router.push('/landing');
    }
  }, [isAuthenticated, user, router, hasHydrated]);

  if (!hasHydrated) {
    return null; // Or a loading spinner
  }
  return null; // No UI needed as we're redirecting
}