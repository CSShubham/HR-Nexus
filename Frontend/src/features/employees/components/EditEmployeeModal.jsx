import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { User, Mail, Phone, Briefcase, Building, MapPin, AlertCircle } from 'lucide-react';

const EditEmployeeModal = ({ isOpen, onClose, employee, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    address: '',
    status: 'active',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department || '',
        designation: employee.designation || '',
        address: employee.address || '',
        status: employee.status || 'active',
      });
    }
  }, [employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(employee._id, formData);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Edit Employee - ${employee?.name || ''}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Update Employee Information</p>
            <p>Modify the employee details below. All fields are optional except name and email.</p>
          </div>
        </div>

        {/* Employee ID (Read-only) */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Employee ID:</strong> {employee?.employeeId}
          </p>
        </div>

        {/* Name */}
        <Input
          label="Full Name"
          type="text"
          name="name"
          icon={User}
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter full name"
          required
        />

        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          icon={Mail}
          value={formData.email}
          onChange={handleInputChange}
          placeholder="employee@example.com"
          required
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          icon={Phone}
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+1 (555) 000-0000"
        />

        {/* Department and Designation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Department"
            type="text"
            name="department"
            icon={Building}
            value={formData.department}
            onChange={handleInputChange}
            placeholder="e.g., Engineering"
          />

          <Input
            label="Designation"
            type="text"
            name="designation"
            icon={Briefcase}
            value={formData.designation}
            onChange={handleInputChange}
            placeholder="e.g., Senior Developer"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <MapPin size={16} />
            Address
          </label>
          <textarea
            name="address"
            placeholder="Enter complete address"
            value={formData.address}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="exiting">Exiting</option>
            <option value="offboarded">Offboarded</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button 
            type="button" 
            onClick={onClose} 
            variant="secondary" 
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            loading={loading}
            className="flex-1"
          >
            {loading ? 'Updating...' : 'Update Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditEmployeeModal;