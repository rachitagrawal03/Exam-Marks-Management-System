import React from 'react';

interface HeaderProps {
  teacherName: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ teacherName, onLogout }) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Marks Entry Portal</h1>
        <p className="text-slate-600 mt-1">Welcome, <span className="font-semibold">{teacherName}</span></p>
      </div>
      <button
        onClick={onLogout}
        className="mt-4 sm:mt-0 flex items-center justify-center px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300 transform hover:scale-105"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
        <span>Logout</span>
      </button>
    </header>
  );
};

export default Header;