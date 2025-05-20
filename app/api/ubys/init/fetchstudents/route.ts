import { NextRequest, NextResponse } from 'next/server';
import { students } from '../../_shared/students-data';

export async function GET() {
  try {
    // Filter out password field from each student object
    const studentsWithoutPasswords = students.map(({ password, ...student }) => student);
    return NextResponse.json(studentsWithoutPasswords, { status: 200 });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ message: 'Failed to fetch students' }, { status: 500 });
  }
} 