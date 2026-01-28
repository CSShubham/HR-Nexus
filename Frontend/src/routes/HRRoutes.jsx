import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HRDashboard from '../pages/hr/HRDashboard';
import EmployeesPage from '../pages/hr/EmployeesPage';
import CandidatesPage from '../pages/hr/CandidatesPage';
import AttendancePage from '../pages/hr/AttendancePage';
import LeavesPage from '../pages/hr/LeavesPage';
import AnnouncementsPage from '../pages/hr/AnnouncementsPage';

const HRRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/hr/dashboard" replace />} />
      <Route path="/dashboard" element={<HRDashboard />} />
      <Route path="/employees" element={<EmployeesPage />} />
      <Route path="/candidates" element={<CandidatesPage />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/leaves" element={<LeavesPage />} />
      <Route path="/announcements" element={<AnnouncementsPage />} />
    </Routes>
  );
};

export default HRRoutes;