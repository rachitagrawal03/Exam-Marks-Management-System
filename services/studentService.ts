import type { Student } from '../types';
import { api } from './api';

export const studentService = {
  /**
   * Fetches the list of students for a given class and section from the backend.
   * @param className The class (e.g., '9').
   * @param section The section (e.g., 'A').
   * @returns A promise that resolves with an array of Student objects.
   */
  getStudents: (className: string, section: string): Promise<Student[]> => {
    if (!className || !section) {
      return Promise.resolve([]);
    }
    // The backend API now expects 'class', aligning with the frontend model.
    return api.post('getStudents', { class: className, section });
  },
};