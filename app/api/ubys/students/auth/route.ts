import { NextRequest, NextResponse } from 'next/server';
import { students } from '../../_shared/students-data';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Login validation
    const student = students.find(s => s.email === email && s.password === password);
    
    if (!student) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Return student without password for security
    const { password: _, ...safeStudent } = student;
    return NextResponse.json({ 
      success: true, 
      message: 'Login successful', 
      user: safeStudent 
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
} 