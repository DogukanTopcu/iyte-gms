import { useState } from 'react';

interface FacultyTableToggleSwitchProps {
  onToggle: (view: 'departments' | 'advisors' | 'students') => void;
  initialView?: 'departments' | 'advisors' | 'students';
}

export default function FacultyTableToggleSwitch({ 
  onToggle, 
  initialView = 'departments' 
}: FacultyTableToggleSwitchProps) {
  const [activeTab, setActiveTab] = useState<'departments' | 'advisors' | 'students'>(initialView);

  const handleToggle = (tab: 'departments' | 'advisors' | 'students') => {
    setActiveTab(tab);
    onToggle(tab);
  };

  return (
    <div className="mb-6">
      <div className="relative bg-gray-100 p-1 rounded-xl inline-flex w-full max-w-md">
        {/* Background slider */}
        <div 
          className={`absolute top-1 bottom-1 rounded-lg shadow-sm transition-all duration-300 ease-in-out bg-white ${
            activeTab === 'departments' 
              ? 'left-1 right-2/3' 
              : activeTab === 'advisors' 
                ? 'left-1/3 right-1/3' 
                : 'left-2/3 right-1'
          }`}
        />
        
        {/* Departments tab */}
        <button
          onClick={() => handleToggle('departments')}
          className={`relative z-10 flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'departments' 
              ? 'text-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Departments
        </button>
        
        {/* Advisors tab */}
        <button
          onClick={() => handleToggle('advisors')}
          className={`relative z-10 flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'advisors' 
              ? 'text-green-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Advisors
        </button>
        
        {/* Students tab */}
        <button
          onClick={() => handleToggle('students')}
          className={`relative z-10 flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'students' 
              ? 'text-indigo-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M12 14l9-5-9-5-9 5 9 5z" />
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.825-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
          Students
        </button>
      </div>
    </div>
  );
} 