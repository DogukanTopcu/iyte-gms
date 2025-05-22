
import { useState } from 'react';

interface TableToggleSwitchProps {
  onToggle: (showStudents: boolean) => void;
  initialView?: 'students' | 'advisors';
}

export default function TableToggleSwitch({ onToggle, initialView = 'students' }: TableToggleSwitchProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'advisors'>(initialView);

  const handleToggle = (tab: 'students' | 'advisors') => {
    setActiveTab(tab);
    onToggle(tab === 'students');
  };

  return (
    <div className="mb-6">
      <div className="relative bg-gray-100 p-1 rounded-xl inline-flex w-full max-w-md">
        {/* Background slider */}
        <div 
          className={`absolute top-1 bottom-1 rounded-lg shadow-sm transition-all duration-300 ease-in-out bg-white ${
            activeTab === 'advisors' ? 'left-1/2 right-1' : 'left-1 right-1/2'
          }`}
        />
        
        {/* Students tab */}
        <button
          onClick={() => handleToggle('students')}
          className={`relative z-10 flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'students' 
              ? 'text-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Students
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
      </div>
    </div>
  );
} 