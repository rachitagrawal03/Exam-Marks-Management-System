// =======================================================================================
// IMPORTANT: PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
// You get this URL after deploying your Code.gs script as a "Web app".
// =======================================================================================
const APPS_SCRIPT_URL = 'PASTE_YOUR_WEB_APP_URL_HERE'; // <-- REPLACE THIS WITH YOUR ACTUAL URL

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
  if (APPS_SCRIPT_URL.includes('PASTE_YOUR_WEB_APP_URL_HERE')) {
      const errorMessage = "CRITICAL: The Google Apps Script URL has not been configured. Please open services/api.ts and replace the placeholder URL.";
      console.error(errorMessage);
      throw new Error(errorMessage);
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      throw new Error(`Network error: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse = await response.json();

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || 'An unknown API error occurred.');
    }
  } catch (error: any) {
    console.error(`API call failed for action "${action}":`, error);
    throw error;
  }
}

export const api = { post };
