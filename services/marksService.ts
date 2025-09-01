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

    // The date from the HTML input is expected to be in YYYY-MM-DD format.
    // To ensure complete consistency and avoid any ambiguity, we explicitly
    // parse and re-format it to the universal YYYY-MM-DD standard before sending.
    // This guarantees that Google Sheets will interpret the date correctly,
    // regardless of any regional settings in the browser or the sheet itself.
    let formattedDate = examDate; // Default to the original value
    try {
      if (examDate) {
        // The input value (e.g., '2025-10-03') is parsed as UTC midnight.
        // To avoid timezone issues where it might shift to the previous day,
        // we add the timezone offset to treat it as a local date.
        const dateObj = new Date(examDate);
        const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
        const localDate = new Date(dateObj.getTime() + userTimezoneOffset);
        
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, '0');
        const day = String(localDate.getDate()).padStart(2, '0');
        
        formattedDate = `${year}-${month}-${day}`;
      }
    } catch (e) {
      console.error("Could not re-format date, sending original value:", examDate);
    }


    // Send the payload with 'class' as the key.
    return api.post('submitExamMarks', { teacherId, examType, class: className, section, subject, examDate: formattedDate, maximumMarks, marksData });
  },
};