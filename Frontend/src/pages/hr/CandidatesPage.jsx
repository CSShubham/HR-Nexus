import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../../components/layout/MainLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { Search, Filter, Download, UserPlus } from "lucide-react";
import { updateCandidateStatus } from "../../features/candidates/candidatesThunks";
import { fetchCandidates } from "../../features/candidates/candidatesThunks";
import { onboardEmployee } from "../../features/employees/employeeThunks";
import CandidateList from "../../features/candidates/components/CandidateList";
import StatusUpdateModal from "../../features/candidates/components/StatusUpdateModal";
import OnboardModal from "../../features/employees/components/OnboardModal";

const CandidatesPage = () => {
  const dispatch = useDispatch();
  const { candidates, loading, error } = useSelector(
    (state) => state.candidates,
  );
  // console.log("Candidates:", candidates);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showOnboardModal, setShowOnboardModal] = useState(false);

  useEffect(() => {
    dispatch(fetchCandidates());
  }, [dispatch]);

  // Filter candidates based on search and status
  const filteredCandidates =
    candidates?.filter((candidate) => {
      const fullName = (candidate.name || "").toLowerCase();
      const email = (candidate.email || "").toLowerCase();
      const search = searchTerm.toLowerCase();

      const matchesSearch = fullName.includes(search) || email.includes(search);

      const matchesStatus =
        statusFilter === "all" || candidate.status === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  // Statistics
  const stats = [
    {
      label: "Total Applications",
      value: candidates?.length || 0,
      color: "bg-blue-500",
    },
    {
      label: "New Applications",
      value: candidates?.filter((c) => c.status === "applied").length || 0,
      color: "bg-yellow-500",
    },
    {
      label: "In Interview",
      value: candidates?.filter((c) => c.status === "interview").length || 0,
      color: "bg-purple-500",
    },
    {
      label: "Onboarded",
      value: candidates?.filter((c) => c.status === "onboarded").length || 0,
      color: "bg-green-500",
    },
  ];

  const handleStatusUpdate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowStatusModal(true);
  };
  const handleStatusSubmit = (id, data) => {
    dispatch(updateCandidateStatus({ id, status: data.status }))
      .unwrap()
      .then(() => {
        dispatch(fetchCandidates());
        setShowStatusModal(false);
        setSelectedCandidate(null);
      });
  };

  const handleOnboard = (candidate) => {
    setSelectedCandidate(candidate);
    setShowOnboardModal(true);
  };
  const handleOnboardSubmit = (data) => {
  dispatch(onboardEmployee({ candidateId: selectedCandidate._id, data }))
    .unwrap()
    .then(() => {
      dispatch(fetchCandidates());
      setShowOnboardModal(false);
      setSelectedCandidate(null);
    });
};


  const handleExport = () => {
    // Export candidates to CSV
    const csvContent = [
      ["Name", "Email", "Phone", "Status", "Applied Date"],
      ...filteredCandidates.map((c) => [
        c.name,
        c.email,
        c.phone,
        c.status,
        new Date(c.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `candidates_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (loading && !candidates) {
    return (
      <MainLayout title="Candidates">
        <Loader text="Loading candidates..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Candidates">
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
                <UserPlus className="text-white" size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Card */}
      <Card>
        {/* Header with Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
              <option value="onboarded">Onboarded</option>
            </select>
          </div>

          {/* Export Button */}
          <Button
            variant="outline"
            icon={Download}
            onClick={handleExport}
            disabled={filteredCandidates.length === 0}
          >
            Export CSV
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Candidates List */}
        {filteredCandidates.length > 0 ? (
          <CandidateList
            candidates={filteredCandidates}
            onStatusUpdate={handleStatusUpdate}
            onOnBoard={handleOnboard}
          />
        ) : (
          <div className="text-center py-12">
            <UserPlus size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm || statusFilter !== "all"
                ? "No candidates found matching your filters"
                : "No candidates yet"}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "New applications will appear here"}
            </p>
          </div>
        )}
      </Card>

      {/* Modals */}
      {showStatusModal && selectedCandidate && (
        <StatusUpdateModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedCandidate(null);
          }}
          candidate={selectedCandidate}
          onSubmit={handleStatusSubmit}
          loading={loading}
          // onSuccess={() => {
          //   dispatch(fetchCandidates());
          //   setShowStatusModal(false);
          //   setSelectedCandidate(null);
          // }}
        />
      )}

      {showOnboardModal && selectedCandidate && (
        <OnboardModal
          isOpen={showOnboardModal}
          onClose={() => {
            setShowOnboardModal(false);
            setSelectedCandidate(null);
          }}
          candidate={selectedCandidate}
          loading={loading}
          onSubmit={handleOnboardSubmit}
        />
      )}
    </MainLayout>
  );
};

export default CandidatesPage;
