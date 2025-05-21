import { NextRequest, NextResponse } from 'next/server';
import { departments, faculties } from '../_shared/faculty-and-department-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') ? parseInt(searchParams.get('id') as string, 10) : undefined;
    const facultyId = searchParams.get('facultyId') ? parseInt(searchParams.get('facultyId') as string, 10) : undefined;
    
    // Return all departments if no filters provided
    if (!id && !facultyId) {
      return NextResponse.json(departments, { status: 200 });
    }
    
    // Get specific department by id
    if (id !== undefined) {
      const department = departments.find((dept) => dept.id === id);
      if (department) {
        // Find the associated faculty
        const faculty = faculties.find(f => f.id === department.facultyId);
        const result = {
          ...department,
          faculty: faculty || null
        };
        return NextResponse.json(result, { status: 200 });
      } else {
        return NextResponse.json({ message: 'Department not found' }, { status: 404 });
      }
    }
    
    // Get departments by facultyId
    if (facultyId !== undefined) {
      const departmentsByFaculty = departments.filter((dept) => dept.facultyId === facultyId);
      return NextResponse.json(departmentsByFaculty, { status: 200 });
    }
    
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error processing departments request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 