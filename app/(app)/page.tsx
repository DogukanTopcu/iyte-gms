'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import AdvisorInfoCard from './_components/AdvisorInfoCard';
import { Department } from '../types/Department';
import { departments } from '../api/ubys/_shared/unit-and-department-data';



export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, userRole } = useAuth();

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
              {isLoading && <p>Loading student data...</p>}
              {error && <p className="text-red-600">Error: {error}</p>}

              <p>Student data:</p>
              <p>{user?.name}</p>
              <p>{user?.email}</p>
              <p>{user?.id}</p>
              <p>{user?.department?.name}</p>

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

      
        <p>Role: {userRole}</p>
      </main>
  );
}
