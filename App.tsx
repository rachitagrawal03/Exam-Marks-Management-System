
import React, { useState } from 'react';
import type { Teacher } from './types';
import Login from './components/Login';
import MarksEntryForm from './components/MarksEntryForm';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (id: string, pass: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedInTeacher = await authService.login(id, pass);
      setTeacher(loggedInTeacher);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setTeacher(null);
  };

  if (!teacher) {
    return <Login onLogin={handleLogin} isLoading={isLoading} error={error} />;
  }

  return <MarksEntryForm teacher={teacher} onLogout={handleLogout} />;
};

export default App;
   