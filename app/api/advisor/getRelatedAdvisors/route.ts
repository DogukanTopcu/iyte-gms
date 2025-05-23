import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handler function to process requests
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get('userId');
  const role = searchParams.get('role');
  // 1. Get all advisor data
  if (!id || !role) {
    return NextResponse.json({ message: 'Students not found' }, { status: 404 });
  }

  if (role === 'department secretariat') {
    // 2. Get all department data
    const advisors = await prisma.advisor.findMany({
      where: { departmentId: parseInt(id) },
      include: {
        Department: {
            include: {
                Faculty: true,
            }
        },
      },
    });
    return NextResponse.json(advisors, { status: 200 });
  }
  else if (role === 'faculty secretariat') {
    // 2. Get all faculty data
    const departments = await prisma.department.findMany({
      where: { facultyId: parseInt(id) },
      select: { id: true },
    });
    const departmentIds = departments.map((department) => department.id);
    const advisors = await prisma.advisor.findMany({
      where: { departmentId: { in: departmentIds } },
      include: {
        Department: {
            include: {
                Faculty: true,
            }
        }
      },
    });
    return NextResponse.json(advisors, { status: 200 });
  }
  else if (role === 'student affairs') {
    const advisors = await prisma.advisor.findMany({
      include: {
        Department: {
            include: {
                Faculty: true,
            }
        }
      },
    });
    return NextResponse.json(advisors, { status: 200 });
  }

  return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
}
