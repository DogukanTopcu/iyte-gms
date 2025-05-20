'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import AdvisorInfoCard from './_components/AdvisorInfoCard';
import { Department } from '../types/Department';
import { departments } from '../api/ubys/_shared/unit-and-department-data';

import { UserCard } from './student/_components/StudentInfoCard';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, userRole } = useAuth();
  
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
            </>
          )
          : userRole === 'student' ? (
            <>
              <UserCard user={user} isLoading={isLoading} error={error} /></UserCard>

              <AdvisorInfoCard
                name={user?.advisor?.name || 'N/A'}
                email={user?.advisor?.email || 'N/A'}
                department={departments.find((dep: Department) => dep.id === user?.advisor?.departmentId) || { id: 0, name: 'N/A' }}></AdvisorInfoCard>

            </>
          )
          : userRole === 'secretariat' ? (
            <>
              {isLoading && <p>Loading secretariat data...</p>}
              {error && <p className="text-red-600">Error: {error}</p>}
            </>
          ) : null
        }

        </main>
  );
}
