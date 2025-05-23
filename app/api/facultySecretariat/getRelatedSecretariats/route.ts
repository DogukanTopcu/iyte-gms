import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handler function to process requests
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get('userId');
  const role = searchParams.get('role');
  
  // 1. Get all department secretariat data
  if (!id || !role) {
    return NextResponse.json({ message: 'Students not found' }, { status: 404 });
  }

  if (role === 'student affairs') {
    const facSecretariats = await prisma.facSecretariat.findMany({
      include: {
        Faculty: true,
      },
    });
    return NextResponse.json(facSecretariats, { status: 200 });
  }

  return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
}
