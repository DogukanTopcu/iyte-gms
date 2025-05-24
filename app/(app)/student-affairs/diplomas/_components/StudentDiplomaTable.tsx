"use client"
import { TableBody } from '@mui/material'
import { TableRow } from '@mui/material'
import { Paper, Table, TableHead } from '@mui/material'
import { TableCell } from '@mui/material'
import { TableContainer } from '@mui/material'
import { CircularProgress, Typography } from '@mui/material'
import { Box } from '@mui/material'
import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { generateDiplomaPdf } from '../lib/diplomapdf'
import { Download } from 'lucide-react'

export interface Diploma {
  id: number;
  Student: {
    id: number;
    name: string;
    email: string;
    studentId: number;
    Department: {
      id: number;
      name: string;
    };
    Advisor: {
      id: number;
      name: string;
    };
    GraduationStatus: {
      status: string;
    };
  };
}

interface StudentFilters {
  department?: string;
  advisor?: string;
  status?: string;
}

const StudentListTable = ({ 
  userId, 
  role, 
  filters = {} 
}: { 
  userId: number, 
  role: string,
  filters?: StudentFilters
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [diplomas, setDiplomas] = useState<Diploma[]>([]);

    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        const fetchStudents = async () => {
            const response = await fetch(`/api/diploma`);
            const data = await response.json();
            setDiplomas(data);
            setIsLoading(false);
        };
        fetchStudents();
    }, [userId, role]);

    // Use useMemo for filtering to avoid infinite loops
    const filteredStudents = useMemo(() => {
      if (diplomas.length === 0) {
        return [];
      }

      let result = [...diplomas];
      
      // Apply department filter
      if (filters.department) {
        result = result.filter(student => 
          student.Student.Department.id.toString() === filters.department
        );
      }
      
      // Apply advisor filter
      if (filters.advisor) {
        result = result.filter(student => 
          student.Student.Advisor.id.toString() === filters.advisor
        );
      }
      
      // Apply status filter
      if (filters.status) {
        result = result.filter(student => 
          student.Student.GraduationStatus.status === filters.status
        );
      }
      
      return result;
    }, [diplomas, filters.department, filters.advisor, filters.status]);
    
  return (
    <Box sx={{ mt: 4 }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Advisor</TableCell>
                  <TableCell>Diploma</TableCell>
                  <TableCell>Transcript</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.Student.id}</TableCell>
                      <TableCell>{student.Student.name}</TableCell>
                      <TableCell>{student.Student.email}</TableCell>
                      <TableCell>{student.Student.Department.name}</TableCell>
                      <TableCell>{student.Student.Advisor.name}</TableCell>
                      <TableCell>
                        <button onClick={() => generateDiplomaPdf([student])} className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Diploma</button>
                      </TableCell>
                      <TableCell>
                        <button onClick={() => router.push(`/transcript/${student.Student.studentId}`)} className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">Transcript</button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No students available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {filteredStudents.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
              <button 
                onClick={() => generateDiplomaPdf(filteredStudents)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
              >
                <Download size={20} />
                Download All Diplomas
              </button>
            </Box>
          )}
        </>
      )}
    </Box>
  )
}

export default StudentListTable