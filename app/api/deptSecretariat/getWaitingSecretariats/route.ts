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

  const departments = await prisma.department.findMany({
    where: { facultyId: parseInt(id) },
    select: { id: true },
  });
  const departmentIds = departments.map((department) => department.id);


  const students = await prisma.student.findMany({
    where: { departmentId: { in: departmentIds }, GraduationStatus: { status: { in: ['DEPARTMENT_SECRETARIAT_APPROVAL', 'FACULTY_SECRETARIAT_APPROVAL', 'COMPLETED'] } } },
    include: {
      Department: {
        include: {
          Faculty: true,
        }
      }
    },
  });

  const deptSecretariats = await prisma.deptSecretariat.findMany({
    where: { departmentId: { notIn: students.map((student) => student.Department.id), in: departmentIds } },
    include: {
      Department: true,
    },
  });
  
  return NextResponse.json(deptSecretariats, { status: 200 });
}
