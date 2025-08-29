// =======================================================================================
//
//                              !!! CRITICAL ACTION REQUIRED !!!
//
// =======================================================================================
//
// 1. DEPLOY YOUR GOOGLE APPS SCRIPT
//    - Open your Google Apps Script project.
//    - Click "Deploy" > "New deployment".
//    - Select "Web app" as the type.
//    - Set "Who has access" to "Anyone".
//    - Click "Deploy".
//
// 2. COPY THE WEB APP URL
//    - After deploying, a URL will be provided. Copy it.
//
// 3. PASTE THE URL BELOW
//    - Replace the placeholder text '!!!_PASTE_YOUR_URL_HERE_!!!' with the URL you just copied.
//
// =======================================================================================

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby6xFk3UQEpatlfScKdEyb4VXEdVqBh-UWbdzne6oV8-v_--yUR1375KyUnk5UAtb0v/exec'; // <-- PASTE YOUR URL HERE

// =======================================================================================


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
  if (APPS_SCRIPT_URL.includes('!!!_PASTE_YOUR_URL_HERE_!!!')) {
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
