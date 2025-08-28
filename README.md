# Teacher's Marks Portal - Web API Deployment Guide

This guide explains how to deploy your application using a modern Web API architecture, which allows your frontend (hosted on Netlify, Vercel, etc.) to communicate with your Google Sheet backend.

## The Architecture

Instead of using the restrictive `google.script.run`, we will turn your Google Apps Script into a standard Web API.

1.  **Backend (Google Apps Script):** Your script will be deployed as a "Web App" that listens for `POST` requests. It will act as a secure API endpoint.
2.  **Frontend (React App):** Your React app will be deployed to a static hosting service like Netlify. It will use standard `fetch` requests to communicate with your backend.

---

## Step 1: Backend Setup (Code.gs)

This is the most critical step. Your `Code.gs` file needs a "router" to handle incoming requests from your frontend.

**Replace the entire contents of your `Code.gs` file with the code below.** Then, paste your existing functions (`validateTeacher`, etc.) into the specified section, making sure they accept a single `payload` object.

```javascript
/**
 * Handles all POST requests from the web app. Acts as a router.
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    
    if (!body.action) {
      throw new Error("API action is missing.");
    }

    // Route the request to the correct function based on the 'action' parameter
    const action = body.action;
    const payload = body.payload;
    let result;

    switch (action) {
      case 'validateTeacher':
        result = validateTeacher(payload);
        break;
      case 'getStudents':
        result = getStudents(payload);
        break;
      case 'submitExamMarks':
        result = submitExamMarks(payload);
        break;
      default:
        throw new Error(`Action "${action}" is not a valid action.`);
    }

    // Return a success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return an error response
    console.error(error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===============================================================
// PASTE YOUR SPREADSHEET FUNCTIONS BELOW
// IMPORTANT: Make sure each function takes a single 'payload' object.
// ===============================================================

function validateTeacher(payload) {
  const { teacherId, password } = payload;
  // Your existing validation logic here...
  // Example: return { id: 'teacher01', name: 'Mr. John Doe', assignments: [...] };
}

function getStudents(payload) {
  const { grade, section } = payload;
  // Your existing logic to get students from the sheet...
  // Example: return [{ id: 's001', rollNumber: 1, name: 'Alice' }];
}

function submitExamMarks(payload) {
  const { examType, grade, section, marksData } = payload;
  // Your existing logic to write marks to the sheet...
  // Example: return 'Success';
}
```

---

## Step 2: Deploy the Backend

1.  Open your Google Apps Script project.
2.  Click **Deploy > New deployment**.
3.  Click the gear icon (⚙️) next to "Select type" and choose **Web app**.
4.  In the dialog:
    *   **Description:** A meaningful description, e.g., "Teacher Portal API v1".
    *   **Execute as:** `Me`
    *   **Who has access:** `Anyone` (This is required for Netlify to be able to access it).
5.  Click **Deploy**.
6.  **Authorize permissions** if prompted.
7.  Copy the **Web app URL**. This is your API endpoint.

---

## Step 3: Configure the Frontend

1.  Open the file `src/services/api.ts` in your React project.
2.  You will see a constant named `APPS_SCRIPT_URL`.
3.  **Paste your Web app URL** from the previous step as the value for this constant.

```typescript
// src/services/api.ts

// IMPORTANT: Replace this placeholder with your actual Google Apps Script Web App URL.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
```

---

## Step 4: Deploy the Frontend

You can now deploy your React application to any static hosting service.

1.  **Build your app:**
    ```bash
    npm run build
    ```
2.  **Deploy to Netlify:**
    *   Drag and drop the `dist` (or `build`) folder into the Netlify deploy UI.
    *   Your site will be live and fully connected to your Google Sheet!
```