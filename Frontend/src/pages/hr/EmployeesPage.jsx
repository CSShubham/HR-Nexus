import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../features/employees/employeeThunks";
import MainLayout from "../../components/layout/MainLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import EmployeeCard from "../../features/employees/components/EmployeeCard";
import OffboardModal from "../../features/employees/components/OffboardModal";
import EditEmployeeModal from "../../features/employees/components/EditEmployeeModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { updateEmployee } from "../../features/employees/employeeThunks";
import { deleteEmployee } from "../../features/employees/employeeThunks";
import { offboardEmployee } from "../../features/employees/employeeThunks";
import { fetchEmployeesWithWorkingStatus } from "../../features/employees/employeeThunks";
import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Users,
  UserCheck,
  UserX,
  Clock,
  RefreshCw,
} from "lucide-react";
const EmployeesPage = () => {
  const dispatch = useDispatch();
  const { employees, loading, error } = useSelector((state) => state.employees);
  // console.log("Employees:", employees);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showWorkingStatus, setShowWorkingStatus] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOffboardModal, setShowOffboardModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (showWorkingStatus) {
      dispatch(fetchEmployeesWithWorkingStatus());
    } else {
      dispatch(fetchEmployees());
    }
  }, [dispatch, showWorkingStatus]);

  // Get unique departments for filter
  const departments =
    [...new Set(employees?.map((e) => e.department).filter(Boolean))] || [];

  // Filter employees
  const filteredEmployees =
    employees?.filter((employee) => {
      const matchesSearch =
        employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || employee.status === statusFilter;
      const matchesDepartment =
        departmentFilter === "all" || employee.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    }) || [];

  // Statistics
  const stats = [
    {
      label: "Total Employees",
      value: employees?.length || 0,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Active",
      value: employees?.filter((e) => e.status === "active").length || 0,
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      label: "On Leave",
      value:
        employees?.filter((e) => e.workingStatus === "On Leave").length || 0,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      label: "Exiting",
      value: employees?.filter((e) => e.status === "exiting").length || 0,
      icon: UserX,
      color: "bg-red-500",
    },
  ];

  const handleRefresh = () => {
    if (showWorkingStatus) {
      dispatch(fetchEmployeesWithWorkingStatus());
    } else {
      dispatch(fetchEmployees());
    }
  };
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };
  const handleEditSubmit = async (employeeId, formData) => {
    try {
      await dispatch(
        updateEmployee({
          employeeId,
          data: formData,
        }),
      ).unwrap();

      setShowEditModal(false);
      setSelectedEmployee(null);
      handleRefresh();
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  const handleOffboard = (employee) => {
    setSelectedEmployee(employee);
    setShowOffboardModal(true);
  };

  const handleOffboardSubmit = async (employeeId, formData) => {
    try {
      await dispatch(
        offboardEmployee({
          employeeId,
          data: {
            reason: formData.reason,
            lastWorkingDay: formData.offboardDate,
          },
        }),
      ).unwrap();

      setShowOffboardModal(false);
      setSelectedEmployee(null);
      handleRefresh();
    } catch (error) {
      console.error("Failed to offboard employee:", error);
    }
  };

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteEmployee(selectedEmployee._id)).unwrap();
      setShowDeleteConfirm(false);
      setSelectedEmployee(null);
      // No need to refresh - the employee will be removed from state automatically
    } catch (error) {
      console.error("Failed to delete employee:", error);
      setShowDeleteConfirm(false);
      setSelectedEmployee(null);
    }
  };

  const handleExport = () => {
    const csvContent = [
      [
        "Employee ID",
        "Name",
        "Email",
        "Phone",
        "Department",
        "Designation",
        "Status",
        "Joined Date",
      ],
      ...filteredEmployees.map((e) => [
        e.employeeId || "",
        e.name || "",
        e.email || "",
        e.phone || "",
        e.department || "",
        e.designation || "",
        e.status || "",
        new Date(e.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `employees_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <MainLayout title="Employees">
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
        {/* Header with Search, Filters, and Actions */}
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
                placeholder="Search by name, email, or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={showWorkingStatus ? "primary" : "outline"}
                icon={Clock}
                onClick={() => setShowWorkingStatus(!showWorkingStatus)}
              >
                {showWorkingStatus ? "Hide Status" : "Show Working Status"}
              </Button>

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
                disabled={filteredEmployees.length === 0}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="exiting">Exiting</option>
                <option value="offboarded">Offboarded</option>
              </select>
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600 ml-auto">
              Showing {filteredEmployees.length} of {employees?.length || 0}{" "}
              employees
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Employee List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee._id}
                employee={employee}
                showWorkingStatus={showWorkingStatus}
                onEdit={() => handleEdit(employee)}
                onOffboard={() => handleOffboard(employee)}
                onDelete={() => handleDelete(employee)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ||
              statusFilter !== "all" ||
              departmentFilter !== "all"
                ? "No employees found matching your filters"
                : "No employees yet"}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ||
              statusFilter !== "all" ||
              departmentFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Onboard candidates to add employees"}
            </p>
          </div>
        )}
      </Card>

      {/* Offboard Modal */}
      {showOffboardModal && selectedEmployee && (
        <OffboardModal
          isOpen={showOffboardModal}
          onClose={() => {
            setShowOffboardModal(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
          onSubmit={handleOffboardSubmit}
          loading={loading}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedEmployee && (
        <EditEmployeeModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
          onSubmit={handleEditSubmit}
          loading={loading}
        />
      )}

     {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedEmployee(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to permanently delete ${selectedEmployee?.name}? This will remove all associated records including attendance and leave history. This action cannot be undone.`}
        confirmText="Delete Permanently"
        variant="danger"
      />
    </MainLayout>
  );
};

export default EmployeesPage;
