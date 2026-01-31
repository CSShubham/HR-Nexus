import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyLeaves, applyLeave } from '../../features/leaves/leavesThunks';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ApplyLeaveModal from '../../features/leaves/components/ApplyLeaveModal';
import { formatDate } from '../../utils/formatters';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Download,
  TrendingUp,
  FileText,
  MessageSquare,
  User,
} from 'lucide-react';
import { toast } from 'react-toastify';

const MyLeavesPage = () => {
  const dispatch = useDispatch();
  const { leaves, loading, error } = useSelector((state) => state.leaves);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, approved, rejected
  const [selectedLeaveType, setSelectedLeaveType] = useState('all'); // all, casual, sick, earned, unpaid

  useEffect(() => {
    dispatch(fetchMyLeaves());
  }, [dispatch]);

  const handleApplyLeave = async (formData) => {
    try {
      await dispatch(applyLeave(formData)).unwrap();
      setIsApplyModalOpen(false);
      dispatch(fetchMyLeaves());
    } catch (error) {
      toast.error(error || 'Failed to apply leave');
    }
  };

  // Calculate leave statistics
  const calculateLeaveStats = () => {
    if (!leaves || leaves.length === 0) {
      return {
        totalLeaves: 0,
        pendingLeaves: 0,
        approvedLeaves: 0,
        rejectedLeaves: 0,
        casualLeaves: 0,
        sickLeaves: 0,
        earnedLeaves: 0,
        unpaidLeaves: 0,
        totalDaysTaken: 0,
      };
    }

    const stats = {
      totalLeaves: leaves.length,
      pendingLeaves: leaves.filter((l) => l.status === 'pending').length,
      approvedLeaves: leaves.filter((l) => l.status === 'approved').length,
      rejectedLeaves: leaves.filter((l) => l.status === 'rejected').length,
      casualLeaves: leaves.filter((l) => l.leaveType === 'casual').length,
      sickLeaves: leaves.filter((l) => l.leaveType === 'sick').length,
      earnedLeaves: leaves.filter((l) => l.leaveType === 'earned').length,
      unpaidLeaves: leaves.filter((l) => l.leaveType === 'unpaid').length,
      totalDaysTaken: 0,
    };

    // Calculate total days taken (only approved leaves)
    leaves
      .filter((l) => l.status === 'approved')
      .forEach((leave) => {
        const fromDate = new Date(leave.fromDate);
        const toDate = new Date(leave.toDate);
        const diffTime = Math.abs(toDate - fromDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end date
        stats.totalDaysTaken += diffDays;
      });

    return stats;
  };

  const stats = calculateLeaveStats();

  // Filter leaves based on status and type
  const getFilteredLeaves = () => {
    if (!leaves) return [];

    let filtered = [...leaves];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((leave) => leave.status === filterStatus);
    }

    // Filter by leave type
    if (selectedLeaveType !== 'all') {
      filtered = filtered.filter((leave) => leave.leaveType === selectedLeaveType);
    }

    return filtered;
  };

  const filteredLeaves = getFilteredLeaves();

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case 'casual':
        return 'bg-blue-100 text-blue-800';
      case 'sick':
        return 'bg-red-100 text-red-800';
      case 'earned':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateLeaveDays = (fromDate, toDate) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };


  const downloadLeaveReport = () => {
    const csv = [
      ['Leave Type', 'From Date', 'To Date', 'Days', 'Reason', 'Status', 'Applied On', 'Remarks'],
      ...leaves.map((leave) => [
        leave.leaveType,
        new Date(leave.fromDate).toLocaleDateString(),
        new Date(leave.toDate).toLocaleDateString(),
        calculateLeaveDays(leave.fromDate, leave.toDate),
        leave.reason,
        leave.status,
        new Date(leave.createdAt).toLocaleDateString(),
        leave.remarks || '-',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-leaves-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Leave report downloaded successfully!');
  };

  return (
    <MainLayout title="My Leaves">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">My Leave Requests</h1>
          <p className="text-gray-600">Manage and track your leave applications</p>
        </div>
        <div className="flex *:text-xs md:*:text-base gap-3">
          <Button onClick={downloadLeaveReport} variant="outline" disabled={!leaves || leaves.length === 0}>
            <Download size={18} className="mr-2" />
            Download Report
          </Button>
          <Button onClick={() => setIsApplyModalOpen(true)} variant="primary">
            <Plus size={18} className="mr-2" />
            Apply for Leave
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Leaves</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalLeaves}</p>
              <p className="text-xs text-gray-500 mt-1">All applications</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText size={28} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-800">{stats.pendingLeaves}</p>
              <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock size={28} className="text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Approved</p>
              <p className="text-3xl font-bold text-gray-800">{stats.approvedLeaves}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.totalDaysTaken} days taken</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle size={28} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-red-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-gray-800">{stats.rejectedLeaves}</p>
              <p className="text-xs text-gray-500 mt-1">Not approved</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle size={28} className="text-red-600" />
            </div>
          </div>
        {/* </div> */}
        </Card>
      </div>
  

      {/* Leave Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Leave Type Distribution">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                  C
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Casual Leave</p>
                  <p className="text-xs text-gray-500">{stats.casualLeaves} applications</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{stats.casualLeaves}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Sick Leave</p>
                  <p className="text-xs text-gray-500">{stats.sickLeaves} applications</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{stats.sickLeaves}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                  E
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Earned Leave</p>
                  <p className="text-xs text-gray-500">{stats.earnedLeaves} applications</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{stats.earnedLeaves}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center text-white font-bold">
                  U
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Unpaid Leave</p>
                  <p className="text-xs text-gray-500">{stats.unpaidLeaves} applications</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-600">{stats.unpaidLeaves}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Leave Balance Overview">
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
              <p className="text-sm opacity-90 mb-1">Total Days Taken (Approved)</p>
              <p className="text-4xl font-bold mb-2">{stats.totalDaysTaken}</p>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={16} />
                <span>This year</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-gray-600 mb-1">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pendingLeaves}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 mb-1">Approved</p>
                <p className="text-2xl font-bold text-green-700">{stats.approvedLeaves}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Quick Tips</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Apply for leave at least 3 days in advance</li>
                <li>• Provide detailed reason for approval</li>
                <li>• Check your leave balance regularly</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Leave History */}
      <Card>
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold text-gray-800">Leave History</h2>
          <div className="flex gap-3 flex-wrap">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setFilterStatus('all')}
                variant={filterStatus === 'all' ? 'primary' : 'outline'}
                size="sm"
              >
                All
              </Button>
              <Button
                onClick={() => setFilterStatus('pending')}
                variant={filterStatus === 'pending' ? 'primary' : 'outline'}
                size="sm"
              >
                Pending
              </Button>
              <Button
                onClick={() => setFilterStatus('approved')}
                variant={filterStatus === 'approved' ? 'primary' : 'outline'}
                size="sm"
              >
                Approved
              </Button>
              <Button
                onClick={() => setFilterStatus('rejected')}
                variant={filterStatus === 'rejected' ? 'primary' : 'outline'}
                size="sm"
              >
                Rejected
              </Button>
            </div>

            <select
              value={selectedLeaveType}
              onChange={(e) => setSelectedLeaveType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="casual">Casual</option>
              <option value="sick">Sick</option>
              <option value="earned">Earned</option>
              <option value="unpaid">Unpaid</option>
            </select>
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
        ) : filteredLeaves.length > 0 ? (
          <div className="space-y-4">
            {filteredLeaves.map((leave, idx) => (
              
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <Calendar size={20} className="text-gray-400 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(leave.leaveType)}`}>
                            {leave.leaveType ? leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1) : 'Unknown'} Leave
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(leave.status)} flex items-center gap-1`}>
                            {getStatusIcon(leave.status)}
                            {leave.status ? leave.status.charAt(0).toUpperCase() + leave.status.slice(1) : 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="font-medium">
                            {formatDate(leave.fromDate)}
                          </span>
                          <span>→</span>
                          <span className="font-medium">
                            {formatDate(leave.toDate)}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                            {calculateLeaveDays(leave.fromDate, leave.toDate)} day{calculateLeaveDays(leave.fromDate, leave.toDate) > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MessageSquare size={16} className="text-gray-400 mt-0.5" />
                          <p className="text-gray-700">{leave.reason}</p>
                        </div>
                      </div>
                    </div>

                    {leave.remarks && (
                      <div className="ml-8 mt-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <p className="text-xs font-semibold text-blue-900 mb-1">HR Remarks:</p>
                        <p className="text-sm text-blue-800">{leave.remarks}</p>
                      </div>
                    )}
                  </div>

                  <div className="lg:text-right">
                    <p className="text-xs text-gray-500 mb-1">Applied on</p>
                    <p className="text-sm font-medium text-gray-800">
                      {formatDate(leave.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium mb-2">
              {filterStatus !== 'all' || selectedLeaveType !== 'all'
                ? 'No leaves found matching the filters'
                : 'No leave requests yet'}
            </p>
            <p className="text-sm text-gray-400 mb-4">
              {filterStatus === 'all' && selectedLeaveType === 'all'
                ? 'Start by applying for your first leave'
                : 'Try adjusting your filters'}
            </p>
            {filterStatus === 'all' && selectedLeaveType === 'all' && (
              <Button onClick={() => setIsApplyModalOpen(true)} variant="primary">
                <Plus size={18} className="mr-2" />
                Apply for Leave
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Apply Leave Modal */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleApplyLeave}
        loading={loading}
      />
    </MainLayout>
  );
};

export default MyLeavesPage;