"use client"
import React, { useState, useEffect } from 'react'
import Sidebar from './_components/Sidebar'
import { useAuth } from '@/app/context/AuthContext';
import { usePathname } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { userRole } = useAuth();
  const pathname = usePathname();
  const [isMobileView, setIsMobileView] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check if we're on mobile view on client side
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768); // 768px is the md breakpoint in Tailwind
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle sidebar state changes
  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    <div className='flex min-h-screen bg-gray-100 relative overflow-hidden'>
      {/* Sidebar wrapper - this keeps the space for the sidebar in desktop view */}
      <div className="md:w-72 w-0 flex-shrink-0">
        <Sidebar 
          activePage={pathname.split('/').pop() || ''} 
          userRole={userRole} 
          onSidebarToggle={handleSidebarToggle}
        />
      </div>
      
      {/* Main content - takes full width on mobile, and respects sidebar in desktop */}
      <div className="flex-1 transition-all duration-300 pt-4">
        {children}
      </div>
    </div>
  )
}

export default Layout