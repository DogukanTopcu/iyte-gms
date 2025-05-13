import { NextRequest, NextResponse } from 'next/server';
import { students } from '../_shared/students-data';
import { departments } from '../_shared/unit-and-department-data';
import { advisors } from '../_shared/advisors-data';

// Handler function to process requests
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') ? parseInt(searchParams.get('id') as string, 10) : undefined;
    const advisorId = searchParams.get('advisorId') ? parseInt(searchParams.get('advisorId') as string, 10) : undefined;
    const departmentId = searchParams.get('departmentId') ? parseInt(searchParams.get('departmentId') as string, 10) : undefined;
    const grade = searchParams.get('grade') ? parseInt(searchParams.get('grade') as string, 10) : undefined;
    const studentId = searchParams.get('studentId') ? parseInt(searchParams.get('studentId') as string, 10) : undefined;
    // 1. Get all student data
    if (!id && !advisorId && !departmentId) {
      return NextResponse.json(students, { status: 200 });
    }

    if (grade) {
      const studentsByGrade = students.filter((student) => student.grade === grade);
      if (studentsByGrade.length > 0) {
        return NextResponse.json(studentsByGrade, { status: 200 });
      } else {
        return NextResponse.json({ message: 'No students found with the given grade' }, { status: 404 });
      }
    }

    // 2. Get specific student by id
    if (id) {
      const student = students.find((student) => student.id === id);
      if (student) {
        return NextResponse.json(student, { status: 200 });
      } else {
        return NextResponse.json({ message: 'Student not found' }, { status: 404 });
      }
    }

    if (advisorId && studentId) {
      const student = students.find((student) => student.advisorId === advisorId && student.studentId === studentId);
      return NextResponse.json(student, { status: 200 });
    }

    // 3. Get all students that have the same advisorId
    if (advisorId && !studentId) {
      const studentsByAdvisor = students.filter((student) => student.advisorId === advisorId);
      return NextResponse.json(studentsByAdvisor, { status: 200 });
    }

    // 4. Get all students that have the same department
    if (departmentId) {
      const studentsByDepartment = students.filter((student) => student.departmentId === departmentId);
      return NextResponse.json(studentsByDepartment, { status: 200 });
    }

    if (studentId) {
      const student = students.find((student) => student.studentId === studentId);
      return NextResponse.json(student, { status: 200 });
    }

    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
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
