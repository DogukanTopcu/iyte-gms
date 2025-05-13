import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const data = await req.json();
    const students = data.filter((student: any) => student.grade === 4);
    try {
        students.forEach(async (student: any) => {
            await prisma.student.upsert({
                where: { id: student.id },
                update: {
                    name: student.name,
                    studentId: student.studentId,
                    email: student.email,
                    departmentId: student.departmentId,
                    advisorId: student.advisorId,
                },
                create: {
                    id: student.id,
                    studentId: student.studentId,
                    name: student.name,
                    email: student.email,
                    departmentId: student.departmentId,
                    advisorId: student.advisorId,
                }
            });
        });
        return NextResponse.json({ message: 'Students created successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create students' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET() {
    try {
        const students = await prisma.student.findMany();
        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}