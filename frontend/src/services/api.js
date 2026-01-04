import axios from 'axios';

// Fallback to the live Render Backend URL if Env Var is missing
const API_URL = import.meta.env.VITE_API_URL || 'https://jobflow-backend-x5ow.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  if (response.data) {
    // The backend connects successfully but returns a raw token string. 
    // We construct a user object to store.
    const user = {
      email: email,
      token: response.data
    };
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
  return null;
};

export const register = async (name, email, password, role) => {
  const response = await api.post('/auth/register', {
    name,
    email,
    password,
    role
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

// --- Job Services ---
export const getJobs = async (query) => {
  try {
    const url = query ? `/jobs?query=${encodeURIComponent(query)}` : '/jobs';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getJobById = async (id) => {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createJob = async (jobData) => {
  try {
    const response = await api.post('/jobs', jobData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateJob = async (id, jobData) => {
  try {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteJob = async (id) => {
  try {
    await api.delete(`/jobs/${id}`);
  } catch (error) {
    throw error;
  }
};

// --- Application Services ---
export const applyForJob = async (jobId, candidateId, resumeFile) => {
  // Note: In a real app, we'd upload the file first. 
  // Here we just pass a mock URL or filename.
  const resumeUrl = resumeFile ? resumeFile.name : 'resume.pdf';
  try {
    const response = await api.post(`/applications/apply/${jobId}?resumeUrl=${encodeURIComponent(resumeUrl)}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getApplicationsForJob = async (jobId) => {
  try {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getApplicationsForCandidate = async (candidateId) => {
  try {
    const response = await api.get('/applications/my-applications');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateApplicationStatus = async (appId, status) => {
  try {
    const response = await api.put(`/applications/${appId}/status?status=${status}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};