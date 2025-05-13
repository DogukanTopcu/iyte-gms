import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const data = await req.json();

    if (!data || !data.studentId || !data.name || !data.email || !data.departmentId || !data.advisorId) {
        return NextResponse.json({ error: 'Missing required student data' }, { status: 400 });
    }

    try {
        const newStudent = await prisma.student.upsert({
            where: { studentId: data.studentId },
            update: {
                name: data.name,
                email: data.email,
                departmentId: data.departmentId,
                advisorId: data.advisorId,
            },
            create: {
                studentId: data.studentId,
                name: data.name,
                email: data.email,
                departmentId: data.departmentId,
                advisorId: data.advisorId,
            },
        });

        return NextResponse.json(newStudent, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add student' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
