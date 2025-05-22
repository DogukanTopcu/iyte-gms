"use client"
import { TableBody, Checkbox, Button, Paper, Table, TableHead, TableCell, TableContainer, CircularProgress, Typography, Alert, Box, TableRow } from '@mui/material';
import React, { useEffect, useState, useCallback } from 'react';
import statusName from '@/app/constants/graduation-status';
import { useRouter } from 'next/navigation';

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

// Renamed component to SecretariatStudentList
const SecretariatStudentList = ({ departmentId, role }: { departmentId: number, role: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

    const router = useRouter();

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        setUpdateError(null);
        setUpdateSuccess(null);
        try {
            // Assuming userId prop for secretariat is departmentId
            const response = await fetch(`/api/student/getRelatedStudents?userId=${departmentId}&role=${role}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch students');
            }
            const data = await response.json();
            // Filter for students awaiting department secretariat approval
            const filteredData = data.filter((student: Student) => student.GraduationStatus?.status === 'ADVISOR_APPROVAL');
            setStudents(filteredData);
        } catch (error) {
            setUpdateError(error instanceof Error ? error.message : "An unknown error occurred while fetching students.");
            setStudents([]); 
        } finally {
            setIsLoading(false);
        }
    }, [departmentId, role]);

    useEffect(() => {
        if (departmentId > 0) { // Only fetch if departmentId is valid
            fetchStudents();
        }
    }, [fetchStudents, departmentId]);

    const handleSelectStudent = (studentId: number) => {
        setSelectedStudentIds(prevSelected =>
            prevSelected.includes(studentId)
                ? prevSelected.filter(id => id !== studentId)
                : [...prevSelected, studentId]
        );
    };

    const handleSelectAllStudents = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setSelectedStudentIds(students.map(student => student.studentId));
        } else {
            setSelectedStudentIds([]);
        }
    };

    const handleApproveSelectedStudents = async () => {
        if (selectedStudentIds.length === 0) {
            setUpdateError("No students selected for approval.");
            return;
        }
        setUpdateLoading(true);
        setUpdateError(null);
        setUpdateSuccess(null);
        try {
            const response = await fetch('/api/student/graduationStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentNumbers: selectedStudentIds,
                    newStatus: "DEPARTMENT_SECRETARIAT_APPROVAL", // New status for secretariat
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Failed to update student statuses.');
            }
            setUpdateSuccess(`Successfully updated status for ${result.count} student(s).`);
            setSelectedStudentIds([]); 
            fetchStudents(); 
        } catch (error) {
            setUpdateError(error instanceof Error ? error.message : "An unknown error occurred.");
        } finally {
            setUpdateLoading(false);
        }
    };

    const isSelected = (studentId: number) => selectedStudentIds.includes(studentId);
    const numSelected = selectedStudentIds.length;
    const rowCount = students.length;

  return (
    <Box sx={{ mt: 4 }}>
      {updateError && <Alert severity="error" sx={{ mb: 2 }}>{updateError}</Alert>}
      {updateSuccess && <Alert severity="success" sx={{ mb: 2 }}>{updateSuccess}</Alert>}
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Students Pending Department Secretariat Approval</Typography>
            {students.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleApproveSelectedStudents}
                disabled={selectedStudentIds.length === 0 || updateLoading}
              >
                {updateLoading ? <CircularProgress size={24} /> : `Approve Selected (${selectedStudentIds.length})`}
              </Button>
            )}
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={numSelected > 0 && numSelected < rowCount}
                      checked={rowCount > 0 && numSelected === rowCount}
                      onChange={handleSelectAllStudents}
                      inputProps={{ 'aria-label': 'select all students' }}
                    />
                  </TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Advisor</TableCell>
                  <TableCell>Current Status</TableCell>
                  <TableCell>Transcript</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.length > 0 ? (
                  students.map((student) => {
                    const isItemSelected = isSelected(student.studentId);
                    return (
                      <TableRow 
                        key={student.id}
                        hover
                        onClick={() => handleSelectStudent(student.studentId)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': `student-checkbox-${student.id}` }}
                          />
                        </TableCell>
                        <TableCell id={`student-checkbox-${student.id}`}>{student.studentId}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.Department?.name || 'N/A'}</TableCell>
                        <TableCell>{student.Advisor?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusName.find((status) => status.status === student.GraduationStatus?.status)?.color || 'bg-gray-100 text-gray-800'}`}>
                            {statusName.find((status) => status.status === student.GraduationStatus?.status)?.name || student.GraduationStatus?.status || 'Unknown'}
                          </div>
                        </TableCell>
                        <TableCell>
                            <Button 
                                variant="outlined" 
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    router.push(`/transcript/${student.studentId}`)
                                }}
                            >
                                Transcript
                            </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">No students requiring department secretariat approval found.</TableCell>
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

export default SecretariatStudentList;