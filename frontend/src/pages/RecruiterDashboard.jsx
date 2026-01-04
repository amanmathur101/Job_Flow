import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { UserRole, JobType, ApplicationStatus } from '../types';
import { getJobs, createJob, updateJob, deleteJob, getApplicationsForJob, updateApplicationStatus } from '../services/api';
import { generateJobDescription } from '../services/geminiService';
import { Button } from '../components/Button';
import { JobCard } from '../components/JobCard';
import { Plus, Users, Trash2, Sparkles, X, Edit2 } from 'lucide-react';

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Job Form State (for Create & Edit)
  const [editingJobId, setEditingJobId] = useState(null);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: JobType.FULL_TIME,
    salaryRange: '',
    description: '',
    requirements: ''
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    if (user?.role === UserRole.RECRUITER) {
      loadJobs();
    }
  }, [user]);

  useEffect(() => {
    if (selectedJobId && activeTab === 'applicants') {
      loadApplications(selectedJobId);
    }
  }, [selectedJobId, activeTab]);

  const loadJobs = async () => {
    setIsLoading(true);
    // In a real API, we would filter by recruiterId
    const allJobs = await getJobs();
    setJobs(allJobs.filter(j => j.recruiterId === user?.id));
    setIsLoading(false);
  };

  const loadApplications = async (jobId) => {
    setIsLoading(true);
    const apps = await getApplicationsForJob(jobId);
    setApplications(apps);
    setIsLoading(false);
  };

  const openCreateModal = () => {
    setEditingJobId(null);
    setNewJob({
      title: '',
      company: '',
      location: '',
      type: JobType.FULL_TIME,
      salaryRange: '',
      description: '',
      requirements: ''
    });
    setShowCreateModal(true);
  };

  const openEditModal = (job, e) => {
    e.stopPropagation();
    setEditingJobId(job.id);
    setNewJob({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salaryRange: job.salaryRange,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements
    });
    setShowCreateModal(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    const jobData = {
      ...newJob,
      recruiterId: user.id,
      requirements: newJob.requirements.split(',').map(s => s.trim())
    };

    if (editingJobId) {
      await updateJob(editingJobId, jobData);
    } else {
      await createJob(jobData);
    }

    setShowCreateModal(false);
    loadJobs();
    setIsLoading(false);
  };

  const handleDeleteJob = async (id, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this job?')) {
      await deleteJob(id);
      loadJobs();
    }
  };

  const handleGenerateDescription = async () => {
    if (!newJob.title || !newJob.company) {
      alert("Please enter a Title and Company first.");
      return;
    }
    setIsGeneratingAI(true);
    const desc = await generateJobDescription(newJob.title, newJob.company, newJob.requirements || "General skills");
    setNewJob(prev => ({ ...prev, description: desc }));
    setIsGeneratingAI(false);
  };

  const handleStatusChange = async (appId, newStatus) => {
    await updateApplicationStatus(appId, newStatus);
    if (selectedJobId) loadApplications(selectedJobId);
  };

  const filteredApplications = applications.filter(app =>
    statusFilter === 'ALL' ? true : app.status === statusFilter
  );

  if (user?.role !== UserRole.RECRUITER) return <div className="p-8">Access Denied</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Recruiter Dashboard</h1>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" /> Post New Job
        </Button>
      </div>

      <div className="flex gap-4 border-b border-slate-200 mb-6">
        <button
          onClick={() => { setActiveTab('jobs'); setSelectedJobId(null); }}
          className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'jobs' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          My Jobs
        </button>
        {selectedJobId && (
          <button
            onClick={() => setActiveTab('applicants')}
            className={`pb-4 px-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'applicants' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Applicants for Selected Job
          </button>
        )}
      </div>

      {activeTab === 'jobs' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map(job => (
            <div key={job.id} className="relative group">
              <JobCard
                job={job}
                onClick={() => { setSelectedJobId(job.id); setActiveTab('applicants'); setStatusFilter('ALL'); }}
                className="cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
              />
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => openEditModal(job, e)}
                  className="p-2 bg-white rounded-full shadow-sm text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                  title="Edit Job"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDeleteJob(job.id, e)}
                  className="p-2 bg-white rounded-full shadow-sm text-slate-500 hover:bg-red-50 hover:text-red-500"
                  title="Delete Job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 text-center">
                <button onClick={() => { setSelectedJobId(job.id); setActiveTab('applicants'); setStatusFilter('ALL'); }} className="text-sm text-blue-600 hover:underline flex items-center justify-center w-full">
                  <Users className="w-4 h-4 mr-1" /> View Applicants
                </button>
              </div>
            </div>
          ))}
          {jobs.length === 0 && !isLoading && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">You haven't posted any jobs yet.</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <button onClick={() => setActiveTab('jobs')} className="text-sm text-slate-500 hover:text-slate-900 mr-4">
                &larr; Back to Jobs
              </button>
              <h2 className="text-xl font-semibold">Applicants for {jobs.find(j => j.id === selectedJobId)?.title}</h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-500 mr-2">Filter by status:</span>
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${statusFilter === 'ALL'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                  }`}
              >
                All
              </button>
              {Object.values(ApplicationStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${statusFilter === status
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-lg border border-slate-200 overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Applied At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Resume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredApplications.map(app => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                          {app.candidateName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{app.candidateName}</div>
                          <div className="text-sm text-slate-500">{app.candidateEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer">
                      View PDF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="text-sm border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-1"
                      >
                        {Object.values(ApplicationStatus).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      {applications.length === 0 ? "No applications yet." : "No applications found with this status."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative my-8">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6">{editingJobId ? 'Edit Job' : 'Post a New Job'}</h2>

            <form onSubmit={handleSaveJob} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Job Title</label>
                  <input type="text" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                    value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Company</label>
                  <input type="text" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                    value={newJob.company} onChange={e => setNewJob({ ...newJob, company: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Location</label>
                  <input type="text" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                    value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Salary Range</label>
                  <input type="text" placeholder="e.g. $100k - $120k" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                    value={newJob.salaryRange} onChange={e => setNewJob({ ...newJob, salaryRange: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Job Type</label>
                <select className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                  value={newJob.type} onChange={e => setNewJob({ ...newJob, type: e.target.value })}>
                  {Object.values(JobType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Key Skills (comma separated)</label>
                <input type="text" placeholder="React, TypeScript, Node.js" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                  value={newJob.requirements} onChange={e => setNewJob({ ...newJob, requirements: e.target.value })} />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700">Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingAI}
                    className="text-xs flex items-center text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {isGeneratingAI ? 'Generating...' : 'Auto-Write with AI'}
                  </button>
                </div>
                <textarea rows={6} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                  value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button type="submit" isLoading={isLoading}>{editingJobId ? 'Update Job' : 'Post Job'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
