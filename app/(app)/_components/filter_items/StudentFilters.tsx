'use client';

import { useState, useEffect } from 'react';
import FilterComponent, { FilterConfig } from './FilterComponent';
import { departments } from '../../../api/ubys/_shared/faculty-and-department-data';
import statusName from '@/app/constants/graduation-status';

interface Advisor {
  id: number;
  name: string;
}

type StudentFiltersProps = {
  onFilterChange: (filters: { department?: string; advisor?: string; status?: string }) => void;
  initialFilters?: { department?: string; advisor?: string; status?: string };
  userId: number;
  role: string;
};

export default function StudentFilters({ 
  onFilterChange, 
  initialFilters = {},
  userId,
  role 
}: StudentFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({
    department: initialFilters.department || null,
    advisor: initialFilters.advisor || null,
    status: initialFilters.status || null,
  });
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch advisors data
  useEffect(() => {
    setIsLoading(true);
    const fetchAdvisors = async () => {
      try {
        const response = await fetch(`/api/advisor/getRelatedAdvisors?userId=${userId}&role=${role}`);
        if (!response.ok) {
          throw new Error('Failed to fetch advisors');
        }
        const data = await response.json();
        setAdvisors(data);
      } catch (error) {
        console.error('Error fetching advisors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdvisors();
  }, [userId, role]);

  // Create department options from the imported departments
  const departmentOptions = departments.map(dept => ({
    label: dept.name,
    value: dept.id.toString(),
  }));

  // Create advisor options from fetched advisors
  const advisorOptions = advisors.map(advisor => ({
    label: advisor.name,
    value: advisor.id.toString(),
  }));

  // Status options from graduation-status.ts
  const statusOptions = statusName.map(status => ({
    label: status.name,
    value: status.status,
  }));

  const filters: FilterConfig[] = [
    {
      id: 'department',
      label: 'Department',
      options: departmentOptions,
    },
    {
      id: 'advisor',
      label: 'Advisor',
      options: advisorOptions,
    },
    {
      id: 'status',
      label: 'Status',
      options: statusOptions,
    },
  ];

  const handleFilterChange = (filterId: string, value: string | null) => {
    const newFilters = { ...activeFilters, [filterId]: value };
    setActiveFilters(newFilters);
    
    onFilterChange({
      department: newFilters.department || undefined,
      advisor: newFilters.advisor || undefined,
      status: newFilters.status || undefined,
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