import { CircularProgress, Paper, TableBody, TableHead, TableRow, Typography } from '@mui/material'
import { Table } from '@mui/material'
import { TableCell } from '@mui/material'
import { TableContainer } from '@mui/material'
import { Box } from '@mui/material'
import React from 'react'
import { InstitutionData } from '../page'

const StepOneTables = ({ data, isLoading }: { data: InstitutionData, isLoading: boolean }) => {
  return (
    <div>
        <Box sx={{ mt: 4 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Departments Table */}
              <Typography variant="h6" sx={{ mb: 2 }}>Departments</Typography>
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
                    {data.departments.length > 0 ? (
                      data.departments.map((dept) => (
                        <TableRow key={dept.id}>
                          <TableCell>{dept.id}</TableCell>
                          <TableCell>{dept.name}</TableCell>
                          <TableCell>{dept.email}</TableCell>
                          <TableCell>{dept.facultyId}</TableCell>
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

              {/* Units Table */}
              <Typography variant="h6" sx={{ mb: 2 }}>Units</Typography>
              <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.units.length > 0 ? (
                      data.units.map((unit) => (
                        <TableRow key={unit.id}>
                          <TableCell>{unit.id}</TableCell>
                          <TableCell>{unit.name}</TableCell>
                          <TableCell>{unit.email}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">No units available</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Faculties Table */}
              <Typography variant="h6" sx={{ mb: 2 }}>Faculties</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.faculties.length > 0 ? (
                      data.faculties.map((faculty) => (
                        <TableRow key={faculty.id}>
                          <TableCell>{faculty.id}</TableCell>
                          <TableCell>{faculty.name}</TableCell>
                          <TableCell>{faculty.email}</TableCell>
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