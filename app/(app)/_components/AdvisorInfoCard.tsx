import React from 'react';

interface Department {
  id: number;
  name: string;
}

interface AdvisorInfoCardProps {
  name: string;
  email: string;
  department: Department;
}

export default function AdvisorInfoCard({ name, email, department }: AdvisorInfoCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-medium text-gray-700 mb-4">Advisor Information</h2>
      <div className="flex items-center space-x-4">
        {/* Placeholder for advisor picture */}
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-xl font-semibold text-gray-500">?
          {/* <Image src="/path/to/advisor/image.jpg" alt="Advisor" width={64} height={64} className="rounded-full" /> */}
        </div>
        <div>
          <p className="font-semibold text-gray-700">Advisor name: {name}</p>
          <p className="text-sm text-gray-600">{email}</p>
          <p className="text-sm text-gray-600">Department: {department.name}</p>
        </div>
      </div>
    </div>
  );
} 