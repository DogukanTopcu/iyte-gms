import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();
  try {
    // Upsert faculties
    for (const faculty of data.faculties) {
      await prisma.faculty.upsert({
        where: { id: faculty.id },
        update: { name: faculty.name, email: faculty.email },
        create: { id: faculty.id, name: faculty.name, email: faculty.email }
      });
    }

    // Upsert departments
    for (const department of data.departments) {
      await prisma.department.upsert({
        where: { id: department.id },
        update: { name: department.name, email: department.email, facultyId: department.facultyId },
        create: { id: department.id, name: department.name, email: department.email, facultyId: department.facultyId }
      });
    }

    // Upsert units
    for (const unit of data.units) {
      await prisma.unit.upsert({
        where: { id: unit.id },
        update: { name: unit.name, email: unit.email },
        create: { id: unit.id, name: unit.name, email: unit.email }
      });
    }

    return NextResponse.json({ message: 'Data upserted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error upserting data:', error);
    return NextResponse.json({ error: 'Failed to upsert data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
