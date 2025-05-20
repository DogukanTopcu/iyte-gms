import { NextRequest, NextResponse } from 'next/server';
import { faculties } from '../_shared/unit-and-department-data';

export async function GET(request: NextRequest) {
  // Get faculty ID from query params if provided
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (id) {
    const numId = parseInt(id);
    const faculty = faculties.find(f => f.id === numId);
    
    if (!faculty) {
      return NextResponse.json({ error: 'Faculty not found' }, { status: 404 });
    }
    
    return NextResponse.json(faculty);
  }
  
  // Return all faculties if no id provided
  return NextResponse.json(faculties);
} 