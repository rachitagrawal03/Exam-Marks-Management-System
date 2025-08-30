import type { ExamDetails, StudentMark } from '../types';
import { api } from './api';

export const marksService = {
  /**
   * Submits student marks to the backend.
   * @param details The details of the exam.
   * @param marks The list of students and their marks.
   * @returns A promise that resolves when the submission is successful.
   */
  submitMarks: (details: ExamDetails, marks: StudentMark[]): Promise<void> => {
    // Destructure details. The 'class' property is passed directly to the backend.
    const { examType, class: className, section, subject, examDate, maximumMarks, teacherId } = details;

    // The backend expects a simple array of objects with the new studentId and status fields.
    const marksData = marks.map(student => ({
      studentId: student.studentId,
      name: student.name,
      marks: student.marks,
      status: student.status,
      remark: student.remark,
    }));

    // Reformat date from YYYY-MM-DD to MM/DD/YYYY for submission.
    let formattedDate = examDate;
    if (examDate && /^\d{4}-\d{2}-\d{2}$/.test(examDate)) {
        const [year, month, day] = examDate.split('-');
        formattedDate = `${month}/${day}/${year}`;
    }

    // Send the payload with 'class' as the key.
    return api.post('submitExamMarks', { teacherId, examType, class: className, section, subject, examDate: formattedDate, maximumMarks, marksData });
  },
};
