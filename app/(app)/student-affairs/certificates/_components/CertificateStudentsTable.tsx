"use client"
import { TableBody } from '@mui/material'
import { TableRow } from '@mui/material'
import { Paper, Table, TableHead } from '@mui/material'
import { TableCell } from '@mui/material'
import { TableContainer } from '@mui/material'
import { CircularProgress, Typography, Button } from '@mui/material'
import { Box } from '@mui/material'
import React, { useEffect, useState, useMemo } from 'react'
import statusName from '@/app/constants/graduation-status'
import { useRouter } from 'next/navigation'

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

interface StudentFilters {
  faculty?: string;
  department?: string;
  advisor?: string;
  status?: string;
}

const CertificateStudentsTable = ({ 
  certificateType,
  filters = {},
  userId = 0,
  role = "student affairs"
}: { 
  certificateType: 'honor' | 'highHonor';
  filters?: StudentFilters;
  userId?: number;
  role?: string;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [showAll, setShowAll] = useState(false);
    const INITIAL_DISPLAY_COUNT = 5;

    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        const fetchCertificateStudents = async () => {
            try {
                const endpoint = certificateType === 'highHonor' 
                    ? '/api/student/getHighHonorCertificatedStudent'
                    : '/api/student/getHonorCertificatedStudent';
                
                const response = await fetch(`${endpoint}?userId=${userId}&role=${role}`);
                const data = await response.json();
                setStudents(data);
            } catch (error) {
                console.error(`Error fetching ${certificateType} certificate students:`, error);
                setStudents([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCertificateStudents();
    }, [certificateType, userId, role]);

    // Filter students based on provided filters
    const filteredStudents = useMemo(() => {
      if (students.length === 0) {
        return [];
      }

      let result = [...students];
      
      // Apply faculty filter
      if (filters.faculty) {
        result = result.filter(student => 
          student.Department.Faculty?.id.toString() === filters.faculty
        );
      }
      
      // Apply department filter
      if (filters.department) {
        result = result.filter(student => 
          student.Department.id.toString() === filters.department
        );
      }
      
      // Apply advisor filter
      if (filters.advisor) {
        result = result.filter(student => 
          student.Advisor.id.toString() === filters.advisor
        );
      }
      
      // Apply status filter
      if (filters.status) {
        result = result.filter(student => 
          student.GraduationStatus.status === filters.status
        );
      }
      
      return result;
    }, [students, filters.faculty, filters.department, filters.advisor, filters.status]);

    // Get students to display based on showAll state
    const displayedStudents = useMemo(() => {
        if (showAll || filteredStudents.length <= INITIAL_DISPLAY_COUNT) {
            return filteredStudents;
        }
        return filteredStudents.slice(0, INITIAL_DISPLAY_COUNT);
    }, [filteredStudents, showAll]);
    
    const getTableTitle = () => {
        return certificateType === 'highHonor' 
            ? 'Students Eligible for High Honor Certificate'
            : 'Students Eligible for Honor Certificate';
    };

    const renderStudentRow = (student: Student, index: number) => (
        <TableRow key={student.id}>
            <TableCell sx={{ minWidth: '100px' }}>{student.studentId}</TableCell>
            <TableCell sx={{ minWidth: '150px' }}>{student.name}</TableCell>
            <TableCell sx={{ minWidth: '150px' }}>{student.Department.name}</TableCell>
            <TableCell sx={{ minWidth: '150px' }}>{student.Advisor.name}</TableCell>
            <TableCell sx={{ minWidth: '80px' }}>
                <span className="font-semibold text-green-600">
                    {student.gpa}
                </span>
            </TableCell>
            <TableCell sx={{ minWidth: '120px' }}>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusName.find((status) => status.status === student.GraduationStatus.status)?.color}`}>
                    {statusName.find((status) => status.status === student.GraduationStatus.status)?.name}
                </div>
            </TableCell>
            <TableCell sx={{ minWidth: '180px' }}>
                <div className="flex gap-2 flex-wrap">
                    <button 
                        onClick={() => router.push(`/transcript/${student.studentId}`)} 
                        className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 whitespace-nowrap"
                    >
                        Transcript
                    </button>
                    <button 
                        className={`px-3 py-1 text-white text-xs rounded hover:opacity-90 whitespace-nowrap ${
                            certificateType === 'highHonor' 
                                ? 'bg-purple-600 hover:bg-purple-700' 
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        Certificate
                    </button>
                </div>
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
                        {filteredStudents.length > 0 && (
                            <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                                ({filteredStudents.length} total)
                            </Typography>
                        )}
                    </Typography>
                    <Box sx={{ width: '100%', overflowX: 'auto' }}>
                        <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
                            <Table stickyHeader sx={{ minWidth: 1000 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Student ID</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Advisor</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>GPA</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {displayedStudents.length > 0 ? (
                                        displayedStudents.map((student, index) => renderStudentRow(student, index))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center">
                                                No students eligible for {certificateType === 'highHonor' ? 'high honor' : 'honor'} certificate
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    
                    {/* Show More/Less Button */}
                    {filteredStudents.length > INITIAL_DISPLAY_COUNT && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="outlined"
                                onClick={() => setShowAll(!showAll)}
                                sx={{ 
                                    color: certificateType === 'highHonor' ? 'purple' : 'green',
                                    borderColor: certificateType === 'highHonor' ? 'purple' : 'green',
                                    '&:hover': {
                                        borderColor: certificateType === 'highHonor' ? 'purple' : 'green',
                                        backgroundColor: certificateType === 'highHonor' ? 'rgba(128, 0, 128, 0.04)' : 'rgba(0, 128, 0, 0.04)'
                                    }
                                }}
                            >
                                {showAll 
                                    ? `Show Less (Show first ${INITIAL_DISPLAY_COUNT})` 
                                    : `Show More (${filteredStudents.length - INITIAL_DISPLAY_COUNT} more)`
                                }
                            </Button>
                        </Box>
                    )}

                    {filteredStudents.length > 0 && (
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start', gap: 2 }}>
                            <button 
                                className={`px-4 py-2 text-white rounded hover:opacity-90 flex items-center gap-2 ${
                                    certificateType === 'highHonor' 
                                        ? 'bg-purple-600 hover:bg-purple-700' 
                                        : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                Download All {certificateType === 'highHonor' ? 'High Honor' : 'Honor'} Certificates ({filteredStudents.length})
                            </button>
                        </Box>
                    )}
                </>
            )}
        </Box>
    )
}

export default CertificateStudentsTable 