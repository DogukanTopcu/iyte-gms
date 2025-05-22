import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, GraduationStatusEnum } from '@prisma/client';

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

// POST METHOD that updates the graduation status of multiple students
// This function needs list of student numbers and the new status as string
// Example: { studentNumbers: [123456, 123457], newStatus: 'ADVISOR_APPROVAL' }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentNumbers, newStatus } = body;

    // Validate studentNumbers: should be an array of numbers
    if (!Array.isArray(studentNumbers) || studentNumbers.some(id => typeof id !== 'number') || studentNumbers.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty studentNumbers provided. Expected a non-empty array of numbers.' }, { status: 400 });
    }

    // Validate newStatus: should be a string and a valid GraduationStatusEnum value
    if (!newStatus || typeof newStatus !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid newStatus provided. Expected a string.' }, { status: 400 });
    }

    const validStatuses = Object.values(GraduationStatusEnum);
    if (!validStatuses.includes(newStatus as GraduationStatusEnum)) {
      return NextResponse.json({ error: `Invalid new status value. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    // Perform the batch update
    // This updates GraduationStatus records where the related Student's studentId (student number) is in the studentNumbers list.
    const updateResult = await prisma.graduationStatus.updateMany({
      where: {
        Student: {
          studentId: {
            in: studentNumbers,
          },
        },
      },
      data: {
        status: newStatus as GraduationStatusEnum,
      },
    });

    return NextResponse.json({ message: 'Graduation statuses updated successfully.', count: updateResult.count }, { status: 200 });

  } catch (error) {
    console.error('Error updating graduation statuses:', error);
    if (error instanceof SyntaxError) { // Handle JSON parsing errors
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    // Generic error for other issues
    return NextResponse.json({ error: 'Failed to update graduation statuses', details: (error as Error).message }, { status: 500 });
  }
}
