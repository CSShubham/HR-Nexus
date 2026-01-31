import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyProfile,
  updateMyProfile,
} from "../../features/profile/profileThunks";
import { clearUpdateStatus } from "../../features/profile/profileSlice";
import MainLayout from "../../components/layout/MainLayout";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  Shield,
  Edit2,
  Save,
  X,
  Building,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const MyProfilePage = () => {
  const dispatch = useDispatch();
  const { profile, loading, error, updateLoading, updateError, updateSuccess } =
    useSelector((state) => state.profile);
// console.log("Profile Data:", profile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
  });

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (updateSuccess) {
      setIsEditing(false);
      const timer = setTimeout(() => {
        dispatch(clearUpdateStatus());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    dispatch(updateMyProfile(formData));
  };

  const handleCancel = () => {
    setFormData({
      phone: profile?.phone || "",
      address: profile?.address || "",
    });
    setIsEditing(false);
    dispatch(clearUpdateStatus());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!dateString || isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      exiting: "bg-yellow-100 text-yellow-800",
      offboarded: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status] || statusStyles.active}`}
      >
        {typeof status === "string"
          ? status.charAt(0).toUpperCase() + status.slice(1)
          : "Active"}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      hr: "bg-purple-100 text-purple-800",
      employee: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${roleStyles[role] || roleStyles.employee}`}
      >
        {role?.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-gray-500">No profile data available</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Success Message */}
        {updateSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
            <CheckCircle className="text-green-600" size={24} />
            <p className="text-green-700 font-medium">
              Profile updated successfully!
            </p>
          </div>
        )}

        {/* Update Error Message */}
        {updateError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <p className="text-red-600 font-medium">{updateError}</p>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">My Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-sm md:text-base gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          ) : (
            <div className="flex flex-wrap *:text-sm md:text-base gap-2">
              <button
                onClick={handleSave}
                disabled={updateLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={updateLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section with Avatar */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-12">
            <div className="flex items-center gap-6">
              <div className="w-15 h-15 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <User size={48} className="text-blue-600" />
              </div>
              <div className="text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{profile.name}</h2>
                <div className="flex *:text-xs *:md:text-base gap-3">
                  {getRoleBadge(profile.role)}
                  {getStatusBadge(profile.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Employee ID */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Employee ID</p>
                  <p className="font-semibold text-gray-800">
                    {String(profile.employeeId || "Not assigned")}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Email Address</p>
                  <p className="font-semibold text-gray-800 break-all">
                    {profile.email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800">
                      {profile.phone || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              {/* Department */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Department</p>
                  <p className="font-semibold text-gray-800">
                    {profile.department || "Not assigned"}
                  </p>
                </div>
              </div>

              {/* Designation */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Designation</p>
                  <p className="font-semibold text-gray-800">
                    {profile.designation || "Not assigned"}
                  </p>
                </div>
              </div>

              {/* Join Date */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Joined On</p>
                  <p className="font-semibold text-gray-800">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
              </div>

              {/* Address - Full Width */}
              <div className="md:col-span-2 flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="font-semibold text-gray-800">
                      {profile.address || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Shield size={20} />
            Profile Settings
          </h3>
          <p className="text-sm text-blue-700">
            You can only update your phone number and address. For changes to
            other details, please contact the HR department.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyProfilePage;
