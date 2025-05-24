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

  const graduationStatusOrder = [
    'COMPLETED',
    'FACULTY_SECRETARIAT_APPROVAL',
    'DEPARTMENT_SECRETARIAT_APPROVAL',
    'ADVISOR_APPROVAL',
    'SYSTEM_APPROVAL'
  ];

  const compareStudentsForFinalRanking = (a: StudentWithGpaAndTerm, b: StudentWithGpaAndTerm): number => {
    // 1. Compare by Graduation Status
    const statusA = graduationStatusOrder.indexOf(a.GraduationStatus.status);
    const statusB = graduationStatusOrder.indexOf(b.GraduationStatus.status);
    if (statusA !== statusB) {
      return statusA - statusB; // Lower index (better status) comes first
    }

    // Statuses are equal, compare by Term logic
    // term <= 8 is one category, term > 8 is another. term <= 8 is better.
    const termCategoryA = a.term <= 8 ? 1 : 2;
    const termCategoryB = b.term <= 8 ? 1 : 2;

    if (termCategoryA !== termCategoryB) {
      return termCategoryA - termCategoryB; // Category 1 (term <= 8) comes before Category 2 (term > 8)
    }

    // If both are in Category 2 (term > 8), lower term is better
    if (termCategoryA === 2) { // (implies termCategoryB is also 2)
      if (a.term !== b.term) {
        return a.term - b.term; // Lower term comes first
      }
    }
    // If both are in Category 1 (term <= 8), or both in Category 2 with the same term,
    // their relative order is determined by GPA logic.

    // Compare by GPA: Higher GPA is better
    if (a.gpa !== b.gpa) {
      return b.gpa - a.gpa; // Higher GPA comes first (b - a for descending)
    }

    // GPAs are equal, compare by term (as a tie-breaker for GPA): Lower term is better
    if (a.term !== b.term) {
      return a.term - b.term; // Lower term comes first
    }

    return 0; // Students are equivalent for ranking
  };

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
      // Ensure GraduationStatus and its status property are not null before accessing
      const status = student.GraduationStatus ? student.GraduationStatus.status : 'SYSTEM_APPROVAL'; // Default or handle as error
      const studentIdForGradStatus = student.GraduationStatus ? student.GraduationStatus.studentId : student.studentId;

      return { 
        ...student, 
        gpa: details!.gpa, 
        term: details!.term, 
        GraduationStatus: { studentId: studentIdForGradStatus, status: status } 
      };
    });
    return returnStudents;
  };

  const sortStudents = async (studentsToSort : StudentWithGpaAndTerm[]) => {
    // The sort function should align with compareStudentsForFinalRanking
    // For simplicity, we'll use the compareStudentsForFinalRanking directly.
    // Create a mutable copy for sorting
    const mutableStudents = [...studentsToSort];
    mutableStudents.sort(compareStudentsForFinalRanking);
    return mutableStudents;
  };

  const getTopThreeWithTies = (sortedStudents: StudentWithGpaAndTerm[]): StudentWithGpaAndTerm[] => {
    if (sortedStudents.length === 0) {
      return [];
    }
    if (sortedStudents.length <= 3) {
      return sortedStudents;
    }

    const thirdRankDefiningStudent = sortedStudents[2];
    const topStudentsResult = [];
    for (const student of sortedStudents) {
      // Include student if they are better than or equal to the 3rd rank defining student
      if (compareStudentsForFinalRanking(student, thirdRankDefiningStudent) <= 0) {
        topStudentsResult.push(student);
      } else {
        // Students are sorted, so once we find one worse than the 3rd, the rest will also be worse
        break;
      }
    }
    return topStudentsResult;
  };

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
    const topThreeStudents = getTopThreeWithTies(sortedStudents);

    return NextResponse.json(topThreeStudents, { status: 200 });

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
    const topThreeStudents = getTopThreeWithTies(sortedStudents);

    return NextResponse.json(topThreeStudents, { status: 200 });
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
    const topThreeStudents = getTopThreeWithTies(sortedStudents);

    return NextResponse.json(topThreeStudents, { status: 200 });
  }

  return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
}
