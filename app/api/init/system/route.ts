import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    
    // Create institutions first (faculties and departments)
    const institutionsResponse = await fetch(`${baseUrl}/api/init/createInstitutions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!institutionsResponse.ok) {
      throw new Error('Failed to create institutions');
    }
    
    // Create secretariats
    const secretariatsResponse = await fetch(`${baseUrl}/api/init/secretariats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!secretariatsResponse.ok) {
      throw new Error('Failed to create secretariats');
    }
    
    // Create administrators
    const administratorsResponse = await fetch(`${baseUrl}/api/init/administrators`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!administratorsResponse.ok) {
      throw new Error('Failed to create administrators');
    }
    
    // Create advisors
    const advisorsResponse = await fetch(`${baseUrl}/api/init/advisors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!advisorsResponse.ok) {
      throw new Error('Failed to create advisors');
    }
    
    // Create students
    const studentsResponse = await fetch(`${baseUrl}/api/init/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!studentsResponse.ok) {
      throw new Error('Failed to create students');
    }
    
    return NextResponse.json({ 
      message: 'System initialized successfully',
      details: {
        institutions: await institutionsResponse.json(),
        secretariats: await secretariatsResponse.json(),
        administrators: await administratorsResponse.json(),
        advisors: await advisorsResponse.json(),
        students: await studentsResponse.json()
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error initializing system:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize system', 
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
} 