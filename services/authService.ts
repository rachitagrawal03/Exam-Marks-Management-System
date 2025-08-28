import type { Teacher } from '../types';
import { api } from './api';

export const authService = {
  /**
   * Logs in a teacher by calling the backend API.
   * @param id The teacher's ID.
   * @param pass The teacher's password.
   * @returns A promise that resolves with the Teacher object if successful.
   */
  login: (id: string, pass: string): Promise<Teacher> => {
    // The payload keys must match what the backend 'validateTeacher' function expects.
    return api.post('validateTeacher', { teacherId: id, password: pass });
  },
};
