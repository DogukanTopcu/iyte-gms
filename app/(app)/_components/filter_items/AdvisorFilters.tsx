'use client';

import { useState } from 'react';
import FilterComponent, { FilterConfig } from './FilterComponent';
import { departments, faculties } from '../../../api/ubys/_shared/faculty-and-department-data';

type AdvisorFiltersProps = {
  onFilterChange: (filters: { department?: string; faculty?: string }) => void;
  initialFilters?: { department?: string; faculty?: string };
  hideFacultyFilter?: boolean;
};

export default function AdvisorFilters({ 
  onFilterChange, 
  initialFilters = {},
  hideFacultyFilter = false
}: AdvisorFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({
    department: initialFilters.department || null,
    faculty: initialFilters.faculty || null,
  });

  // Create department options from the imported departments
  const departmentOptions = departments.map(dept => ({
    label: dept.name,
    value: dept.id.toString(),
  }));

  // Create faculty options
  const facultyOptions = faculties.map(faculty => ({
    label: faculty.name,
    value: faculty.id.toString(),
  }));

  const filters: FilterConfig[] = [
    // Only include faculty filter if hideFacultyFilter is false
    ...(hideFacultyFilter ? [] : [{
      id: 'faculty',
      label: 'Faculty',
      options: facultyOptions,
    }]),
    {
      id: 'department',
      label: 'Department',
      options: departmentOptions,
    },
  ];

  const handleFilterChange = (filterId: string, value: string | null) => {
    const newFilters = { ...activeFilters, [filterId]: value };
    setActiveFilters(newFilters);
    
    onFilterChange({
      department: newFilters.department || undefined,
      faculty: newFilters.faculty || undefined,
    });
  };

  return (
    <FilterComponent
      filters={filters}
      onFilterChange={handleFilterChange}
      activeFilters={activeFilters}
    />
  );
} 