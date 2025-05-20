import { NextRequest, NextResponse } from 'next/server';
import { students } from '../_shared/students-data';
import { departments } from '../_shared/unit-and-department-data';
import { advisors } from '../_shared/advisors-data';

// Handler function to process requests
export async function GET(request: NextRequest) {
  // Get student ID from query params if provided
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const studentId = searchParams.get('studentId');
  
  if (id) {
    const numId = parseInt(id);
    const student = students.find(s => s.id === numId);
    
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    
    return NextResponse.json(student);
  }
  
  if (studentId) {
    const numStudentId = parseInt(studentId);
    const student = students.find(s => s.studentId === numStudentId);
    
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    
    return NextResponse.json(student);
  }
  
  // Return all students if no id provided
  return NextResponse.json(students);
}


// Handler function to process POST requests
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Find the admin with the matching email and password
    const student = students.find((student) => student.email === email && student.password === password);

    if (student) {
      const dept = departments.find((dept) => dept.id === student.departmentId);
      const advisor = advisors.find((advisor) => advisor.id === student.advisorId);
      // Return the advisor data without the password
      const { password, ...studentWithoutPassword } = student;
      return NextResponse.json({ ...studentWithoutPassword, department: dept, advisor: advisor }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
