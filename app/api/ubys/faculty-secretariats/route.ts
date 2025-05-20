import { NextRequest, NextResponse } from 'next/server';
import { facultySecretariats } from '../_shared/unit-and-department-data';

export async function GET(request: NextRequest) {
  // Get secretariat ID from query params if provided
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const facultyId = searchParams.get('facultyId');
  const email = searchParams.get('email');
  
  if (id) {
    const numId = parseInt(id);
    const secretariat = facultySecretariats.find(s => s.id === numId);
    
    if (!secretariat) {
      return NextResponse.json({ error: 'Faculty secretariat not found' }, { status: 404 });
    }
    
    return NextResponse.json(secretariat);
  }

  if (facultyId) {
    const numFacultyId = parseInt(facultyId);
    const facultySecretariat = facultySecretariats.find(s => s.facultyId === numFacultyId);
    
    if (!facultySecretariat) {
      return NextResponse.json({ error: 'No secretariat found for this faculty' }, { status: 404 });
    }
    
    return NextResponse.json(facultySecretariat);
  }

  if (email) {
    const secretariat = facultySecretariats.find(s => s.email === email);
    
    if (!secretariat) {
      return NextResponse.json({ error: 'Faculty secretariat not found' }, { status: 404 });
    }
    
    return NextResponse.json(secretariat);
  }
  
  // Return all secretariats if no id provided
  return NextResponse.json(facultySecretariats);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Login validation
    const secretariat = facultySecretariats.find(s => s.email === email && s.password === password);
    
    if (!secretariat) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Return secretariat without password for security
    const { password: _, ...safeSecretariat } = secretariat;
    return NextResponse.json({ 
      success: true, 
      message: 'Login successful', 
      user: safeSecretariat 
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
} 