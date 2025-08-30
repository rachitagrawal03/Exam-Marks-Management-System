import { useState, useEffect, useCallback, useMemo } from 'react';
import type { StudentMark, ExamDetails } from '../types';
import { studentService } from '../services/studentService';

// FIX: Changed type to Omit<ExamDetails, 'teacherName' | 'teacherId'> to match the updated state type from the useExamDetails hook.
export const useStudentData = (examDetails: Omit<ExamDetails, 'teacherName' | 'teacherId'>) => {
  const [studentMarks, setStudentMarks] = useState<StudentMark[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [studentId: string]: string | undefined }>({});

  const fetchStudents = useCallback(async () => {
    if (examDetails.class && examDetails.section) {
      setIsLoadingStudents(true);
      setStudentMarks([]);
      setValidationErrors({});
      setFilterQuery('');
      try {
        const students = await studentService.getStudents(examDetails.class, examDetails.section);
        setStudentMarks(students.map(s => ({ ...s, marks: '', status: 'Present', remark: '' })));
      } catch (error) {
        console.error("Failed to fetch students:", error);
        // We can expose an error state to the UI if needed
      } finally {
        setIsLoadingStudents(false);
      }
    } else {
      setStudentMarks([]); // Clear students if class/section is deselected
    }
  }, [examDetails.class, examDetails.section]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleMarksChange = (studentId: string, marks: string) => {
    const numericMarks = marks.replace(/[^0-9]/g, '');
    setStudentMarks(prevMarks =>
      prevMarks.map(student =>
        student.id === studentId ? { ...student, marks: numericMarks } : student
      )
    );
    
    const max = Number(examDetails.maximumMarks);
    if (isNaN(max)) return; // Don't validate if max marks isn't set yet

    const num = Number(numericMarks);
    if (numericMarks !== '' && (num < 0 || num > max)) {
      setValidationErrors(prev => ({ ...prev, [studentId]: `Marks must be between 0 and ${max}.` }));
    } else {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[studentId];
        return newErrors;
      });
    }
  };

  const handleStatusChange = (studentId: string) => {
    setStudentMarks(prevMarks =>
      prevMarks.map(student => {
        if (student.id === studentId) {
          const newStatus = student.status === 'Present' ? 'Absent' : 'Present';
          return {
            ...student,
            status: newStatus,
            marks: newStatus === 'Absent' ? '0' : '',
          };
        }
        return student;
      })
    );
    // Clear validation error for this student when status changes
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[studentId];
      return newErrors;
    });
  };
  
  const handleRemarkChange = (studentId: string, remark: string) => {
    setStudentMarks(prevMarks =>
      prevMarks.map(student =>
        student.id === studentId ? { ...student, remark } : student
      )
    );
  };

  const filteredStudents = useMemo(() => {
    if (!filterQuery) {
      return studentMarks;
    }
    const lowercasedQuery = filterQuery.toLowerCase();
    return studentMarks.filter(student =>
      student.name.toLowerCase().includes(lowercasedQuery) ||
      student.studentId.toLowerCase().includes(lowercasedQuery)
    );
  }, [studentMarks, filterQuery]);

  const hasValidationErrors = useMemo(() => Object.values(validationErrors).some(e => !!e), [validationErrors]);

  const resetStudentData = () => {
    setStudentMarks([]);
    setValidationErrors({});
    setFilterQuery('');
  };

  return {
    studentMarks,
    isLoadingStudents,
    filterQuery,
    setFilterQuery,
    filteredStudents,
    handleMarksChange,
    handleStatusChange,
    handleRemarkChange,
    validationErrors,
    setValidationErrors,
    hasValidationErrors,
    resetStudentData,
  };
};