import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { departmentSecretariats, facultySecretariats } from '../ubys/_shared';

const prisma = new PrismaClient();

async function authenticateUser(url: string, email: string, password: string) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const user = await response.json();
    return user;
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const student = await authenticateUser(process.env.NEXT_PUBLIC_API_URL + '/api/ubys/students', email, password);
    if (student) {
      return NextResponse.json({ user: student, role: 'student' }, { status: 200 });
    }

    const advisor = await authenticateUser(process.env.NEXT_PUBLIC_API_URL + '/api/ubys/advisors', email, password);
    if (advisor) {
      return NextResponse.json({ user: advisor, role: 'advisor' }, { status: 200 });
    }

    const admin = await authenticateUser(process.env.NEXT_PUBLIC_API_URL + '/api/ubys/admins', email, password);
    if (admin) {
      return NextResponse.json({ user: admin, role: "student affairs" }, { status: 200 });
    }

    const deptSecretariat = await authenticateUser(process.env.NEXT_PUBLIC_API_URL + '/api/ubys/secretariats/department', email, password);
    if (deptSecretariat) {
      return NextResponse.json({ user: deptSecretariat, role: 'department secretariat' }, { status: 200 });
    }

    const facSecretariat = await authenticateUser(process.env.NEXT_PUBLIC_API_URL + '/api/ubys/secretariats/faculty', email, password);
    if (facSecretariat) {
      return NextResponse.json({ user: facSecretariat, role: 'faculty secretariat' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  } catch (error) {
    console.error('Error processing authentication request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const role = searchParams.get('role')?.toLowerCase();

    if (!email || !role) {
      return NextResponse.json({ message: 'Email and role are required' }, { status: 400 });
    }

    if (role === 'student') {
      const student = await prisma.student.findUnique({
        where: { email: email }
      });
      if (student) {
        return NextResponse.json({ user: student, role: 'student' }, { status: 200 });
      }
    }

    if (role === 'advisor') {
      const advisor = await prisma.advisor.findUnique({
        where: { email: email }
      });
      if (advisor) {
        return NextResponse.json({ user: advisor, role: 'advisor' }, { status: 200 });
      }
    }

    if (role === 'student affairs') {
      const admin = await prisma.admin.findUnique({
        where: { email: email }
      });
      if (admin) {
        return NextResponse.json({ user: admin, role: 'Student Affairs' }, { status: 200 });
      }
    }

    if (role === 'department secretariat') {
      // Check in departmentSecretariats array
      const deptMatch = departmentSecretariats.find(secretariat => secretariat.email === email);
      if (deptMatch) {
        const secretariat = await prisma.deptSecretariat.findUnique({
          where: { email: email }
        });
        if (secretariat) {
          return NextResponse.json({ user: secretariat, role: 'department secretariat' }, { status: 200 });
        }
      }
    }

    if (role === 'faculty secretariat') {
      const facSecretariat = await prisma.facSecretariat.findUnique({
        where: { email: email }
      });
      if (facSecretariat) {
        return NextResponse.json({ user: facSecretariat, role: 'faculty secretariat' }, { status: 200 });
      }
    }

    return NextResponse.json({ message: 'Invalid role' }, { status: 400 });
    
  } catch (error) {
    console.error('Error processing authentication request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}