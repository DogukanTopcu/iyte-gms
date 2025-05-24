import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const diplomas = await prisma.diploma.findMany({
      include: {
        Student: {
          include: {
            Department: {
              include: {
                Faculty: true,
              },
            },
            Advisor: true,
            GraduationStatus: true,
          },
        },
      },
    });
    return new NextResponse(JSON.stringify(diplomas), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });

  } catch (error) {
    console.error('Error fetching diplomas:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error' },
      { 
        status: 500,
        headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        },
      },
    );
  }
}
