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
    // Destructure all necessary details, including the subject.
    const { examType, class: grade, section, subject } = details;

    // The backend expects a simple array of objects.
    const marksData = marks.map(student => ({
      rollNumber: student.rollNumber,
      name: student.name,
      marks: student.marks,
    }));

    // CRITICAL FIX: Add the 'subject' to the payload so the backend knows
    // which subject these marks are for.
    return api.post('submitExamMarks', { examType, grade, section, subject, marksData });
  },
};