'use client';

import { useState, useEffect } from 'react';
import FilterComponent, { FilterConfig } from './FilterComponent';
import { faculties } from '../../../api/ubys/_shared/faculty-and-department-data';
import { CascadingFilters } from './types';

type DepartmentFiltersProps = {
  onFilterChange: (filters: { faculty?: string }) => void;
  initialFilters?: { faculty?: string };
  cascadingFilters?: CascadingFilters;
};

export default function DepartmentFilters({ 
  onFilterChange, 
  initialFilters = {},
  cascadingFilters 
}: DepartmentFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({
    faculty: initialFilters.faculty || null,
  });

  // Update local state when cascading filters change
  useEffect(() => {
    if (cascadingFilters) {
      setActiveFilters(prev => ({
        ...prev,
        faculty: cascadingFilters.faculty,
      }));
    }
  }, [cascadingFilters]);

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