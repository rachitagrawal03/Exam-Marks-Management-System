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
    const { examType, class: className, section, subject } = details;

    // The backend expects a simple array of objects with the new studentId field.
    const marksData = marks.map(student => ({
      studentId: student.studentId,
      name: student.name,
      marks: student.marks,
    }));

    // Send the payload with 'class' as the key.
    return api.post('submitExamMarks', { examType, class: className, section, subject, marksData });
  },
};