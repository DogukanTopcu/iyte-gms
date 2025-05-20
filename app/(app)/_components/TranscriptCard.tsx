import React from 'react';

interface Course {
  code: string;
  name: string;
  grade: string;
  credit: number;
  status: string;
}

interface TranscriptData {
  courses: Course[];
  gpa: number;
  completedCredits: number;
  totalCredits: number;
}

interface TranscriptCardProps {
  data: TranscriptData | null;
  isLoading: boolean;
  error: string | null;
}

export const TranscriptCard = ({ data, isLoading, error }: TranscriptCardProps) => {
  if (isLoading) {
    return (
      <div className="animate-pulse bg-white p-6 rounded-lg shadow-md">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex flex-col space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200">
        <p className="text-red-600 font-medium">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200">
        <p className="text-yellow-700">No transcript data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Academic Transcript</h2>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <div className="bg-blue-50 p-2 rounded-md">
            <p className="text-sm text-gray-500">GPA</p>
            <p className="text-lg font-medium">{data.gpa.toFixed(2)}</p>
          </div>
          <div className="bg-green-50 p-2 rounded-md">
            <p className="text-sm text-gray-500">Completed Credits</p>
            <p className="text-lg font-medium">{data.completedCredits}</p>
          </div>
          <div className="bg-purple-50 p-2 rounded-md">
            <p className="text-sm text-gray-500">Total Credits</p>
            <p className="text-lg font-medium">{data.totalCredits}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.courses.map((course, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{course.name}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  course.grade === 'F' ? 'text-red-600' : 
                  course.grade === 'A' ? 'text-green-600' : 'text-gray-900'
                }`}>{course.grade}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{course.credit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    course.status === 'Passed' ? 'bg-green-100 text-green-800' : 
                    course.status === 'Failed' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 