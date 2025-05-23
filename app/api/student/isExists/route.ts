import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const studentNumber = searchParams.get('studentId');

    if (!studentNumber) {
        return NextResponse.json({ error: 'Student number is required' }, { status: 400 });
    }

    try {
        const studentExists = await prisma.student.findUnique({
            where: { studentId: parseInt(studentNumber) },
        });

        return NextResponse.json({ exists: !!studentExists }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to check student existence' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
