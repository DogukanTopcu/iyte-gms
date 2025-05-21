import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handler function to process requests
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('userId');
  const role = searchParams.get('role');

  // 1. Get all advisor data
  if (!id || !role) {
    return NextResponse.json({ message: 'Students not found' }, { status: 404 });
  }

  if (role === 'advisor') {
    const students = await prisma.student.findMany({
      where: { advisorId: parseInt(id) },
      include: {
        Department: true,
        Advisor: true,
        GraduationStatus: true,
      },
    });
    return NextResponse.json(students, { status: 200 });
  }

  return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
}
