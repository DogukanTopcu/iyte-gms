import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const faculties = await prisma.faculty.findMany();
    return NextResponse.json(faculties, { status: 200 });
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return NextResponse.json({ error: 'Failed to fetch faculties' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
