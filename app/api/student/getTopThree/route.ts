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


  const studentsWithGpaAndTerm = async (students : Student[]) : Promise<StudentWithGpaAndTerm[]> => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ubys/transcripts/getTranscriptDetails`, {
      method: 'POST',
      body: JSON.stringify({
        studentIds: students.map(student => student.studentId),
      }),
    });
    const transcriptDetails : TranscriptDetails[] = await data.json();
    const returnStudents = students.map(student => {
      const details = transcriptDetails.find(detail => detail.studentId === student.studentId);
      return { ...student, gpa: details!.gpa, term: details!.term, GraduationStatus: { studentId: student.studentId, status: student.GraduationStatus!.status } };
    });
    return returnStudents;
  };

  const sortStudents = async (students : StudentWithGpaAndTerm[]) => {
    // Sort students by gpo
    /**
     * For two equal gpa, the number of terms is considered. 
     * The one with lower term is bigger.
     */
    const sortedStudentsByGpa = students.sort((a, b) => {
      if (b.gpa === a.gpa) {
        return a.term - b.term;
      }
      return b.gpa - a.gpa;
    });

    // Sort students by term
    /**
     * The ones with a term of 8 and less than 8 are ranked in the same category. 
     * Those with more than 8 are left behind in the ranking
     */
    const sortedStudentsByTerm = sortedStudentsByGpa.sort((a, b) => {
      if (a.term <= 8 && b.term <= 8) {
        return 1;
      } else if (a.term <= 8) {
        return -1;
      } else if (b.term <= 8) {
        return 1;
      }
      return a.term - b.term;
    });

    // Sort students by graduation status
    /**
     * The ones with a graduation status of COMPLETED are ranked first.
     * The ones with a graduation status of FACULTY_SECRETARIAT_APPROVAL are ranked second.
     * The ones with a graduation status of DEPARTMENT_SECRETARIAT_APPROVAL are ranked third.
     * The ones with a graduation status of ADVISOR_APPROVAL are ranked fourth.
     * The ones with a graduation status of SYSTEM_APPROVAL are ranked fifth.
     */
    const graduationStatusOrder = [
      'COMPLETED',
      'FACULTY_SECRETARIAT_APPROVAL',
      'DEPARTMENT_SECRETARIAT_APPROVAL',
      'ADVISOR_APPROVAL',
      'SYSTEM_APPROVAL'
    ];

    const sortedStudentsByGraduationStatus = sortedStudentsByTerm.sort((a, b) => {
      return graduationStatusOrder.indexOf(a.GraduationStatus!.status) - graduationStatusOrder.indexOf(b.GraduationStatus!.status);
    });

    return sortedStudentsByGraduationStatus;
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
    const sortedStudents = await sortStudents(studentsData);

    return NextResponse.json(sortedStudents.slice(0, 3), { status: 200 });

  }else if (role === 'faculty secretariat') {
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
    const sortedStudents = await sortStudents(studentsData);

    return NextResponse.json(sortedStudents.slice(0, 3), { status: 200 });
  }else if (role === 'student affairs') {
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
    const sortedStudents = await sortStudents(studentsData);

    return NextResponse.json(sortedStudents.slice(0, 3), { status: 200 });
  }

  return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
}
