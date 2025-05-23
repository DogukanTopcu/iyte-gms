'use client';

import { useState, useEffect } from 'react';
import FilterComponent, { FilterConfig } from './FilterComponent';
import { departments, faculties } from '../../../api/ubys/_shared/faculty-and-department-data';
import statusName from '@/app/constants/graduation-status';
import { CascadingFilters } from './types';

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
  onFilterChange: (filters: { faculty?: string; department?: string; advisor?: string; status?: string }) => void;
  initialFilters?: { faculty?: string; department?: string; advisor?: string; status?: string };
  userId: number;
  role: string;
  cascadingFilters?: CascadingFilters;
  showFacultyFilter?: boolean;
};

export default function StudentFilters({ 
  onFilterChange, 
  initialFilters = {},
  userId,
  role,
  cascadingFilters,
  showFacultyFilter = false
}: StudentFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string | null>>({
    faculty: initialFilters.faculty || null,
    department: initialFilters.department || null,
    advisor: initialFilters.advisor || null,
    status: initialFilters.status || null,
  });
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [fetchedDepartments, setFetchedDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Update local state when cascading filters change
  useEffect(() => {
    if (cascadingFilters) {
      setActiveFilters(prev => ({
        ...prev,
        faculty: cascadingFilters.faculty,
        department: cascadingFilters.department,
        advisor: cascadingFilters.advisor,
      }));
    }
  }, [cascadingFilters]);

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

  // Create faculty options
  const facultyOptions = faculties.map(faculty => ({
    label: faculty.name,
    value: faculty.id.toString(),
  }));

  // Create department options - filter by faculty if selected
  const getDepartmentOptions = () => {
    let departmentData = role === 'faculty secretariat' && fetchedDepartments.length > 0 
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

  // Create advisor options from fetched advisors, filter by faculty and department if selected
  const getAdvisorOptions = () => {
    let filteredAdvisors = [...advisors];
    
    // Filter advisors by selected faculty (if no specific department is selected)
    if (cascadingFilters?.faculty && !cascadingFilters?.department) {
      filteredAdvisors = filteredAdvisors.filter(advisor => 
        advisor.Department?.Faculty?.id.toString() === cascadingFilters.faculty
      );
    }
    
    // Filter advisors by selected department (this takes priority over faculty)
    if (cascadingFilters?.department) {
      filteredAdvisors = filteredAdvisors.filter(advisor => 
        advisor.Department?.id.toString() === cascadingFilters.department
      );
    }
    
    return filteredAdvisors.map(advisor => ({
      label: advisor.name,
      value: advisor.id.toString(),
    }));
  };

  // Status options from graduation-status.ts
  const statusOptions = statusName.map(status => ({
    label: status.name,
    value: status.status,
  }));

  const filters: FilterConfig[] = [
    // Only include faculty filter if showFacultyFilter is true
    ...(showFacultyFilter ? [{
      id: 'faculty',
      label: 'Faculty',
      options: facultyOptions,
    }] : []),
    {
      id: 'department',
      label: 'Department',
      options: getDepartmentOptions(),
    },
    {
      id: 'advisor',
      label: 'Advisor',
      options: getAdvisorOptions(),
    },
    {
      id: 'status',
      label: 'Status',
      options: statusOptions,
    },
  ];

  const handleFilterChange = (filterId: string, value: string | null) => {
    let newFilters = { ...activeFilters, [filterId]: value };
    
    // Implement cascading logic: clear child filters when parent changes
    if (filterId === 'faculty') {
      // When faculty changes, clear department and advisor
      newFilters.department = null;
      newFilters.advisor = null;
    } else if (filterId === 'department') {
      // When department changes, clear advisor
      newFilters.advisor = null;
    }
    // When advisor changes, no need to clear anything (it's the leaf node)
    
    setActiveFilters(newFilters);
    
    onFilterChange({
      faculty: newFilters.faculty || undefined,
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