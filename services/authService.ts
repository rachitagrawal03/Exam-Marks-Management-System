import type { Teacher } from '../types';
import { api } from './api';

export const authService = {
  /**
   * Logs in a teacher by calling the backend API.
   * @param id The teacher's ID.
   * @param pass The teacher's password.
   * @returns A promise that resolves with the Teacher object if successful.
   */
  login: async (id: string, pass: string): Promise<Teacher> => {
    // The payload keys must match what the backend 'validateTeacher' function expects.
    // The teacher ID is passed as a string to ensure that IDs with leading zeros (e.g., '003')
    // are handled correctly as text, preventing any potential type coercion.
    const responseData = await api.post('validateTeacher', { teacherId: id, password: pass });

    // FIX: Ensure the response matches the frontend's data model.
    // The backend might send 'grade' in assignments, but the frontend expects 'class'.
    // This mapping ensures consistency within the frontend application.
    if (responseData.assignments && Array.isArray(responseData.assignments)) {
        responseData.assignments = responseData.assignments.map((assignment: any) => ({
            class: assignment.class || assignment.grade, // Handle both 'class' and 'grade' from backend
            section: assignment.section,
            subject: assignment.subject,
        }));
    }
    
    return responseData as Teacher;
  },
};