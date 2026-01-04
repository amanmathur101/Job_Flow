import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Menu, X, Briefcase, LogOut, User as UserIcon } from 'lucide-react';
import { UserRole } from '../types';

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Briefcase className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-slate-900">JobFlow</span>
              </Link>

              <div className="hidden md:ml-8 md:flex md:space-x-8">
                <Link
                  to="/jobs"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/jobs') ? 'border-blue-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
                >
                  Find Jobs
                </Link>
                {user?.role === UserRole.RECRUITER && (
                  <Link
                    to="/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/dashboard') ? 'border-blue-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
                  >
                    Dashboard
                  </Link>
                )}
                {user?.role === UserRole.CANDIDATE && (
                  <Link
                    to="/my-applications"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/my-applications') ? 'border-blue-500 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'}`}
                  >
                    My Applications
                  </Link>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-slate-700">
                    <UserIcon className="w-4 h-4 mr-2" />
                    {user.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-slate-500 hover:text-slate-900 font-medium text-sm">Sign in</Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Sign up</Link>
                </div>
              )}
            </div>

            <div className="flex items-center md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-500 hover:text-slate-700">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 pb-4">
            <div className="pt-2 pb-3 space-y-1">
              <Link to="/jobs" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800">Find Jobs</Link>
              {user?.role === UserRole.RECRUITER && (
                <Link to="/dashboard" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800">Dashboard</Link>
              )}
              {user?.role === UserRole.CANDIDATE && (
                <Link to="/my-applications" className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800">My Applications</Link>
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-slate-200">
              {user ? (
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {user.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-slate-800">{user.name}</div>
                    <div className="text-sm font-medium text-slate-500">{user.email}</div>
                  </div>
                  <button onClick={handleLogout} className="ml-auto flex-shrink-0 p-1 rounded-full text-slate-400 hover:text-slate-500">
                    <LogOut className="h-6 w-6" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1 px-4">
                  <Link to="/login" className="block text-center w-full px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">Sign in</Link>
                  <Link to="/register" className="block text-center w-full mt-2 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Sign up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} JobFlow Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
