import { NextRequest, NextResponse } from 'next/server';
import { transcripts } from '../../_shared/transcript-data';

export async function POST(request: NextRequest) {
  // Get student ID from query params if provided
  const body = await request.json();
  const studentIds = body.studentIds;
  
  if (studentIds) {
    const transcript = transcripts.filter(t => studentIds.includes(t.studentId));
    
    if (!transcript) {
      return NextResponse.json({ error: 'Transcript not found' }, { status: 404 });
    }
    
    return NextResponse.json(transcript);
  }
  
  return NextResponse.json({ error: 'Student IDs are required' }, { status: 400 });
}

