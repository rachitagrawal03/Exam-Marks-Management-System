import type { Student } from '../types';
import { api } from './api';

export const studentService = {
  /**
   * Fetches the list of students for a given class and section from the backend.
   * @param className The class name (e.g., '9').
   * @param section The section (e.g., 'A').
   * @returns A promise that resolves with an array of Student objects.
   */
  getStudents: (className: string, section: string): Promise<Student[]> => {
    if (!className || !section) {
      return Promise.resolve([]);
    }
    // The payload keys must match what the backend 'getStudents' function expects.
    return api.post('getStudents', { grade: className, section });
  },
};
