"use client"
import { TableBody } from '@mui/material'
import { TableRow } from '@mui/material'
import { Paper, Table, TableHead } from '@mui/material'
import { TableCell } from '@mui/material'
import { TableContainer } from '@mui/material'
import { CircularProgress, Typography } from '@mui/material'
import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import statusName from '@/app/constants/graduation-status'
import { useRouter, useSearchParams } from 'next/navigation'
import StudentListTable from './StudentListTable'

interface Advisor {
  id: number;
  name: string;
  email: string;
  Department: {
    name: string;
    Faculty: {
      name: string;
    };
  };
}

const AdvisorListTable = ({ userId, role }: { userId: number, role: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [advisors, setAdvisors] = useState<Advisor[]>([]);
    const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsLoading(true);
        const fetchAdvisors = async () => {
            const response = await fetch(`/api/advisor/getRelatedAdvisors?userId=${userId}&role=${role}`);
            const data = await response.json();
            setAdvisors(data);
            setIsLoading(false);
        };
        fetchAdvisors();
    }, [userId, role]);

    // Handle selected advisor from URL params
    useEffect(() => {
        const advisorId = searchParams.get('advisorId');
        if (advisorId && advisors.length > 0) {
            const advisor = advisors.find(a => a.id === parseInt(advisorId));
            setSelectedAdvisor(advisor || null);
        } else {
            setSelectedAdvisor(null);
        }
    }, [searchParams, advisors]);

    const handleSelectAdvisor = (advisor: Advisor) => {
        const params = new URLSearchParams(searchParams);
        params.set('advisorId', advisor.id.toString());
        router.push(`?${params.toString()}`);
    };

    const handleBackToAdvisors = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('advisorId');
        router.push(`?${params.toString()}`);
    };

    
  return (
    <Box sx={{ mt: 4 }}>
      {selectedAdvisor ? (
        // Show StudentListTable for selected advisor
        <div>
                     <div className="flex items-center gap-4 mb-4">
             <button 
               onClick={handleBackToAdvisors}
               className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
             >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Advisors
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Students of {selectedAdvisor.name}</h3>
              <p className="text-sm text-gray-600">{selectedAdvisor.email} • {selectedAdvisor.Department.name}</p>
            </div>
          </div>
          <StudentListTable userId={selectedAdvisor.id} role="advisor" />
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
              <Typography variant="h6" sx={{ mb: 2 }}>Advisors</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Faculty</TableCell>
                      <TableCell>Students</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {advisors.length > 0 ? (
                      advisors.map((advisor) => (
                        <TableRow key={advisor.id}>
                          <TableCell>{advisor.id}</TableCell>
                          <TableCell>{advisor.name}</TableCell>
                          <TableCell>{advisor.email}</TableCell>
                          <TableCell>{advisor.Department.name}</TableCell>
                          <TableCell>{advisor.Department.Faculty.name}</TableCell>
                          <TableCell><button onClick={() => handleSelectAdvisor(advisor)} className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">View Students</button></TableCell>
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

export default AdvisorListTable