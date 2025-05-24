'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AdvisorInfoCard from './_components/AdvisorInfoCard';
import { Department } from '../types/Department';
import { departments, faculties } from '../api/ubys/_shared/faculty-and-department-data';
import StudentListTable from './_components/StudentListTable';
import { UserCard } from './_components/StudentInfoCard';
import DeptSecretariatInfoCard from './_components/DeptSecretariatInfoCard';
import AdvisorListTable from './_components/AdvisorListTable';
import TableToggleSwitch from './_components/TableToggleSwitch';
import { useSearchParams, useRouter } from 'next/navigation';
import FacultySecretariatInfoCard from './_components/FacultySecretariatInfoCard';
import FacultyTableToggleSwitch from './_components/FacultyTableToggleSwitch';
import DepartmentSecretariatsListTable from './_components/DepartmentSecretariatsListTable';
import StudentAffairsInfoCard from './_components/StudentAffairsInfoCard';
import AdminTableToggleSwitch from './_components/AdminTableToggleSwitch';
import FacultySecretariatsListTable from './_components/FacultySecretariatsListTable';
import { StudentFilters, AdvisorFilters, DepartmentFilters, FacultyFilters } from './_components/filter_items';



export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userRole } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get view from URL params, default to 'students' for dept secretariat and 'departments' for faculty secretariat
  const defaultView = userRole === 'faculty secretariat' ? 'departments' : 'students';
  const currentView = searchParams.get('view') || defaultView;
  const showStudentsTable = currentView === 'students';
  
  // Filter states for different views
  const [studentFilters, setStudentFilters] = useState({});
  const [advisorFilters, setAdvisorFilters] = useState({});
  const [departmentFilters, setDepartmentFilters] = useState({});
  const [facultyFilters, setFacultyFilters] = useState({});

  // Cascading filter state management
  const [cascadingFilters, setCascadingFilters] = useState({
    faculty: null as string | null,
    department: null as string | null,
    advisor: null as string | null,
  });

  // Convert cascading filters to specific filter formats
  const getStudentFiltersFromCascading = () => ({
    faculty: cascadingFilters.faculty || undefined,
    department: cascadingFilters.department || undefined,
    advisor: cascadingFilters.advisor || undefined,
    ...studentFilters
  });

  const getAdvisorFiltersFromCascading = () => ({
    faculty: cascadingFilters.faculty || undefined,
    department: cascadingFilters.department || undefined,
    ...advisorFilters
  });

  const getDepartmentFiltersFromCascading = () => ({
    faculty: cascadingFilters.faculty || undefined,
    ...departmentFilters
  });

  const handleToggleView = (showStudents: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', showStudents ? 'students' : 'advisors');
    router.push(`?${params.toString()}`);
  };
  
  useEffect(() => {
    // Once user data is available or confirmed null, set loading to false
    if (user !== undefined) {
      setError(null);
      setIsLoading(false);
    }
  }, [user]);
  function capitalizeWords(input: string): string {
    return input
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
  const panelTitle = `(${capitalizeWords(String(userRole))} Panel)`;
  return (
    <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Graduation Management System {panelTitle}</h1>

        {
          userRole === 'advisor' ? (
            <>
              {isLoading && <p>Loading advisor data...</p>}
              {error && <p className="text-red-600">Error: {error}</p>}
              <AdvisorInfoCard
                name={user?.name || 'N/A'}
                email={user?.email || 'N/A'}
                department={departments.find((dep: Department) => dep.id === user?.departmentId) || { id: 0, name: 'N/A' }} />
              <StudentFilters 
                onFilterChange={setStudentFilters} 
                userId={user?.id || 0}
                role="advisor"
              />
              <StudentListTable userId={user?.id || 0} role="advisor" filters={studentFilters} />
            </>
          )
          : userRole === 'student' ? (
            <>
              <UserCard user={user} isLoading={isLoading} error={error} />

              <AdvisorInfoCard
                name={user?.advisor?.name || 'N/A'}
                email={user?.advisor?.email || 'N/A'}
                department={departments.find((dep: Department) => dep.id === user?.advisor?.departmentId) || { id: 0, name: 'N/A' }} />

            </>
          )
          : userRole === 'department secretariat' ? (
            <>
              {isLoading && <p>Loading secretariat data...</p>}
              {error && <p className="text-red-600">Error: {error}</p>}
              <DeptSecretariatInfoCard
                name={user?.name || 'N/A'}
                email={user?.email || 'N/A'}
                department={departments.find((dep: Department) => dep.id === user?.departmentId) || { id: 0, name: 'N/A' }} />
              
              <TableToggleSwitch 
                onToggle={handleToggleView}
                initialView={currentView as 'students' | 'advisors'}
              />
              
              {showStudentsTable ? (
                <>
                  <StudentFilters 
                    onFilterChange={setStudentFilters} 
                    userId={user?.departmentId || 0}
                    role="department secretariat"
                  />
                  <StudentListTable userId={user?.departmentId || 0} role="department secretariat" filters={studentFilters} />
                </>
              ) : (
                <>
                  <AdvisorFilters onFilterChange={setAdvisorFilters} />
                  <AdvisorListTable userId={user?.departmentId || 0} role="department secretariat" filters={advisorFilters} />
                </>
              )}
            </>
          )
          : userRole === 'faculty secretariat' ? (
            <>
              {isLoading && <p>Loading secretariat data...</p>}
              {error && <p className="text-red-600">Error: {error}</p>}
              <FacultySecretariatInfoCard
                name={user?.name || 'N/A'}
                email={user?.email || 'N/A'}
                faculty={faculties.find((fac) => fac.id === user?.facultyId) || { id: 0, name: 'N/A', email: 'N/A' }} />
              
              <div className="mt-6">
                <FacultyTableToggleSwitch 
                  onToggle={(view) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('view', view);
                    router.push(`?${params.toString()}`);
                  }}
                  initialView={currentView as 'departments' | 'advisors' | 'students'}
                />
                
                {currentView === 'departments' && (
                  <>
                    <DepartmentSecretariatsListTable userId={user?.facultyId || 0} role="faculty secretariat" filters={{}} />
                  </>
                )}
                
                {currentView === 'advisors' && (
                  <>
                    <AdvisorFilters 
                      onFilterChange={(filters) => {
                        setAdvisorFilters(filters);
                        // Update cascading filters for external sync
                        setCascadingFilters(prev => ({
                          ...prev,
                          faculty: filters.faculty || null,
                          department: filters.department || null,
                        }));
                      }}
                      cascadingFilters={cascadingFilters}
                    />
                    <AdvisorListTable userId={user?.facultyId || 0} role="faculty secretariat" filters={getAdvisorFiltersFromCascading()} />
                  </>
                )}
                
                {currentView === 'students' && (
                  <>
                    <StudentFilters 
                      onFilterChange={setStudentFilters} 
                      userId={user?.facultyId || 0}
                      role="faculty secretariat"
                    />
                    <StudentListTable userId={user?.facultyId || 0} role="faculty secretariat" filters={studentFilters} />
                  </>
                )}
              </div>
            </>
          )
          : userRole === 'student affairs' ? (
            <>
              {isLoading && <p>Loading secretariat data...</p>}
              {error && <p className="text-red-600">Error: {error}</p>}
              <StudentAffairsInfoCard
                name={user?.name || 'N/A'}
                email={user?.email || 'N/A'}
              />
              <div className="mt-6">
                <AdminTableToggleSwitch 
                  onToggle={(view) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('view', view);
                    router.push(`?${params.toString()}`);
                  }}
                  initialView={currentView as 'departments' | 'advisors' | 'students'}
                />

                {currentView === 'faculties' && (
                  <>
                    <FacultyFilters onFilterChange={setFacultyFilters} />
                    <FacultySecretariatsListTable userId={user?.id || 0} role="student affairs" filters={facultyFilters} />
                  </>
                )}
                
                {currentView === 'departments' && (
                  <>
                    <DepartmentFilters 
                      onFilterChange={(filters) => {
                        setDepartmentFilters(filters);
                        // Update cascading filters for external sync
                        setCascadingFilters(prev => ({
                          ...prev,
                          faculty: filters.faculty || null,
                        }));
                      }}
                      cascadingFilters={cascadingFilters}
                    />
                    <DepartmentSecretariatsListTable userId={user?.facultyId || 0} role="student affairs" filters={getDepartmentFiltersFromCascading()} />
                  </>
                )}
                
                {currentView === 'advisors' && (
                  <>
                    <AdvisorFilters 
                      onFilterChange={(filters) => {
                        setAdvisorFilters(filters);
                        // Update cascading filters for external sync
                        setCascadingFilters(prev => ({
                          ...prev,
                          faculty: filters.faculty || null,
                          department: filters.department || null,
                        }));
                      }}
                      cascadingFilters={cascadingFilters}
                    />
                    <AdvisorListTable userId={user?.facultyId || 0} role="student affairs" filters={getAdvisorFiltersFromCascading()} />
                  </>
                )}
                
                {currentView === 'students' && (
                  <>
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
                      userId={user?.id || 0}
                      role="student affairs"
                      cascadingFilters={cascadingFilters}
                      showFacultyFilter={true}
                    />
                    <StudentListTable userId={user?.id || 0} role="student affairs" filters={getStudentFiltersFromCascading()} />
                  </>
                )}
              </div>
            </>
          ) : null
        }

        </main>
  );
}
