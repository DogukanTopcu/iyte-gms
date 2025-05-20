import { NextRequest, NextResponse } from 'next/server';
import { admins } from '../_shared/admin-data';

// Handler function to process requests
export async function GET(request: NextRequest) {
  // Get admin ID from query params if provided
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const email = searchParams.get('email');
  
  if (id) {
    const numId = parseInt(id);
    const admin = admins.find(a => a.id === numId);
    
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }
    
    return NextResponse.json(admin);
  }

  if (email) {
    const admin = admins.find(a => a.email === email);
    
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }
    
    return NextResponse.json(admin);
  }
  
  // Return all admins if no id provided
  return NextResponse.json(admins);
}

// Handler function to process POST requests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    // Login validation
    const admin = admins.find(a => a.email === email && a.password === password);
    
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Return admin without password for security
    const { password: _, ...safeAdmin } = admin;
    return NextResponse.json({ 
      success: true, 
      message: 'Login successful', 
      user: safeAdmin 
    });
    
  } catch (error) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

