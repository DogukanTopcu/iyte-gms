import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { AdvisorsData } from '../page';


const StepThreeTable = ({ data, isLoading }: { data: AdvisorsData[], isLoading: boolean }) => {
  return (
    <Box sx={{ mt: 4 }}>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? (
                  data.map((advisor) => (
                    <TableRow key={advisor.id}>
                      <TableCell>{advisor.id}</TableCell>
                      <TableCell>{advisor.name}</TableCell>
                      <TableCell>{advisor.email}</TableCell>
                      <TableCell>{advisor.Department.name}</TableCell>
                      <TableCell>{advisor.Department.Faculty.name}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No advisors available</TableCell>
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

export default StepThreeTable