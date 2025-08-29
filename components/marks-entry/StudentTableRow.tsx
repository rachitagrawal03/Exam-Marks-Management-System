import React from 'react';
import type { StudentMark } from '../../types';

interface StudentTableRowProps {
  student: StudentMark;
  onMarksChange: (studentId: string, marks: string) => void;
  onStatusChange: (studentId: string) => void;
  validationError: string | undefined;
  isSubmitting: boolean;
}

const StudentTableRow: React.FC<StudentTableRowProps> = ({ student, onMarksChange, onStatusChange, validationError, isSubmitting }) => {
  return (
    <tr className="hover:bg-slate-50 transition-colors duration-200">
      <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-slate-600 font-mono">{student.studentId}</td>
      <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-slate-800 font-medium">{student.name}</td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center space-x-2.5">
          <span className={`font-medium text-xs ${student.status === 'Absent' ? 'text-slate-700' : 'text-slate-400'}`}>Absent</span>
          <button
            type="button"
            onClick={() => onStatusChange(student.id)}
            disabled={isSubmitting}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${student.status === 'Present' ? 'bg-green-600' : 'bg-slate-300'}`}
            aria-pressed={student.status === 'Present'}
          >
            <span className="sr-only">Toggle Status</span>
            <span
              aria-hidden="true"
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${student.status === 'Present' ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
          <span className={`font-medium text-xs ${student.status === 'Present' ? 'text-green-700' : 'text-slate-400'}`}>Present</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex flex-col items-center">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={student.marks}
            onChange={(e) => onMarksChange(student.id, e.target.value)}
            disabled={student.status === 'Absent' || isSubmitting}
            className={`w-32 p-2 text-center text-base font-semibold border rounded-md transition-all duration-200 ${validationError ? 'border-red-500 bg-red-50 ring-2 ring-red-300' : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300'} ${student.status === 'Absent' ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-700'}`}
            aria-invalid={!!validationError}
            aria-describedby={validationError ? `error-${student.id}` : undefined}
          />
          {validationError && (
            <p id={`error-${student.id}`} className="mt-1.5 text-xs text-red-600">{validationError}</p>
          )}
        </div>
      </td>
    </tr>
  );
};

export default StudentTableRow;