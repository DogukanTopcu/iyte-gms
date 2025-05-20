import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
    try {
        // Fetch data from UBYS API
        const advisorsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ubys/init/fetchadvisors`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!advisorsResponse.ok) {
            throw new Error('Failed to fetch advisors data');
        }

        const advisors = await advisorsResponse.json();

        // Upsert advisors
        for (const advisor of advisors) {
            await prisma.advisor.upsert({
                where: { id: advisor.id },
                update: {
                    name: advisor.name,
                    email: advisor.email,
                    departmentId: advisor.departmentId,
                },
                create: {
                    id: advisor.id,
                    name: advisor.name,
                    email: advisor.email,
                    departmentId: advisor.departmentId,
                }
            });
        }

        return NextResponse.json({ message: 'Advisors created successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error creating advisors:', error);
        return NextResponse.json({ error: 'Failed to create advisors' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET() {
    try {
        const advisors = await prisma.advisor.findMany();
        return NextResponse.json(advisors, { status: 200 });
    } catch (error) {
        console.error('Error fetching advisors:', error);
        return NextResponse.json({ error: 'Failed to fetch advisors' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}