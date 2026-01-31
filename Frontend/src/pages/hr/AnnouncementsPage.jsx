import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { 
  Search, 
  Plus,
  Megaphone,
  RefreshCw,
  Edit,
  Trash2,
  User,
  Calendar
} from 'lucide-react';
import { 
  fetchAnnouncements, 
  createAnnouncement,
  deleteAnnouncement ,
  updateAnnouncement
} from '../../features/announcements/announcementsThunks';
import { formatDate, formatDateTime } from '../../utils/formatters';

const AnnouncementsPage = () => {
  const dispatch = useDispatch();
  const { announcements, loading, error } = useSelector((state) => state.announcements);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
  });

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  // Filter announcements
  const filteredAnnouncements = announcements?.filter(announcement => {
    const matchesSearch = 
      announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.createdBy?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  }) || [];

  // Calculate statistics
  const stats = [
    {
      label: 'Total Announcements',
      value: announcements?.length || 0,
      icon: Megaphone,
      color: 'bg-blue-500',
    },
    {
      label: 'This Week',
      value: announcements?.filter(a => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(a.createdAt) >= weekAgo;
      }).length || 0,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      label: 'This Month',
      value: announcements?.filter(a => {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return new Date(a.createdAt) >= monthAgo;
      }).length || 0,
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      label: 'By You',
      value: announcements?.filter(a => {
        // You can add current user check here
        return true;
      }).length || 0,
      icon: User,
      color: 'bg-yellow-500',
    },
  ];

  const handleRefresh = () => {
    dispatch(fetchAnnouncements());
  };

  const handleCreate = () => {
    setEditData(null);
    setFormData({ title: '', message: '' });
    setShowCreateModal(true);
  };

  const handleEdit = (announcement) => {
    setEditData(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
    });
    setShowCreateModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editData) {
        // Note: You'll need to implement update endpoint
        
        await dispatch(updateAnnouncement({ id: editData._id, data: formData })).unwrap();
      } else {
        await dispatch(createAnnouncement(formData)).unwrap();
      }
      
      setShowCreateModal(false);
      setEditData(null);
      setFormData({ title: '', message: '' });
      dispatch(fetchAnnouncements());
    } catch (error) {
      console.error('Failed to save announcement:', error);
    }
  };

  const handleDelete = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteAnnouncement(selectedAnnouncement._id)).unwrap();
      setShowDeleteConfirm(false);
      setSelectedAnnouncement(null);
      dispatch(fetchAnnouncements());
    } catch (error) {
      console.error('Failed to delete announcement:', error);
    }
  };

  return (
    <MainLayout title="Announcements">
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
        {/* Header with Search and Actions */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search announcements by title, message, or creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleCreate}
            >
              Create Announcement
            </Button>
            <Button
              variant="outline"
              icon={RefreshCw}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          Showing {filteredAnnouncements.length} of {announcements?.length || 0} announcements
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Announcements List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : filteredAnnouncements.length > 0 ? (
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement._id}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Megaphone className="text-primary-600" size={24} />
                    </div>

                    {/* Title and Meta */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {announcement.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User size={14} />
                        <span>By {announcement.createdBy?.name || 'Unknown'}</span>
                        <span>•</span>
                        <Calendar size={14} />
                        <span>{formatDateTime(announcement.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line">
                    {announcement.message}
                  </p>
                </div>

                {/* Footer with Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => handleEdit(announcement)}
                    variant="outline"
                    size="sm"
                    icon={Edit}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(announcement)}
                    variant="danger"
                    size="sm"
                    icon={Trash2}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Megaphone size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm
                ? 'No announcements found matching your search'
                : 'No announcements yet'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm
                ? 'Try adjusting your search'
                : 'Create your first announcement to get started'}
            </p>
            {!searchTerm && (
              <Button
                variant="primary"
                icon={Plus}
                onClick={handleCreate}
                className="mt-4"
              >
                Create Announcement
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditData(null);
          setFormData({ title: '', message: '' });
        }}
        title={editData ? 'Edit Announcement' : 'Create Announcement'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            type="text"
            name="title"
            placeholder="Enter announcement title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              name="message"
              placeholder="Enter announcement message"
              value={formData.message}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setEditData(null);
                setFormData({ title: '', message: '' });
              }}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              {editData ? 'Update Announcement' : 'Create Announcement'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedAnnouncement(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${selectedAnnouncement?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </MainLayout>
  );
};

export default AnnouncementsPage;