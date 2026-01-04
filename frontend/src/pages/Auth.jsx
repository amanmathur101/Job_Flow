import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../types';
import { Button } from '../components/Button';
import { Briefcase, User, Building2 } from 'lucide-react';

export const Auth = ({ mode }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: UserRole.CANDIDATE
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        // In this mock, we only use email to login
        await login(formData.email);
      } else {
        await register(formData.name, formData.email, formData.role);
      }
      navigate('/jobs');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {mode === 'login'
              ? 'Sign in to access your account'
              : 'Join thousands of professionals finding their dream job'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              {mode === 'login' && <p className="text-xs text-slate-500 mt-1">Mock Login: Use 'recruiter@jobflow.com' or 'dev@jobflow.com'</p>}
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">I am a...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${formData.role === UserRole.CANDIDATE
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    onClick={() => setFormData({ ...formData, role: UserRole.CANDIDATE })}
                  >
                    <User className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Candidate</span>
                  </button>
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${formData.role === UserRole.RECRUITER
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    onClick={() => setFormData({ ...formData, role: UserRole.RECRUITER })}
                  >
                    <Building2 className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Recruiter</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" isLoading={isLoading}>
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </Button>

          <div className="text-center">
            {mode === 'login' ? (
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <button type="button" onClick={() => navigate('/register')} className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <button type="button" onClick={() => navigate('/login')} className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
