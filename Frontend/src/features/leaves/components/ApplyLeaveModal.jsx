import React, { useState } from 'react';
import Modal from '../../../components/common/Modal'
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const ApplyLeaveModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    leaveType: 'casual',
    reason: '',
    contactNumber: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      fromDate: '',
      toDate: '',
      leaveType: 'casual',
      reason: '',
      contactNumber: '',
    });
  };

  const leaveTypes = [
    { value: 'casual', label: 'Casual Leave' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'earned', label: 'Earned Leave' },
    { value: 'unpaid', label: 'Unpaid Leave' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply for Leave">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="From Date"
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleInputChange}
            required
          />
          <Input
            label="To Date"
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Leave Type</label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            {leaveTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Contact Number During Leave"
          type="tel"
          name="contactNumber"
          placeholder="Enter your contact number"
          value={formData.contactNumber}
          onChange={handleInputChange}
          required
        />

        <div>
          <label className="block text-gray-700 font-medium mb-2">Reason for Leave</label>
          <textarea
            name="reason"
            placeholder="Please provide a reason for your leave"
            value={formData.reason}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" onClick={onClose} variant="secondary" className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Submitting...' : 'Apply Leave'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyLeaveModal;
