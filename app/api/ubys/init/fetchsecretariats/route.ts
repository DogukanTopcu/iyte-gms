import { NextResponse } from 'next/server';
import { departmentSecretariats, facultySecretariats } from '../../_shared/secretariat-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Filter out password field from each secretariat object
    const deptSecretariatsWithoutPasswords = departmentSecretariats.map(({ password, ...secretariat }) => secretariat);
    const facSecretariatsWithoutPasswords = facultySecretariats.map(({ password, ...secretariat }) => secretariat);
    
    const secretariats = {
      departmentSecretariats: deptSecretariatsWithoutPasswords,
      facultySecretariats: facSecretariatsWithoutPasswords
    };
    
    return NextResponse.json(secretariats, 
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
  } catch (error) {
    console.error('Error fetching secretariats:', error);
    return NextResponse.json({ message: 'Failed to fetch secretariats' }, 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
  }
} 