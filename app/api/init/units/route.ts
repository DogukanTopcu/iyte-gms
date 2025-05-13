import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const units = await prisma.unit.findMany();
    return NextResponse.json(units, { status: 200 });
  } catch (error) {
    console.error('Error fetching units:', error);
    return NextResponse.json({ error: 'Failed to fetch units' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
