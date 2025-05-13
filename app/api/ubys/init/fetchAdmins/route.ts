import { NextResponse } from 'next/server';
import { advisors } from '../../_shared/advisors-data';

export async function GET() {
  try {
    return NextResponse.json(advisors, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
