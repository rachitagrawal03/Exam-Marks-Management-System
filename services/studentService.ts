import type { Student } from '../types';

// Let TypeScript know that the `google` object from Google Apps Script is available.
declare const google: any;

// MOCK DATA for local development
const MOCK_STUDENTS: { [key: string]: Student[] } = {
  '9-A': [
    { id: 's001', rollNumber: 1, name: 'Alice Johnson' },
    { id: 's002', rollNumber: 2, name: 'Bob Williams' },
    { id: 's003', rollNumber: 3, name: 'Charlie Brown' },
    { id: 's004', rollNumber: 4, name: 'Diana Miller' },
    { id: 's005', rollNumber: 5, name: 'Ethan Davis' },
  ],
  '9-B': [
    { id: 's006', rollNumber: 1, name: 'Fiona Garcia' },
    { id: 's007', rollNumber: 2, name: 'George Rodriguez' },
    { id: 's008', rollNumber: 3, name: 'Hannah Martinez' },
  ],
  '10-A': [
    { id: 's009', rollNumber: 1, name: 'Ivy Hernandez' },
    { id: 's010', rollNumber: 2, name: 'Jack Lopez' },
    { id: 's011', rollNumber: 3, name: 'Karen Gonzalez' },
    { id: 's012', rollNumber: 4, name: 'Leo Wilson' },
  ],
  '8-A': [
    { id: 's013', rollNumber: 1, name: 'Mia Anderson' },
    { id: 's014', rollNumber: 2, name: 'Noah Thomas' },
  ],
  '8-B': [
    { id: 's015', rollNumber: 1, name: 'Olivia Jackson' },
    { id: 's016', rollNumber: 2, name: 'Peter White' },
    { id: 's017', rollNumber: 3, name: 'Quinn Harris' },
  ],
  '8-C': [], // Example of an empty class
};

const mockGetStudents = (className: string, section: string): Promise<Student[]> => {
    return new Promise((resolve) => {
        console.warn('[studentService] Running in MOCK mode. No real API call was made.');
        setTimeout(() => {
            const key = `${className}-${section}`;
            const students = MOCK_STUDENTS[key] || [];
            console.log(`[studentService] Mock fetch for class ${key} returned ${students.length} students.`);
            resolve(students);
        }, 500); // Simulate network delay
    });
};

const liveGetStudents = (className: string, section: string): Promise<Student[]> => {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((students: Student[] | null) => {
          // Ensure we always resolve with an array, even if the backend returns null.
          resolve(students || []);
        })
        .withFailureHandler((error: Error) => {
          console.error('Failed to fetch students:', error);
          reject(new Error(`Failed to fetch student list: ${error.message}`));
        })
        .getStudents(className, section);
    });
};

export const studentService = {
  getStudents: (className: string, section: string): Promise<Student[]> => {
    if (!className || !section) {
        return Promise.resolve([]);
    }
    // Check if running in a local environment vs. Google Apps Script
    if (typeof google === 'undefined' || typeof google.script === 'undefined') {
        return mockGetStudents(className, section);
    }
    return liveGetStudents(className, section);
  },
};
