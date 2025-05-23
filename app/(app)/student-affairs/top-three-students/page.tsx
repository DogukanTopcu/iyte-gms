"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import TopStudentsTable from "../../_components/TopStudentsTable";
import { 
  CircularProgress, 
  Typography, 
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { faculties, departments } from "../../../api/ubys/_shared/faculty-and-department-data";

const StudentAffairsTopThreeStudentsPage = () => {
  const { user } = useAuth();
  const [selectedFaculty, setSelectedFaculty] = useState<number | "">("");
  const [selectedDepartment, setSelectedDepartment] = useState<number | "">("");
  
  const authLoading = !user; // Fallback: treat as loading if user is not yet available

  if (authLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading user data...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          User not authenticated. Please log in.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-red-700 border-b pb-2">
        Top Three Students Dashboard
      </h1>
      <p className="mb-6 text-gray-600">
        This page displays the top three performing students across different levels: 
        university-wide, by selected faculty, and by selected department.
      </p>

      {/* University-Wide Top 3 */}
      <TopStudentsTable isUniversityWide={true} />
      
      <Divider sx={{ my: 4 }} />
      
      {/* Faculty Selection and Top 3 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Top Three Students by Faculty
        </Typography>
        <FormControl sx={{ minWidth: 200, mb: 2 }}>
          <InputLabel>Select Faculty</InputLabel>
          <Select
            value={selectedFaculty}
            label="Select Faculty"
            onChange={(e) => setSelectedFaculty(e.target.value as number)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {faculties.map((faculty) => (
              <MenuItem key={faculty.id} value={faculty.id}>
                {faculty.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {selectedFaculty && (
          <TopStudentsTable 
            departmentId={selectedFaculty}
            showSelectedFaculty={true}
            selectedFacultyName={faculties.find(f => f.id === selectedFaculty)?.name}
          />
        )}
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      {/* Department Selection and Top 3 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Top Three Students by Department
        </Typography>
        <FormControl sx={{ minWidth: 200, mb: 2 }}>
          <InputLabel>Select Department</InputLabel>
          <Select
            value={selectedDepartment}
            label="Select Department"
            onChange={(e) => setSelectedDepartment(e.target.value as number)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {departments.map((department) => (
              <MenuItem key={department.id} value={department.id}>
                {department.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        {selectedDepartment && (
          <TopStudentsTable 
            departmentId={selectedDepartment}
            showSelectedDepartment={true}
            selectedDepartmentName={departments.find(d => d.id === selectedDepartment)?.name}
          />
        )}
      </Box>
    </div>
  );
};

export default StudentAffairsTopThreeStudentsPage;