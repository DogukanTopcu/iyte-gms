"use client"
import { useAuth } from '@/app/context/AuthContext'
import React, { useState } from 'react'

interface Student {
  id: number
  studentId: number
  name: string
  email: string
  departmentId: number
  advisorId: number
  grade: number
}

interface OutlierData {
  studentId: number
  isOutlier: boolean
  reason?: string
  // Add other outlier data fields as needed
}

const AddOutlierPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [outlierData, setOutlierData] = useState<OutlierData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  const [isExists, setIsExists] = useState(false)

  const addStudent = async () => {
    if (!selectedStudent) return;
    try {
      const response = await fetch('/api/student/addStudent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.studentId,
          name: selectedStudent.name,
          email: selectedStudent.email,
          departmentId: selectedStudent.departmentId,
          advisorId: selectedStudent.advisorId
        })
      });
      if (!response.ok) throw new Error('Failed to add student');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add student');
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setSearchResults([])
      return
    }

    await fetch(`/api/ubys/students?studentId=${query}&advisorId=${user?.id}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    })
    .then(res => {
        if (!res.ok) {
            setSelectedStudent(null)
            throw new Error('Failed to fetch outlier data')
        }
        return res.json();
    })
    .then(data => {
        setError(null)
        const d = isStudentExists(data.studentId);
        console.log(d);
        setSelectedStudent(data);
    })
    .catch(err => {
        setError(err instanceof Error ? err.message : 'An error occurred')
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


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Outlier Student</h1>
      
      {/* Search Bar */}
      <div className="mb-6 flex">
        <input
          type="text"
          placeholder="Search by student name or email..."
          className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => handleSearch(searchQuery)}
          className="p-3 bg-red-500 text-white rounded-r-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Search
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Search Results</h2>
          <div className="space-y-3">
            {searchResults.map((student) => (
              <div
                key={student.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <h3 className="font-medium">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-600">Error: {error}</div>
      )}

      {/* Selected Student Card */}
      {selectedStudent && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Selected Student</h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Name:</span> {selectedStudent.name}
            </div>
            <div>
              <span className="font-medium">Email:</span> {selectedStudent.email}
            </div>
            <div>
              <span className="font-medium">Student ID:</span> {selectedStudent.studentId}
            </div>
            <div>
              <span className="font-medium">Grade:</span> {selectedStudent.grade}
            </div>
            <div>
              <span className="font-medium">Department ID:</span> {selectedStudent.departmentId}
            </div>
            <div>
              <span className="font-medium">Advisor ID:</span> {selectedStudent.advisorId}
            </div>
          </div>

          {/* Outlier Data Section */}
          {loading && (
            <div className="mt-4 text-gray-600">Loading outlier data...</div>
          )}

          {outlierData && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Outlier Status</h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Is Outlier:</span>{' '}
                  <span className={outlierData.isOutlier ? 'text-red-600' : 'text-green-600'}>
                    {outlierData.isOutlier ? 'Yes' : 'No'}
                  </span>
                </div>
                {outlierData.reason && (
                  <div>
                    <span className="font-medium">Reason:</span> {outlierData.reason}
                  </div>
                )}
              </div>
            </div>
          )}

          {isExists ? (
            <div className="mt-4">
              <p className="text-gray-600 mb-4">
                This student is already registered in the system. You can view their outlier status above.
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => addStudent()}
              >
                Add Student
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AddOutlierPage