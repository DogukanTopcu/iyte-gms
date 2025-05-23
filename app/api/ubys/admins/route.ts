
import { NextRequest, NextResponse } from 'next/server';
import { admins } from '../_shared/admin-data';

// Handler function to process requests
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get('id');

  // 1. Get all admin data
  if (!id) {
    return NextResponse.json(admins, { status: 200 });
  }

  // 2. Get specific admin by id
  if (id) {
    const adminId = parseInt(id, 10);
    const admin = admins.find((admin) => admin.id === adminId);
    if (admin) {
      return NextResponse.json(admin, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }
  }

  return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
}

// Handler function to process POST requests
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Find the admin with the matching email and password
    const admin = admins.find((admin) => admin.email === email && admin.password === password);
    if (admin) {
      // Return the admin data without the password
      const { password, ...adminWithoutPassword } = admin;
      return NextResponse.json({ ...adminWithoutPassword }, { status: 200 });
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

