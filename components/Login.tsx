import React, { useState } from 'react';
import Spinner from './common/Spinner';

interface LoginProps {
  onLogin: (id: string, pass: string) => void;
  isLoading: boolean;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, isLoading, error }) => {
  const [teacherId, setTeacherId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacherId && password) {
      onLogin(teacherId, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-gray-100 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200">
        <div className="text-center">
          <svg className="mx-auto h-12 w-auto text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Teacher's Portal</h1>
          <p className="text-gray-500 mt-2">Please sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              id="teacherId"
              type="text"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
              placeholder=" "
              disabled={isLoading}
              autoComplete="username"
            />
             <label htmlFor="teacherId" className="absolute left-4 -top-2.5 text-sm text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                Teacher ID
            </label>
          </div>
          <div className="relative">
             <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
              placeholder=" "
              disabled={isLoading}
              autoComplete="current-password"
            />
            <label htmlFor="password" className="absolute left-4 -top-2.5 text-sm text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                Password
            </label>
          </div>

          {error && <p className="text-sm text-red-600 text-center animate-shake">{error}</p>}
          
          <button
            type="submit"
            disabled={isLoading || !teacherId || !password}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? <Spinner /> : 
            (
              <>
                <span>Sign In</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )
            }
          </button>
          <div className="text-xs text-center text-gray-500 pt-4 border-t border-gray-200">
            <p className="font-semibold">For Demo:</p>
            <p>ID: <code className="bg-gray-200 text-gray-800 px-1 rounded">teacher01</code> / <code className="bg-gray-200 text-gray-800 px-1 rounded">teacher02</code> / <code className="bg-gray-200 text-gray-800 px-1 rounded">teacher03</code></p>
            <p>Pass: <code className="bg-gray-200 text-gray-800 px-1 rounded">password123</code></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;