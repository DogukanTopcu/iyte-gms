'use client';

import { useState, useEffect } from 'react';
import FilterComponent, { FilterConfig } from './FilterComponent';
import { departments } from '../../../api/ubys/_shared/faculty-and-department-data';
import statusName from '@/app/constants/graduation-status';

interface Advisor {
  id: number;
  name: string;
  Department?: {
    id: number;
    name: string;
    Faculty?: {
      id: number;
      name: string;
    };
  };
}

interface Department {
  id: number;
  name: string;
  Faculty?: {
    id: number;
    name: string;
  };
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
  const [fetchedDepartments, setFetchedDepartments] = useState<Department[]>([]);
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

  // Fetch departments for faculty secretariat
  useEffect(() => {
    if (role === 'faculty secretariat') {
      const fetchDepartments = async () => {
        try {
          const response = await fetch(`/api/deptSecretariat/getRelatedSecretariats?userId=${userId}&role=${role}`);
          if (!response.ok) {
            throw new Error('Failed to fetch departments');
          }
          const data = await response.json();
          // Extract unique departments from department secretariats
          const uniqueDepartments = data.map((secretariat: any) => ({
            id: secretariat.Department.id,
            name: secretariat.Department.name,
          }));
          setFetchedDepartments(uniqueDepartments);
        } catch (error) {
          console.error('Error fetching departments:', error);
        }
      };
      
      fetchDepartments();
    }
  }, [userId, role]);

  // Create department options - use fetched departments for faculty secretariat, otherwise use all departments
  const departmentOptions = (role === 'faculty secretariat' && fetchedDepartments.length > 0 
    ? fetchedDepartments 
    : departments
  ).map(dept => ({
    label: dept.name,
    value: dept.id.toString(),
  }));

  // Create advisor options from fetched advisors (already filtered by faculty for faculty secretariat)
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