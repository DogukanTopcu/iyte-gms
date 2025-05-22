"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import AdvisorStudentList from "../../_components/AdvisorStudentList"; // Adjusted path
import { 
  CircularProgress, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Chip,
  Alert
} from "@mui/material";

const DeptSecretariatStudentListPage = () => {
  const { user } = useAuth();
  
  const authLoading = !user; // Fallback: treat as loading if user is not yet available

  // State for advisors data
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [advisorsLoading, setAdvisorsLoading] = useState(true);
  const [advisorsError, setAdvisorsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvisors = async () => {
      if (!user?.departmentId) return;
      
      try {
        setAdvisorsLoading(true);
        setAdvisorsError(null);
        const response = await fetch(`/api/advisor/getWaitingAdvisors?userId=${user.departmentId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch advisors: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log(data);
        setAdvisors(data.advisors || data || []);
      } catch (error) {
        console.error('Error fetching advisors:', error);
        setAdvisorsError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setAdvisorsLoading(false);
      }
    };

    console.log(userId);
    console.log(userRole);
    
    fetchAdvisors();
  }, [user?.departmentId]);

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

  // Assuming the role for this page is always 'department secretariat' or derived from the user object
  // and that AdvisorStudentList expects a numeric userId.
  const userId = user.id;
  const userRole = user.role || "department secretariat"; // Fallback or ensure user.role is always present

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

      {/* Advisors Pending Approval Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Advisors Pending Approval Process
        </h2>
        
        {advisorsLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={20} />
            <Typography sx={{ ml: 2 }}>Loading advisors...</Typography>
          </Box>
        )}

        {advisorsError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading advisors: {advisorsError}
          </Alert>
        )}

        {!advisorsLoading && !advisorsError && advisors.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            No advisors are currently pending approval.
          </Alert>
        )}

        {!advisorsLoading && !advisorsError && advisors.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {advisors.map((advisor: any, index: number) => (
              <Card 
                key={advisor.id || index}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {advisor.name || (advisor.firstName && advisor.lastName ? `${advisor.firstName} ${advisor.lastName}` : 'Unknown Advisor')}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Email:</strong> {advisor.email || 'N/A'}
                  </Typography>
                  
                  {advisor.department && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Department:</strong> {advisor.department}
                    </Typography>
                  )}
                  
                  {advisor.studentCount !== undefined && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Students:</strong> {advisor.studentCount}
                    </Typography>
                  )}
                  
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip 
                      label="Pending Approval" 
                      color="warning" 
                      size="small"
                    />
                    {advisor.status && (
                      <Chip 
                        label={advisor.status} 
                        color="default" 
                        size="small"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AdvisorStudentList userId={userId} role={userRole || "department secretariat"} newStatus="DEPARTMENT_SECRETARIAT_APPROVAL" />
    </div>
  );
};

export default DeptSecretariatStudentListPage;