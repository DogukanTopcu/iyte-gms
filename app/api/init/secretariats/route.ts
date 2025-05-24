import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Fetch data from UBYS API
    const secretariatsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ubys/init/fetchsecretariats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });

    if (!secretariatsResponse.ok) {
      throw new Error('Failed to fetch secretariats data');
    }

    const { departmentSecretariats, facultySecretariats } = await secretariatsResponse.json();

    // Upsert department secretariats
    for (const deptSec of departmentSecretariats) {
      await prisma.deptSecretariat.upsert({
        where: { id: deptSec.id },
        update: { 
          name: deptSec.name, 
          email: deptSec.email, 
          departmentId: deptSec.departmentId 
        },
        create: { 
          id: deptSec.id, 
          name: deptSec.name, 
          email: deptSec.email, 
          departmentId: deptSec.departmentId 
        }
      });
    }

    // Upsert faculty secretariats
    for (const facSec of facultySecretariats) {
      await prisma.facSecretariat.upsert({
        where: { id: facSec.id },
        update: { 
          name: facSec.name, 
          email: facSec.email, 
          facultyId: facSec.facultyId 
        },
        create: { 
          id: facSec.id, 
          name: facSec.name, 
          email: facSec.email, 
          facultyId: facSec.facultyId 
        }
      });
    }

    return NextResponse.json({ message: 'Secretariats created successfully' },
       { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      });
  } catch (error) {
    console.error('Error creating secretariats:', error);
    return NextResponse.json({ error: 'Failed to create secretariats' }, 
      {
         status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
      });
  } finally {
    await prisma.$disconnect();
  }
} 


export async function GET() {
  try {
    const deptSecretariatsWithDepartment = await prisma.deptSecretariat.findMany({
      include: {
        Department: true
      }
    });

    const facultySecretariatsWithFaculty = await prisma.facSecretariat.findMany({
      include: {
        Faculty: true
      }
    });

    return NextResponse.json({ deptSecretariatsWithDepartment, facultySecretariatsWithFaculty }, 
      {
         status: 200,
         headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
      });
  } catch (error) {
    console.error('Error fetching secretariats:', error);
    return NextResponse.json({ error: 'Failed to fetch secretariats' },
      {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          }, 
      });
  } finally {
    await prisma.$disconnect();
  }
}