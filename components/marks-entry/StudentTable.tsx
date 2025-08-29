import React from 'react';
import type { StudentMark } from '../../types';
import Spinner from '../common/Spinner';
import StudentTableRow from './StudentTableRow';

interface StudentTableProps {
  students: StudentMark[];
  onMarksChange: (studentId: string, marks: string) => void;
  onStatusChange: (studentId: string) => void;
  validationErrors: { [studentId: string]: string | undefined };
  filterQuery: string;
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  isSubmitting: boolean;
}

const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onMarksChange,
  onStatusChange,
  validationErrors,
  filterQuery,
  onFilterChange,
  isLoading,
  isSubmitting,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10 min-h-[200px]">
        <Spinner className="w-8 h-8 text-indigo-600" />
        <p className="ml-4 text-slate-600">Loading Students...</p>
      </div>
    );
  }

  if (students.length === 0 && !filterQuery) {
    return (
      <div className="text-center py-10 bg-slate-50 rounded-lg min-h-[200px] flex items-center justify-center">
        <p className="text-slate-500">Select a class and section to see the student list.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
       <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
        <input
          type="text"
          value={filterQuery}
          onChange={onFilterChange}
          placeholder="Filter students by name or ID..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition"
          aria-label="Filter students"
          disabled={isSubmitting}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Student ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Student Name</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">Marks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {students.length > 0 ? (
                students.map((student) => (
                    <StudentTableRow
                        key={student.id}
                        student={student}
                        onMarksChange={onMarksChange}
                        onStatusChange={onStatusChange}
                        validationError={validationErrors[student.id]}
                        isSubmitting={isSubmitting}
                    />
                ))
            ) : (
                <tr>
                    <td colSpan={4} className="text-center py-10 text-slate-500">
                        No students found matching your filter.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;