'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdvisorInfoCard from './_components/AdvisorInfoCard';
import { Department } from '../types/Department';
import { departments } from '../api/ubys/_shared/faculty-and-department-data';
import StudentListTable from './_components/StudentListTable';
import { UserCard } from './_components/StudentInfoCard';
import DeptSecretariatInfoCard from './_components/DeptSecretariatInfoCard';
import AdvisorListTable from './_components/AdvisorListTable';
import TableToggleSwitch from './_components/TableToggleSwitch';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userRole } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get view from URL params, default to 'students'
  const currentView = searchParams.get('view') || 'students';
  const showStudentsTable = currentView === 'students';
  
  const handleToggleView = (showStudents: boolean) => {
    const params = new URLSearchParams(searchParams);
    params.set('view', showStudents ? 'students' : 'advisors');
    router.push(`?${params.toString()}`);
  };
  
  useEffect(() => {
    // Once user data is available or confirmed null, set loading to false
    if (user !== undefined) {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Graduation Management System ({userRole} panel)</h1>

        {
          userRole === 'advisor' ? (
            <>
              {isLoading && <p>Loading advisor data...</p>}
              {error && <p className="text-red-600">Error: {error}</p>}
              <AdvisorInfoCard
                name={user?.name || 'N/A'}
                email={user?.email || 'N/A'}
                department={departments.find((dep: Department) => dep.id === user?.departmentId) || { id: 0, name: 'N/A' }} />
              <StudentListTable userId={user?.id || 0} role="advisor" />
            </>
          )
          : userRole === 'student' ? (
            <>
              <UserCard user={user} isLoading={isLoading} error={error} />

              <AdvisorInfoCard
                name={user?.advisor?.name || 'N/A'}
                email={user?.advisor?.email || 'N/A'}
                department={departments.find((dep: Department) => dep.id === user?.advisor?.departmentId) || { id: 0, name: 'N/A' }} />

            </>
          )
          : userRole === 'department secretariat' ? (
            <>
              {isLoading && <p>Loading secretariat data...</p>}
              {error && <p className="text-red-600">Error: {error}</p>}
              <DeptSecretariatInfoCard
                name={user?.name || 'N/A'}
                email={user?.email || 'N/A'}
                department={departments.find((dep: Department) => dep.id === user?.departmentId) || { id: 0, name: 'N/A' }} />
              
              <TableToggleSwitch 
                onToggle={handleToggleView}
                initialView={currentView as 'students' | 'advisors'}
              />
              
              {showStudentsTable ? (
                <StudentListTable userId={user?.departmentId || 0} role="department secretariat" />
              ) : (
                <AdvisorListTable userId={user?.departmentId || 0} role="department secretariat" />
              )}
            </>
          ) : null
        }

        </main>
  );
}
