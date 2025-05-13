import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const data = await req.json();
    try {
        data.forEach(async (administrator: any) => {
            await prisma.admin.upsert({
                where: { id: administrator.id },
                update: {
                    name: administrator.name,
                    email: administrator.email,
                    Unit: administrator.Unit,
                    Department: administrator.Department,
                    Faculty: administrator.Faculty,
                },
                create: {
                    id: administrator.id,
                    name: administrator.name,
                    email: administrator.email,
                    Unit: administrator.Unit,
                    Department: administrator.Department,
                    Faculty: administrator.Faculty,
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