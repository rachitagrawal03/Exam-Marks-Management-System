
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
  id: string;
  rollNumber: number;
  name: string;
}

export interface StudentMark extends Student {
  marks: string; // Use string to allow empty input
}

export interface ExamDetails {
  examType: string;
  class: string;
  section: string;
  subject: string;
  teacherName: string;
}