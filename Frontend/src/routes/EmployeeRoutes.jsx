import MyAttendancePage from '../pages/employee/MyAttendancePage';
import MyLeavesPage from '../pages/employee/MyLeavesPage';
import AnnouncementsPage from '../pages/employee/AnnouncementsPage';
import { Routes,Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import MyProfilePage from '../pages/employee/MyProfilePage';
const EmployeeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/employee/dashboard" replace />} />
      <Route path="/dashboard" element={<EmployeeDashboard />} />
      <Route path="/profile" element={<MyProfilePage />} />
      <Route path="/attendance" element={<MyAttendancePage />} />
      <Route path="/leaves" element={<MyLeavesPage />} />
      <Route path="/announcements" element={<AnnouncementsPage />} />
    </Routes>
  );
};

export default EmployeeRoutes;