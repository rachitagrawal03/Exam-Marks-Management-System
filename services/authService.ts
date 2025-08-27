import type { Teacher } from '../types';

// Let TypeScript know that the `google` object from Google Apps Script is available.
declare const google: any;

// MOCK DATA for local development
const MOCK_TEACHERS: { [id: string]: Teacher } = {
  teacher01: {
    id: 'teacher01',
    name: 'Mr. John Doe (Demo)',
    assignments: [
      { class: '9', section: 'A', subject: 'Mathematics' },
      { class: '9', section: 'B', subject: 'Mathematics' },
    ],
  },
  teacher02: {
    id: 'teacher02',
    name: 'Ms. Jane Smith (Demo)',
    assignments: [{ class: '10', section: 'A', subject: 'Science' }],
  },
  teacher03: {
    id: 'teacher03',
    name: 'Mrs. Emily Jones (Demo)',
    assignments: [
      { class: '8', section: 'A', subject: 'English' },
      { class: '8', section: 'B', subject: 'English' },
    ],
  },
};

const mockLogin = (id: string, pass: string): Promise<Teacher> => {
  return new Promise((resolve, reject) => {
    console.warn('[authService] Running in MOCK mode. No real API call was made.');
    setTimeout(() => {
      if (pass === 'password123' && MOCK_TEACHERS[id]) {
        console.log(`[authService] Mock login successful for ${id}`);
        resolve(MOCK_TEACHERS[id]);
      } else {
        console.error(`[authService] Mock login failed for ${id}`);
        reject(new Error('Invalid credentials. Please use a demo ID and the password "password123".'));
      }
    }, 1000); // Simulate network delay
  });
};

const liveLogin = (id: string, pass: string): Promise<Teacher> => {
  return new Promise((resolve, reject) => {
    try {
      // This check is safe because we've already confirmed `google` exists.
      if (!google.script || !google.script.run) {
        throw new Error("Google Apps Script API is not available. This app must be run within a Google Apps Script environment.");
      }

      console.log(`[authService] Calling validateTeacher for ID: ${id}`);

      google.script.run
        .withSuccessHandler((data: any) => {
          console.log('[authService] successHandler received:', data);
          try {
            const result = typeof data === 'string' ? JSON.parse(data) : data;

            if (result && result.id) {
              console.log('[authService] Login successful for teacher:', result.name);
              resolve(result as Teacher);
            } else if (result && result.error) {
              console.error('[authService] Login failed with backend error:', result.error);
              reject(new Error(result.error));
            } else {
              console.warn('[authService] Login failed: Invalid credentials or unexpected response.', result);
              reject(new Error('Invalid credentials. Please try again.'));
            }
          } catch (e: any) {
            console.error('[authService] Error parsing success handler response:', e);
            console.error('[authService] Raw response was:', data);
            reject(new Error('Failed to process the server\'s response.'));
          }
        })
        .withFailureHandler((error: Error) => {
          console.error('[authService] failureHandler received:', error);
          let friendlyMessage = 'An unexpected error occurred on the server. Please try again.';
          if (error && error.message) {
               friendlyMessage = `Server error: ${error.message}`;
          }
          reject(new Error(friendlyMessage));
        })
        .validateTeacher(id, pass);
    } catch (e: any) {
      console.error("[authService] A critical error occurred before calling the backend:", e);
      reject(new Error("A critical error occurred while trying to contact the server."));
    }
  });
};

export const authService = {
  login: (id: string, pass: string): Promise<Teacher> => {
    // Check if running in a local environment vs. Google Apps Script
    if (typeof google === 'undefined' || typeof google.script === 'undefined') {
      return mockLogin(id, pass);
    }
    return liveLogin(id, pass);
  },
};
