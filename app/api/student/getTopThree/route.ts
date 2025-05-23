import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Student } from '@prisma/client';
import { transcripts as allMockTranscripts } from '../../ubys/_shared/transcript-data'; // Import mock transcript data

const prisma = new PrismaClient();

// Interface for Student data fetched from Prisma with its relations
interface StudentWithPrismaDetails extends Student {
  Department: {} | null;
  Advisor: {} | null;
  GraduationStatus: {} | null;
  // studentId from Prisma's Student model will be used for matching
}

// Interface for students after their GPA has been attached from transcript
interface StudentWithGpa extends StudentWithPrismaDetails {
  gpa: number; // GPA obtained from transcript
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get('userId');
  const role = searchParams.get('role');

  if (!role) {
    return NextResponse.json({ message: 'Role is required' }, { status: 400 });
  }
  if (!idParam && role !== 'student affairs') {
    return NextResponse.json({ message: 'User ID is required for this role' }, { status: 400 });
  }

  let parsedId: number | undefined = undefined;
  if (idParam && role !== 'student affairs') {
    parsedId = parseInt(idParam, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json({ message: 'Invalid User ID format' }, { status: 400 });
    }
  }

  try {
    let relevantStudentsFromPrisma: StudentWithPrismaDetails[] = [];

    const studentInclude = {
      Department: true,
      Advisor: true,
      GraduationStatus: true,
    };

    if (role === 'advisor') {
      if (parsedId === undefined) return NextResponse.json({ message: 'User ID is required for advisor role' }, { status: 400 });
      relevantStudentsFromPrisma = await prisma.student.findMany({
        where: { advisorId: parsedId },
        include: studentInclude,
      }) as StudentWithPrismaDetails[];
    } else if (role === 'department secretariat') {
      if (parsedId === undefined) return NextResponse.json({ message: 'User ID is required for department secretariat role' }, { status: 400 });
      relevantStudentsFromPrisma = await prisma.student.findMany({
        where: { departmentId: parsedId },
        include: studentInclude,
      }) as StudentWithPrismaDetails[];
    } else if (role === 'faculty secretariat') {
      if (parsedId === undefined) return NextResponse.json({ message: 'User ID is required for faculty secretariat role' }, { status: 400 });
      const departments = await prisma.department.findMany({
        where: { facultyId: parsedId },
        select: { id: true },
      });
      const departmentIds = departments.map((department) => department.id);

      if (departmentIds.length === 0) return NextResponse.json([], { status: 200 });
      relevantStudentsFromPrisma = await prisma.student.findMany({
        where: { departmentId: { in: departmentIds } },
        include: studentInclude,
      }) as StudentWithPrismaDetails[];
    } else if (role === 'student affairs') {
      relevantStudentsFromPrisma = await prisma.student.findMany({
        include: studentInclude,
      }) as StudentWithPrismaDetails[];
    } else {
      return NextResponse.json({ message: 'Invalid role specified' }, { status: 400 });
    }

    if (relevantStudentsFromPrisma.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Create a map of studentId to GPA from the mock transcript data
    const gpaMap = new Map<number, number>();
    allMockTranscripts.forEach(transcript => {
      // Ensure studentId and gpa are valid and gpa is a number
      if (transcript.studentId && typeof transcript.gpa === 'number') {
        gpaMap.set(transcript.studentId, transcript.gpa);
      }
    });

    // Augment students with GPA from transcripts and filter out those without a valid GPA
    const studentsWithGpaData: StudentWithGpa[] = relevantStudentsFromPrisma
      .map(student => {
        const gpa = gpaMap.get(student.studentId); // student.studentId is the student's number
        return { ...student, gpa: gpa }; // gpa can be undefined here
      })
      .filter(student => typeof student.gpa === 'number') as StudentWithGpa[]; // Ensure gpa is a number

    if (studentsWithGpaData.length === 0) {
      return NextResponse.json([], { status: 200 }); // No students with valid GPAs from transcripts
    }

    const gpas = studentsWithGpaData.map(student => student.gpa);
    const uniqueSortedGpas = Array.from(new Set(gpas)).sort((a, b) => b - a);
    const topGpaTiers = uniqueSortedGpas.slice(0, 3);

    if (topGpaTiers.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    let topStudents = studentsWithGpaData.filter(student =>
      topGpaTiers.includes(student.gpa)
    );

    // Sort the final list of top students by GPA in descending order
    topStudents.sort((a, b) => b.gpa - a.gpa);

    return NextResponse.json(topStudents, { status: 200 });

  } catch (error) {
    console.error("Error in /api/student/getTopThree:", error);
    return NextResponse.json({ message: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}