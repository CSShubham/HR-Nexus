// src/pages/hr/AttendancePage.jsx - COMPLETE VERSION
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {getLocalDateString} from '../../utils/formatters'
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  RefreshCw,
  TrendingUp
} from 'lucide-react';
import { fetchAllAttendance } from '../../features/attendance/attendanceThunks';
import { formatDate, formatTime, formatHours } from '../../utils/formatters';

const AttendancePage = () => {
  const dispatch = useDispatch();
  const { attendanceList, loading, error } = useSelector((state) => state.attendance);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  useEffect(() => {
    dispatch(fetchAllAttendance());
  }, [dispatch]);

  // Get unique departments
  const departments = [...new Set(
    attendanceList?.map(a => a.employeeId?.department).filter(Boolean)
  )] || [];

  // Filter attendance records
  const filteredAttendance = attendanceList?.filter(record => {
    // Search filter
    const matchesSearch = 
      record.employeeId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId?.department?.toLowerCase().includes(searchTerm.toLowerCase());

    // Department filter
    const matchesDepartment = 
      departmentFilter === 'all' || 
      record.employeeId?.department === departmentFilter;

    // Date filter
    let matchesDate = true;
    const recordDate = new Date(record.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case 'today':
        // const todayStr = today.toISOString().split('T')[0];
        const todayStr = getLocalDateString();
        // console.log("Filtering for today's date string:", todayStr);
        matchesDate = record.date === todayStr;
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        matchesDate = record.date === yesterday.toISOString().split('T')[0];
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchesDate = recordDate >= weekAgo;
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchesDate = recordDate >= monthAgo;
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate);
          const end = new Date(customEndDate);
          matchesDate = recordDate >= start && recordDate <= end;
        }
        break;
      default:
        matchesDate = true;
    }

    return matchesSearch && matchesDepartment && matchesDate;
  }) || [];

  // Calculate statistics
  const stats = [
    {
      label: 'Total Records',
      value: filteredAttendance.length,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Present Today',
      value: filteredAttendance.filter(a => {
        const today = getLocalDateString();
        return a.date === today && a.punchIn;
      }).length,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      label: 'Not Punched Out',
      value: filteredAttendance.filter(a => a.punchIn && !a.punchOut).length,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      label: 'Avg Hours',
      value: (filteredAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0) / 
             (filteredAttendance.filter(a => a.totalHours).length || 1)).toFixed(1) + 'h',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  const handleRefresh = () => {
    dispatch(fetchAllAttendance());
  };

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Employee ID', 'Name', 'Department', 'Punch In', 'Punch Out', 'Total Hours'],
      ...filteredAttendance.map(a => [
        a.date,
        a.employeeId?.employeeId || '',
        a.employeeId?.name || '',
        a.employeeId?.department || '',
        formatTime(a.punchIn),
        formatTime(a.punchOut),
        a.totalHours || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${getLocalDateString()}.csv`;
    a.click();
  };

  return (
    <MainLayout title="Attendance Management">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-l-4 border-primary-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Card */}
      <Card>
        {/* Filters Section */}
        <div className="space-y-4 mb-6">
          {/* Top Row: Search and Actions */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, employee ID, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                icon={RefreshCw}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
              <Button
                variant="outline"
                icon={Download}
                onClick={handleExport}
                disabled={filteredAttendance.length === 0}
              >
                Export
              </Button>
            </div>
          </div>

          {/* Bottom Row: Date and Department Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-500" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Custom Date Range */}
            {dateFilter === 'custom' && (
              <>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="End Date"
                />
              </>
            )}

            {/* Department Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600 ml-auto">
              Showing {filteredAttendance.length} of {attendanceList?.length || 0} records
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Attendance Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : filteredAttendance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Punch In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Punch Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(record.date)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {record.employeeId?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.employeeId?.employeeId || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {record.employeeId?.department || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-green-500" />
                        <span className="text-sm text-gray-900">
                          {formatTime(record.punchIn)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {record.punchOut ? (
                          <>
                            <Clock size={16} className="text-red-500" />
                            <span className="text-sm text-gray-900">
                              {formatTime(record.punchOut)}
                            </span>
                          </>
                        ) : (
                          <Badge variant="warning" size="sm">Active</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {record.totalHours ? formatHours(record.totalHours) : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.punchOut ? (
                        <Badge variant="success" size="sm">
                          <CheckCircle size={14} className="mr-1" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="warning" size="sm">
                          <Clock size={14} className="mr-1" />
                          In Progress
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm || dateFilter !== 'all' || departmentFilter !== 'all'
                ? 'No attendance records found matching your filters'
                : 'No attendance records yet'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm || dateFilter !== 'all' || departmentFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Attendance records will appear here'}
            </p>
          </div>
        )}
      </Card>

      {/* Summary Cards at Bottom */}
      {filteredAttendance.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card title="Today's Summary">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Punched In:</span>
                <span className="font-semibold text-gray-900">
                  {filteredAttendance.filter(a => {
                    const today = getLocalDateString();
                    return a.date === today && a.punchIn;
                  }).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed:</span>
                <span className="font-semibold text-gray-900">
                  {filteredAttendance.filter(a => {
                    const today = getLocalDateString();
                    return a.date === today && a.punchOut;
                  }).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Still Active:</span>
                <span className="font-semibold text-yellow-600">
                  {filteredAttendance.filter(a => {
                    const today = getLocalDateString();
                    return a.date === today && a.punchIn && !a.punchOut;
                  }).length}
                </span>
              </div>
            </div>
          </Card>

          <Card title="Department Breakdown">
            <div className="space-y-2">
              {departments.slice(0, 5).map(dept => (
                <div key={dept} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{dept}:</span>
                  <span className="font-semibold text-gray-900">
                    {filteredAttendance.filter(a => a.employeeId?.department === dept).length}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Hours Summary">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Hours:</span>
                <span className="font-semibold text-gray-900">
                  {formatHours(filteredAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0))}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average:</span>
                <span className="font-semibold text-gray-900">
                  {formatHours(
                    filteredAttendance.reduce((sum, a) => sum + (a.totalHours || 0), 0) / 
                    (filteredAttendance.filter(a => a.totalHours).length || 1)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Records:</span>
                <span className="font-semibold text-gray-900">
                  {filteredAttendance.filter(a => a.totalHours).length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </MainLayout>
  );
};

export default AttendancePage;