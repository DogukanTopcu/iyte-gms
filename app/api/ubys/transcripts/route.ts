import { NextRequest, NextResponse } from 'next/server';
import { transcripts } from '../_shared/transcript-data';

export async function GET(request: NextRequest) {
  // Get student ID from query params if provided
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  const studentId = searchParams.get('studentId');
  
  if (id) {
    const numId = parseInt(id);
    const transcript = transcripts.find(t => t.id === numId);
    
    if (!transcript) {
      return NextResponse.json({ error: 'Transcript not found' }, { status: 404 });
    }
    
    return NextResponse.json(transcript);
  }
  
  if (studentId) {
    const numStudentId = parseInt(studentId);
    const transcript = transcripts.find(t => t.studentId === numStudentId);
    
    if (!transcript) {
      return NextResponse.json({ error: 'Transcript not found for this student' }, { status: 404 });
    }
    
    return NextResponse.json(transcript);
  }
  
  // Return all transcripts if no id provided
  return NextResponse.json(transcripts);
}

