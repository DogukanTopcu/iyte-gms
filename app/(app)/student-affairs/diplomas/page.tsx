'use client'
import React, { useState } from 'react'
import StudentDiplomaTable from './_components/StudentDiplomaTable'
import StudentFilters from '../../_components/filter_items/StudentFilters';

const DiplomasPage = () => {
  const [studentFilters, setStudentFilters] = useState({});
  const [cascadingFilters, setCascadingFilters] = useState({
    faculty: null as string | null,
    department: null as string | null,
    advisor: null as string | null,
  });

  const getStudentFiltersFromCascading = () => ({
    faculty: cascadingFilters.faculty || undefined,
    department: cascadingFilters.department || undefined,
    advisor: cascadingFilters.advisor || undefined,
    ...studentFilters
  });
  
  return (
    <main className="flex-1 p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Diplomas</h1>
      <StudentFilters 
        onFilterChange={(filters) => {
          setStudentFilters(filters);
          // Update cascading filters for external sync
          setCascadingFilters({
            faculty: filters.faculty || null,
            department: filters.department || null,
            advisor: filters.advisor || null,
          });
        }}
        userId={0}
        role="student affairs"
        cascadingFilters={cascadingFilters}
        showFacultyFilter={true}
      />
      <StudentDiplomaTable userId={0} role="student affairs" filters={getStudentFiltersFromCascading()} />
    </main>
  )
}

export default DiplomasPage