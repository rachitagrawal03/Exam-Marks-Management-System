import React from 'react';
import type { ExamDetails } from '../../types';

const EXAM_TYPES = ['CT1', 'CT2', 'UT', 'Half Yearly', 'Annual Exam'];

interface ExamDetailsFormProps {
  // FIX: Changed type to Omit<ExamDetails, 'teacherName' | 'teacherId'> to match the updated state type from the useExamDetails hook.
  examDetails: Omit<ExamDetails, 'teacherName' | 'teacherId'>;
  onDetailChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
  disabled: boolean;
  availableClasses: string[];
  availableSections: string[];
  availableSubjects: string[];
}

const ExamDetailsForm: React.FC<ExamDetailsFormProps> = ({
  examDetails,
  onDetailChange,
  disabled,
  availableClasses,
  availableSections,
  availableSubjects,
}) => {
  const renderSelect = (name: 'examType' | 'class' | 'section' | 'subject', label: string, options: string[], value: string) => {
    const isDisabled = disabled || options.length === 0;
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
        <div className="relative w-full">
          <select
            id={name}
            name={name}
            value={value}
            onChange={onDetailChange}
            className={`
              w-full appearance-none bg-white border border-solid border-slate-300 rounded-lg 
              px-3.5 py-2.5 text-slate-900 
              focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500
              disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
              transition duration-200
            `}
            required
            disabled={isDisabled}
          >
            <option value="" disabled>Select {label}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
          </div>
        </div>
      </div>
    );
  };

  const renderNonEditableInput = (label: string, value: string) => (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        className="w-full bg-slate-100 px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed"
        readOnly
        disabled
      />
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-end">
      <div>
        <label htmlFor="examDate" className="block text-sm font-medium text-slate-600 mb-1.5">Exam Date</label>
        <div className="date-input-wrapper">
          <input
            id="examDate"
            name="examDate"
            type="date"
            value={examDetails.examDate}
            onChange={onDetailChange}
            className="w-full bg-white px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition duration-200 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
            required
            disabled={disabled}
            placeholder="mm/dd/yyyy"
          />
        </div>
      </div>
      {renderSelect('examType', 'Exam Type', EXAM_TYPES, examDetails.examType)}
      <div>
        <label htmlFor="maximumMarks" className="block text-sm font-medium text-slate-600 mb-1.5">Maximum Marks</label>
        <input
          id="maximumMarks"
          name="maximumMarks"
          type="text"
          value={examDetails.maximumMarks}
          className="w-full bg-slate-100 px-3.5 py-2.5 border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed"
          readOnly
          disabled
        />
      </div>
      {renderSelect('class', 'Class', availableClasses, examDetails.class)}
      
      {availableSections.length === 1 && examDetails.class
        ? renderNonEditableInput('Section', examDetails.section)
        : renderSelect('section', 'Section', availableSections, examDetails.section)
      }
      
      {availableSubjects.length === 1 && examDetails.section
        ? renderNonEditableInput('Subject', examDetails.subject)
        : renderSelect('subject', 'Subject', availableSubjects, examDetails.subject)
      }
    </div>
  );
};

export default ExamDetailsForm;