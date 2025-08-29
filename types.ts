
export interface Assignment {
  class: string;
  section: string;
  subject: string;
}

export interface Teacher {
  id: string;
  name: string;
  assignments: Assignment[];
}

export interface Student {
  id: string; // Internal React key
  studentId: string; // The actual, unique student identifier
  name: string;
}

export interface StudentMark extends Student {
  marks: string; // Use string to allow empty input
  status: 'Present' | 'Absent';
}

export interface ExamDetails {
  examType: string;
  class: string;
  section: string;
  subject: string;
  examDate: string;
  teacherName: string;
  maximumMarks: string;
}