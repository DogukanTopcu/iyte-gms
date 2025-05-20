'use client';

import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { TranscriptViewCard } from '../../_components/TranscriptViewCard';

const TranscriptPage = () => {
  const { user } = useAuth();
  const studentId = user?.studentId;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Academic Transcript</h1>
      <TranscriptViewCard studentId={studentId} />
    </div>
  );
};

export default TranscriptPage;