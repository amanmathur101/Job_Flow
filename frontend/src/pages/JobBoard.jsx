import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobType } from '../types';
import { getJobs } from '../services/api';
import { JobCard } from '../components/JobCard';
import { Search, MapPin, Filter, X } from 'lucide-react';

export const JobBoard = () => {
  const navigate = useNavigate();
  
  // Data States
  const [jobs, setJobs] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Fetch jobs from API (Mock Server Search) when Search Term changes
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const data = await getJobs(searchTerm);
        setJobs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    // Simple debounce to prevent too many API calls
    const timeoutId = setTimeout(fetchJobs, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Apply Client-Side Filters (Location & Job Type) using useMemo for immediate updates
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Location Filter
      const matchesLocation = locationTerm.trim() === '' || 
        job.location.toLowerCase().includes(locationTerm.toLowerCase());

      // Job Type Filter
      const matchesType = selectedTypes.length === 0 || 
        selectedTypes.includes(job.type);

      return matchesLocation && matchesType;
    });
  }, [jobs, locationTerm, selectedTypes]);

  const toggleJobType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setLocationTerm('');
    setSelectedTypes([]);
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Find your next opportunity</h1>
        
        {/* Search Bar Container */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative md:w-1/4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
             <input
              type="text"
              placeholder="City or Remote"
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-shadow"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-3 border rounded-lg shadow-sm text-sm font-medium focus:outline-none transition-colors ${
              showFilters || selectedTypes.length > 0 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
            {selectedTypes.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs py-0.5 px-2 rounded-full">
                {selectedTypes.length}
              </span>
            )}
          </button>
        </div>

        {/* Expanded Filters Section */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Job Type</h3>
              <button onClick={clearFilters} className="text-sm text-slate-500 hover:text-blue-600">
                Clear all filters
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {Object.values(JobType).map((type) => (
                <label 
                  key={type} 
                  className={`inline-flex items-center px-4 py-2 rounded-full border cursor-pointer text-sm transition-all ${
                    selectedTypes.includes(type)
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleJobType(type)}
                  />
                  {type}
                  {selectedTypes.includes(type) && <X className="ml-2 w-3 h-3" />}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <>
          <p className="text-slate-500 mb-4 font-medium">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
            {(searchTerm || locationTerm || selectedTypes.length > 0) && ' matching your criteria'}
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="h-full"
              />
            ))}
          </div>
        </>
      )}
      
      {!loading && filteredJobs.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No jobs found</h3>
            <p className="mt-1 text-slate-500 max-w-sm mx-auto">
              We couldn't find any matches. Try adjusting your search terms, location, or filters.
            </p>
            <button 
              onClick={clearFilters}
              className="mt-4 text-blue-600 font-medium hover:underline"
            >
              Clear all filters
            </button>
        </div>
      )}
    </div>
  );
};
