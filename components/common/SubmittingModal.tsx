import React from 'react';
import Spinner from './Spinner';

interface SubmittingModalProps {
    show: boolean;
}

const SubmittingModal: React.FC<SubmittingModalProps> = ({ show }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center m-4 animate-modal-pop-in">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                    <Spinner className="h-10 w-10 text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Submitting Form...</h3>
                <p className="text-gray-500 mt-2">Please wait, this may take a moment.</p>
            </div>
        </div>
    );
};

export default SubmittingModal;
