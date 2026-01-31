import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnnouncements } from "../../features/announcements/announcementsThunks";
import MainLayout from "../../components/layout/MainLayout";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import {
  Bell,
  Search,
  Calendar,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  TrendingUp,
  Filter,
  Download,
  Megaphone,
  X,
} from "lucide-react";
import { formatDateTime } from "../../utils/formatters";

const AnnouncementsPage = () => {
  const dispatch = useDispatch();
  const { announcements, loading, error } = useSelector(
    (state) => state.announcements,
  );
  // console.log(announcements);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all"); // all, today, week, month
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // newest, oldest

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  // Filter announcements by period
  const getFilteredByPeriod = () => {
    if (!announcements || announcements.length === 0) return [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    let filtered = [...announcements];

    switch (filterPeriod) {
      case "today":
        filtered = filtered.filter((a) => {
          const createdDate = new Date(a.createdAt);
          return createdDate >= today;
        });
        break;
      case "week":
        filtered = filtered.filter((a) => {
          const createdDate = new Date(a.createdAt);
          return createdDate >= weekAgo;
        });
        break;
      case "month":
        filtered = filtered.filter((a) => {
          const createdDate = new Date(a.createdAt);
          return createdDate >= monthAgo;
        });
        break;
      default:
        break;
    }

    return filtered;
  };

  // Filter by search query
  const getFilteredAnnouncements = () => {
    let filtered = getFilteredByPeriod();

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (announcement) =>
          announcement.title?.toLowerCase().includes(query) ||
          announcement.message?.toLowerCase().includes(query) ||
          announcement.createdBy?.name?.toLowerCase().includes(query),
      );
    }

    // Sort
    if (sortOrder === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return filtered;
  };

  const filteredAnnouncements = getFilteredAnnouncements();

  // Statistics
  const calculateStats = () => {
    if (!announcements || announcements.length === 0) {
      return {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
      };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      total: announcements.length,
      today: announcements.filter((a) => new Date(a.createdAt) >= today).length,
      thisWeek: announcements.filter((a) => new Date(a.createdAt) >= weekAgo)
        .length,
      thisMonth: announcements.filter((a) => new Date(a.createdAt) >= monthAgo)
        .length,
    };
  };

  const stats = calculateStats();

  const toggleExpand = (id) => {
    setExpandedAnnouncement(expandedAnnouncement === id ? null : id);
  };

  const isNew = (date) => {
    const createdDate = new Date(date);
    const now = new Date();
    const diffHours = (now - createdDate) / (1000 * 60 * 60);
    return diffHours < 24;
  };

  const downloadAnnouncements = () => {
    const csv = [
      ["Title", "Message", "Posted By", "Date"],
      ...announcements.map((announcement) => [
        announcement.title,
        announcement.message.replace(/,/g, ";"), // Replace commas to avoid CSV issues
        announcement.createdBy?.name || "N/A",
        new Date(announcement.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `announcements-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterPeriod("all");
    setSortOrder("newest");
  };

  return (
    <MainLayout title="Announcements">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
            <Megaphone size={28} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Company Announcements
            </h1>
            <p className="text-gray-600">
              Stay updated with the latest news and updates
            </p>
          </div>
        </div>
        <Button
          onClick={downloadAnnouncements}
          variant="outline"
          disabled={!announcements || announcements.length === 0}
        >
          <Download size={18} className="mr-2" />
          Download
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Announcements</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Bell size={28} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Today</p>
              <p className="text-3xl font-bold text-gray-800">{stats.today}</p>
              <p className="text-xs text-gray-500 mt-1">New today</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp size={28} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">This Week</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.thisWeek}
              </p>
              <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar size={28} className="text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">This Month</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.thisMonth}
              </p>
              <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock size={28} className="text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search announcements by title, message, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Period Filter */}
          <div className="flex gap-2">
            <Button
              onClick={() => setFilterPeriod("all")}
              variant={filterPeriod === "all" ? "primary" : "outline"}
              size="sm"
            >
              All
            </Button>
            <Button
              onClick={() => setFilterPeriod("today")}
              variant={filterPeriod === "today" ? "primary" : "outline"}
              size="sm"
            >
              Today
            </Button>
            <Button
              onClick={() => setFilterPeriod("week")}
              variant={filterPeriod === "week" ? "primary" : "outline"}
              size="sm"
            >
              This Week
            </Button>
            <Button
              onClick={() => setFilterPeriod("month")}
              variant={filterPeriod === "month" ? "primary" : "outline"}
              size="sm"
            >
              This Month
            </Button>
          </div>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {(searchQuery ||
            filterPeriod !== "all" ||
            sortOrder !== "newest") && (
            <Button onClick={clearFilters} variant="outline" size="sm">
              <X size={16} className="mr-1" />
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Announcements List */}
      <Card>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading announcements...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : filteredAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement, idx) => (
              <div
                key={announcement._id || idx}
                className={`border rounded-lg overflow-hidden transition-all ${
                  isNew(announcement.createdAt)
                    ? "border-blue-300 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {announcement.title}
                        </h3>
                        {isNew(announcement.createdAt) && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          <span>
                            Posted by {announcement.createdBy?.name || "HR"}
                            {announcement.createdBy?.designation &&
                              ` • ${announcement.createdBy.designation}`}
                            {announcement.createdBy?.department &&
                              ` • ${announcement.createdBy.department}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>{formatDateTime(announcement.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExpand(announcement._id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedAnnouncement === announcement._id ? (
                        <ChevronUp size={20} className="text-gray-600" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Message Preview/Full */}
                  <div className="text-gray-700">
                    {expandedAnnouncement === announcement._id ? (
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {announcement.message}
                      </p>
                    ) : (
                      <p className="line-clamp-2">{announcement.message}</p>
                    )}
                  </div>

                  {/* Read More/Less */}
                  {announcement.message &&
                    announcement.message.length > 150 && (
                      <button
                        onClick={() => toggleExpand(announcement._id)}
                        className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        {expandedAnnouncement === announcement._id ? (
                          <>
                            Read Less <ChevronUp size={16} />
                          </>
                        ) : (
                          <>
                            Read More <ChevronDown size={16} />
                          </>
                        )}
                      </button>
                    )}
                </div>

                {/* Expanded Details */}
                {expandedAnnouncement === announcement._id && (
                  <div className="px-5 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Bell size={16} className="text-blue-600" />
                        <span className="font-medium">Announcement ID:</span>
                        <span className="font-mono text-xs">
                          {announcement._id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-blue-600" />
                        <span>
                          {new Date(announcement.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Megaphone size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium mb-2">
              {searchQuery || filterPeriod !== "all"
                ? "No announcements found matching your filters"
                : "No announcements available"}
            </p>
            <p className="text-sm text-gray-400">
              {searchQuery || filterPeriod !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Check back later for updates from HR"}
            </p>
            {(searchQuery || filterPeriod !== "all") && (
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Info Card */}
      {filteredAnnouncements.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Stay Informed
              </p>
              <p className="text-sm text-blue-700">
                Company announcements are posted here regularly. Check back
                often to stay updated with important news, policy changes, and
                company events.
              </p>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default AnnouncementsPage;
