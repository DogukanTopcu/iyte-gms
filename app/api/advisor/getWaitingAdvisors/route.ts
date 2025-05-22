import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handler function to process requests
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('userId');
  
  // 1. Get all advisor data
  if (!id) {
    return NextResponse.json({ message: 'Students not found' }, { status: 404 });
  }

  const advisors = await prisma.advisor.findMany({
    where: { departmentId: parseInt(id), Student: { none: { GraduationStatus: { status: { in: ['ADVISOR_APPROVAL', 'DEPARTMENT_SECRETARIAT_APPROVAL', 'FACULTY_SECRETARIAT_APPROVAL', 'COMPLETED'] } } } } },
    include: {
      Department: true,
      Student: true,
    },
  });
  console.log(advisors);
  return NextResponse.json(advisors, { status: 200 });
}
