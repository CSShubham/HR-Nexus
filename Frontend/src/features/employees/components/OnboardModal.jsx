import React, { useState ,useEffect} from 'react';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

const OnboardModal = ({ isOpen, onClose, candidate, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
  name: candidate?.name || "",
  email: candidate?.email || "",
  designation: candidate?.designation || "",
  department: candidate?.department || "",
  phone: candidate?.phone || "",
  joinDate: "",
  salary: "",
});

useEffect(() => {
  if (candidate) {
    setFormData({
      name: candidate.name || "",
      email: candidate.email || "",
      designation: candidate.designation || "",
      department: candidate.department || "",
      phone: candidate.phone || "",
      joinDate: "",
      salary: "",
    });
  }
}, [candidate]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    onSubmit(formData);
    setFormData({
      name: '',
      email: '',
      designation: '',
      department: '',
      phone: '',
      joinDate: '',
      salary: '',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Onboard Employee">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          name="name"
          placeholder="Enter employee name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter email address"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <Input
          label="Designation"
          type="text"
          name="designation"
          placeholder="Enter designation"
          value={formData.designation}
          onChange={handleInputChange}
          required
        />

        <Input
          label="Department"
          type="text"
          name="department"
          placeholder="Enter department"
          value={formData.department}
          onChange={handleInputChange}
          required
        />

        <Input
          label="Phone"
          type="tel"
          name="phone"
          placeholder="Enter phone number"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />

        <Input
          label="Join Date"
          type="date"
          name="joinDate"
          value={formData.joinDate}
          onChange={handleInputChange}
          required
        />

        <Input
          label="Salary"
          type="number"
          name="salary"
          placeholder="Enter salary"
          value={formData.salary}
          onChange={handleInputChange}
          required
        />

        <div className="flex gap-4 pt-4">
          <Button type="button" onClick={onClose} variant="secondary" className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Submitting...' : 'Onboard Employee'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OnboardModal;
