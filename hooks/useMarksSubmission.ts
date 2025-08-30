import { useState } from 'react';
import type { Teacher, StudentMark, ExamDetails } from '../types';
import { marksService } from '../services/marksService';

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

interface UseMarksSubmissionProps {
  examDetails: Omit<ExamDetails, 'teacherName' | 'teacherId'>;
  studentMarks: StudentMark[];
  teacher: Teacher;
  areDetailsComplete: boolean;
  hasValidationErrors: boolean;
  setValidationErrors: React.Dispatch<React.SetStateAction<{ [studentId: string]: string | undefined }>>;
  onSuccess: () => void;
}

export const useMarksSubmission = ({
  examDetails,
  studentMarks,
  teacher,
  areDetailsComplete,
  hasValidationErrors,
  setValidationErrors,
  onSuccess,
}: UseMarksSubmissionProps) => {
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [studentId: string]: string } = {};
    let isAllValid = true;
    const max = Number(examDetails.maximumMarks);

    studentMarks.forEach(student => {
      if (student.status === 'Present') {
        const marks = student.marks;
        if (marks.trim() === '') {
          newErrors[student.id] = 'Marks are required.';
          isAllValid = false;
        } else {
          const num = Number(marks);
          if (isNaN(num) || num < 0 || (!isNaN(max) && num > max)) {
            newErrors[student.id] = `Must be between 0 and ${max}.`;
            isAllValid = false;
          }
        }
      }
    });

    setValidationErrors(newErrors);
    if (!isAllValid || !areDetailsComplete || hasValidationErrors) {
      setErrorMessage("Please correct the highlighted errors before submitting.");
      setSubmissionState('error');
      return;
    }

    setSubmissionState('submitting');
    setErrorMessage('');

    // ** CRITICAL FIX **
    // This ensures the teacher's ID and name from the logged-in session
    // are included in the data sent to the backend.
    const finalData: ExamDetails = {
      ...examDetails,
      teacherId: teacher.id,
      teacherName: teacher.name,
    };

    try {
      await marksService.submitMarks(finalData, studentMarks);
      setSuccessMessage("Marks Submitted Successfully!");
      setSubmissionState('success');
      setTimeout(() => {
        onSuccess();
        setSubmissionState('idle');
      }, 3000);
    } catch (error: any) {
      setSubmissionState('error');
      setErrorMessage(error.message || 'An unknown error occurred during submission.');
      console.error("Submission failed:", error);
    }
  };
  
  const resetSubmissionState = () => {
      setSubmissionState('idle');
  };

  return {
    submissionState,
    successMessage,
    errorMessage,
    handleSubmit,
    resetSubmissionState,
  };
};