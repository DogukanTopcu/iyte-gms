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
import DepartmentSecretariatsListTable from './DepartmentSecretariatsListTable'

interface FacultySecretariat {
  id: number;
  name: string;
  email: string;
  Faculty: {
    id: number;
    name: string;
  };
}

const FacultySecretariatsListTable = ({ userId, role }: { userId: number, role: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [facultySecretariats, setFacultySecretariats] = useState<FacultySecretariat[]>([]);
    const [selectedFacultySecretariat, setSelectedFacultySecretariat] = useState<FacultySecretariat | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsLoading(true);
        const fetchFacultySecretariats = async () => {
            const response = await fetch(`/api/facultySecretariat/getRelatedSecretariats?userId=${userId}&role=${role}`);
            const data = await response.json();
            setFacultySecretariats(data);
            setIsLoading(false);
        };
        fetchFacultySecretariats();
    }, [userId, role]);

    // Handle selected advisor from URL params
    useEffect(() => {
        const facultySecretariatId = searchParams.get('facultySecretariatId');
        if (facultySecretariatId && facultySecretariats.length > 0) {
            const facultySecretariat = facultySecretariats.find(a => a.id === parseInt(facultySecretariatId));
            setSelectedFacultySecretariat(facultySecretariat || null);
        } else {
            setSelectedFacultySecretariat(null);
        }
    }, [searchParams, facultySecretariats]);

    const handleSelectFacultySecretariat = (facultySecretariat: FacultySecretariat) => {
        const params = new URLSearchParams(searchParams);
        params.set('facultySecretariatId', facultySecretariat.id.toString());
        router.push(`?${params.toString()}`);
        setSelectedFacultySecretariat(facultySecretariat);
    };

    const handleBackToFacultySecretariats = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('facultySecretariatId');
        router.push(`?${params.toString()}`);
    };

    
  return (
    <Box sx={{ mt: 4 }}>
      {selectedFacultySecretariat ? (
        // Show StudentListTable for selected department secretariat
        <div>
            <div className="flex items-center gap-4 mb-4">
             <button 
               onClick={handleBackToFacultySecretariats}
               className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
             >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Faculty Secretariats
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Department Secretariats of {selectedFacultySecretariat.name}</h3>
              <p className="text-sm text-gray-600">{selectedFacultySecretariat.email} • {selectedFacultySecretariat.Faculty.name}</p>
            </div>
          </div>
          <DepartmentSecretariatsListTable userId={selectedFacultySecretariat.Faculty.id} role="faculty secretariat" />
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
              <Typography variant="h6" sx={{ mb: 2 }}>Faculty Secretariats</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Faculty</TableCell>
                      <TableCell>Department Secretariats</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {facultySecretariats.length > 0 ? (
                      facultySecretariats.map((facultySecretariat) => (
                        <TableRow key={facultySecretariat.id}>
                          <TableCell>{facultySecretariat.id}</TableCell>
                          <TableCell>{facultySecretariat.name}</TableCell>
                          <TableCell>{facultySecretariat.email}</TableCell>
                          <TableCell>{facultySecretariat.Faculty.name}</TableCell>
                          <TableCell><button onClick={() => handleSelectFacultySecretariat(facultySecretariat)} className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">View Department Secretariats</button></TableCell>
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

export default FacultySecretariatsListTable