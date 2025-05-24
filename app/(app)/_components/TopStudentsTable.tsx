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
    status: string; // Matches GraduationStatusEnum from backend
  };
}

interface StudentWithRank extends Student {
  rank: number;
}

// Order for graduation status, lower index is better
const graduationStatusOrder = [
  'COMPLETED',
  'FACULTY_SECRETARIAT_APPROVAL',
  'DEPARTMENT_SECRETARIAT_APPROVAL',
  'ADVISOR_APPROVAL',
  'SYSTEM_APPROVAL'
];

// Comparison function to determine if two students have the same rank
const compareStudentsForRankDisplay = (a: Student, b: Student): number => {
  // 1. Compare by Graduation Status
  const statusA = graduationStatusOrder.indexOf(a.GraduationStatus.status);
  const statusB = graduationStatusOrder.indexOf(b.GraduationStatus.status);
  if (statusA !== statusB) return statusA - statusB;

  // 2. Term category (term <= 8 is better)
  const termCategoryA = a.term <= 8 ? 1 : 2;
  const termCategoryB = b.term <= 8 ? 1 : 2;
  if (termCategoryA !== termCategoryB) return termCategoryA - termCategoryB;

  // 3. If both are in Category 2 (term > 8), lower term is better
  if (termCategoryA === 2) { // (implies termCategoryB is also 2)
    if (a.term !== b.term) {
      return a.term - b.term; // Lower term comes first
    }
  }
  // If both are in Category 1 (term <= 8), or both in Category 2 with the same term,
  // their relative order is determined by GPA logic.

  // 4. Compare by GPA: Higher GPA is better
  if (a.gpa !== b.gpa) {
    return b.gpa - a.gpa; // Higher GPA comes first (b - a for descending)
  }

  // 5. GPAs are equal, compare by term (as a tie-breaker for GPA): Lower term is better
  if (a.term !== b.term) {
    return a.term - b.term; // Lower term comes first
  }

  return 0; // Students are equivalent for ranking
};


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
    const [studentsWithRanks, setStudentsWithRanks] = useState<StudentWithRank[]>([]);

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
                const fetchedStudents: Student[] = await response.json();
                
                if (fetchedStudents.length > 0) {
                    const rankedStudents: StudentWithRank[] = [];
                    let currentRankDisplay = 1;
                    for (let i = 0; i < fetchedStudents.length; i++) {
                        const student = fetchedStudents[i];
                        if (i > 0 && compareStudentsForRankDisplay(student, fetchedStudents[i-1]) !== 0) {
                            // Not tied with the previous student, so increment rank
                            currentRankDisplay++;
                        }
                        rankedStudents.push({ ...student, rank: currentRankDisplay });
                    }
                    setStudentsWithRanks(rankedStudents);
                } else {
                    setStudentsWithRanks([]);
                }

            } catch (error) {
                console.error('Error fetching top students:', error);
                setStudentsWithRanks([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTopStudents();
    }, [departmentId, isFacultyLevel, isUniversityWide, showSelectedFaculty, showSelectedDepartment]);
    
    const getTableTitle = () => {
        if (isUniversityWide) return 'Top Students (University-Wide)';
        if (showSelectedFaculty && selectedFacultyName) return `Top Students - ${selectedFacultyName}`;
        if (showSelectedDepartment && selectedDepartmentName) return `Top Students - ${selectedDepartmentName}`;
        if (isFacultyLevel) return 'Top Students (Faculty Level)';
        return `Top Students (${studentsWithRanks.length > 0 ? studentsWithRanks[0]?.Department.name : 'N/A'})`;
    };

    const renderStudentRow = (studentWithRank: StudentWithRank) => (
        <TableRow key={studentWithRank.id}>
            <TableCell>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    studentWithRank.rank === 1 ? 'bg-yellow-100 text-yellow-800' : // Gold
                    studentWithRank.rank === 2 ? 'bg-gray-100 text-gray-800' :    // Silver
                    studentWithRank.rank === 3 ? 'bg-orange-100 text-orange-800' : // Bronze
                    'bg-blue-100 text-blue-800' // Default for other ranks
                }`}>
                    #{studentWithRank.rank}
                </div>
            </TableCell>
            <TableCell>{studentWithRank.studentId}</TableCell>
            <TableCell>{studentWithRank.name}</TableCell>
            <TableCell>{studentWithRank.email}</TableCell>
            <TableCell>{studentWithRank.Advisor.name}</TableCell>
            <TableCell>{studentWithRank.gpa}</TableCell>
            <TableCell>{studentWithRank.term}</TableCell>
            <TableCell>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusName.find((status) => status.status === studentWithRank.GraduationStatus.status)?.color}`}>
                    {statusName.find((status) => status.status === studentWithRank.GraduationStatus.status)?.name}
                </div>
            </TableCell>
            <TableCell>
                <button 
                    onClick={() => router.push(`/transcript/${studentWithRank.studentId}`)} 
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
                                {studentsWithRanks.length > 0 ? (
                                    studentsWithRanks.map((studentWithRank) => renderStudentRow(studentWithRank))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">No students available</TableCell> {/* Updated colSpan to 9 */}
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