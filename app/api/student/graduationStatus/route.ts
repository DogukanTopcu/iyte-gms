import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This route handler expects to be part of a dynamic route structure,
// e.g., /app/api/student/graduationStatus/[id]/route.ts
// where `[id]` is the student's primary key, matching `user.id` from UserCard.
export async function GET(
  request: NextRequest,
) {
  try {
    const studentPkIdString = request.nextUrl.searchParams.get('id');

    if (!studentPkIdString) {
      return NextResponse.json({ status: 'Error: Student ID missing in path parameter' }, { status: 400 });
    }

    const studentPkId = parseInt(studentPkIdString, 10);
    if (isNaN(studentPkId)) {
      return NextResponse.json({ status: 'Error: Invalid Student ID format in path parameter' }, { status: 400 });
    }

    console.log(studentPkId);
    const status = await prisma.graduationStatus.findFirst({
      where: {
        Student: {studentId: studentPkId}
      }
    });

    if (!status) {
      return NextResponse.json({ status: "Student Not Found" }, { status: 404 });
    }

    return NextResponse.json({ status: status.status }, { status: 200 });

  } catch (error) {
    console.error('Error fetching graduation status:', error);
    // Return a 'status' field in the error response for consistency,
    // as UserCard.tsx expects `data.status`.
    return NextResponse.json({ status: "Error: Failed to retrieve status", message: 'Internal Server Error' }, { status: 500 });
  }
}
