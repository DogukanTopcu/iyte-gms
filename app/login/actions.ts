
import prisma from '@/lib/prisma';

export async function loginUser(email: string, password: string) {
  try {
    // First try to find a student
    const student = await prisma.student.findUnique({
      where: { email },
      include: {
        Department: true,
        Advisor: true,
      },
    });

    if (student) {
      // In a real application, you would verify the password hash here
      // For demo purposes, we'll just check if the password matches the email
      if (password === email.split('@')[0]) {
        return {
          success: true,
          user: {
            id: student.id,
            name: student.name,
            email: student.email,
            role: 'student',
            department: student.Department.name,
            advisor: student.Advisor.name,
          },
        };
      }
    }

    // If not a student, try to find an advisor
    const advisor = await prisma.advisor.findUnique({
      where: { email },
      include: {
        Department: true,
      },
    });

    if (advisor) {
      // In a real application, you would verify the password hash here
      // For demo purposes, we'll just check if the password matches the email
      if (password === email.split('@')[0]) {
        return {
          success: true,
          user: {
            id: advisor.id,
            name: advisor.name,
            email: advisor.email,
            role: "advisor",
            department: advisor.Department.name,
          },
        };
      }
    }

    return {
      success: false,
      error: 'Invalid email or password',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'An error occurred during login',
    };
  }
} 