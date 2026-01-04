import React from 'react';
import { Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';

export const JobCard = ({ job, onClick, className = '' }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{job.title}</h3>
          <p className="text-blue-600 font-medium">{job.company}</p>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {job.type}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1.5" />
          {job.location}
        </div>
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1.5" />
          {job.salaryRange}
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1.5" />
          {new Date(job.postedAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {job.requirements.slice(0, 3).map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
            {skill}
          </span>
        ))}
        {job.requirements.length > 3 && (
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
            +{job.requirements.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
};
