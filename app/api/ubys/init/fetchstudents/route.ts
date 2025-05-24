import { NextResponse } from 'next/server';
import { students } from '../../_shared/students-data';
import { transcripts } from '../../_shared/transcript-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get all students with grade 4 from transcripts
    const grade4Transcripts = transcripts.filter(transcript => transcript.grade === 4);
    const grade4StudentIds = grade4Transcripts.map(transcript => transcript.studentId);
    
    // Filter students based on those student IDs and remove passwords
    const grade4Students = students
      .filter(student => grade4StudentIds.includes(student.studentId))
      .map(({ password, ...student }) => student);
    
    return NextResponse.json(grade4Students, 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ message: 'Failed to fetch students' }, 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
  }
} 