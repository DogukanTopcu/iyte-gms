import { NextRequest, NextResponse } from 'next/server';
import { advisors } from '../_shared/advisors-data';
import { departments } from '../_shared/unit-and-department-data';

// Handler function to process requests
export async function GET(request: NextRequest) {
  // Get advisor ID from query params if provided
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const departmentId = searchParams.get('departmentId');
  const email = searchParams.get('email');
  
  if (id) {
    const numId = parseInt(id);
    const advisor = advisors.find(a => a.id === numId);
    
    if (!advisor) {
      return NextResponse.json({ error: 'Advisor not found' }, { status: 404 });
    }
    
    return NextResponse.json(advisor);
  }

  if (departmentId) {
    const numDeptId = parseInt(departmentId);
    const departmentAdvisors = advisors.filter(a => a.departmentId === numDeptId);
    
    if (departmentAdvisors.length === 0) {
      return NextResponse.json({ error: 'No advisors found for this department' }, { status: 404 });
    }
    
    return NextResponse.json(departmentAdvisors);
  }

  if (email) {
    const advisor = advisors.find(a => a.email === email);
    
    if (!advisor) {
      return NextResponse.json({ error: 'Advisor not found' }, { status: 404 });
    }
    
    return NextResponse.json(advisor);
  }
  
  // Return all advisors if no id provided
  return NextResponse.json(advisors);
}

// Handler function to process POST requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Login validation
    const advisor = advisors.find(a => a.email === email && a.password === password);
    
    if (!advisor) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Return advisor without password for security
    const { password: _, ...safeAdvisor } = advisor;
    return NextResponse.json({ 
      success: true, 
      message: 'Login successful', 
      user: safeAdvisor 
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
