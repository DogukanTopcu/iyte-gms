'use client';

import React, { useState, useEffect } from 'react';
import { TranscriptCard } from '../../_components/TranscriptCard';
import { useAuth } from '../../../context/AuthContext';
import { Transcript } from '../../../types/Transcript';

const TranscriptPage = () => {
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTranscript = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Use current user's ID if studentId property doesn't exist
        const studentId = user.studentId; 
        const response = await fetch(`/api/ubys/transcripts?studentId=${studentId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Error fetching transcript: ${response.status}`);
        }
        
        const data = await response.json();
        setTranscript(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch transcript:', err);
        setError('Failed to load transcript data. Please try again later.');
        setTranscript(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranscript();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Academic Transcript</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="animate-pulse bg-white p-6 rounded-lg shadow-md">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-lg shadow-md border border-red-200">
            <p className="text-red-600 font-medium">Error: {error}</p>
          </div>
        ) : !transcript ? (
          <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-200">
            <p className="text-yellow-700">No transcript data available</p>
          </div>
        ) : (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Transcript Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">GPA</p>
                <p className="text-lg font-medium">{transcript.gpa.toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Credits Completed</p>
                <p className="text-lg font-medium">{transcript.creditsCompleted}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">ECTS</p>
                <p className="text-lg font-medium">{transcript.ects}</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Compulsory Courses Completed</p>
                <p className="text-lg font-medium">{transcript.compulsoryCoursesCompleted}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="text-lg font-medium">{transcript.studentId}</p>
              </div>
              <div className="bg-rose-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Grade</p>
                <p className="text-lg font-medium">{transcript.grade}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptPage;