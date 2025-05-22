"use client";

import React from "react";
import { useAuth } from "@/app/context/AuthContext";
import AdvisorStudentList from "../../_components/AdvisorStudentList"; // Adjusted path
import { CircularProgress, Typography, Box } from "@mui/material";

const AdvisorStudentListPage = () => {
  const { user } = useAuth();
  // If your AuthContext provides a different loading property, use it here.
  // For example, if it's 'isLoading', use:
  // const { user, isLoading: authLoading } = useAuth();
  // For now, we'll assume no loading state is provided.
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

  // Assuming the role for this page is always 'advisor' or derived from the user object
  // and that AdvisorStudentList expects a numeric userId.
  const userId = user.id;
  const userRole = user.role || "advisor"; // Fallback or ensure user.role is always present

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-red-700 border-b pb-2">
        Student Graduation Approval List
      </h1>
      <p className="mb-4 text-gray-600">
        This page lists students who are awaiting your approval for their
        graduation status. You can select one or more students and approve their
        status.
      </p>

      <AdvisorStudentList userId={userId} role={userRole} newStatus="ADVISOR_APPROVAL" />
    </div>
  );
};

export default AdvisorStudentListPage;