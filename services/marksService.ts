import type { ExamDetails, StudentMark } from '../types';

// Let TypeScript know that the `google` object from Google Apps Script is available.
declare const google: any;

const mockSubmitMarks = (details: ExamDetails, marks: StudentMark[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        console.warn('[marksService] Running in MOCK mode. No real API call was made.');
        console.log('[marksService] Mock submitting data:', { details, marks });
        setTimeout(() => {
            // Simulate a potential random failure for testing purposes
            if (Math.random() > 0.95) { // 5% chance of failure
                console.error('[marksService] Mock submission failed!');
                reject(new Error("A random mock error occurred. Please try again."));
            } else {
                console.log('[marksService] Mock submission successful!');
                resolve();
            }
        }, 1500); // Simulate network delay
    });
};

const liveSubmitMarks = (details: ExamDetails, marks: StudentMark[]): Promise<void> => {
    return new Promise((resolve, reject) => {
      const { examType, class: grade, section } = details;

      const marksData = marks.map(student => ({
        rollNumber: student.rollNumber,
        name: student.name,
        marks: student.marks,
      }));

      google.script.run
        .withSuccessHandler(() => {
          resolve();
        })
        .withFailureHandler((error: Error) => {
          console.error('Marks submission failed:', error);
          reject(new Error(`Marks submission failed: ${error.message}`));
        })
        .submitExamMarks(examType, grade, section, marksData);
    });
};

export const marksService = {
  submitMarks: (details: ExamDetails, marks: StudentMark[]): Promise<void> => {
    // Check if running in a local environment vs. Google Apps Script
    if (typeof google === 'undefined' || typeof google.script === 'undefined') {
        return mockSubmitMarks(details, marks);
    }
    return liveSubmitMarks(details, marks);
  },
};
