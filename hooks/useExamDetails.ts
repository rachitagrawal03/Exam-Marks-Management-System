import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Teacher, Assignment, ExamDetails } from '../types';

export const useExamDetails = (teacherAssignments: Assignment[]) => {
  const [examDetails, setExamDetails] = useState<Omit<ExamDetails, 'teacherName'>>({
    examType: '',
    class: '',
    section: '',
    subject: '',
    examDate: '',
    maximumMarks: '',
  });

  const availableClasses: string[] = useMemo(() => [...new Set(teacherAssignments.map(a => a.class))].sort((a, b) => parseInt(a) - parseInt(b)), [teacherAssignments]);

  const availableSections: string[] = useMemo(() => {
    if (!examDetails.class) return [];
    return [...new Set(teacherAssignments.filter(a => a.class === examDetails.class).map(a => a.section))].sort();
  }, [teacherAssignments, examDetails.class]);

  const availableSubjects: string[] = useMemo(() => {
    if (!examDetails.class || !examDetails.section) return [];
    return [...new Set(teacherAssignments
      .filter(a => a.class === examDetails.class && a.section === examDetails.section)
      .map(a => a.subject))];
  }, [teacherAssignments, examDetails.class, examDetails.section]);

  // Effect to auto-populate maximum marks based on exam type.
  useEffect(() => {
    let maxMarks = '';
    switch (examDetails.examType) {
      case 'CT1':
      case 'CT2':
        maxMarks = '15';
        break;
      case 'UT':
        maxMarks = '20';
        break;
      case 'Half Yearly':
        maxMarks = '80';
        break;
      case 'Final Exam':
        maxMarks = '100';
        break;
      default:
        maxMarks = '';
    }
    setExamDetails(prev => ({ ...prev, maximumMarks: maxMarks }));
  }, [examDetails.examType]);

  // Effect to auto-select section if only one is available for the chosen class.
  useEffect(() => {
    if (examDetails.class && availableSections.length === 1) {
      const singleSection = availableSections[0];
      if (examDetails.section !== singleSection) {
        setExamDetails(prev => ({ ...prev, section: singleSection, subject: '' }));
      }
    }
  }, [examDetails.class, examDetails.section, availableSections]);

  // Effect to auto-select subject if only one is available for the chosen class and section.
  useEffect(() => {
      if (examDetails.section && availableSubjects.length === 1) {
          const singleSubject = availableSubjects[0];
          if (examDetails.subject !== singleSubject) {
              setExamDetails(prev => ({ ...prev, subject: singleSubject }));
          }
      }
  }, [examDetails.section, examDetails.subject, availableSubjects]);

  const handleDetailChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setExamDetails(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'class') {
        newState.section = '';
        newState.subject = '';
      }
      if (name === 'section') {
        newState.subject = '';
      }
      if (name === 'examType') {
        newState.maximumMarks = ''; // Let the effect handle setting the new max marks
      }
      return newState;
    });
  };

  const areDetailsComplete = Object.values(examDetails).every(val => val !== '');

  const resetExamDetails = () => {
    setExamDetails({ examType: '', class: '', section: '', subject: '', examDate: '', maximumMarks: '' });
  };

  return {
    examDetails,
    handleDetailChange,
    areDetailsComplete,
    availableClasses,
    availableSections,
    availableSubjects,
    resetExamDetails,
  };
};