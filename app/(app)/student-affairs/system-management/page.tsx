"use client"
import React, { useEffect, useState } from 'react'
import {
  Button,
  Stack,
} from '@mui/material';
import StepOneTables from './_components/StepOneTables';
import StepFourTables from './_components/StepFourTables';
import StepTwoTables from './_components/StepTwoTables';
import StepThreeTable from './_components/StepThreeTable';

interface Department {
  id: number;
  name: string;
  email: string;
  facultyId: number;
  Faculty: Faculty;
}

interface Faculty {
  id: number;
  name: string;
  email: string;
}

interface DeptSecretariat {
  id: number;
  name: string;
  email: string;
  departmentId: number;
  Department: Department;
}

interface FacultySecretariat {
  id: number;
  name: string;
  email: string;
  facultyId: number;
  Faculty: Faculty;
}


interface Step {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface InstitutionData {
  departments: Department[];
  faculties: Faculty[];
}

export interface SecretariatsData {
  deptSecretariats: DeptSecretariat[];
  facultySecretariats: FacultySecretariat[];
}

export interface AdvisorsData {
  id: number;
  name: string;
  email: string;
  departmentId: number;
  Department: {
    id: number;
    name: string;
    email: string;
    facultyId: number;
    Faculty: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export interface StudentsData {
  id: number;
  studentId: number;
  name: string;
  email: string;
  departmentId: number;
  advisorId: number;
  Department: {
    id: number;
    name: string;
  };
  Advisor: {
    id: number;
    name: string;
  };
}
const InitStudent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Add state to track which steps have been initialized
  const [initializedSteps, setInitializedSteps] = useState<number[]>(() => {
    // Load from localStorage on initialization
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ubys-initialized-steps');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [institutionData, setInstitutionData] = useState<InstitutionData>({
    departments: [],
    faculties: []
  });

  const [secretariatsData, setSecretariatsData] = useState<SecretariatsData>({
    deptSecretariats: [],
    facultySecretariats: []
  });

  const [advisorsData, setAdvisorsData] = useState<AdvisorsData[]>([]);
  const [studentsData, setStudentsData] = useState<StudentsData[]>([]);

  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: 'Faculties and Departments',
      description: 'Pull data from UBYS API and push to our database',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Secretariats',
      description: 'Pull faculty secretariats from UBYS',
      status: 'pending'
    },
    {
      id: 3,
      title: 'Advisors',
      description: 'Get all advisors from UBYS',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Students',
      description: 'Get all eligible 4th grade students from UBYS',
      status: 'pending'
    }
  ]);

  useEffect(() => {
    // Only fetch data to show current state, don't automatically initialize
    const fetchCurrentData = async () => {
      await institutionsTableFetchData();
      await secretariatsTableFetchData();
      await advisorsTableFetchData();
      await studentsTableFetchData();
    }
    fetchCurrentData();
  }, []);

  // Save initialized steps to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ubys-initialized-steps', JSON.stringify(initializedSteps));
    }
  }, [initializedSteps]);

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length && currentStep < maxStep) {
      setCurrentStep(currentStep + 1);
      setSteps(steps.map(step => 
        step.id === currentStep 
          ? { ...step, status: 'completed' }
          : step.id === currentStep + 1
          ? { ...step, status: 'in-progress' }
          : step
      ));
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setSteps(steps.map(step => 
        step.id === currentStep 
          ? { ...step, status: 'pending' }
          : step.id === currentStep - 1
          ? { ...step, status: 'in-progress' }
          : step
      ));
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (currentStep === 1) {
        const response = await fetch('/api/init/createInstitutions', {
          method: 'POST',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create institutions');
        }

        // Small delay to ensure database transaction is complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await institutionsTableFetchData();
        // Mark step 1 as initialized
        setInitializedSteps(prev => [...prev.filter(step => step !== 1), 1]);
      }

      else if (currentStep === 2) {
        const response = await fetch('/api/init/secretariats', {
          method: 'POST',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create secretariats');
        }

        // Small delay to ensure database transaction is complete
        await new Promise(resolve => setTimeout(resolve, 100));

        await secretariatsTableFetchData();
        // Mark step 2 as initialized
        setInitializedSteps(prev => [...prev.filter(step => step !== 2), 2]);
      }

      else if (currentStep === 3) {
        const response = await fetch('/api/init/advisors', {
          method: 'POST',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create advisors');
        }

        // Small delay to ensure database transaction is complete
        await new Promise(resolve => setTimeout(resolve, 100));

        await advisorsTableFetchData();
        // Mark step 3 as initialized
        setInitializedSteps(prev => [...prev.filter(step => step !== 3), 3]);
      }

      else if (currentStep === 4) {
        const response = await fetch('/api/init/students', {
          method: 'POST',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create students');
        }

        // Small delay to ensure database transaction is complete
        await new Promise(resolve => setTimeout(resolve, 100));

        await studentsTableFetchData();
        // Mark step 4 as initialized
        setInitializedSteps(prev => [...prev.filter(step => step !== 4), 4]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      // Show error to user (you might want to add a toast notification here)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };


  const institutionsTableFetchData = async () => {
    setIsLoading(true);
    try {
      const deptResponse = await fetch('/api/init/departments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const facultyResponse = await fetch('/api/init/faculties', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!deptResponse.ok) {
        throw new Error(`Failed to fetch departments: ${deptResponse.status}`);
      }
      
      if (!facultyResponse.ok) {
        throw new Error(`Failed to fetch faculties: ${facultyResponse.status}`);
      }

      const departments = await deptResponse.json();
      const faculties = await facultyResponse.json();

      console.log('Departments fetched:', departments.length, departments);
      console.log('Faculties fetched:', faculties.length, faculties);

      // Update the institution data state
      setInstitutionData({
        departments: departments || [],
        faculties: faculties || []
      });
      if (departments.length > 0 && faculties.length > 0) {
        setMaxStep(2);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const secretariatsTableFetchData = async () => {
    setIsLoading(true);
    try {
      const secretariatsResponse = await fetch('/api/init/secretariats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await secretariatsResponse.json();
      setSecretariatsData({
        deptSecretariats: data.deptSecretariatsWithDepartment,
        facultySecretariats: data.facultySecretariatsWithFaculty
      }); 
      if (data.deptSecretariatsWithDepartment.length > 0 && data.facultySecretariatsWithFaculty.length > 0) {
        setMaxStep(3);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const advisorsTableFetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/init/advisors', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setAdvisorsData(data as AdvisorsData[]);
      if (data.length > 0) {
        setMaxStep(4);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const studentsTableFetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/init/students', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setStudentsData(data);
      if (data.length > 0) {
        setMaxStep(4);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
    } finally {
      setIsLoading(false);
    }
  }

const renderStepContent = () => {
  const currentStepData = steps[currentStep - 1];
  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative">
      <div className="flex justify-between items-center mb-6">
        <div className='max-w-sm'>
          <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
          <p className="text-gray-600">{currentStepData.description}</p>
          {/* Show initialization status */}
          <div className="mt-2">
            {initializedSteps.includes(currentStep) ? (
              <span className="text-green-600 text-sm font-medium">✓ Initialized from UBYS</span>
            ) : (
              (() => {
                let hasData = false;
                if (currentStep === 1) hasData = institutionData.departments.length > 0;
                if (currentStep === 2) hasData = secretariatsData.deptSecretariats.length > 0;
                if (currentStep === 3) hasData = advisorsData.length > 0;
                if (currentStep === 4) hasData = studentsData.length > 0;
                
                return hasData ? (
                  <span className="text-orange-600 text-sm font-medium">⚠ Existing data found (not initialized)</span>
                ) : (
                  <span className="text-gray-500 text-sm font-medium">⏳ Not initialized</span>
                );
              })()
            )}
          </div>
        </div>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchData()}
            disabled={isLoading || initializedSteps.includes(currentStep)}
          >
            {initializedSteps.includes(currentStep) ? 'Data Initialized' : 'Fetch Data'}
          </Button>
          {/* <Button
            variant="outlined"
            color="warning"
            onClick={() => {
              setInitializedSteps(prev => prev.filter(step => step !== currentStep));
            }}
            disabled={isLoading || !initializedSteps.includes(currentStep)}
          >
            Reset Initialization
          </Button> */}
          <Button
            variant="outlined"
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
          >
            Previous Step
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleNextStep}
            disabled={currentStep === steps.length}
          >
            Next Step
          </Button>
        </Stack>
      </div>
      
      {/* Material UI Tables */}
      {currentStep === 1 && (
        <StepOneTables data={institutionData} isLoading={isLoading} />
      )}
      {currentStep === 2 && (
        <StepTwoTables data={secretariatsData} isLoading={isLoading} />
      )}
      {currentStep === 3 && (
        <StepThreeTable data={advisorsData} isLoading={isLoading} />
      )}
      {currentStep === 4 && (
        <StepFourTables data={studentsData} isLoading={isLoading} />
      )}
    </div>
  );
};

  return (
    <main className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">System Initiation</h1>
        <p className="text-gray-600">
          Follow the steps below to initialize the system with data from UBYS. Each step must be completed in order.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                className={`flex-1 text-center ${
                  step.id <= currentStep ? 'text-red-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 cursor-pointer mx-auto rounded-full flex items-center justify-center mb-2 ${
                    step.status === 'completed'
                      ? 'bg-green-500 text-white'
                      : step.status === 'in-progress'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  onClick={() => handleStepClick(step.id)}
                >
                  {step.id}
                </div>
                <div className="text-sm font-medium">{step.title}</div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1">
                  <hr className="border-t-2 border-gray-300 mx-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {renderStepContent()}
    </main>
  )
}

export default InitStudent