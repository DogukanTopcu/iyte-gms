"use client";

import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import TopStudentsTable from "../../_components/TopStudentsTable";
import { 
  CircularProgress, 
  Typography, 
  Box 
} from "@mui/material";

const TopThreeStudentsPage = () => {
  const { user } = useAuth();
  
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
        Top Three Students
      </h1>
      <p className="mb-4 text-gray-600">
        This page displays the top three performing students in your department.
      </p>

      <TopStudentsTable departmentId={user.departmentId} />
    </div>
  );
};

export default TopThreeStudentsPage;
