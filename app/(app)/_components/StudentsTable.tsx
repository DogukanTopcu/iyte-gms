import React, { useState } from 'react';

interface Student {
  id: number;
  name: string;
  email: string;
}

interface StudentsTableProps {
  students: Student[];
}

export default function StudentsTable({ students }: StudentsTableProps) {
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  
  // Handle checkbox selection
  const handleSelectStudent = (studentId: number) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId) // Remove if already selected
        : [...prev, studentId] // Add if not selected
    );
  };
  
  // Handle select all students
  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(student => student.id));
    }
  };
  
  // Handle approve transcripts
  const handleApproveTranscripts = () => {
    if (selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }
    
    // Reset selection after approval
    setSelectedStudents([]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-medium text-gray-700 mb-4">Students Graduation Statements</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-red-600 border-gray-300 rounded"
                  checked={students.length > 0 && selectedStudents.length === students.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transcript</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-red-600 border-gray-300 rounded"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">Transcript</button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{"Pending"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No students assigned to this advisor.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-3">
        <button 
          className={`px-4 py-2 text-white text-sm rounded ${selectedStudents.length > 0 ? 'bg-red-700 hover:bg-red-800' : 'bg-red-400 cursor-not-allowed'}`}
          onClick={handleApproveTranscripts}
        >
          Approve Transcripts ({selectedStudents.length})
        </button>
        <button className="px-4 py-2 bg-red-700 text-white text-sm rounded hover:bg-red-800">Add Outlier Student</button>
      </div>
    </div>
  );
} 