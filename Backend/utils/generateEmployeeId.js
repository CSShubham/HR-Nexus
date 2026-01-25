const generateEmployeeId = async (Employee) => {
  const count = await Employee.countDocuments();
  return `EMP${String(count + 1).padStart(4, "0")}`;
};

export default generateEmployeeId;
