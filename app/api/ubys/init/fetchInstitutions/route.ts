import { NextResponse } from 'next/server';
import { faculties, departments } from '../../_shared/faculty-and-department-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const unitsAndDepartments = {
      faculties,
      departments
    };
    
    return NextResponse.json(unitsAndDepartments, 
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error fetching units and departments:', error);
    return NextResponse.json({ message: 'Failed to fetch units and departments' }, 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
  }
} 