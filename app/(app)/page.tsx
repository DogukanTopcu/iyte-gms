'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
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
            <UserCard user={user} isLoading={isLoading} error={error} />
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
