import React, { useState } from 'react';
import Modal from '../../../components/common/Modal';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { Calendar, AlertCircle } from 'lucide-react';

const OffboardModal = ({ isOpen, onClose, employee, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    offboardDate: '',
    reason: '',
    finalPayment: '',
    equipmentReturn: false,
    knowledgeTransfer: false,
    notes: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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
      title={`Offboard Employee - ${employee?.name || ''}`}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Warning Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Important</p>
            <p>This will initiate the offboarding process. The employee's status will be changed to "exiting".</p>
          </div>
        </div>

        {/* Employee Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Employee ID:</strong> {employee?.employeeId}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Email:</strong> {employee?.email}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Department:</strong> {employee?.department}
          </p>
        </div>

        {/* Last Working Day */}
        <Input
          label="Last Working Day"
          type="date"
          name="offboardDate"
          icon={Calendar}
          value={formData.offboardDate}
          onChange={handleInputChange}
          min={new Date().toISOString().split('T')[0]}
          required
        />

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Offboarding
          </label>
          <select
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            required
          >
            <option value="">Select a reason</option>
            <option value="resignation">Resignation</option>
            <option value="retirement">Retirement</option>
            <option value="termination">Termination</option>
            <option value="contract_end">Contract End</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Final Payment */}
        <Input
          label="Final Payment Amount (Optional)"
          type="number"
          name="finalPayment"
          placeholder="Enter final payment amount"
          value={formData.finalPayment}
          onChange={handleInputChange}
        />

        {/* Checkboxes */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="equipmentReturn"
              checked={formData.equipmentReturn}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Equipment Returned</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="knowledgeTransfer"
              checked={formData.knowledgeTransfer}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Knowledge Transfer Completed</span>
          </label>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            placeholder="Add any additional notes or comments..."
            value={formData.notes}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
          />
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
            variant="danger"
            loading={loading}
            className="flex-1"
          >
            {loading ? 'Processing...' : 'Initiate Offboarding'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OffboardModal;
// const OffboardModal = ({ isOpen, onClose, employee, onSubmit, loading }) => {
//   const [formData, setFormData] = useState({
//     offboardDate: '',
//     reason: '',
//     finalPayment: '',
//     equipmentReturn: false,
//     knowledgeTransfer: false,
//     notes: '',
//   });

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(employee._id, formData);
//     setFormData({
//       offboardDate: '',
//       reason: '',
//       finalPayment: '',
//       equipmentReturn: false,
//       knowledgeTransfer: false,
//       notes: '',
//     });
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title={`Offboard Employee - ${employee?.name || ''}`}>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <Input
//           label="Offboard Date"
//           type="date"
//           name="offboardDate"
//           value={formData.offboardDate}
//           onChange={handleInputChange}
//           required
//         />

//         <div>
//           <label className="block text-gray-700 font-medium mb-2">Reason for Offboarding</label>
//           <select
//             name="reason"
//             value={formData.reason}
//             onChange={handleInputChange}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           >
//             <option value="">Select a reason</option>
//             <option value="resignation">Resignation</option>
//             <option value="retirement">Retirement</option>
//             <option value="termination">Termination</option>
//             <option value="contract_end">Contract End</option>
//             <option value="other">Other</option>
//           </select>
//         </div>

//         <Input
//           label="Final Payment Amount"
//           type="number"
//           name="finalPayment"
//           placeholder="Enter final payment amount"
//           value={formData.finalPayment}
//           onChange={handleInputChange}
//         />

//         <div className="space-y-2">
//           <label className="flex items-center">
//             <input
//               type="checkbox"
//               name="equipmentReturn"
//               checked={formData.equipmentReturn}
//               onChange={handleInputChange}
//               className="rounded border-gray-300"
//             />
//             <span className="ml-2 text-gray-700">Equipment Returned</span>
//           </label>

//           <label className="flex items-center">
//             <input
//               type="checkbox"
//               name="knowledgeTransfer"
//               checked={formData.knowledgeTransfer}
//               onChange={handleInputChange}
//               className="rounded border-gray-300"
//             />
//             <span className="ml-2 text-gray-700">Knowledge Transfer Completed</span>
//           </label>
//         </div>

//         <div>
//           <label className="block text-gray-700 font-medium mb-2">Additional Notes</label>
//           <textarea
//             name="notes"
//             placeholder="Add any additional notes"
//             value={formData.notes}
//             onChange={handleInputChange}
//             rows="3"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           ></textarea>
//         </div>

//         <div className="flex gap-4 pt-4">
//           <Button type="button" onClick={onClose} variant="secondary" className="flex-1">
//             Cancel
//           </Button>
//           <Button type="submit" disabled={loading} className="flex-1">
//             {loading ? 'Processing...' : 'Offboard Employee'}
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default OffboardModal;
