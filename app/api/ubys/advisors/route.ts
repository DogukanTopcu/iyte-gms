import { NextRequest, NextResponse } from 'next/server';
import { advisors } from '../_shared/advisors-data';
import { departments } from '../_shared/faculty-and-department-data';

// Handler function to process requests
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get('id');
  const departmentName = searchParams.get('departmentName');

  // 1. Get all advisor data
  if (!id && !departmentName) {
    return NextResponse.json(advisors, { status: 200 });
  }

  // 2. Get specific advisor by id
  if (id) {
    const advisorId = parseInt(id, 10);
    const advisor = advisors.find((advisor) => advisor.id === advisorId);
    if (advisor) {
      return NextResponse.json(advisor, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Advisor not found' }, { status: 404 });
    }
  }

  // 3. Get specific advisors by department name
  if (departmentName) {
    const department = departments.find((dept) => dept.name.toLowerCase() === departmentName.toLowerCase());
    if (department) {
      const advisorsByDepartment = advisors.filter((advisor) => advisor.departmentId === department.id);
      return NextResponse.json(advisorsByDepartment, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Department not found' }, { status: 404 });
    }
  }

  return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
}


// Handler function to process POST requests
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Find the admin with the matching email and password
    const advisor = advisors.find((advisor) => advisor.email === email && advisor.password === password);

    if (advisor) {
      const dept = departments.find((dept) => dept.id === advisor.departmentId);
      // Return the advisor data without the password
      const { password, ...advisorWithoutPassword } = advisor;
      return NextResponse.json({ ...advisorWithoutPassword, department: dept }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
