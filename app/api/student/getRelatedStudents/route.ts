import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get the students that are related to the Advisor, Department Secretariat, Faculty Secretariat

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('userId');
  const role = searchParams.get('role');
  
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
  } else if (role === 'department secretariat') {
    const students = await prisma.student.findMany({
      where: { departmentId: parseInt(id) },
      include: {
        Department: true,
        Advisor: true,
        GraduationStatus: true,
      },
    });
    return NextResponse.json(students, { status: 200 });
  }else if (role === 'faculty') {
    const departments = await prisma.department.findMany({
      where: { facultyId: parseInt(id) },
      select: { id: true },
    });
    const departmentIds = departments.map((department) => department.id);
    const students = await prisma.student.findMany({
      where: { 
      departmentId: { in: departmentIds },
      GraduationStatus: { status: 'DEPARTMENT_SECRETARIAT_APPROVAL' },
      },
      include: {
        Department: true,
        Advisor: true,
        GraduationStatus: true,
      },
    });
    return NextResponse.json(students, { status: 200 });
  }else if (role === 'studentAffairs') {
    // 4. Get all university data
    const students = await prisma.student.findMany({
      where: { GraduationStatus: { status: 'FACULTY_SECRETARIAT_APPROVAL' } },
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
