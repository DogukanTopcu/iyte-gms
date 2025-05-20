import { NextRequest, NextResponse } from 'next/server';
import { admins } from '../../_shared/admin-data';

export async function GET() {
  try {
    // Filter out password field from each admin object
    const adminsWithoutPasswords = admins.map(({ password, ...admin }) => admin);
    return NextResponse.json(adminsWithoutPasswords, { status: 200 });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json({ message: 'Failed to fetch admins' }, { status: 500 });
  }
} 