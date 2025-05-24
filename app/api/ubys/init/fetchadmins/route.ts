import { NextResponse } from 'next/server';
import { admins } from '../../_shared/admin-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    // Filter out password field from each admin object
    const adminsWithoutPasswords = admins.map(({ password, ...admin }) => admin);
    return NextResponse.json(adminsWithoutPasswords, 
      { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({ message: 'Failed to fetch admins' }, 
    { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  }
} 