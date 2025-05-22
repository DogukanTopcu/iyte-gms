"use client";

import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import SecretariatStudentList from "../../_components/SecretariatStudentList"; // Updated import
import { CircularProgress, Typography, Box } from "@mui/material";

const SecretariatStudentListPage = () => {
  const { user } = useAuth(); // Only 'user' is provided by useAuth

  const authLoading = !user;

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

  // For secretariat, user.departmentId is the relevant ID.
  // Ensure user.departmentId and user.role are available and correct.
  const departmentId = user.departmentId;
  const userRole = user.role || "secretariat"; // Fallback to 'secretariat' if not provided
  if (userRole !== "secretariat" || !departmentId) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Access denied or department information missing.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-red-700 border-b pb-2">
        Student Graduation Approval (Department Secretariat)
      </h1>
      <p className="mb-4 text-gray-600">
        This page lists students from your department who have been approved by
        their advisors and are awaiting your (Department Secretariat) approval for
        their graduation status. You can select one or more students and approve
        their status.
      </p>

      <SecretariatStudentList departmentId={departmentId} role={userRole} />
    </div>
  );
};

export default SecretariatStudentListPage;