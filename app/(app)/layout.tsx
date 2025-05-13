"use client"
import React from 'react'
import Sidebar from './_components/Sidebar'
import { useAuth } from '@/app/context/AuthContext';
import { usePathname } from 'next/navigation';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { userRole } = useAuth();
  const pathname = usePathname();

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <div className='w-72'>
        <Sidebar activePage={pathname.split('/').pop() || ''} userRole={userRole} />
      </div>
      <div className='flex-1'>
        {children}
      </div>
    </div>
  )
}

export default Layout