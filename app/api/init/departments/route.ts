import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('Fetching departments from database...');
    const departments = await prisma.department.findMany({
      include: {
        Faculty: true,
      },
    });
    console.log(`Found ${departments.length} departments in database`);
    return new NextResponse(JSON.stringify(departments), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch departments' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
