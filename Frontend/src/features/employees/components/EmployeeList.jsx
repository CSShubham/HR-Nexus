import React from 'react';
import EmployeeCard from './EmployeeCard';
import Loader from '../../../components/common/Loader';

const EmployeeList = ({ employees, loading, error, onEdit, onDelete }) => {
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No employees found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee._id}
          employee={employee}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default EmployeeList;
