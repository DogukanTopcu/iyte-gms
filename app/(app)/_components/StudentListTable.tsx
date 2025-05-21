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
import { useRouter } from 'next/navigation'

interface Student {
  id: number;
  studentId: number;
  name: string;
  email: string;
  Department: {
    name: string;
  };
  Advisor: {
    name: string;
  };
  GraduationStatus: {
    status: string;
  };
}

const StudentListTable = ({ userId, role }: { userId: number, role: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);

    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        const fetchStudents = async () => {
            const response = await fetch(`/api/student/getRelatedStudents?userId=${userId}&role=${role}`);
            const data = await response.json();
            setStudents(data);
            setIsLoading(false);
        };
        fetchStudents();
    }, [userId, role]);

    
  return (
    <Box sx={{ mt: 4 }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>Students</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Advisor</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Transcript</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.Department.name}</TableCell>
                      <TableCell>{student.Advisor.name}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusName.find((status) => status.status === student.GraduationStatus.status)?.color}`}>
                          {statusName.find((status) => status.status === student.GraduationStatus.status)?.name}
                        </div>
                      </TableCell>
                      <TableCell><button onClick={() => router.push(`/transcript/${student.studentId}`)} className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">Transcript</button></TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No students available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  )
}

export default StudentListTable