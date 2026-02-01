const generateEmployeeId = async (Employee) => {
  const lastEmployee = await Employee.find({ employeeId: { $regex: /^EMP\d+$/ } })
    .sort({ employeeId: -1 })
    .limit(1)
    .lean();

  let nextNumber = 1;

  if (lastEmployee.length > 0) {
    const lastNumber = parseInt(lastEmployee[0].employeeId.replace("EMP", ""), 10);
    nextNumber = lastNumber + 1;
  }

  return `EMP${String(nextNumber).padStart(4, "0")}`;
};

export default generateEmployeeId;