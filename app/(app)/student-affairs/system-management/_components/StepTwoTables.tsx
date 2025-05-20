import { CircularProgress, Paper, TableBody, TableHead, TableRow, Typography } from '@mui/material'
import { Table } from '@mui/material'
import { TableCell } from '@mui/material'
import { TableContainer } from '@mui/material'
import { Box } from '@mui/material'
import React from 'react'
import { SecretariatsData } from '../page'

const StepOneTables = ({ data, isLoading }: { data: SecretariatsData, isLoading: boolean }) => {
  return (
    <div>
        <Box sx={{ mt: 4 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Faculty Secretariats Table */}
              <Typography variant="h6" sx={{ mb: 2 }}>Faculty Secretariats</Typography>
              <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Faculty</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.facultySecretariats.length > 0 ? (
                      data.facultySecretariats.map((faculty) => (
                        <TableRow key={faculty.id}>
                          <TableCell>{faculty.id}</TableCell>
                          <TableCell>{faculty.name}</TableCell>
                          <TableCell>{faculty.email}</TableCell>
                          <TableCell>{faculty.Faculty.name}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">No departments available</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              
              {/* Department Secretariats Table */}
              <Typography variant="h6" sx={{ mb: 2 }}>Department Secretariats</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Department</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.deptSecretariats.length > 0 ? (
                      data.deptSecretariats.map((dept) => (
                        <TableRow key={dept.id}>
                          <TableCell>{dept.id}</TableCell>
                          <TableCell>{dept.name}</TableCell>
                          <TableCell>{dept.email}</TableCell>
                          <TableCell>{dept.Department.name}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">No faculties available</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
        
    </div>
  )
}

export default StepOneTables