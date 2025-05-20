'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function LoadingOverlay() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isLoading = searchParams?.get('loading') === 'true';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      
      // Create artificial delay for loading (2 seconds)
      const timeout = setTimeout(() => {
        // Remove the loading parameter
        const url = new URL(window.location.href);
        url.searchParams.delete('loading');
        
        // Use router.replace to update URL without adding to history
        router.replace(url.pathname + url.search);
      }, 2000); // 2 second delay

      return () => clearTimeout(timeout);
    } else {
      // Add a small fade-out delay
      const fadeTimeout = setTimeout(() => {
        setVisible(false);
      }, 300);
      
      return () => clearTimeout(fadeTimeout);
    }
  }, [isLoading, router]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center transition-opacity duration-300">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-800 mb-4"></div>
      <h2 className="text-xl font-semibold text-red-800">Loading...</h2>
      <p className="text-gray-600 mt-2">Please wait...</p>
    </div>
  );
} 