import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { CircularProgress } from '@mui/material';

// Add these styles for the input placeholders
const inputStyles = `
  .login-input::placeholder {
    color: #9CA3AF;
    opacity: 1;
  }
`;  

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Use the auth context
  const { login, isLoading } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      await login(email, password);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid email or password');
    }
  };

  return (
    <>
      <style jsx>{inputStyles}</style>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">User Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 login-input disabled:opacity-50"
            placeholder="Email Address"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 login-input disabled:opacity-50"
            placeholder="Password"
          />
        </div>

        <div className="flex items-center justify-between">

        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 ${isLoading ? 'cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : 'Log In'}
          </button>
        </div>
      </form>
    </>
  );
} 