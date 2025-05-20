import { NextResponse } from 'next/server';
import { units, departments, faculties } from '../../_shared/faculty-and-department-data';

export async function GET() {
  try {
    const data = {
      units: units,
      departments: departments,
      faculties: faculties,
    };
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
