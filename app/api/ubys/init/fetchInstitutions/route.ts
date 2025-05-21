import { NextResponse } from 'next/server';
import { faculties, departments } from '../../_shared/faculty-and-department-data';

export async function GET() {
  try {
    const unitsAndDepartments = {
      faculties,
      departments
    };
    
    return NextResponse.json(unitsAndDepartments, { status: 200 });
  } catch (error) {
    console.error('Error fetching units and departments:', error);
    return NextResponse.json({ message: 'Failed to fetch units and departments' }, { status: 500 });
  }
} 