import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
    try {
        // Fetch data from UBYS API - this endpoint already filters students with grade 4
        const studentsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ubys/init/fetchstudents`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!studentsResponse.ok) {
            throw new Error('Failed to fetch students data');
        }

        const students = await studentsResponse.json();

        // Upsert students
        for (const student of students) {
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

            await prisma.graduationStatus.upsert({
                where: { studentId: student.id },
                update: {
                    status: "SYSTEM_APPROVAL",
                },
                create: {
                    studentId: student.id,
                    status: "SYSTEM_APPROVAL",
                }
            });
        }
        
        return NextResponse.json({ message: 'Students created successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error creating students:', error);
        return NextResponse.json({ error: 'Failed to create students' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET() {
    try {
        const students = await prisma.student.findMany({
            include: {
                Department: true,
                Advisor: true,
            }
        });
        console.log(students);
        return NextResponse.json(students, { status: 200 });
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}