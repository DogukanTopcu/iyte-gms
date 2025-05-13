"use client"
import React, { useEffect, useState } from 'react'
import {
  Button,
  Stack,
} from '@mui/material';
import StepOneTables from './_components/StepOneTables';
import StepTwoTable from './_components/StepThreeTable';
import StepFourTables from './_components/StepFourTables';
interface Step {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  data?: any[];
}

export interface InstitutionData {
  departments: any[];
  units: any[];
  faculties: any[];
}

export interface AdvisorsData {
  id: number;
  name: string;
  email: string;
  departmentId: number;
}

export interface StudentsData {
  id: number;
  studentId: number;
  name: string;
  email: string;
  departmentId: number;
  advisorId: number;
}

const InitStudent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [institutionData, setInstitutionData] = useState<InstitutionData>({
    departments: [],
    units: [],
    faculties: []
  });

  const [advisorsData, setAdvisorsData] = useState<AdvisorsData[]>([]);
  const [studentsData, setStudentsData] = useState<StudentsData[]>([]);

  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: 'Units, Faculties, and Departments',
      description: 'Pull data from UBYS API and push to our database',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Administrators',
      description: 'Pull faculty admins, department admins, and other admins from UBYS',
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
    const fetchData = async () => {
      await institutionsTableFetchData();
      await advisorsTableFetchData();
      await studentsTableFetchData();
    }
    fetchData();
  }, []);

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
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
        const response = await fetch('/api/ubys/init/fetchInstitutions');
        const data = await response.json();

        await fetch('/api/init/createInstitutions', {
          method: 'POST',
          body: JSON.stringify(data)
        }).then(res => res.json()).then(data => {
          console.log(data);
        });

        await institutionsTableFetchData();
      }

      else if (currentStep === 3) {
        const response = await fetch('/api/ubys/advisors', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();

        await fetch('/api/init/advisors', {
          method: 'POST',
          body: JSON.stringify(data)
        }).then(res => res.json()).then(data => {
          console.log(data);
        });

        await advisorsTableFetchData();
      }

      else if (currentStep === 4) {
        const response = await fetch('/api/ubys/students', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log(data);

        await fetch('/api/init/students', {
          method: 'POST',
          body: JSON.stringify(data)
        }).then(res => res.json()).then(data => {
          console.log(data);
        });

        await studentsTableFetchData();
      }

    } catch (error) {
      console.error('Error fetching data:', error);
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
      const unitResponse = await fetch('/api/init/units', {
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
      const departments = await deptResponse.json();
      const units = await unitResponse.json();
      const faculties = await facultyResponse.json();
      // Update the institution data state
      setInstitutionData({
        departments: departments || [],
        units: units || [],
        faculties: faculties || []
      });
      console.log(departments, units, faculties);
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
      setAdvisorsData(data);
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
        </div>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchData()}
            disabled={isLoading || (!isLoading && currentStep == 1 ? institutionData.departments.length > 0 : false) || (!isLoading && currentStep == 3 ? advisorsData.length > 0 : false) || (!isLoading && currentStep == 4 ? studentsData.length > 0 : false)}
          >
            Fetch Data
          </Button>
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
      {currentStep === 3 && (
        <StepTwoTable data={advisorsData} isLoading={isLoading} />
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