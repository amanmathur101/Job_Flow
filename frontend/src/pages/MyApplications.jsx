import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../types';
import { getApplicationsForCandidate } from '../services/api';
import { Briefcase, Calendar } from 'lucide-react';

export const MyApplications = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === UserRole.CANDIDATE) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const result = await getApplicationsForCandidate(user.id);
    setData(result);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REVIEWING': return 'bg-blue-100 text-blue-800';
      case 'INTERVIEWING': return 'bg-purple-100 text-purple-800';
      case 'OFFERED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (user?.role !== UserRole.CANDIDATE) return <div className="p-8">Access Denied</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Applications</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse" />)}
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">You haven't applied to any jobs yet.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
          <ul className="divide-y divide-slate-200">
            {data.map(({ application, job }) => (
              <li key={application.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                    <div className="text-slate-600 flex items-center mt-1">
                      <Briefcase className="w-4 h-4 mr-1" /> {job.company}
                    </div>
                    <div className="text-slate-500 text-sm flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1" /> Applied on {new Date(application.appliedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
