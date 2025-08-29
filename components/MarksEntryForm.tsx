import React from 'react';
import type { Teacher } from '../types';

import { useExamDetails } from '../hooks/useExamDetails';
import { useStudentData } from '../hooks/useStudentData';
import { useMarksSubmission } from '../hooks/useMarksSubmission';

import SuccessModal from './common/SuccessModal';
import Header from './marks-entry/Header';
import ExamDetailsForm from './marks-entry/ExamDetailsForm';
import StudentTable from './marks-entry/StudentTable';
import FormActions from './marks-entry/FormActions';

interface MarksEntryFormProps {
  teacher: Teacher;
  onLogout: () => void;
}

const MarksEntryForm: React.FC<MarksEntryFormProps> = ({ teacher, onLogout }) => {
  const {
    examDetails,
    handleDetailChange,
    areDetailsComplete,
    availableClasses,
    availableSections,
    availableSubjects,
    resetExamDetails,
  } = useExamDetails(teacher.assignments);

  const {
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
  } = useStudentData(examDetails);

  const resetForm = () => {
    resetExamDetails();
    resetStudentData();
  };

  const {
    submissionState,
    successMessage,
    errorMessage,
    handleSubmit,
    resetSubmissionState,
  } = useMarksSubmission({
    examDetails,
    studentMarks,
    teacher,
    areDetailsComplete,
    hasValidationErrors,
    setValidationErrors,
    onSuccess: resetForm,
  });
  
  // Reset submission state if form details change after an error
  React.useEffect(() => {
      resetSubmissionState();
  }, [examDetails]);

  const isSubmitting = submissionState === 'submitting';

  return (
    <>
      <SuccessModal show={submissionState === 'success'} message={successMessage} subMessage="The form will reset shortly." />
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Header teacherName={teacher.name} onLogout={onLogout} />
          <main>
            <form onSubmit={handleSubmit}>
              <fieldset disabled={isSubmitting}>
                {/* A single, unified card for the entire form */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    {/* Exam Details Section */}
                    <div className="p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-slate-800">Exam Details</h2>
                        <div className="border-t border-slate-200 mt-3 mb-6"></div>
                        <ExamDetailsForm
                            examDetails={examDetails}
                            onDetailChange={handleDetailChange}
                            disabled={isSubmitting}
                            availableClasses={availableClasses}
                            availableSections={availableSections}
                            availableSubjects={availableSubjects}
                        />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-200"></div>

                    {/* Student Marks Section */}
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <h2 className="text-xl font-bold text-slate-800">Student Marks</h2>
                            <p className="text-sm text-slate-500">
                                {studentMarks.length > 0 ? `Total Students: ${studentMarks.length}` : 'No students to display.'}
                            </p>
                        </div>
                        <div className="border-t border-slate-200 mt-3 mb-6"></div>
                        <StudentTable
                            students={filteredStudents}
                            onMarksChange={handleMarksChange}
                            onStatusChange={handleStatusChange}
                            onRemarkChange={handleRemarkChange}
                            validationErrors={validationErrors}
                            filterQuery={filterQuery}
                            onFilterChange={(e) => setFilterQuery(e.target.value)}
                            isLoading={isLoadingStudents}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
                
                <div className="mt-8">
                    <FormActions
                      submissionState={submissionState}
                      errorMessage={errorMessage}
                      canSubmit={areDetailsComplete && studentMarks.length > 0 && !hasValidationErrors}
                    />
                </div>
              </fieldset>
            </form>
          </main>
        </div>
      </div>
    </>
  );
};

export default MarksEntryForm;
