

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Teacher, StudentMark, ExamDetails } from '../types';
import { studentService } from '../services/studentService';
import { marksService } from '../services/marksService';
import Spinner from './common/Spinner';
import SuccessModal from './common/SuccessModal';

const EXAM_TYPES = ['CT1', 'CT2', 'Half Yearly', 'Final Exam'];

// FIX: Define props interface for MarksEntryForm component.
interface MarksEntryFormProps {
  teacher: Teacher;
  onLogout: () => void;
}

const MarksEntryForm: React.FC<MarksEntryFormProps> = ({ teacher, onLogout }) => {
  const [examDetails, setExamDetails] = useState<Omit<ExamDetails, 'teacherName'>>({
    examType: '',
    class: '',
    section: '',
    subject: '',
  });
  const [studentMarks, setStudentMarks] = useState<StudentMark[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [submissionState, setSubmissionState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [studentId: string]: string | undefined }>({});

  // Memoize derived lists from teacher assignments
  // FIX: Explicitly type useMemo to ensure correct type inference for availableClasses. This resolves errors with parseInt and passing this array to renderSelect.
  const availableClasses: string[] = useMemo(() => [...new Set(teacher.assignments.map(a => a.class))].sort((a, b) => parseInt(a) - parseInt(b)), [teacher.assignments]);
  // FIX: Explicitly type useMemo to ensure correct type inference for availableSubjects. This resolves errors in useEffect, resetForm, and passing this array to renderSelect.
  const availableSubjects: string[] = useMemo(() => [...new Set(teacher.assignments.map(a => a.subject))], [teacher.assignments]);
  // FIX: Explicitly type useMemo to ensure correct type inference for availableSections. This resolves errors with passing this array to renderSelect.
  const availableSections: string[] = useMemo(() => {
    if (!examDetails.class) return [];
    return [...new Set(teacher.assignments.filter(a => a.class === examDetails.class).map(a => a.section))].sort();
  }, [teacher.assignments, examDetails.class]);

  // Effect to handle auto-selection and resets
   useEffect(() => {
    // If there's only one subject, auto-select it.
    if (availableSubjects.length === 1) {
      setExamDetails(prev => ({ ...prev, subject: availableSubjects[0] }));
    }
  }, [availableSubjects]);

  const handleDetailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExamDetails(prev => {
        const newState = { ...prev, [name]: value };
        // If class is changed, reset section as the old one might be invalid
        if (name === 'class') {
            newState.section = '';
        }
        return newState;
    });
    setSubmissionState('idle');
  };
  
  const fetchStudents = useCallback(async () => {
    if (examDetails.class && examDetails.section) {
      setIsLoadingStudents(true);
      setStudentMarks([]);
      setValidationErrors({});
      try {
        const students = await studentService.getStudents(examDetails.class, examDetails.section);
        setStudentMarks(students.map(s => ({ ...s, marks: '' })));
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setIsLoadingStudents(false);
      }
    }
  }, [examDetails.class, examDetails.section]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleMarksChange = (studentId: string, marks: string) => {
    // Prevent non-numeric characters from being entered
    const numericMarks = marks.replace(/[^0-9]/g, '');

    setStudentMarks(prevMarks =>
      prevMarks.map(student =>
        student.id === studentId ? { ...student, marks: numericMarks } : student
      )
    );

    // Live validation for out-of-range numbers
    const num = Number(numericMarks);
    if (numericMarks !== '' && (num < 0 || num > 100)) {
        setValidationErrors(prev => ({ ...prev, [studentId]: 'Marks must be between 0 and 100.' }));
    } else {
        // Clear error if it becomes valid or empty
        setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[studentId];
            return newErrors;
        });
    }
  };
  
  const areDetailsComplete = Object.values(examDetails).every(val => val !== '');
  const hasValidationErrors = useMemo(() => Object.values(validationErrors).some(e => !!e), [validationErrors]);


  const resetForm = () => {
     setExamDetails({ examType: '', class: '', section: '', subject: availableSubjects.length === 1 ? availableSubjects[0] : '' });
     setStudentMarks([]);
     setValidationErrors({});
     setSubmissionState('idle');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Perform a full validation on all fields upon submission
    const newErrors: { [studentId: string]: string } = {};
    let isAllValid = true;
    studentMarks.forEach(student => {
        const marks = student.marks;
        if (marks.trim() === '') {
            newErrors[student.id] = 'Marks are required.';
            isAllValid = false;
        } else {
            const num = Number(marks);
            if (isNaN(num) || num < 0 || num > 100) {
                newErrors[student.id] = 'Must be between 0 and 100.';
                isAllValid = false;
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
    
    const finalData: ExamDetails = {
        ...examDetails,
        teacherName: teacher.name,
    };
    try {
        await marksService.submitMarks(finalData, studentMarks);
        setSuccessMessage("Marks Submitted Successfully!");
        setSubmissionState('success');
        setTimeout(() => {
            resetForm();
        }, 3000);
    } catch (error: any) {
        setSubmissionState('error');
        setErrorMessage(error.message || 'An unknown error occurred during submission.');
        console.error("Submission failed:", error);
    }
  };

  const renderSelect = (name: string, label: string, options: string[], value: string) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <select
                id={name}
                name={name}
                value={value}
                onChange={handleDetailChange}
                className="w-full appearance-none bg-white px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                required
                disabled={name === 'subject' && availableSubjects.length === 1}
            >
                <option value="" disabled>Select {label}</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    </div>
  );
  
  if (submissionState === 'submitting') {
    return (
        <div className="fixed inset-0 bg-blue-600 bg-opacity-90 flex flex-col items-center justify-center z-50 text-white transition-opacity duration-300">
            <Spinner className="w-16 h-16" />
            <h2 className="text-3xl font-bold mt-6 animate-pulse">Submitting Marks...</h2>
            <p className="text-lg mt-2">Please wait a moment.</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <SuccessModal
        show={submissionState === 'success'}
        message={successMessage}
        subMessage={`Student ${examDetails.subject} marks have been submitted.`}
      />
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
             <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Marks Entry Portal</h1>
             <p className="text-gray-600">Welcome, {teacher.name}</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center gap-2"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            <span>Logout</span>
          </button>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} noValidate>
            <fieldset disabled={submissionState !== 'idle'}>
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-3 mb-6">Exam Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {renderSelect('examType', 'Exam Type', EXAM_TYPES, examDetails.examType)}
                    {renderSelect('class', 'Class', availableClasses, examDetails.class)}
                    {renderSelect('section', 'Section', availableSections, examDetails.section)}
                    {renderSelect('subject', 'Subject', availableSubjects, examDetails.subject)}
                </div>

                {isLoadingStudents && (
                     <div className="flex justify-center items-center py-10">
                        <Spinner className="w-8 h-8 text-blue-600" />
                        <p className="ml-3 text-gray-600">Loading students...</p>
                    </div>
                )}
                
                {!isLoadingStudents && studentMarks.length === 0 && (!examDetails.class || !examDetails.section) && (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                         <p className="text-gray-500">Please select a class and section to load the student list.</p>
                    </div>
                )}

                {studentMarks.length > 0 && (
                <>
                    <h2 className="text-xl font-semibold text-gray-700 border-b pb-3 mb-6 mt-8">Student Marks</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No.</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {studentMarks.map((student, index) => {
                                const isInvalid = !!validationErrors[student.id];
                                return (
                                <tr key={student.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.rollNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            value={student.marks}
                                            onChange={(e) => handleMarksChange(student.id, e.target.value)}
                                            className={`w-24 sm:w-28 text-center text-lg font-medium text-gray-700 bg-gray-50 border rounded-lg transition-all duration-200 ease-in-out hover:border-gray-300 focus:bg-white focus:outline-none placeholder-gray-400 ${
                                                isInvalid
                                                ? 'border-red-500 ring-2 ring-red-200 focus:border-red-500'
                                                : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200'
                                            }`}
                                            placeholder="N/A"
                                            required
                                            aria-invalid={isInvalid}
                                            aria-describedby={isInvalid ? `${student.id}-error` : undefined}
                                        />
                                        {isInvalid && <p id={`${student.id}-error`} className="text-red-600 text-xs mt-1">{validationErrors[student.id]}</p>}
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                        </table>
                    </div>
                    <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={!areDetailsComplete || hasValidationErrors || studentMarks.length === 0}
                        className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-300"
                    >
                        Submit All Marks
                    </button>
                    </div>
                    {submissionState === 'error' && (
                         <div className="text-center mt-6 p-4 bg-red-100 text-red-800 border-l-4 border-red-500 rounded-md animate-shake">
                            <p className="font-bold">{errorMessage}</p>
                        </div>
                    )}
                </>
                )}
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MarksEntryForm;