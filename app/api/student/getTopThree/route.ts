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

// Interface for students after their GPA and term have been attached from transcript
interface StudentWithGpaAndTerm extends StudentWithPrismaDetails {
  gpa: number;  // GPA obtained from transcript
  term: number; // Term obtained from transcript
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
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

    // Create a map of studentId to {gpa, term} from the mock transcript data, excluding term 10
    const transcriptDetailsMap = new Map<number, { gpa: number, term: number }>();
    allMockTranscripts.forEach(transcript => {
      // Ensure studentId, gpa, and term are valid, gpa and term are numbers, and term is not 10
      if (transcript.studentId &&
          typeof transcript.gpa === 'number' &&
          typeof transcript.term === 'number' &&
          transcript.term !== 10) {
        transcriptDetailsMap.set(transcript.studentId, { gpa: transcript.gpa, term: transcript.term });
      }
    });

    // Augment students with GPA and term from transcripts and filter out those without valid data
    const studentsWithDetails: StudentWithGpaAndTerm[] = relevantStudentsFromPrisma
      .map(student => {
        const details = transcriptDetailsMap.get(student.studentId);
        return { ...student, gpa: details?.gpa, term: details?.term };
      })
      .filter(student => typeof student.gpa === 'number' && typeof student.term === 'number') as StudentWithGpaAndTerm[];

    if (studentsWithDetails.length === 0) {
      return NextResponse.json([], { status: 200 }); // No students with valid GPAs and terms from transcripts
    }

    const gpas = studentsWithDetails.map(student => student.gpa);
    const uniqueSortedGpas = Array.from(new Set(gpas)).sort((a, b) => b - a);
    const topGpaTiers = uniqueSortedGpas.slice(0, 3);

    if (topGpaTiers.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    let topStudents = studentsWithDetails.filter(student =>
      topGpaTiers.includes(student.gpa)
    );

    // Sort the final list: primary sort by term (ascending), secondary sort by GPA (descending)
    topStudents.sort((a, b) => {
      if (a.term !== b.term) {
        return a.term - b.term; // Ascending by term
      }
      return b.gpa - a.gpa; // Descending by GPA for same term
    });

    return NextResponse.json(topStudents, { status: 200 });

  } catch (error) {
    console.error("Error in /api/student/getTopThree:", error);
    return NextResponse.json({ message: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}