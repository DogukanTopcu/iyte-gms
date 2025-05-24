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
import { faculties, departments } from '../../api/ubys/_shared/faculty-and-department-data'

interface Faculty {
  id: number;
  name: string;
  email: string;
}

interface Student {
  gpa: number;
  term: number;
  id: number;
  studentId: number;
  name: string;
  email: string;
  Department: {
    id: number;
    name: string;
    Faculty?: {
      id: number;
      name: string;
    };
  };
  Advisor: {
    id: number;
    name: string;
  };
  GraduationStatus: {
    status: string;
  };
}

const TopStudentsTable = ({ 
  departmentId,
  isFacultyLevel = false,
  isUniversityWide = false,
  showSelectedFaculty = false,
  showSelectedDepartment = false,
  selectedFacultyName,
  selectedDepartmentName
}: { 
  departmentId?: number;
  isFacultyLevel?: boolean;
  isUniversityWide?: boolean;
  showSelectedFaculty?: boolean;
  showSelectedDepartment?: boolean;
  selectedFacultyName?: string;
  selectedDepartmentName?: string;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);

    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        const fetchTopStudents = async () => {
            try {
                let url;
                if (isUniversityWide) {
                    url = '/api/student/getTopThree?userId=0&role=student affairs';
                } else if (showSelectedFaculty && departmentId) {
                    url = `/api/student/getTopThree?userId=${departmentId}&role=faculty secretariat`;
                } else if (showSelectedDepartment && departmentId) {
                    url = `/api/student/getTopThree?userId=${departmentId}&role=department secretariat`;
                } else if (isFacultyLevel && departmentId) {
                    url = `/api/student/getTopThree?userId=${departmentId}&role=faculty secretariat`;
                } else if (departmentId) {
                    url = `/api/student/getTopThree?userId=${departmentId}&role=department secretariat`;
                } else {
                    url = '/api/student/getTopThree?userId=0&role=student affairs';
                }
                
                const response = await fetch(url);
                const data = await response.json();
                setStudents(data);
            } catch (error) {
                console.error('Error fetching top students:', error);
                setStudents([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTopStudents();
    }, [departmentId, isFacultyLevel, isUniversityWide, showSelectedFaculty, showSelectedDepartment]);
    
    const getTableTitle = () => {
        if (isUniversityWide) return 'Top Three Students (University-Wide)';
        if (showSelectedFaculty && selectedFacultyName) return `Top Three Students - ${selectedFacultyName}`;
        if (showSelectedDepartment && selectedDepartmentName) return `Top Three Students - ${selectedDepartmentName}`;
        if (isFacultyLevel) return 'Top Three Students (Faculty Level)';
        return `Top Three Students (${students.length > 0 ? students[0]?.Department.name : 'N/A'})`;
    };

    const renderStudentRow = (student: Student, index: number, rankOffset: number = 0) => (
        <TableRow key={`${student.id}-${rankOffset}`}>
            <TableCell>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    (index + rankOffset) === 0 ? 'bg-yellow-100 text-yellow-800' :
                    (index + rankOffset) === 1 ? 'bg-gray-100 text-gray-800' :
                    'bg-orange-100 text-orange-800'
                }`}>
                    #{index + rankOffset + 1}
                </div>
            </TableCell>
            <TableCell>{student.studentId}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>{student.Advisor.name}</TableCell>
            <TableCell>{student.gpa}</TableCell>
            <TableCell>{student.term}</TableCell>
            <TableCell>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusName.find((status) => status.status === student.GraduationStatus.status)?.color}`}>
                    {statusName.find((status) => status.status === student.GraduationStatus.status)?.name}
                </div>
            </TableCell>
            <TableCell>
                <button 
                    onClick={() => router.push(`/transcript/${student.studentId}`)} 
                    className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                >
                    Transcript
                </button>
            </TableCell>
        </TableRow>
    );

    return (
        <Box sx={{ mt: 4 }}>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {getTableTitle()}
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Rank</TableCell>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Advisor</TableCell>
                                    <TableCell>GPA</TableCell>
                                    <TableCell>Term</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Transcript</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.length > 0 ? (
                                    students.map((student, index) => renderStudentRow(student, index))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">No students available</TableCell>
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

export default TopStudentsTable 