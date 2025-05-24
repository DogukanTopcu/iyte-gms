import Link from 'next/link'
import React from 'react'

const StudentAffairsSidebar = ({ activePage }: { activePage: string }) => {
  return (
    <nav className="flex-1 px-4 py-6">
    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-300 pl-2">
      Main Menu
    </div>
    <ul className="space-y-1">
      <li>
        <Link 
          href="/" 
          className={`flex items-center px-4 py-3 rounded-lg hover:bg-red-700 transition-colors ${
            activePage === '' ? 'bg-red-700 font-medium' : ''
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </Link>
      </li>
      <li>
        <Link 
          href="/student-affairs/system-management" 
          className={`flex items-center px-4 py-3 rounded-lg hover:bg-red-700 transition-colors ${
            activePage === 'system-management' ? 'bg-red-700 font-medium' : ''
          }`}
        >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
        </svg>
          System Management
        </Link>
      </li>
      <li>
        <Link 
          href="/student-affairs/student-list" 
          className={`flex items-center px-4 py-3 rounded-lg hover:bg-red-700 transition-colors ${
            activePage === 'student-list' ? 'bg-red-700 font-medium' : ''
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Graduation Approval
        </Link>
      </li>
      <li>
        <Link 
          href="/student-affairs/diplomas" 
          className={`flex items-center px-4 py-3 rounded-lg hover:bg-red-700 transition-colors ${
            activePage === 'diplomas' ? 'bg-red-700 font-medium' : ''
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          Diplomas
        </Link>
      </li>
      <li>
        <Link 
          href="/student-affairs/certificates" 
          className={`flex items-center px-4 py-3 rounded-lg hover:bg-red-700 transition-colors ${
            activePage === 'certificates' ? 'bg-red-700 font-medium' : ''
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Certificates
        </Link>
      </li>
      <li>
        <Link 
          href="/student-affairs/top-three-students" 
          className={`flex items-center px-4 py-3 rounded-lg hover:bg-red-700 transition-colors ${
            activePage === 'top-three-students' ? 'bg-red-700 font-medium' : ''
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Top Three Students
        </Link>
      </li>
    </ul>
  </nav>
  )
}

export default StudentAffairsSidebar