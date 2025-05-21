"use client"
import { useAuth } from '@/app/context/AuthContext'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Student {
  id: number
  studentId: number
  name: string
  email: string
  departmentId: number
  department: {
    name: string
  }
  advisorId: number
  advisor: {
    name: string
  }
  grade: number
}

const AddOutlierPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isExists, setIsExists] = useState(false)

  useEffect(() => {
    const studentIdParam = searchParams.get('studentId');
    if (studentIdParam) {
      setSearchQuery(studentIdParam);
      handleSearch(studentIdParam);
    }
  }, [searchParams]);

  const addStudent = async () => {
    if (!selectedStudent) return;
    try {
      setLoading(true);
      const response = await fetch('/api/student/addStudent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedStudent.id,
          studentId: selectedStudent.studentId,
          name: selectedStudent.name,
          email: selectedStudent.email,
          departmentId: selectedStudent.departmentId,
          advisorId: selectedStudent.advisorId
        })
      });
      if (!response.ok) throw new Error('Failed to add student');
      setError(null);
      setSuccess('Student successfully added to the system!');
      setIsExists(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add student');
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    // Update URL with search parameter
    router.push(`/advisor/add-outlier?studentId=${query}`);

    setLoading(true);
    setSuccess(null);
    setError(null);

    await fetch(`/api/ubys/students?studentId=${query}&advisorId=${user?.id}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    })
    .then(res => {
        if (!res.ok) {
            setSelectedStudent(null)
            throw new Error('Failed to fetch student data')
        }
        return res.json();
    })
    .then(data => {
        setError(null)
        isStudentExists(data.studentId);
        setSelectedStudent(data);
    })
    .catch(err => {
        setError(err instanceof Error ? err.message : 'An error occurred')
    })
    .finally(() => {
        setLoading(false);
    });
  }

  const isStudentExists = async (studentId: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/student/isExists?studentId=${studentId}`)
      
      if (!response.ok) {
        setIsExists(false)
        throw new Error('Failed to check student existence')
      }

      const data = await response.json()
      setIsExists(data.exists)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsExists(false)
    } finally {
      setLoading(false)
    }
  }

  const viewTranscript = () => {
    if (selectedStudent) {
      router.push(`/transcript/${selectedStudent.studentId}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-red-700 border-b pb-2">Add Outlier Student</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Enter Student ID
        </label>
        <div className="flex">
          <input
            id="search"
            type="text"
            placeholder="Enter student ID..."
            className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => handleSearch(searchQuery)}
            className="p-3 bg-red-600 text-white rounded-r-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {/* Selected Student Card */}
      {selectedStudent && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-700">Name:</span> {selectedStudent.name}
            </div>
            <div>
              <span className="font-medium text-gray-700">Email:</span> {selectedStudent.email}
            </div>
            <div>
              <span className="font-medium text-gray-700">Student ID:</span> {selectedStudent.studentId}
            </div>
            <div>
              <span className="font-medium text-gray-700">Department ID:</span> {selectedStudent.department.name}
            </div>
            <div>
              <span className="font-medium text-gray-700">Advisor ID:</span> {selectedStudent.advisor.name}
            </div>
          </div>

          {/* Outlier Data Section */}
          {loading && (
            <div className="mt-4 text-gray-600">Loading data...</div>
          )}


          <div className="mt-6 flex flex-wrap gap-3">
            {isExists ? (
              <div className="flex gap-3">
                <p className="text-gray-600 flex items-center">
                  This student is already registered in the system.
                </p>
                <button
                  onClick={viewTranscript}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150"
                >
                  View Transcript
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150 disabled:bg-gray-400"
                  onClick={addStudent}
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Student'}
                </button>
                <button
                  onClick={viewTranscript}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150"
                >
                  View Transcript
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AddOutlierPage