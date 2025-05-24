import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
    return NextResponse.json(diplomas);
  } catch (error) {
    console.error('Error fetching diplomas:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
