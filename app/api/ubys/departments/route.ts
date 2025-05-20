import { NextRequest, NextResponse } from 'next/server';
import { departments } from '../_shared/unit-and-department-data';

export async function GET(request: NextRequest) {
  // Get department ID from query params if provided
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const facultyId = searchParams.get('facultyId');
  
  if (id) {
    const numId = parseInt(id);
    const department = departments.find(d => d.id === numId);
    
    if (!department) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }
    
    return NextResponse.json(department);
  }

  if (facultyId) {
    const numFacultyId = parseInt(facultyId);
    const facultyDepartments = departments.filter(d => d.facultyId === numFacultyId);
    
    if (facultyDepartments.length === 0) {
      return NextResponse.json({ error: 'No departments found for this faculty' }, { status: 404 });
    }
    
    return NextResponse.json(facultyDepartments);
  }
  
  // Return all departments if no id provided
  return NextResponse.json(departments);
} 