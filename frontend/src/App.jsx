import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { Layout } from './layouts/Layout';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { JobBoard } from './pages/JobBoard';
import { JobDetail } from './pages/JobDetail';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { MyApplications } from './pages/MyApplications';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />
            <Route path="/jobs" element={<JobBoard />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/dashboard" element={<RecruiterDashboard />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;