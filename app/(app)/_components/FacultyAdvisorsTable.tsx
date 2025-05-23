import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Advisor {
  id: number;
  name: string;
  email: string;
  departmentId: number;
  departmentName: string;
}

interface FacultyAdvisorsTableProps {
  advisors: Advisor[];
  isLoading: boolean;
}

export default function FacultyAdvisorsTable({ 
  advisors = [], 
  isLoading = false 
}: FacultyAdvisorsTableProps) {
  const router = useRouter();

  const handleViewStudents = (advisorId: number) => {
    // Navigate to view students for this advisor
    router.push(`/advisor/${advisorId}/students`);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">Loading advisors...</td>
            </tr>
          ) : advisors.length > 0 ? (
            advisors.map((advisor) => (
              <tr key={advisor.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{advisor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{advisor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{advisor.departmentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    onClick={() => handleViewStudents(advisor.id)}
                  >
                    View Students
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No advisors found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 