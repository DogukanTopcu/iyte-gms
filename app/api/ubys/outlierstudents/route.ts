import { NextRequest, NextResponse } from 'next/server';
import { students } from '../_shared/students-data';
import { departments } from '../_shared/unit-and-department-data';
import { advisors } from '../_shared/advisors-data';

// Handler function to process requests
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sId = searchParams.get('sId') ? parseInt(searchParams.get('sId') as string, 10) : undefined;
    const advisorId = searchParams.get('advisorId') ? parseInt(searchParams.get('advisorId') as string, 10) : undefined;

    // 1. Get all student data
    if (!sId || !advisorId) {
      return NextResponse.json(students.filter(student => student.grade !== 4), { status: 200 });
    }

    if (sId && advisorId) {
      console.log(sId, advisorId)
      const student = students.find((student) => student.studentId === sId && student.advisorId === advisorId);
      if (student) {
        return NextResponse.json(student, { status: 200 });
      } else {
        return NextResponse.json({ message: 'Student not found' }, { status: 404 });
      }
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
