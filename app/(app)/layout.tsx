"use client"
import React, { useState, useEffect } from 'react'
import Sidebar from './_components/Sidebar'
import ProtectedLayout from './_components/ProtectedLayout'
import { useAuth } from '@/app/context/AuthContext';
import { usePathname } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { userRole } = useAuth();
  const pathname = usePathname();

  return (
    <ProtectedLayout>
      <div className='flex min-h-screen bg-gray-100 relative overflow-hidden'>
        {/* Sidebar wrapper - this keeps the space for the sidebar in desktop view */}
        <div className="md:w-72 w-0 flex-shrink-0">
          <Sidebar 
            activePage={pathname.split('/').pop() || ''} 
            userRole={userRole} 
          />
        </div>
        
        {/* Main content - takes full width on mobile, and respects sidebar in desktop */}
        <div className="flex-1 transition-all duration-300 pt-4">
          {children}
        </div>
      </div>
    </ProtectedLayout>
  )
}

export default Layout