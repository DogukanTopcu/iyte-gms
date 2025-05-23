"use client"
import { TableBody } from '@mui/material'
import { TableRow } from '@mui/material'
import { Paper, Table, TableHead } from '@mui/material'
import { TableCell } from '@mui/material'
import { TableContainer } from '@mui/material'
import { CircularProgress, Typography } from '@mui/material'
import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AdvisorListTable from './AdvisorListTable'

interface DepartmentSecretariat {
  id: number;
  name: string;
  email: string;
  Department: {
    id: number;
    name: string;
    Faculty: {
      name: string;
    };
  };
}

const DepartmentSecretariatsListTable = ({ userId, role }: { userId: number, role: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [departmentSecretariats, setDepartmentSecretariats] = useState<DepartmentSecretariat[]>([]);
    const [selectedDepartmentSecretariat, setSelectedDepartmentSecretariat] = useState<DepartmentSecretariat | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsLoading(true);
        const fetchAdvisors = async () => {
            const response = await fetch(`/api/deptSecretariat/getRelatedSecretariats?userId=${userId}&role=${role}`);
            const data = await response.json();
            setDepartmentSecretariats(data);
            setIsLoading(false);
        };
        fetchAdvisors();
    }, [userId, role]);

    // Handle selected advisor from URL params
    useEffect(() => {
        const departmentSecretariatId = searchParams.get('departmentSecretariatId');
        if (departmentSecretariatId && departmentSecretariats.length > 0) {
            const departmentSecretariat = departmentSecretariats.find(a => a.id === parseInt(departmentSecretariatId));
            setSelectedDepartmentSecretariat(departmentSecretariat || null);
        } else {
            setSelectedDepartmentSecretariat(null);
        }
    }, [searchParams, departmentSecretariats]);

    const handleSelectDepartmentSecretariat = (departmentSecretariat: DepartmentSecretariat) => {
        const params = new URLSearchParams(searchParams);
        params.set('departmentSecretariatId', departmentSecretariat.id.toString());
        router.push(`?${params.toString()}`);
        setSelectedDepartmentSecretariat(departmentSecretariat);
    };

    const handleBackToDepartmentSecretariats = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('departmentSecretariatId');
        router.push(`?${params.toString()}`);
    };

    
  return (
    <Box sx={{ mt: 4 }}>
      {selectedDepartmentSecretariat ? (
        // Show StudentListTable for selected department secretariat
        <div>
            <div className="flex items-center gap-4 mb-4">
             <button 
               onClick={handleBackToDepartmentSecretariats}
               className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
             >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Department Secretariats
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Advisors of {selectedDepartmentSecretariat.name}</h3>
              <p className="text-sm text-gray-600">{selectedDepartmentSecretariat.email} • {selectedDepartmentSecretariat.Department.name}</p>
            </div>
          </div>
          <AdvisorListTable userId={selectedDepartmentSecretariat.Department.id} role="department secretariat" />
        </div>
      ) : (
        // Show Advisors table
        <>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>Department Secretariats</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Faculty</TableCell>
                      <TableCell>Advisors</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departmentSecretariats.length > 0 ? (
                      departmentSecretariats.map((departmentSecretariat) => (
                        <TableRow key={departmentSecretariat.id}>
                          <TableCell>{departmentSecretariat.id}</TableCell>
                          <TableCell>{departmentSecretariat.name}</TableCell>
                          <TableCell>{departmentSecretariat.email}</TableCell>
                          <TableCell>{departmentSecretariat.Department.name}</TableCell>
                          <TableCell>{departmentSecretariat.Department.Faculty.name}</TableCell>
                          <TableCell><button onClick={() => handleSelectDepartmentSecretariat(departmentSecretariat)} className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">View Advisors</button></TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">No advisors available</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      )}
    </Box>
  )
}

export default DepartmentSecretariatsListTable