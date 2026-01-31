import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Calendar,
  AlertCircle,
  BarChart3,
  User,
  Bell,
  TrendingUp,
  CheckCircle,
  XCircle,
  Timer,
  LogIn,
  LogOut,
  FileText,
  AlertTriangle,
  Info,
  Briefcase,
} from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { fetchMyAttendance, punchIn, punchOut } from '../../features/attendance/attendanceThunks';
import { fetchMyLeaves } from '../../features/leaves/leavesThunks';
import { fetchAnnouncements } from '../../features/announcements/announcementsThunks';
import { fetchMyProfile } from '../../features/profile/profileThunks';
import { getOffboardingInfo } from '../../features/employees/employeeThunks';
import { toast } from 'react-toastify';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { attendanceList, loading: attendanceLoading } = useSelector((state) => state.attendance);
  const { leaves, loading: leavesLoading } = useSelector((state) => state.leaves);
  const { announcements } = useSelector((state) => state.announcements);
  const { profile } = useSelector((state) => state.profile);
  const { offboardingInfo } = useSelector((state) => state.employees);

  const [todayAttendance, setTodayAttendance] = useState(null);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    dispatch(fetchMyAttendance());
    dispatch(fetchMyLeaves());
    dispatch(fetchAnnouncements());
    dispatch(fetchMyProfile());
    
    // Fetch offboarding info if employee is exiting or offboarded
    if (profile && (profile.status === 'exiting' || profile.status === 'offboarded')) {
      dispatch(getOffboardingInfo());
    }
  }, [dispatch, profile?.status]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check today's attendance status
  useEffect(() => {
    if (attendanceList && attendanceList.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = attendanceList.find(
        (record) => record.date === today
      );
      if (todayRecord) {
        setTodayAttendance(todayRecord);
        setIsPunchedIn(!todayRecord.punchOut);
      }
    }
  }, [attendanceList]);

  // Calculate statistics
  const calculateStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Attendance this month
    const monthAttendance = attendanceList?.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    }).length || 0;

    // Working days this month (assuming 22 working days)
    const workingDays = 22;

    // Total working hours this month
    const totalHours = attendanceList?.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear &&
        record.totalHours
      );
    }).reduce((sum, record) => sum + (record.totalHours || 0), 0) || 0;

    // Pending leave requests
    const pendingLeaves = leaves?.filter((leave) => leave.status === 'pending').length || 0;

    // Approved leaves this month
    const approvedLeavesThisMonth = leaves?.filter((leave) => {
      const leaveDate = new Date(leave.fromDate);
      return (
        leave.status === 'approved' &&
        leaveDate.getMonth() === currentMonth &&
        leaveDate.getFullYear() === currentYear
      );
    }).length || 0;

    return {
      monthAttendance,
      workingDays,
      totalHours: Math.round(totalHours * 10) / 10,
      pendingLeaves,
      approvedLeavesThisMonth,
    };
  };

  const stats = calculateStats();

  const handlePunchIn = async () => {
    try {
      await dispatch(punchIn()).unwrap();
      toast.success('Punched in successfully!');
      dispatch(fetchMyAttendance());
    } catch (error) {
      toast.error(error || 'Failed to punch in');
    }
  };

  const handlePunchOut = async () => {
    try {
      await dispatch(punchOut()).unwrap();
      toast.success('Punched out successfully!');
      dispatch(fetchMyAttendance());
    } catch (error) {
      toast.error(error || 'Failed to punch out');
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getLeaveStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const dashboardStats = [
    {
      label: 'Attendance This Month',
      value: `${stats.monthAttendance}/${stats.workingDays}`,
      icon: Clock,
      color: 'bg-blue-500',
      percentage: Math.round((stats.monthAttendance / stats.workingDays) * 100),
      trend: 'up',
    },
    {
      label: 'Working Hours',
      value: `${stats.totalHours}h`,
      icon: Timer,
      color: 'bg-purple-500',
      percentage: Math.round((stats.totalHours / (stats.workingDays * 8)) * 100),
      trend: 'up',
    },
    {
      label: 'Pending Requests',
      value: stats.pendingLeaves,
      icon: AlertCircle,
      color: 'bg-yellow-500',
      percentage: null,
      trend: null,
    },
    {
      label: 'Leaves Taken',
      value: stats.approvedLeavesThisMonth,
      icon: Calendar,
      color: 'bg-green-500',
      percentage: null,
      trend: null,
    },
  ];

  return (
    <MainLayout title="Dashboard">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {profile?.name || 'Employee'}! 👋
            </h2>
            <p className="text-blue-100 mb-1">{formatDate(currentTime)}</p>
            <p className="text-3xl font-bold">{formatTime(currentTime)}</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <User size={40} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Offboarding Alert Section */}
      {profile && (profile.status === 'exiting' || profile.status === 'offboarded') && (
        <div className={`${profile.status === 'offboarded' ? 'bg-red-50 border-red-500' : 'bg-orange-50 border-orange-500'} border-l-4 rounded-lg p-6 mb-8 shadow-lg`}>
          <div className="flex items-start gap-4">
            <div className={`${profile.status === 'offboarded' ? 'bg-red-100' : 'bg-orange-100'} p-3 rounded-lg`}>
              <AlertTriangle size={32} className={profile.status === 'offboarded' ? 'text-red-600' : 'text-orange-600'} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-xl font-bold ${profile.status === 'offboarded' ? 'text-red-900' : 'text-orange-900'}`}>
                  {profile.status === 'offboarded' ? 'Offboarding Complete' : 'Offboarding In Progress'}
                </h3>
                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${profile.status === 'offboarded' ? 'bg-red-200 text-red-900' : 'bg-orange-200 text-orange-900'}`}>
                  {profile.status.toUpperCase()}
                </span>
              </div>

              {offboardingInfo ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Calendar size={18} className={`mt-0.5 ${profile.status === 'offboarded' ? 'text-red-600' : 'text-orange-600'}`} />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Last Working Day</p>
                        <p className={`font-semibold ${profile.status === 'offboarded' ? 'text-red-800' : 'text-orange-800'}`}>
                          {new Date(offboardingInfo.lastWorkingDay).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Info size={18} className={`mt-0.5 ${profile.status === 'offboarded' ? 'text-red-600' : 'text-orange-600'}`} />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Reason</p>
                        <p className={`font-semibold ${profile.status === 'offboarded' ? 'text-red-800' : 'text-orange-800'} capitalize`}>
                          {offboardingInfo.reason?.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Clock size={18} className={`mt-0.5 ${profile.status === 'offboarded' ? 'text-red-600' : 'text-orange-600'}`} />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Initiated On</p>
                        <p className={`font-semibold ${profile.status === 'offboarded' ? 'text-red-800' : 'text-orange-800'}`}>
                          {new Date(offboardingInfo.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {profile.status === 'exiting' && (
                      <div className="flex items-start gap-2">
                        <Briefcase size={18} className="mt-0.5 text-orange-600" />
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Days Remaining</p>
                          <p className="font-semibold text-orange-800">
                            {Math.max(0, Math.ceil((new Date(offboardingInfo.lastWorkingDay) - new Date()) / (1000 * 60 * 60 * 24)))} days
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className={`${profile.status === 'offboarded' ? 'text-red-700' : 'text-orange-700'}`}>
                  {profile.status === 'offboarded' 
                    ? 'Your employment has been completed. Thank you for your service.'
                    : 'Your offboarding process has been initiated. Please ensure all handover tasks are completed before your last working day.'}
                </p>
              )}

              {profile.status === 'exiting' && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-orange-200">
                  <p className="text-sm font-semibold text-orange-900 mb-2">Important Reminders:</p>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Complete all pending tasks and handover documentation</li>
                    <li>Return all company equipment and assets</li>
                    <li>Clear all pending expenses and settlements</li>
                    <li>Complete knowledge transfer to your replacement/team</li>
                  </ul>
                </div>
              )}

              {profile.status === 'offboarded' && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm font-semibold text-red-900 mb-2">Your Access:</p>
                  <p className="text-sm text-gray-700">
                    Your account access has been revoked. For any queries regarding final settlement or documents, 
                    please contact HR at <a href="mailto:hr@company.com" className="text-red-600 font-medium hover:underline">hr@company.com</a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, idx) => (
          <Card key={idx} className="border-l-4 border-primary-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                {stat.percentage !== null && (
                  <div className="flex items-center gap-1">
                    <TrendingUp size={16} className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'} />
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.percentage}%
                    </span>
                  </div>
                )}
              </div>
              <div className={`${stat.color} p-4 rounded-lg`}>
                <stat.icon className="text-white" size={28} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Today's Attendance */}
        <Card title="Today's Attendance" className="lg:col-span-1">
          <div className="text-center py-6">
            {todayAttendance ? (
              <div className="space-y-4">
                <div className={`${isPunchedIn ? 'bg-green-100' : 'bg-gray-100'} p-4 rounded-lg`}>
                  {isPunchedIn ? (
                    <CheckCircle size={48} className="mx-auto text-green-600 mb-3" />
                  ) : (
                    <Clock size={48} className="mx-auto text-gray-400 mb-3" />
                  )}
                  <p className="font-semibold text-lg mb-1">
                    {isPunchedIn ? 'Currently Working' : 'Work Complete'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Punch In: {new Date(todayAttendance.punchIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {todayAttendance.punchOut && (
                    <>
                      <p className="text-sm text-gray-600">
                        Punch Out: {new Date(todayAttendance.punchOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm font-semibold text-gray-800 mt-2">
                        Total Hours: {todayAttendance.totalHours?.toFixed(2) || 0}h
                      </p>
                    </>
                  )}
                </div>
                {isPunchedIn && (
                  <Button
                    onClick={handlePunchOut}
                    variant="danger"
                    className="w-full"
                    disabled={attendanceLoading}
                  >
                    <LogOut size={18} className="mr-2" />
                    Punch Out
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Clock size={48} className="mx-auto text-primary-600 mb-3" />
                <p className="text-gray-600 mb-4">Start your workday</p>
                <Button
                  onClick={handlePunchIn}
                  variant="primary"
                  className="w-full"
                  disabled={attendanceLoading}
                >
                  <LogIn size={18} className="mr-2" />
                  {attendanceLoading ? 'Processing...' : 'Punch In'}
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions" className="lg:col-span-1">
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/employee/leaves')}
              variant="outline"
              className="w-full justify-start"
            >
              <Calendar size={18} className="mr-2" />
              Apply for Leave
            </Button>
            <Button
              onClick={() => navigate('/employee/attendance')}
              variant="outline"
              className="w-full justify-start"
            >
              <BarChart3 size={18} className="mr-2" />
              View Attendance
            </Button>
            <Button
              onClick={() => navigate('/employee/profile')}
              variant="outline"
              className="w-full justify-start"
            >
              <User size={18} className="mr-2" />
              My Profile
            </Button>
            <Button
              onClick={() => navigate('/employee/announcements')}
              variant="outline"
              className="w-full justify-start"
            >
              <Bell size={18} className="mr-2" />
              Announcements
            </Button>
          </div>
        </Card>

        {/* Recent Announcements */}
        <Card title="Recent Announcements" className="lg:col-span-1">
          {announcements && announcements.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {announcements.slice(0, 3).map((announcement, idx) => (
                <div key={idx} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start gap-2">
                    <Bell size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">{announcement.title}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {announcement.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">No announcements</p>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Leaves */}
      <Card title="Recent Leave Requests" className="mb-8">
        {leavesLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : leaves && leaves.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Leave Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Applied On</th>
                </tr>
              </thead>
              <tbody>
                {leaves.slice(0, 5).map((leave, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {new Date(leave.fromDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(leave.toDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getLeaveStatusColor(leave.status)}`}>
                        {leave.status === 'approved' && <CheckCircle size={14} className="mr-1" />}
                        {leave.status === 'rejected' && <XCircle size={14} className="mr-1" />}
                        {leave.status === 'pending' && <Clock size={14} className="mr-1" />}
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(leave.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No leave requests yet</p>
            <Button
              onClick={() => navigate('/employee/leaves')}
              variant="primary"
              className="mt-4"
            >
              Apply for Leave
            </Button>
          </div>
        )}
      </Card>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="This Week's Attendance">
          <div className="space-y-3">
            {attendanceList && attendanceList.length > 0 ? (
              attendanceList.slice(0, 7).map((record, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${record.punchOut ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      {record.punchOut ? (
                        <CheckCircle size={20} className="text-green-600" />
                      ) : (
                        <Clock size={20} className="text-yellow-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(record.punchIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        {record.punchOut && ` - ${new Date(record.punchOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                      </p>
                    </div>
                  </div>
                  {record.totalHours && (
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">{record.totalHours.toFixed(2)}h</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500 text-sm">No attendance records</p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Performance Overview">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BarChart3 size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-xl font-bold text-gray-800">
                    {Math.round((stats.monthAttendance / stats.workingDays) * 100)}%
                  </p>
                </div>
              </div>
              <TrendingUp size={24} className="text-green-500" />
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Timer size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Daily Hours</p>
                  <p className="text-xl font-bold text-gray-800">
                    {stats.monthAttendance > 0 ? (stats.totalHours / stats.monthAttendance).toFixed(1) : 0}h
                  </p>
                </div>
              </div>
              <TrendingUp size={24} className="text-green-500" />
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Calendar size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">On-Time Punches</p>
                  <p className="text-xl font-bold text-gray-800">
                    {stats.monthAttendance}
                  </p>
                </div>
              </div>
              <CheckCircle size={24} className="text-green-500" />
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default EmployeeDashboard;