// src/pages/hr/LeavesPage.jsx - COMPLETE VERSION
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../components/layout/MainLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import {
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  fetchAllLeaves,
  updateLeaveStatus,
} from "../../features/leaves/leavesThunks";
import LeaveApprovalModal from "../../features/leaves/components/LeaveApprovalModal";
import { formatDate } from "../../utils/formatters";

const LeavesPage = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = 10;
  const { leaves, loading, error, page: currentPage, pages } = useSelector((state) => state.leaves);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // useEffect(() => {
  //   dispatch(fetchAllLeaves());
  // }, [dispatch]);
  useEffect(() => {
    dispatch(fetchAllLeaves({ page, limit }));
  }, [dispatch, page]);

  // Filter leaves
  const filteredLeaves =
    leaves?.filter((leave) => {
      // Search filter
      const matchesSearch =
        leave.employeeId?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        leave.employeeId?.employeeId
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        leave.employeeId?.department
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || leave.status === statusFilter;

      // Leave type filter
      const matchesLeaveType =
        leaveTypeFilter === "all" || leave.leaveType === leaveTypeFilter;

      // Date filter
      let matchesDate = true;
      const today = new Date();
      const fromDate = new Date(leave.fromDate);
      const toDate = new Date(leave.toDate);

      switch (dateFilter) {
        case "upcoming":
          matchesDate = fromDate > today;
          break;
        case "ongoing":
          matchesDate = fromDate <= today && toDate >= today;
          break;
        case "past":
          matchesDate = toDate < today;
          break;
        default:
          matchesDate = true;
      }

      return matchesSearch && matchesStatus && matchesLeaveType && matchesDate;
    }) || [];

  // Calculate statistics
  const stats = [
    {
      label: "Total Requests",
      value: leaves?.length || 0,
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      label: "Pending",
      value: leaves?.filter((l) => l.status === "pending").length || 0,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      label: "Approved",
      value: leaves?.filter((l) => l.status === "approved").length || 0,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      label: "Rejected",
      value: leaves?.filter((l) => l.status === "rejected").length || 0,
      icon: XCircle,
      color: "bg-red-500",
    },
  ];

  // Calculate days
  const calculateDays = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return diff;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "danger";
      default:
        return "default";
    }
  };

  const getLeaveTypeColor = (type) => {
    switch (type) {
      case "sick":
        return "bg-red-100 text-red-800";
      case "casual":
        return "bg-blue-100 text-blue-800";
      case "earned":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleRefresh = () => {
    dispatch(fetchAllLeaves({ page, limit }));
  };

  const handleApprove = (leave) => {
    setSelectedLeave(leave);
    setShowApprovalModal(true);
  };

  const handleApproveConfirm = async (leaveId, data) => {
    try {
      await dispatch(
        updateLeaveStatus({
          id: leaveId,
          status: data.status,
          remarks: data.approverNotes,
        }),
      ).unwrap();
      setShowApprovalModal(false);
      setSelectedLeave(null);
      dispatch(fetchAllLeaves());
    } catch (error) {
      console.error("Failed to update leave status:", error);
    }
  };

  const handleReject = async (leaveId, data) => {
    try {
      await dispatch(
        updateLeaveStatus({
          id: leaveId,
          status: data.status,
          remarks: data.approverNotes,
        }),
      ).unwrap();
      setShowApprovalModal(false);
      setSelectedLeave(null);
      dispatch(fetchAllLeaves());
    } catch (error) {
      console.error("Failed to update leave status:", error);
    }
  };

  const handleExport = () => {
    const csvContent = [
      [
        "Date Applied",
        "Employee ID",
        "Name",
        "Department",
        "Leave Type",
        "From",
        "To",
        "Days",
        "Status",
        "Reason",
      ],
      ...filteredLeaves.map((l) => [
        formatDate(l.createdAt),
        l.employeeId?.employeeId || "",
        l.employeeId?.name || "",
        l.employeeId?.department || "",
        l.leaveType || "",
        formatDate(l.fromDate),
        formatDate(l.toDate),
        calculateDays(l.fromDate, l.toDate),
        l.status || "",
        l.reason || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leaves_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <MainLayout title="Leave Management">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-l-4 border-primary-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center`}
              >
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
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
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
                disabled={filteredLeaves.length === 0}
              >
                Export
              </Button>
            </div>
          </div>

          {/* Bottom Row: Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Leave Type Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={leaveTypeFilter}
                onChange={(e) => setLeaveTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Types</option>
                <option value="casual">Casual</option>
                <option value="sick">Sick</option>
                <option value="earned">Earned</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-500" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Dates</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="past">Past</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600 ml-auto">
              Showing {filteredLeaves.length} of {leaves?.length || 0} requests
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Leave Requests List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : filteredLeaves.length > 0 ? (
          <div className="space-y-4">
            {filteredLeaves.map((leave) => (
              <div
                key={leave._id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 font-semibold text-lg">
                        {leave.employeeId?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>

                    {/* Employee Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {leave.employeeId?.name || "Unknown"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {leave.employeeId?.employeeId} •{" "}
                        {leave.employeeId?.department}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getLeaveTypeColor(leave.leaveType)}`}
                    >
                      {leave.leaveType?.toUpperCase()}
                    </span>
                    <Badge variant={getStatusColor(leave.status)}>
                      {leave.status?.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Leave Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      From
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(leave.fromDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      To
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(leave.toDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Duration
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {calculateDays(leave.fromDate, leave.toDate)} days
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Applied On
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(leave.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                {leave.reason && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Reason
                    </p>
                    <p className="text-sm text-gray-700">{leave.reason}</p>
                  </div>
                )}

                {/* Approver Notes */}
                {leave.remarks && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600 uppercase tracking-wide font-medium mb-1">
                      Approver Notes
                    </p>
                    <p className="text-sm text-blue-900">{leave.remarks}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  {leave.status === "pending" && (
                    <>
                      <Button
                        onClick={() => handleApprove(leave)}
                        variant="success"
                        size="sm"
                        icon={CheckCircle}
                        className="flex-1"
                      >
                        Review
                      </Button>
                    </>
                  )}
                  {leave.status !== "pending" && (
                    <div className="flex-1 text-sm text-gray-500 italic">
                      {leave.status === "approved"
                        ? "✓ Approved"
                        : "✗ Rejected"}{" "}
                      on {formatDate(leave.updatedAt)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ||
              statusFilter !== "all" ||
              leaveTypeFilter !== "all" ||
              dateFilter !== "all"
                ? "No leave requests found matching your filters"
                : "No leave requests yet"}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ||
              statusFilter !== "all" ||
              leaveTypeFilter !== "all" ||
              dateFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Leave requests will appear here"}
            </p>
          </div>
        )}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded ${
                  page === i + 1 ? "bg-primary-600 text-white" : "border"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </Card>

      {/* Summary Cards at Bottom */}
      {filteredLeaves.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card title="Leave Type Breakdown">
            <div className="space-y-2">
              {["casual", "sick", "earned", "unpaid"].map((type) => (
                <div
                  key={type}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-600 capitalize">{type}:</span>
                  <span className="font-semibold text-gray-900">
                    {filteredLeaves.filter((l) => l.leaveType === type).length}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Total Days Requested">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">All Leaves:</span>
                <span className="font-semibold text-gray-900">
                  {filteredLeaves.reduce(
                    (sum, l) => sum + calculateDays(l.fromDate, l.toDate),
                    0,
                  )}{" "}
                  days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved:</span>
                <span className="font-semibold text-green-600">
                  {filteredLeaves
                    .filter((l) => l.status === "approved")
                    .reduce(
                      (sum, l) => sum + calculateDays(l.fromDate, l.toDate),
                      0,
                    )}{" "}
                  days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending:</span>
                <span className="font-semibold text-yellow-600">
                  {filteredLeaves
                    .filter((l) => l.status === "pending")
                    .reduce(
                      (sum, l) => sum + calculateDays(l.fromDate, l.toDate),
                      0,
                    )}{" "}
                  days
                </span>
              </div>
            </div>
          </Card>

          <Card title="Quick Stats">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg Duration:</span>
                <span className="font-semibold text-gray-900">
                  {(
                    filteredLeaves.reduce(
                      (sum, l) => sum + calculateDays(l.fromDate, l.toDate),
                      0,
                    ) / (filteredLeaves.length || 1)
                  ).toFixed(1)}{" "}
                  days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approval Rate:</span>
                <span className="font-semibold text-gray-900">
                  {(
                    (filteredLeaves.filter((l) => l.status === "approved")
                      .length /
                      (filteredLeaves.filter((l) => l.status !== "pending")
                        .length || 1)) *
                    100
                  ).toFixed(0)}
                  %
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Requests:</span>
                <span className="font-semibold text-gray-900">
                  {filteredLeaves.length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Leave Approval Modal */}
      {showApprovalModal && selectedLeave && (
        <LeaveApprovalModal
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedLeave(null);
          }}
          leave={{
            ...selectedLeave,
            employeeName: selectedLeave.employeeId?.name,
            employeeId: selectedLeave.employeeId?.employeeId,
          }}
          onApprove={handleApproveConfirm}
          onReject={handleReject}
          loading={loading}
        />
      )}
    </MainLayout>
  );
};

export default LeavesPage;
