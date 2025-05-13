import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/app/context/AuthContext';
import StudentSidebar from './sidebar_items/StudentSidebar';
import AdvisorSidebar from './sidebar_items/AdvisorSidebar';
import StudentAffairsSidebar from './sidebar_items/StudentAffairsSidebar';

interface SidebarProps {
  activePage?: string;
  userRole: UserRole;
}

export default function Sidebar({ activePage = 'home', userRole }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <aside className="w-full h-full max-h-screen bg-gradient-to-b from-red-800 to-red-900 text-white flex flex-col sticky top-0 left-0 bottom-0 z-0">
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
        userRole?.toLowerCase() === 'secretariat' ? <StudentSidebar activePage={activePage} /> :
        userRole?.toLowerCase() === 'student affairs' ? <StudentAffairsSidebar activePage={activePage} /> :
        userRole?.toLowerCase() === 'advisor' ? <AdvisorSidebar activePage={activePage} /> : null
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
  );
} 