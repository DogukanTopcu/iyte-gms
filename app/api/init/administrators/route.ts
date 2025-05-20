import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
    try {
        // Fetch data from UBYS API
        const adminsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ubys/init/admins`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!adminsResponse.ok) {
            throw new Error('Failed to fetch admins data');
        }

        const admins = await adminsResponse.json();

        // Upsert admins
        for (const admin of admins) {
            await prisma.admin.upsert({
                where: { id: admin.id },
                update: {
                    name: admin.name,
                    email: admin.email,
                },
                create: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email,
                }
            });
        }
        
        return NextResponse.json({ message: 'Administrators created successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error creating administrators:', error);
        return NextResponse.json({ error: 'Failed to create administrators' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET() {
    try {
        const administrators = await prisma.admin.findMany();
        return NextResponse.json(administrators, { status: 200 });
    } catch (error) {
        console.error('Error fetching administrators:', error);
        return NextResponse.json({ error: 'Failed to fetch administrators' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}