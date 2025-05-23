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
  const { user, userRole } = useAuth();
  
  const authLoading = !user; // Fallback: treat as loading if user is not yet available

  // State for advisors data
  const [deptSecretariats, setDeptSecretariats] = useState<any[]>([]);
  const [deptSecretariatsLoading, setDeptSecretariatsLoading] = useState(true);
  const [deptSecretariatsError, setDeptSecretariatsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvisors = async () => {
      if (!user?.facultyId) return;
      
      try {
        setDeptSecretariatsLoading(true);
        setDeptSecretariatsError(null);
        const response = await fetch(`/api/deptSecretariat/getWaitingSecretariats?userId=${user.facultyId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch advisors: ${response.statusText}`);
        }
        
        const data = await response.json();

        setDeptSecretariats(data || []);
      } catch (error) {
        console.error('Error fetching advisors:', error);
        setDeptSecretariatsError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setDeptSecretariatsLoading(false);
      }
    };

    fetchAdvisors();
  }, [user?.facultyId]);

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
          Department Secretariats Pending Approval Process
        </h2>
        
        {deptSecretariatsLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={20} />
            <Typography sx={{ ml: 2 }}>Loading department secretariats...</Typography>
          </Box>
        )}

        {deptSecretariatsError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error loading department secretariats: {deptSecretariatsError}
          </Alert>
        )}

        {!deptSecretariatsLoading && !deptSecretariatsError && deptSecretariats.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            No advisors are currently pending approval.
          </Alert>
        )}

        {!deptSecretariatsLoading && !deptSecretariatsError && deptSecretariats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {deptSecretariats.map((deptSecretariat: any, index: number) => (
              <Card 
                key={deptSecretariat.id || index}
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
                    {deptSecretariat.name || (deptSecretariat.firstName && deptSecretariat.lastName ? `${deptSecretariat.firstName} ${deptSecretariat.lastName}` : 'Unknown Advisor')}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Email:</strong> {deptSecretariat.email || 'N/A'}
                  </Typography>
                  
                  {deptSecretariat.Department && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Department:</strong> {deptSecretariat.Department.name}
                    </Typography>
                  )}
                  
                  <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip 
                      label="Pending Approval" 
                      color="warning" 
                      size="small"
                    />
                    {deptSecretariat.status && (
                      <Chip 
                        label={deptSecretariat.status} 
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

      <AdvisorStudentList userId={user.id} role={userRole || "faculty secretariat"} newStatus="FACULTY_SECRETARIAT_APPROVAL" />
    </div>
  );
};

export default DeptSecretariatStudentListPage;