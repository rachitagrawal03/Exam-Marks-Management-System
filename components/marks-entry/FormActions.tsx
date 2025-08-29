import React from 'react';
import Spinner from '../common/Spinner';

interface FormActionsProps {
  submissionState: 'idle' | 'submitting' | 'success' | 'error';
  errorMessage: string;
  canSubmit: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ submissionState, errorMessage, canSubmit }) => {
  const isSubmitting = submissionState === 'submitting';
  return (
    <div className="flex flex-col items-center justify-end gap-4">
      {submissionState === 'error' && errorMessage && (
        <p className="text-sm text-red-600 animate-shake text-center">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className="w-full sm:w-auto flex items-center justify-center px-10 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
      >
        {isSubmitting ? (
          <>
            <Spinner className="mr-3" /> Submitting...
          </>
        ) : (
          'Submit All Marks'
        )}
      </button>
    </div>
  );
};

export default FormActions;