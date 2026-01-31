// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Users, UserPlus, Calendar, CheckCircle } from 'lucide-react';
// import MainLayout from '../../components/layout/MainLayout';
// import Card from '../../components/common/Card';
// import { fetchEmployees } from '../../features/employees/employeeThunks';
// import { fetchCandidates } from '../../features/candidates/candidatesThunks';
// import { fetchAllLeaves } from '../../features/leaves/leavesThunks';
// // import { Navigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// const HRDashboard = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { employees } = useSelector((state) => state.employees);
//   const { candidates } = useSelector((state) => state.candidates);
//   const { leaves } = useSelector((state) => state.leaves);

//   useEffect(() => {
//     dispatch(fetchEmployees());
//     dispatch(fetchCandidates());
//     dispatch(fetchAllLeaves());
//   }, [dispatch]);

//   const stats = [
//     {
//       label: 'Total Employees',
//       value: employees?.length || 0,
//       icon: Users,
//       color: 'bg-blue-500',
//     },
//     {
//       label: 'Active Candidates',
//       value: candidates?.filter((c) => c.status === 'applied').length || 0,
//       icon: UserPlus,
//       color: 'bg-green-500',
//     },
//     {
//       label: 'Pending Leaves',
//       value: leaves?.filter((l) => l.status === 'pending').length || 0,
//       icon: Calendar,
//       color: 'bg-yellow-500',
//     },
//     {
//       label: 'Active Employees',
//       value: employees?.filter((e) => e.status === 'active').length || 0,
//       icon: CheckCircle,
//       color: 'bg-purple-500',
//     },
//   ];

//   return (
//     <MainLayout title="Dashboard">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat, idx) => (
//           <Card key={idx} className="border-l-4 border-primary-500">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
//                 <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
//               </div>
//               <div className={`${stat.color} p-3 rounded-lg`}>
//                 <stat.icon className="text-white" size={24} />
//               </div>
//             </div>
//           </Card>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card title="Recent Activity">
//           <div className="space-y-3">
//             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//               <div className="w-2 h-2 bg-green-500 rounded-full" />
//               <div className="flex-1">
//                 <p className="text-sm font-medium">New employee onboarded</p>
//                 <p className="text-xs text-gray-500">2 hours ago</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//               <div className="w-2 h-2 bg-blue-500 rounded-full" />
//               <div className="flex-1">
//                 <p className="text-sm font-medium">Leave request approved</p>
//                 <p className="text-xs text-gray-500">5 hours ago</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//               <div className="w-2 h-2 bg-yellow-500 rounded-full" />
//               <div className="flex-1">
//                 <p className="text-sm font-medium">New candidate application</p>
//                 <p className="text-xs text-gray-500">1 day ago</p>
//               </div>
//             </div>
//           </div>
//         </Card>

//         <Card title="Quick Actions">
//           <div className="grid grid-cols-2 gap-3">
//             <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-left">
//               <UserPlus className="text-primary-600 mb-2" size={24} />
//               <p className="text-sm font-medium text-gray-800">Add Employee</p>
//             </button>
//             <button onClick={() => navigate('/hr/leaves')} className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
//               <Calendar className="text-green-600 mb-2" size={24} />
//               <p className="text-sm font-medium text-gray-800">View Leaves</p>
//             </button>
//             <button onClick={()=>navigate('/hr/attendance')} className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
//               <CheckCircle className="text-blue-600 mb-2" size={24} />
//               <p className="text-sm font-medium text-gray-800">Attendance</p>
//             </button>
//             <button  onClick={()=>navigate('/hr/candidates')} className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
//               <Users className="text-purple-600 mb-2" size={24} />
//               <p className="text-sm font-medium text-gray-800">Candidates</p>
//             </button>
//           </div>
//         </Card>
//       </div>
//     </MainLayout>
//   );
// };

// export default HRDashboard;
// src/pages/hr/HRDashboard.jsx - ENHANCED VERSION
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserPlus,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Briefcase,
  Award,
  ChevronRight,
  ArrowUpRight,
  UserCheck,
  XCircle,
  Megaphone,
  BarChart3,
  PieChart,
} from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { fetchEmployees } from '../../features/employees/employeeThunks';
import { fetchCandidates } from '../../features/candidates/candidatesThunks';
import { fetchAllLeaves } from '../../features/leaves/leavesThunks';
import { fetchAllAttendance } from '../../features/attendance/attendanceThunks';
import { fetchAnnouncements } from '../../features/announcements/announcementsThunks';
import { formatDate } from '../../utils/formatters';

const HRDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { employees } = useSelector((state) => state.employees);
  const { candidates } = useSelector((state) => state.candidates);
  const { leaves } = useSelector((state) => state.leaves);
  const { attendanceList } = useSelector((state) => state.attendance);
  const { announcements } = useSelector((state) => state.announcements);

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Fetch all data
    dispatch(fetchEmployees());
    dispatch(fetchCandidates());
    dispatch(fetchAllLeaves());
    dispatch(fetchAllAttendance());
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  // Calculate statistics
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendanceList?.filter(a => a.date === today) || [];
  const pendingLeaves = leaves?.filter(l => l.status === 'pending') || [];
  const activeEmployees = employees?.filter(e => e.status === 'active') || [];
  const newCandidates = candidates?.filter(c => c.status === 'applied') || [];

  // Main stats
  const stats = [
    {
      label: 'Total Employees',
      value: employees?.length || 0,
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Present Today',
      value: todayAttendance.length,
      change: `${((todayAttendance.length / (employees?.length || 1)) * 100).toFixed(0)}%`,
      trend: 'up',
      icon: UserCheck,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      label: 'Pending Actions',
      value: pendingLeaves.length + newCandidates.length,
      change: `${pendingLeaves.length} leaves`,
      trend: 'neutral',
      icon: AlertCircle,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      label: 'Active Candidates',
      value: newCandidates.length,
      change: '+5 this week',
      trend: 'up',
      icon: UserPlus,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  // Recent employees (last 5)
  const recentEmployees = employees?.slice(0, 5) || [];

  // Pending leave requests (top 5)
  const recentLeaves = pendingLeaves.slice(0, 5);

  // Department breakdown
  const departmentStats = {};
  employees?.forEach(emp => {
    if (emp.department) {
      departmentStats[emp.department] = (departmentStats[emp.department] || 0) + 1;
    }
  });

  const topDepartments = Object.entries(departmentStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Quick action items with counts
  const quickActions = [
    {
      title: 'Review Candidates',
      description: `${newCandidates.length} awaiting review`,
      icon: UserPlus,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      hoverColor: 'hover:bg-purple-100',
      path: '/hr/candidates',
      count: newCandidates.length,
    },
    {
      title: 'Approve Leaves',
      description: `${pendingLeaves.length} pending requests`,
      icon: Calendar,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      hoverColor: 'hover:bg-green-100',
      path: '/hr/leaves',
      count: pendingLeaves.length,
    },
    {
      title: 'View Attendance',
      description: `${todayAttendance.length} present today`,
      icon: Clock,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      hoverColor: 'hover:bg-blue-100',
      path: '/hr/attendance',
      count: todayAttendance.length,
    },
    {
      title: 'Manage Employees',
      description: `${activeEmployees.length} active employees`,
      icon: Users,
      color: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      hoverColor: 'hover:bg-indigo-100',
      path: '/hr/employees',
      count: activeEmployees.length,
    },
  ];

  return (
    <MainLayout title="Dashboard">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{greeting}! 👋</h1>
            <p className="text-primary-100">Here's what's happening with your workforce today</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              icon={Megaphone}
              onClick={() => navigate('/hr/announcements')}
              className="bg-white text-primary-600 hover:bg-primary-50"
            >
              New Announcement
            </Button>
          </div>
        </div>
      </div>

      {/* Main Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-l-4 border-primary-500 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                <div className="flex items-center gap-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp size={16} className="text-green-500" />
                  ) : stat.trend === 'down' ? (
                    <TrendingDown size={16} className="text-red-500" />
                  ) : null}
                  <span className={`text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.bgColor} p-4 rounded-xl`}>
                <stat.icon className={stat.textColor} size={28} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => navigate(action.path)}
              className={`${action.color} ${action.hoverColor} rounded-xl p-6 text-left transition-all transform hover:scale-105 hover:shadow-lg group relative`}
            >
              {action.count > 0 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {action.count}
                </span>
              )}
              <action.icon className={`${action.iconColor} mb-3`} size={32} />
              <h3 className="font-semibold text-gray-800 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
              <ChevronRight className="text-gray-400 group-hover:text-gray-600 absolute bottom-4 right-4 transition-colors" size={20} />
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pending Leave Requests */}
        <Card 
          title="Pending Leave Requests" 
          className="lg:col-span-2"
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/hr/leaves')}
              icon={ArrowUpRight}
            >
              View All
            </Button>
          }
        >
          {recentLeaves.length > 0 ? (
            <div className="space-y-3">
              {recentLeaves.map((leave) => (
                <div
                  key={leave._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate('/hr/leaves')}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">
                        {leave.employeeId?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {leave.employeeId?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning" size="sm">
                      {Math.ceil((new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)) + 1} days
                    </Badge>
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar size={48} className="mx-auto mb-3 opacity-50" />
              <p>No pending leave requests</p>
            </div>
          )}
        </Card>

        {/* Department Overview */}
        <Card title="Department Overview">
          {topDepartments.length > 0 ? (
            <div className="space-y-3">
              {topDepartments.map(([dept, count], idx) => {
                const percentage = ((count / (employees?.length || 1)) * 100).toFixed(0);
                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{dept}</span>
                      <span className="text-sm font-semibold text-gray-900">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <PieChart size={48} className="mx-auto mb-3 opacity-50" />
              <p>No department data</p>
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Employees */}
        <Card 
          title="Recently Onboarded" 
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/hr/employees')}
              icon={ArrowUpRight}
            >
              View All
            </Button>
          }
        >
          {recentEmployees.length > 0 ? (
            <div className="space-y-3">
              {recentEmployees.map((emp) => (
                <div
                  key={emp._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate('/hr/employees')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-semibold">
                        {emp.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{emp.name}</p>
                      <p className="text-xs text-gray-500">
                        {emp.designation} • {emp.department}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">New</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-3 opacity-50" />
              <p>No recent employees</p>
            </div>
          )}
        </Card>

        {/* Latest Announcements */}
        <Card 
          title="Latest Announcements"
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/hr/announcements')}
              icon={ArrowUpRight}
            >
              View All
            </Button>
          }
        >
          {announcements && announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.slice(0, 4).map((announcement) => (
                <div
                  key={announcement._id}
                  className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                  onClick={() => navigate('/hr/announcements')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {announcement.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {announcement.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDate(announcement.createdAt)}
                      </p>
                    </div>
                    <Megaphone size={20} className="text-blue-600 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Megaphone size={48} className="mx-auto mb-3 opacity-50" />
              <p>No announcements yet</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/hr/announcements')}
                className="mt-3"
              >
                Create First Announcement
              </Button>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default HRDashboard;