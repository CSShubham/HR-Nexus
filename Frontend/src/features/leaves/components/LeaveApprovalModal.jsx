import React, { useState } from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';

const LeaveApprovalModal = ({ isOpen, onClose, leave, onApprove, onReject, loading }) => {
  const [formData, setFormData] = useState({
    status: '',
    notes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApprove = (e) => {
    e.preventDefault();
    onApprove(leave._id, {
      status: 'approved',
      approverNotes: formData.notes,
    });
    setFormData({ status: '', notes: '' });
  };

  const handleReject = (e) => {
    e.preventDefault();
    onReject(leave._id, {
      status: 'rejected',
      approverNotes: formData.notes,
    });
    setFormData({ status: '', notes: '' });
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    return diff;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave Approval Request">
      <div className="space-y-6">
        {/* Leave Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Employee:</span>
            <span className="font-medium text-gray-900">{leave?.employeeName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Leave Type:</span>
            <span className="font-medium text-gray-900 capitalize">{leave?.leaveType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">From:</span>
            <span className="font-medium text-gray-900">
              {leave?.fromDate && new Date(leave.fromDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">To:</span>
            <span className="font-medium text-gray-900">
              {leave?.toDate && new Date(leave.toDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-gray-900">
              {leave && calculateDays(leave.fromDate, leave.toDate)} days
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <span className="text-gray-600">Reason:</span>
            <span className="font-medium text-gray-900 text-right max-w-xs">
              {leave?.reason}
            </span>
          </div>
        </div>

        {/* Approval Form */}
        <form onSubmit={handleApprove} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Approver Notes</label>
            <textarea
              name="notes"
              placeholder="Add any notes for the employee"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleReject}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Processing...' : 'Reject'}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Processing...' : 'Approve'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default LeaveApprovalModal;
