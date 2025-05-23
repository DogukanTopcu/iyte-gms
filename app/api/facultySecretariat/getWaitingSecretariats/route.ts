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


  const students = await prisma.student.findMany({
    where: { GraduationStatus: { status: { in: ['FACULTY_SECRETARIAT_APPROVAL', 'COMPLETED'] } } },
    include: {
      Department: {
        include: {
          Faculty: true,
        }
      }
    },
  });

  const facSecretariats = await prisma.facSecretariat.findMany({
    where: { facultyId: { notIn: students.map((student) => student.Department.Faculty.id) } },
    include: {
      Faculty: true,
    },
  });
  
  return NextResponse.json(facSecretariats, { status: 200 });
}
