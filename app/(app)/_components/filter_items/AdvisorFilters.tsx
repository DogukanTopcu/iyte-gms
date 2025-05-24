'use client';

import { useState, useEffect } from 'react';
import FilterComponent, { FilterConfig } from './FilterComponent';
import { departments, faculties } from '../../../api/ubys/_shared/faculty-and-department-data';
import { CascadingFilters } from './types';

interface Department {
  id: number;
  name: string;
  Faculty?: {
    id: number;
    name: string;
  };
}

type AdvisorFiltersProps = {
  onFilterChange: (filters: { department?: string; faculty?: string }) => void;
  initialFilters?: { department?: string; faculty?: string };
  hideFacultyFilter?: boolean;
  userId?: number;
  role?: string;
  cascadingFilters?: CascadingFilters;
};

export default function AdvisorFilters({ 
  onFilterChange, 
  initialFilters = {},
  hideFacultyFilter = false,
  userId,
  role,
  cascadingFilters
}: AdvisorFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({
    department: initialFilters.department || null,
    faculty: initialFilters.faculty || null,
  });
  const [fetchedDepartments, setFetchedDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Determine what filters to show based on role
  const shouldShowFacultyFilter = role !== 'faculty secretariat' && role !== 'department secretariat' && !hideFacultyFilter;
  const shouldShowDepartmentFilter = role !== 'department secretariat';

  // Update local state when cascading filters change
  useEffect(() => {
    if (cascadingFilters) {
      setActiveFilters(prev => ({
        ...prev,
        faculty: cascadingFilters.faculty,
        department: cascadingFilters.department,
      }));
    }
  }, [cascadingFilters]);

  // Fetch departments based on userId and role when hideFacultyFilter is true (faculty secretariat)
  useEffect(() => {
    if ((role === 'faculty secretariat' || hideFacultyFilter) && userId && role) {
      setIsLoading(true);
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
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchDepartments();
    }
  }, [hideFacultyFilter, userId, role]);

  // Create department options - filter by faculty if selected
  const getDepartmentOptions = () => {
    let departmentData = (role === 'faculty secretariat' || hideFacultyFilter) && fetchedDepartments.length > 0 
      ? fetchedDepartments 
      : departments;

    // Filter departments by selected faculty
    if (cascadingFilters?.faculty) {
      departmentData = departmentData.filter(dept => 
        'facultyId' in dept ? dept.facultyId?.toString() === cascadingFilters.faculty : false
      );
    }

    return departmentData.map(dept => ({
      label: dept.name,
      value: dept.id.toString(),
    }));
  };

  // Create faculty options
  const facultyOptions = faculties.map(faculty => ({
    label: faculty.name,
    value: faculty.id.toString(),
  }));

  const filters: FilterConfig[] = [
    // Only include faculty filter if role allows it
    ...(shouldShowFacultyFilter ? [{
      id: 'faculty',
      label: 'Faculty',
      options: facultyOptions,
    }] : []),
    // Only include department filter if role allows it
    ...(shouldShowDepartmentFilter ? [{
      id: 'department',
      label: 'Department',
      options: getDepartmentOptions(),
    }] : []),
  ];

  const handleFilterChange = (filterId: string, value: string | null) => {
    let newFilters = { ...activeFilters, [filterId]: value };
    
    // Implement cascading logic: clear child filters when parent changes
    if (filterId === 'faculty') {
      // When faculty changes, clear department
      newFilters.department = null;
    }
    // When department changes, no need to clear anything (it's the leaf node in this component)
    
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