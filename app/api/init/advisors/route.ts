import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const data = await req.json();
    try {
        data.forEach(async (advisor: any) => {
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
        });
        return NextResponse.json({ message: 'Advisors created successfully' }, { status: 200 });
    } catch (error) {
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
        return NextResponse.json({ error: 'Failed to fetch advisors' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}