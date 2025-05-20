'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function ProtectedLayout({
  children
}: {
  children: React.ReactNode
}) {
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated before showing content
    if (!isAuthenticated) {
      router.replace('/login');
    } else {
      // Only show content if user is actually authenticated
      setIsReady(true);
    }
  }, [isAuthenticated, router]);

  // Show nothing while checking authentication
  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-white z-40">
        {/* Just a blank white screen while checking auth */}
      </div>
    );
  }

  // Only render child components when we're sure the user is authenticated
  return <>{children}</>;
} 