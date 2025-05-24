import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';

export async function POST() {
  try {
    // Fetch data from UBYS API
    const unitsAndDepartmentsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ubys/init/fetchInstitutions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!unitsAndDepartmentsResponse.ok) {
      throw new Error('Failed to fetch units and departments data');
    }

    const { faculties, departments } = await unitsAndDepartmentsResponse.json();

    console.log(`Received ${faculties?.length || 0} faculties and ${departments?.length || 0} departments from UBYS`);

    for (const faculty of faculties || []) {
      await prisma.faculty.upsert({
        where: { id: faculty.id },
        update: { name: faculty.name, email: faculty.email },
        create: { id: faculty.id, name: faculty.name, email: faculty.email }
      });
    }

    // Upsert departments
    for (const department of departments || []) {
      await prisma.department.upsert({
        where: { id: department.id },
        update: { name: department.name, email: department.email, facultyId: department.facultyId },
        create: { id: department.id, name: department.name, email: department.email, facultyId: department.facultyId }
      });
    }

    // Verify data was saved
    const facultyCount = await prisma.faculty.count();
    const departmentCount = await prisma.department.count();
    console.log(`After upsert: ${facultyCount} faculties and ${departmentCount} departments in database`);

    return NextResponse.json({ 
      message: 'Institutions created successfully',
      counts: { faculties: facultyCount, departments: departmentCount }
    }, { status: 200 });
  } catch (error) {
    console.error('Error creating institutions:', error);
    return NextResponse.json({ error: 'Failed to create institutions' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
