import { useRouter } from 'next/navigation';

interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string;
  departmentId: number;
  departmentName: string;
  advisorId: number;
  advisorName: string;
  status: string;
}

interface FacultyStudentsTableProps {
  students: Student[];
  isLoading: boolean;
}

export default function FacultyStudentsTable({ 
  students = [], 
  isLoading = false 
}: FacultyStudentsTableProps) {
  const router = useRouter();

  const handleViewTranscript = (studentId: string) => {
    // Navigate to view transcript for this student
    router.push(`/transcript/${studentId}`);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advisor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">Loading students...</td>
            </tr>
          ) : students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.studentId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.departmentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.advisorName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    student.status === 'approved' ? 'bg-green-100 text-green-800' :
                    student.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    student.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {student.status || 'Unknown'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                    onClick={() => handleViewTranscript(student.studentId)}
                  >
                    View Transcript
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 