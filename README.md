# Teacher's Marks Portal - Deployment Guide

This guide explains how to deploy the application, which consists of a React frontend and a Google Apps Script backend that uses your Google Sheet as a database.

---

## Step 1: Google Sheets Setup

Before deploying the script, ensure your Google Sheet is set up correctly.

1.  **`Teachers Info` Sheet**:
    *   This sheet stores teacher credentials and their assignments.
    *   **Crucially, it must not contain any merged cells.** Every row must be a complete record.
    *   Required columns: `Teacher ID`, `Teacher Name`, `Class`, `Section`, `Subject`, `Password`.
    *   For multiple sections or subjects for a single class in one row, use comma-separated values (e.g., `A, B`).

2.  **`Students Info` Sheet**:
    *   This sheet contains the list of all students.
    *   Required columns: `Class`, `Section`, `Student ID`, `Student Name`.

3.  **`Marks` Sheet**:
    *   This sheet will store the submitted marks. You can create it empty.
    *   Required columns (in this order): `Timestamp`, `Exam Type`, `Class`, `Section`, `Student ID`, `Student Name`, and then a column for each subject (e.g., `English`, `Mathematics`).

---

## Step 2: Backend Deployment (`Code.gs`)

The backend logic resides in the `Code.gs` file and acts as the API for your web app.

**Action:**

1.  Open your Google Sheet.
2.  Go to **Extensions > Apps Script**.
3.  If you see a default `Code.gs` file, delete its content.
4.  Copy the **entire contents** from the `Code.gs` file provided in this project and paste it into your script editor.
5.  Deploy the script as a Web App:
    *   Click **Deploy > New deployment**.
    *   Select Type: **Web app**.
    *   For "Execute as," select **Me**.
    *   For "Who has access," select **Anyone**.
    *   Click **Deploy**.
6.  **Important:** Copy the **Web app URL** provided after deployment. You will need it in the next step.

---

## Step 3: Frontend Configuration (`services/api.ts`)

Connect your frontend to your newly deployed backend.

**Action:**

1.  Open the `services/api.ts` file in your project.
2.  Paste the **Web app URL** you copied from Google Apps Script into the `APPS_SCRIPT_URL` constant, replacing the placeholder.

Your application is now fully configured and ready.