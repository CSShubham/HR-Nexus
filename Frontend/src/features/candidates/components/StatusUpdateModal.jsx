import React, { useState } from "react";
import Modal from "../../../components/common/Modal";
import Button from "../../../components/common/Button";
import { useEffect } from "react";
const StatusUpdateModal = ({
  isOpen,
  onClose,
  candidate,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    status: candidate?.status || "",
    notes: "",
    interviewDate: "",
  });
  useEffect(() => {
    if (candidate) {
      setFormData({
        status: candidate.status || "",
        notes: "",
        interviewDate: "",
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
    onSubmit(candidate._id, formData);
    setFormData({
      status: candidate?.status || "",
      notes: "",
      interviewDate: "",
    });
  };

  const statusOptions = [
    { value: "applied", label: "Applied" },

    { value: "interview", label: "Interview" },

    { value: "rejected", label: "Rejected" },
    { value: "onboarded", label: "Onboarded" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Status - ${candidate?.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Application Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a status</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {formData.status === "interview" && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Interview Date
            </label>
            <input
              type="datetime-local"
              name="interviewDate"
              value={formData.interviewDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-gray-700 font-medium mb-2">Notes</label>
          <textarea
            name="notes"
            placeholder="Add any notes or feedback"
            value={formData.notes}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StatusUpdateModal;
