import React from 'react';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar, 
  Edit, 
  UserX,
  Trash2 
} from 'lucide-react';
import { getStatusColor, formatDate } from '../../../utils/formatters';

const EmployeeCard = ({ 
  employee, 
  showWorkingStatus, 
  onEdit, 
  onOffboard, 
  onDelete 
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-semibold text-lg">
              {employee.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* Name and ID */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {employee.name}
            </h3>
            <p className="text-sm text-gray-500">{employee.employeeId}</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <Badge variant={getStatusColor(employee.status)}>
          {employee.status}
        </Badge>
      </div>

      {/* Working Status (if enabled) */}
      {showWorkingStatus && employee.workingStatus && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Today's Status:</span>
            <Badge variant={getStatusColor(employee.workingStatus)} size="sm">
              {employee.workingStatus}
            </Badge>
          </div>
        </div>
      )}

      {/* Employee Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Briefcase size={16} className="text-gray-400" />
          <span className="font-medium">Position:</span>
          <span>{employee.designation || 'N/A'}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Briefcase size={16} className="text-gray-400" />
          <span className="font-medium">Department:</span>
          <span>{employee.department || 'N/A'}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail size={16} className="text-gray-400" />
          <a 
            href={`mailto:${employee.email}`} 
            className="hover:text-primary-600 truncate"
          >
            {employee.email}
          </a>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone size={16} className="text-gray-400" />
          <a href={`tel:${employee.phone}`} className="hover:text-primary-600">
            {employee.phone || 'N/A'}
          </a>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} className="text-gray-400" />
          <span className="font-medium">Joined:</span>
          <span>{formatDate(employee.createdAt)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <Button
          onClick={onEdit}
          variant="outline"
          size="sm"
          icon={Edit}
          className="flex-1"
        >
          Edit
        </Button>

        {employee.status === 'active' && (
          <Button
            onClick={onOffboard}
            variant="danger"
            size="sm"
            icon={UserX}
            className="flex-1"
          >
            Offboard
          </Button>
        )}

        {employee.status === 'offboarded' && (
          <Button
            onClick={onDelete}
            variant="danger"
            size="sm"
            icon={Trash2}
            className="flex-1"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;
// const EmployeeCard = ({ employee, onEdit, onDelete }) => {
//   return (
//     <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <h3 className="text-lg font-bold text-gray-900">{employee.name}</h3>
//           <p className="text-sm text-gray-600">{employee.employeeId}</p>
//         </div>
//         <Badge status={employee.status}>{employee.status}</Badge>
//       </div>

//       <div className="space-y-2 mb-4">
//         <p className="text-sm text-gray-600">
//           <span className="font-medium">Position:</span> {employee.position}
//         </p>
//         <p className="text-sm text-gray-600">
//           <span className="font-medium">Department:</span> {employee.department}
//         </p>
//         <p className="text-sm text-gray-600">
//           <span className="font-medium">Email:</span> {employee.email}
//         </p>
//         <p className="text-sm text-gray-600">
//           <span className="font-medium">Phone:</span> {employee.phone}
//         </p>
//         <p className="text-sm text-gray-600">
//           <span className="font-medium">Joined:</span> {new Date(employee.joinDate).toLocaleDateString()}
//         </p>
//       </div>

//       <div className="flex gap-2 pt-4 border-t border-gray-200">
//         <button
//           onClick={() => onEdit(employee)}
//           className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors text-sm font-medium"
//         >
//           Edit
//         </button>
//         <button
//           onClick={() => onDelete(employee._id)}
//           className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors text-sm font-medium"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EmployeeCard;
