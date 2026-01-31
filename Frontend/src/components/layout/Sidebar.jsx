import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Clock,
  Calendar,
  Megaphone,
  User,
  LogOut,
  Home,
  Menu,
  X,
  Building2,
} from "lucide-react";
import { logout } from "../../features/auth/authSlice";
import { useAuth } from "../../hooks/useAuth";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role } = useAuth();
  // console.log("User role in Sidebar:", role);

  const hrMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/hr/dashboard" },
    { id: "employees", label: "Employees", icon: Users, path: "/hr/employees" },
    {
      id: "candidates",
      label: "Candidates",
      icon: UserPlus,
      path: "/hr/candidates",
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: Clock,
      path: "/hr/attendance",
    },
    {
      id: "leaves",
      label: "Leave Requests",
      icon: Calendar,
      path: "/hr/leaves",
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: Megaphone,
      path: "/hr/announcements",
    },
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      path: "/hr/profile",
    },
  ];

  const employeeMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/employee/dashboard",
    },
    {
      id: "profile",
      label: "My Profile",
      icon: User,
      path: "/employee/profile",
    },
    {
      id: "attendance",
      label: "My Attendance",
      icon: Clock,
      path: "/employee/attendance",
    },
    {
      id: "leaves",
      label: "My Leaves",
      icon: Calendar,
      path: "/employee/leaves",
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: Megaphone,
      path: "/employee/announcements",
    },
  ];

  const menuItems = role === "hr" ? hrMenuItems : employeeMenuItems;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-primary-600 text-white p-2 rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-64 bg-gradient-to-b from-primary-700 to-primary-900 text-white transition-transform duration-300 ease-in-out z-40 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 pl-18 md:pl-6  border-b border-primary-600">
          <div className="flex items-center gap-3">
            <Building2 size={32} />
            <div>
              <h1 className="text-xl font-bold">HR Nexus</h1>
              <p className="text-xs text-primary-200">
                {role === "hr" ? "HR Portal" : "Employee Portal"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                window.location.pathname === item.path
                  ? "bg-white text-primary-700 shadow-lg"
                  : "hover:bg-primary-600 text-primary-100"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-primary-600">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-400 rounded-lg hover:bg-red-600 text-primary-100 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
