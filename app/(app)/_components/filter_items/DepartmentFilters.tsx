'use client';

import { useState } from 'react';
import FilterComponent, { FilterConfig } from './FilterComponent';
import { faculties } from '../../../api/ubys/_shared/faculty-and-department-data';

type DepartmentFiltersProps = {
  onFilterChange: (filters: { faculty?: string }) => void;
  initialFilters?: { faculty?: string };
};

export default function DepartmentFilters({ 
  onFilterChange, 
  initialFilters = {} 
}: DepartmentFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({
    faculty: initialFilters.faculty || null,
  });

  // Create faculty options
  const facultyOptions = faculties.map(faculty => ({
    label: faculty.name,
    value: faculty.id.toString(),
  }));

  const filters: FilterConfig[] = [
    {
      id: 'faculty',
      label: 'Faculty',
      options: facultyOptions,
    },
  ];

  const handleFilterChange = (filterId: string, value: string | null) => {
    const newFilters = { ...activeFilters, [filterId]: value };
    setActiveFilters(newFilters);
    
    onFilterChange({
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