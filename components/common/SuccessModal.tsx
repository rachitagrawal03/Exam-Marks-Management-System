import React, { useEffect } from 'react';

// Let TypeScript know confetti is available on the window
declare const confetti: any;

interface SuccessModalProps {
    show: boolean;
    message: string;
    subMessage?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ show, message, subMessage }) => {
    useEffect(() => {
        if (show && typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 180,
                origin: { y: 0 }
            });
        }
    }, [show]);

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center m-4 animate-modal-pop-in">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{message}</h3>
                {subMessage && <p className="text-gray-500 mt-2">{subMessage}</p>}
            </div>
        </div>
    );
};

export default SuccessModal;