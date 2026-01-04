import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Search, Briefcase, TrendingUp, Users } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-white pt-20 pb-32 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            Find the job that <span className="text-blue-600">fits your life</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500 mb-10">
            Thousands of jobs in the computer, engineering and technology sectors are waiting for you.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="px-8 py-4 text-lg" onClick={() => navigate('/jobs')}>
              <Search className="w-5 h-5 mr-2" />
              Find a Job
            </Button>
            <Button variant="secondary" size="lg" className="px-8 py-4 text-lg" onClick={() => navigate('/register')}>
              Post a Job
            </Button>
          </div>
        </div>
        
        {/* Decorative background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
             <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
             <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">20k+</h3>
              <p className="text-slate-600 mt-1">Live Jobs</p>
            </div>
            <div className="p-6">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">10k+</h3>
              <p className="text-slate-600 mt-1">Companies</p>
            </div>
            <div className="p-6">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900">150k+</h3>
              <p className="text-slate-600 mt-1">Candidates</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};