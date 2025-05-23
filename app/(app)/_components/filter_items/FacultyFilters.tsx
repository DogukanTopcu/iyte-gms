'use client';

import { useState } from 'react';
import FilterComponent, { FilterConfig } from './FilterComponent';

type FacultyFiltersProps = {
  onFilterChange: (filters: {}) => void;
  initialFilters?: {};
};

export default function FacultyFilters({ 
  onFilterChange, 
  initialFilters = {} 
}: FacultyFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({});

  // Empty filter set for faculties as requested
  const filters: FilterConfig[] = [];

  const handleFilterChange = (filterId: string, value: string | null) => {
    const newFilters = { ...activeFilters, [filterId]: value };
    setActiveFilters(newFilters);
    
    onFilterChange({});
  };

  return (
    <FilterComponent
      filters={filters}
      onFilterChange={handleFilterChange}
      activeFilters={activeFilters}
    />
  );
} 