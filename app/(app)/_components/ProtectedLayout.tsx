'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth(); // Use isLoading from AuthContext
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading) { // Only check after auth context has loaded
      if (!isAuthenticated) {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Loading Indicator
  if (isAuthLoading) {
    return (
      <div className="fixed inset-0 bg-white z-40 flex justify-center items-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // If auth has loaded and user is not authenticated,
  // the useEffect above would have initiated a redirect.
  // This check prevents rendering children if the redirect hasn't completed.
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-white z-40 flex justify-center items-center">
        <p className="text-lg">Redirecting to login...</p>
      </div>
    );
  }

  // Only render child components when we're sure the user is authenticated
  return <>{children}</>;
}