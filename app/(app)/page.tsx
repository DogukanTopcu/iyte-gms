'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';


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
