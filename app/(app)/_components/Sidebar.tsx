import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth, UserRole } from '@/app/context/AuthContext';
import StudentSidebar from './sidebar_items/StudentSidebar';
import AdvisorSidebar from './sidebar_items/AdvisorSidebar';
import StudentAffairsSidebar from './sidebar_items/StudentAffairsSidebar';
import DeptSecretariatSidebar from './sidebar_items/DeptSecretariatSidebar';
import FacultySecretariatSidebar from './sidebar_items/FacultySecretariatSidebar';

interface SidebarProps {
  activePage?: string;
  userRole: UserRole;
  onSidebarToggle?: (isOpen: boolean) => void;
}

export default function Sidebar({ activePage = 'home', userRole, onSidebarToggle }: SidebarProps) {
  const { logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Notify parent component when sidebar state changes
  useEffect(() => {
    if (onSidebarToggle) {
      onSidebarToggle(isMobileOpen);
    }
  }, [isMobileOpen, onSidebarToggle]);

  const toggleSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile toggle button - only visible on small screens */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-2 left-2 z-50 p-2 bg-red-800 rounded-md text-white md:hidden"
        aria-label="Toggle sidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isMobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      <aside className={`w-full h-full max-h-screen bg-gradient-to-b from-red-800 to-red-900 text-white flex flex-col md:fixed md:left-0 md:top-0 md:bottom-0 md:w-72 md:z-30
        transition-all duration-300 absolute z-40 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 overflow-hidden md:overflow-auto`}>
        {/* Logo section */}
        <div className="flex items-center justify-center py-6 border-b border-red-700">
          <div className="bg-white p-1 rounded-full shadow-md">
            <Image
              src="/images/iyte_logo.png"
              alt="IYTE Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold">IYTE GMS</h2>
            <p className="text-xs text-red-200">{userRole} Panel</p>
          </div>
        </div>

        {
          userRole === 'student' ? <StudentSidebar activePage={activePage} /> : 
          userRole?.toLowerCase() === 'secretariat' ? <SecretariatSidebar activePage={activePage} /> :
          userRole?.toLowerCase() === 'student affairs' ? <StudentAffairsSidebar activePage={activePage} /> :
          userRole?.toLowerCase() === 'advisor' ? <AdvisorSidebar activePage={activePage} /> : 
          userRole?.toLowerCase() === 'department secretariat' ? <DeptSecretariatSidebar activePage={activePage} /> :
          userRole?.toLowerCase() === 'faculty secretariat' ? <FacultySecretariatSidebar activePage={activePage} /> : null
        }

        {/* Logout section - separated as requested */}
        <div className="border-t border-red-700 p-4">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center px-4 py-3 bg-red-950 text-white rounded-lg hover:bg-red-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>

          <div className="mt-4 text-center text-xs text-red-300">
            © İzmir Yüksek Teknoloji Enstitüsü
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile - only shows when sidebar is open on mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
} 