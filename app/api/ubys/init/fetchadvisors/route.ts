import { NextResponse } from 'next/server';
import { advisors } from '../../_shared/advisors-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    // Filter out password field from each advisor object
    const advisorsWithoutPasswords = advisors.map(({ password, ...advisor }) => advisor);
    return NextResponse.json(advisorsWithoutPasswords, 
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error fetching advisors:', error);
    return NextResponse.json({ message: 'Failed to fetch advisors' }, 
      { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }
} 