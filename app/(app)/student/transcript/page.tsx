'use client';

import React, { useState, useEffect } from 'react';
import { TranscriptCard } from '../../_components/TranscriptCard';
import { useAuth } from '../../../context/AuthContext';

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

const TranscriptPage = () => {
  const [transcriptData, setTranscriptData] = useState<TranscriptData | null>(null);
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
        const response = await fetch('/api/ubys/transcript', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching transcript: ${response.status}`);
        }
        
        const data = await response.json();
        setTranscriptData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch transcript:', err);
        setError('Failed to load transcript data. Please try again later.');
        setTranscriptData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranscript();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Academic Transcript</h1>
      <TranscriptCard 
        data={transcriptData} 
        isLoading={isLoading} 
        error={error} 
      />
    </div>
  );
};

export default TranscriptPage;