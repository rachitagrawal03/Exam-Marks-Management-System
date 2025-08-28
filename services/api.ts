// IMPORTANT: Replace this placeholder with your actual Google Apps Script Web App URL from Step 2 of the README.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6xFk3UQEpatlfScKdEyb4VXEdVqBh-UWbdzne6oV8-v_--yUR1375KyUnk5UAtb0v/exec';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * A centralized function for making POST requests to the Google Apps Script backend.
 * @param action The name of the backend function to call (e.g., 'validateTeacher').
 * @param payload The data to send to the function.
 * @returns The data from the successful response.
 * @throws An error if the API call fails or the backend returns an error.
 */
async function post(action: string, payload: object): Promise<any> {
  if (APPS_SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT')) {
      const errorMessage = "The Google Apps Script URL has not been configured. Please update it in services/api.ts.";
      console.error(errorMessage);
      // Removed the alert to prevent blocking UI during development.
      throw new Error(errorMessage);
  }

  try {
    // We use 'text/plain' for the Content-Type to avoid a CORS preflight request,
    // which Google Apps Script web apps can't handle for POST requests.
    // The backend's doPost(e) function will parse e.postData.contents as a JSON string.
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action, payload }),
      // mode: 'no-cors' is not needed and will break the ability to read the response.
    });

    if (!response.ok) {
      throw new Error(`Network error: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse = await response.json();

    if (result.success) {
      return result.data;
    } else {
      // If the backend sends a specific error message, use it.
      throw new Error(result.error || 'An unknown API error occurred.');
    }
  } catch (error: any) {
    console.error(`API call failed for action "${action}":`, error);
    // Re-throw the error so the calling service and UI can handle it.
    throw error;
  }
}

export const api = { post };
