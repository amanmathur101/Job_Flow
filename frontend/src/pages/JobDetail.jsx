import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { getJobById, applyForJob } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import { Button } from '../components/Button';
import { MapPin, DollarSign, Briefcase, CheckCircle, Clock, ArrowLeft, Upload } from 'lucide-react';

export const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      const data = await getJobById(id);
      if (data) setJob(data);
      else navigate('/jobs'); // Redirect if not found
      setLoading(false);
    };
    fetchJob();
  }, [id, navigate]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user || !job || !resumeFile) return;

    setIsApplying(true);
    setErrorMsg('');
    try {
      await applyForJob(job.id, user.id, resumeFile);
      setSuccessMsg('Application submitted successfully!');
      setTimeout(() => {
        setShowApplyModal(false);
        setSuccessMsg('');
        setResumeFile(null);
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to apply');
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading job details...</div>;
  if (!job) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Jobs
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
              <div className="mt-2 flex items-center text-lg text-slate-600">
                <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                {job.company}
              </div>
            </div>
            {user?.role !== UserRole.RECRUITER && (
              <Button onClick={() => user ? setShowApplyModal(true) : navigate('/login')} size="lg">
                Apply Now
              </Button>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
              <MapPin className="w-4 h-4 mr-1.5" /> {job.location}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
              <DollarSign className="w-4 h-4 mr-1.5" /> {job.salaryRange}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
              <Clock className="w-4 h-4 mr-1.5" /> {job.type}
            </span>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">About the Role</h2>
            {/* Simple Markdown-ish rendering: treat double newlines as paragraphs */}
            <div className="prose prose-slate max-w-none text-slate-600">
              {job.description.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Requirements</h2>
            <ul className="space-y-3">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start text-slate-600">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5" />
                  {req}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative">
            <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>

            {!successMsg ? (
              <form onSubmit={handleApply}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Upload Resume (PDF)</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-sm text-slate-500">
                        {resumeFile ? resumeFile.name : "Click to upload resume"}
                      </span>
                    </div>
                  </div>
                </div>

                {errorMsg && <p className="text-red-600 text-sm mb-4">{errorMsg}</p>}

                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="secondary" onClick={() => setShowApplyModal(false)}>Cancel</Button>
                  <Button type="submit" disabled={!resumeFile} isLoading={isApplying}>Submit Application</Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Application Sent!</h3>
                <p className="text-slate-500 mt-2">The recruiter will review your profile shortly.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
