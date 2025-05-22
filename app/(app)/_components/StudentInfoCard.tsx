"use client";
import { useEffect, useState } from "react";
import { User } from "../../context/AuthContext";
import statusName from "@/app/constants/graduation-status";

interface UserCardProps {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const UserCard = ({ user, isLoading, error }: UserCardProps) => {
  const [status, setStatus] = useState<string | null>(null);
  const [statusColor, setStatusColor] = useState<string>("bg-gray-200");
  const [statusId, setStatusId] = useState<number>(1);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  useEffect(() => {
    if (user) {
      const fetchStatus = async () => {
        const response = await fetch(`/api/student/graduationStatus?id=${user.studentId}`);
        const data = await response.json();
        const currentStatus = statusName.find((status) => status.status === data.status);
        setStatus(currentStatus?.name || "ERROR");
        setStatusColor(currentStatus?.color || "bg-red-100 text-red-800 border-red-300");
        
        if (currentStatus) {
          setStatusId(currentStatus.id);
          // Calculate progress as percentage (current status / total statuses)
          const maxStatusId = statusName.length;
          setProgressPercentage((currentStatus.id / maxStatusId) * 100);
        }
      };
      fetchStatus();
    }
  }, [user]);
  
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

  // Determine color for progress bar based on current status
  const getProgressBarColor = () => {
    switch(statusId) {
      case 1: return "bg-yellow-500";
      case 2: return "bg-blue-500";
      case 3: return "bg-purple-500";
      case 4: return "bg-pink-500";
      case 5: return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

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
          <>
            <div className="flex items-center">
              <span className="font-medium text-gray-500 w-32">Status:</span>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor} border`}>
                  {status}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  Step {statusId} of {statusName.length}
                </span>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">Graduation Progress</span>
                <span className="text-sm font-medium text-gray-700">{progressPercentage.toFixed(0)}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`${getProgressBarColor()} h-3 rounded-full transition-all duration-500`} 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="mt-4 grid grid-cols-5 gap-1 text-xs">
                {statusName.map((item, index) => {
                  const isCompleted = statusId > item.id;
                  const isCurrent = statusId === item.id;
                  
                  return (
                    <div key={item.id} className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full mb-1 
                        ${isCompleted ? getProgressBarColor() : 
                          isCurrent ? 'bg-white border-2 border-' + getProgressBarColor().replace('bg-', '') : 
                          'bg-gray-200'}`}>
                        {isCompleted ? '✓' : item.id}
                      </div>
                      <span className={`text-center ${isCurrent ? 'font-medium' : ''}`}>{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 