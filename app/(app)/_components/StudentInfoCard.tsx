import { User } from "../../context/AuthContext";

interface UserCardProps {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const UserCard = ({ user, isLoading, error }: UserCardProps) => {
  if (isLoading) {
    return (
      <div className="animate-pulse bg-white p-6 rounded-lg shadow-md">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
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

  if (!user) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200">
        <p className="text-yellow-700">No user data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white mb-5 p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 pb-2 border-b border-gray-200">
        Student Information
      </h2>
      
      <div className="space-y-3">
        <div className="flex">
          <span className="font-medium text-gray-500 w-32">Student Name:</span>
          <span className="text-gray-800">{user.name}</span>
        </div>
        
        <div className="flex">
          <span className="font-medium text-gray-500 w-32">Student Email:</span>
          <span className="text-gray-800">{user.email}</span>
        </div>
        
        <div className="flex">
          <span className="font-medium text-gray-500 w-32">Student ID:</span>
          <span className="text-gray-800">{user.studentId}</span>
        </div>
        
        <div className="flex">
          <span className="font-medium text-gray-500 w-32">Department:</span>
          <span className="text-gray-800">{user.department?.name || 'Not assigned'}</span>
        </div>
        
        {user.grade !== undefined && (
          <div className="flex">
            <span className="font-medium text-gray-500 w-32">Grade:</span>
            <span className="text-gray-800">{user.grade}. Grade</span>
          </div>
        )}
        
        {user.advisor && (
          <div className="flex">
            <span className="font-medium text-gray-500 w-32">Advisor:</span>
            <span className="text-gray-800">{user.advisor.name}</span>
          </div>
        )}
        {user && (
          <div className="flex">
            <span className="font-medium text-gray-500 w-32">GPA:</span>
            <span className="text-gray-800">{}</span>
          </div>
        )}
      </div>
    </div>
  );
}; 