import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyAttendance, punchIn, punchOut } from '../../features/attendance/attendanceThunks';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import {
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  LogIn,
  LogOut,
  Timer,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
} from 'lucide-react';
import { toast } from 'react-toastify';

const MyAttendancePage = () => {
  const dispatch = useDispatch();
  const { attendanceList, loading, error } = useSelector((state) => state.attendance);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterType, setFilterType] = useState('all'); // all, present, absent
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [isPunchedIn, setIsPunchedIn] = useState(false);

  useEffect(() => {
    dispatch(fetchMyAttendance());
  }, [dispatch]);

  // Check today's attendance
  useEffect(() => {
    if (attendanceList && attendanceList.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = attendanceList.find((record) => record.date === today);
      if (todayRecord) {
        setTodayAttendance(todayRecord);
        setIsPunchedIn(!todayRecord.punchOut);
      } else {
        setTodayAttendance(null);
        setIsPunchedIn(false);
      }
    }
  }, [attendanceList]);

  const handlePunchIn = async () => {
    try {
      await dispatch(punchIn()).unwrap();
      dispatch(fetchMyAttendance());
    } catch (error) {
      toast.error(error || 'Failed to punch in');
    }
  };

  const handlePunchOut = async () => {
    try {
      await dispatch(punchOut()).unwrap();
      dispatch(fetchMyAttendance());
    } catch (error) {
      toast.error(error || 'Failed to punch out');
    }
  };

  // Get attendance for selected month
  const getMonthAttendance = () => {
    if (!attendanceList) return [];
    return attendanceList.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === selectedMonth &&
        recordDate.getFullYear() === selectedYear
      );
    });
  };

  const monthAttendance = getMonthAttendance();

  // Calculate statistics
  const calculateStats = () => {
    const totalDays = monthAttendance.length;
    const presentDays = monthAttendance.filter((r) => r.punchIn).length;
    const totalHours = monthAttendance.reduce((sum, r) => sum + (r.totalHours || 0), 0);
    const avgHours = totalDays > 0 ? totalHours / totalDays : 0;
    const onTimeDays = monthAttendance.filter((r) => {
      if (!r.punchIn) return false;
      const punchInTime = new Date(r.punchIn).getHours();
      return punchInTime <= 9; // Assuming 9 AM is on-time
    }).length;

    return {
      totalDays,
      presentDays,
      totalHours: Math.round(totalHours * 10) / 10,
      avgHours: Math.round(avgHours * 10) / 10,
      onTimeDays,
      lateArrivals: presentDays - onTimeDays,
    };
  };

  const stats = calculateStats();

  // Calendar helpers
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      selectedMonth === today.getMonth() &&
      selectedYear === today.getFullYear()
    );
  };

  const getAttendanceForDate = (day) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return monthAttendance.find((r) => r.date === dateStr);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const attendance = getAttendanceForDate(day);
      const isTodayDate = isToday(day);
      const isPast = new Date(selectedYear, selectedMonth, day) < new Date().setHours(0, 0, 0, 0);

      days.push(
        <div
          key={day}
          className={`p-2 border rounded-lg min-h-[80px] ${
            isTodayDate ? 'border-blue-500 border-2 bg-blue-50' : 'border-gray-200'
          } ${attendance ? 'bg-green-50' : isPast ? 'bg-gray-50' : 'bg-white'}`}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-semibold ${isTodayDate ? 'text-blue-600' : 'text-gray-700'}`}>
              {day}
            </span>
            {attendance && (
              <CheckCircle size={16} className="text-green-600" />
            )}
          </div>
          {attendance && (
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-1">
                <LogIn size={12} className="text-gray-500" />
                <span>{new Date(attendance.punchIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {attendance.punchOut && (
                <div className="flex items-center gap-1">
                  <LogOut size={12} className="text-gray-500" />
                  <span>{new Date(attendance.punchOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
              {attendance.totalHours && (
                <div className="font-semibold text-green-700">
                  {attendance.totalHours.toFixed(1)}h
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const filteredAttendance = () => {
    let filtered = monthAttendance;
    if (filterType === 'present') {
      filtered = monthAttendance.filter((r) => r.punchIn);
    } else if (filterType === 'late') {
      filtered = monthAttendance.filter((r) => {
        if (!r.punchIn) return false;
        const punchInTime = new Date(r.punchIn).getHours();
        return punchInTime > 9;
      });
    }
    return filtered;
  };

  const downloadAttendance = () => {
    const csv = [
      ['Date', 'Punch In', 'Punch Out', 'Total Hours'],
      ...monthAttendance.map((r) => [
        r.date,
        r.punchIn ? new Date(r.punchIn).toLocaleTimeString() : '-',
        r.punchOut ? new Date(r.punchOut).toLocaleTimeString() : '-',
        r.totalHours?.toFixed(2) || '-',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${monthNames[selectedMonth]}-${selectedYear}.csv`;
    a.click();
    toast.success('Attendance downloaded successfully!');
  };

  return (
    <MainLayout title="My Attendance">
      {/* Today's Status Card */}
      <Card className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white border-none">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Clock className='text-black' size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Today's Attendance</h2>
              <p className="text-blue-100">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            {todayAttendance ? (
              <div className="bg-white bg-opacity-20 rounded-lg p-4 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  {isPunchedIn ? (
                    <CheckCircle size={20} className="text-red-500" />
                  ) : (
                    <CheckCircle size={20} className="text-green-600" />
                  )}
                  <span className="font-semibold text-md text-green-700">
                    {isPunchedIn ? 'Currently Working' : 'Work Complete'}
                  </span>
                </div>
                <div className="space-y-1 text-black text-sm">
                  <p>In: {new Date(todayAttendance.punchIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  {todayAttendance.punchOut && (
                    <p>Out: {new Date(todayAttendance.punchOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  )}
                  {todayAttendance.totalHours && (
                    <p className="font-bold text-lg">{todayAttendance.totalHours.toFixed(2)}h</p>
                  )}
                </div>
                {isPunchedIn && (
                  <Button
                    onClick={handlePunchOut}
                    variant="secondary"
                    className="mt-3 w-full bg-white text-blue-600 hover:bg-gray-100"
                    disabled={loading}
                  >
                    <LogOut size={16} className="mr-2" />
                    Punch Out
                  </Button>
                )}
              </div>
            ) : (
              <div className="bg-white bg-opacity-20 rounded-lg p-4 min-w-[200px] text-center">
                <p className="mb-3 text-red-500">Not punched in yet</p>
                <Button
                  onClick={handlePunchIn}
                  variant="secondary"
                  className="w-full bg-white text-blue-600 hover:bg-gray-100"
                  disabled={loading}
                >
                  <LogIn size={16} className="mr-2" />
                  Punch In
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Days Present</p>
              <p className="text-3xl font-bold text-gray-800">{stats.presentDays}</p>
              <p className="text-xs text-gray-500 mt-1">out of {stats.totalDays} days</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <CheckCircle size={28} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Hours</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalHours}h</p>
              <p className="text-xs text-gray-500 mt-1">Avg: {stats.avgHours}h/day</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Timer size={28} className="text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">On-Time Arrivals</p>
              <p className="text-3xl font-bold text-gray-800">{stats.onTimeDays}</p>
              <p className="text-xs text-gray-500 mt-1">Before 9:00 AM</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp size={28} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Late Arrivals</p>
              <p className="text-3xl font-bold text-gray-800">{stats.lateArrivals}</p>
              <p className="text-xs text-gray-500 mt-1">After 9:00 AM</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock size={28} className="text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Calendar View */}
      <Card className="mb-8 hidden md:block">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Button onClick={handlePrevMonth} variant="outline" size="sm">
              <ChevronLeft size={20} />
            </Button>
            <h2 className="text-2xl font-bold text-gray-800">
              {monthNames[selectedMonth]} {selectedYear}
            </h2>
            <Button onClick={handleNextMonth} variant="outline" size="sm">
              <ChevronRight size={20} />
            </Button>
          </div>
          <Button onClick={downloadAttendance} variant="outline">
            <Download size={18} className="mr-2" />
            Download Report
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600 text-sm p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {renderCalendar()}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-gray-600">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
            <span className="text-gray-600">Absent/Not Marked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-50 border-2 border-blue-500 rounded"></div>
            <span className="text-gray-600">Today</span>
          </div>
        </div>
      </Card>

      {/* Detailed Records */}
      <Card>
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-gray-800">Attendance Records</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setFilterType('all')}
              variant={filterType === 'all' ? 'primary' : 'outline'}
              size="sm"
            >
              All
            </Button>
            <Button
              onClick={() => setFilterType('present')}
              variant={filterType === 'present' ? 'primary' : 'outline'}
              size="sm"
            >
              Present
            </Button>
            <Button
              onClick={() => setFilterType('late')}
              variant={filterType === 'late' ? 'primary' : 'outline'}
              size="sm"
            >
              Late
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <XCircle size={48} className="mx-auto text-red-500 mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : filteredAttendance().length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Day</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Punch In</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Punch Out</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total Hours</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance().map((record, idx) => {
                  const recordDate = new Date(record.date);
                  const punchInTime = record.punchIn ? new Date(record.punchIn).getHours() : null;
                  const isLate = punchInTime && punchInTime > 9;
                  const isComplete = record.punchOut;

                  return (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">
                        {recordDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {recordDate.toLocaleDateString('en-US', { weekday: 'long' })}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {record.punchIn ? (
                          <span className={isLate ? 'text-orange-600 font-medium' : ''}>
                            {new Date(record.punchIn).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {record.punchOut
                          ? new Date(record.punchOut).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                        {record.totalHours ? `${record.totalHours.toFixed(2)}h` : '-'}
                      </td>
                      <td className="py-3 px-4">
                        {isComplete ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={14} className="mr-1" />
                            Complete
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock size={14} className="mr-1" />
                            In Progress
                          </span>
                        )}
                        {isLate && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Late
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No attendance records found</p>
            <p className="text-sm text-gray-400 mt-1">
              {filterType !== 'all'
                ? `No ${filterType} records for this month`
                : 'Start marking your attendance'}
            </p>
          </div>
        )}
      </Card>
    </MainLayout>
  );
};

export default MyAttendancePage;