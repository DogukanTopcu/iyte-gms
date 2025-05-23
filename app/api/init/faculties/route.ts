import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('Fetching faculties from database...');
    const faculties = await prisma.faculty.findMany();
    console.log(`Found ${faculties.length} faculties in database`);
    return NextResponse.json(faculties, { status: 200 });
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return NextResponse.json({ error: 'Failed to fetch faculties' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
