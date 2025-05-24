import { NextRequest, NextResponse } from 'next/server';
import { GraduationStatusEnum, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface StudentWithGpaAndTerm {
  gpa: number;  // GPA obtained from transcript
  term: number; // Term obtained from transcript
  id: number;
  name: string;
  email: string;
  studentId: number;
  Department: {
    id: number;
    name: string;
    Faculty: {
      id: number;
      name: string;
    };
  };
  Advisor: {
    id: number;
    name: string;
  };
  GraduationStatus: {
    studentId: number;
    status: GraduationStatusEnum;
  };
}

interface Student {
  id: number;
  name: string;
  email: string;
  studentId: number;
  Department: {
    id: number;
    name: string;
    Faculty: {
      id: number;
      name: string;
    };
  };
  Advisor: {
    id: number;
    name: string;
  };
  GraduationStatus: {
    studentId: number;
    status: GraduationStatusEnum;
  } | null;
}

interface TranscriptDetails {
  studentId: number;
  gpa: number;
  term: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get('userId');
  const role = searchParams.get('role');
  
  if (!id || !role) {
    return NextResponse.json({ message: 'Students not found' }, { status: 404 });
  }

  const studentsWithGpaAndTerm = async (students: Student[]): Promise<StudentWithGpaAndTerm[]> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ubys/transcripts/getTranscriptDetails`, {
      method: 'POST',
      body: JSON.stringify({
        studentIds: students.map(student => student.studentId),
      }),
    });
    const transcriptDetails: TranscriptDetails[] = await data.json();
    const returnStudents = students.map(student => {
      const details = transcriptDetails.find(detail => detail.studentId === student.studentId);
      return { ...student, gpa: details!.gpa, term: details!.term, GraduationStatus: { studentId: student.studentId, status: student.GraduationStatus!.status } };
    });
    return returnStudents;
  };

  const filterHighHonorStudents = (students: StudentWithGpaAndTerm[]) => {
    // Filter students with GPA between 3.5 and 4.0 (inclusive) for High Honor Certificate
    return students.filter(student => student.gpa >= 3.5 && student.gpa <= 4.0);
  };

  const sortStudents = (students: StudentWithGpaAndTerm[]) => {
    // Sort students by GPA only (higher GPA first)
    return students.sort((a, b) => b.gpa - a.gpa);
  }

  if (role === 'department secretariat') {
    const students = await prisma.student.findMany({
      where: { departmentId: parseInt(id) },
      include: {
        Department: {
          include: {
            Faculty: true,
          },
        },
        Advisor: true,
        GraduationStatus: {
          select: {
            studentId: true,
            status: true,
          }
        },
      },
    });
    
    const studentsData = await studentsWithGpaAndTerm(students);
    const highHonorStudents = filterHighHonorStudents(studentsData);
    const sortedStudents = sortStudents(highHonorStudents);

    return NextResponse.json(sortedStudents, { status: 200 });

  } else if (role === 'faculty secretariat') {
    const departments = await prisma.department.findMany({
      where: { facultyId: parseInt(id) },
      select: { id: true },
    });
    const departmentIds = departments.map((department) => department.id);
    const students = await prisma.student.findMany({
      where: { 
        departmentId: { in: departmentIds },
      },
      include: {
        Department: {
          include: {
            Faculty: true,
          },
        },
        Advisor: true,
        GraduationStatus: {
          select: {
            studentId: true,
            status: true,
          }
        },
      },
    });

    const studentsData = await studentsWithGpaAndTerm(students);
    const highHonorStudents = filterHighHonorStudents(studentsData);
    const sortedStudents = sortStudents(highHonorStudents);

    return NextResponse.json(sortedStudents, { status: 200 });
    
  } else if (role === 'student affairs') {
    const students = await prisma.student.findMany({
      include: {
        Department: {
          include: {
            Faculty: true,
          },
        },
        Advisor: true,
        GraduationStatus: {
          select: {
            studentId: true,
            status: true,
          }
        },
      },
    });

    const studentsData = await studentsWithGpaAndTerm(students);
    const highHonorStudents = filterHighHonorStudents(studentsData);
    const sortedStudents = sortStudents(highHonorStudents);

    return NextResponse.json(sortedStudents, { status: 200 });
  }

  return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
} 