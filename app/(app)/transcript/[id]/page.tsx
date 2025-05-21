"use client";
import React, { useEffect, useState } from 'react'
import { TranscriptViewCard } from '../../_components/TranscriptViewCard'
import { Student } from '@prisma/client';
import Image from 'next/image';

const StudentTranscriptPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [department, setDepartment] = useState<{name: string} | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/ubys/students?studentId=${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await response.json();
        setStudent(data);
        
        // Fetch department data
        if (data && data.departmentId) {
          const deptResponse = await fetch(`/api/ubys/departments?id=${data.departmentId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const deptData = await deptResponse.json();
          setDepartment(deptData);
        }
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
              <div className="space-y-3 flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
          <div className="h-96 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <span className="bg-red-800 text-white p-1 rounded-md mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </span>
        Academic Transcript
      </h1>
      
      {student && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all hover:shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="bg-gradient-to-r from-red-800 to-red-900 p-1 rounded-full shadow-md">
                <div className="bg-white p-1 rounded-full">
                  <Image
                    src="/images/iyte_logo.png"
                    alt="IYTE Logo"
                    width={60}
                    height={60}
                    className="rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/60x60/red/white?text=IYTE";
                    }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
                    <p className="text-gray-600">Student ID: <span className="font-semibold">{student.studentId}</span></p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      Active Student
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{department?.name || 'Computer Engineering'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Program</p>
                    <p className="font-medium">Undergraduate</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-500">Academic Year</p>
                    <p className="font-medium">2024-2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <TranscriptViewCard studentId={parseInt(id)} />
        </>
      )}
    </div>
  )
}

export default StudentTranscriptPage