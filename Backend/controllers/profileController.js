import Employee from "../models/Employee.js";

// ====================
// GET MY PROFILE
// ====================
export const getMyProfile = async (req, res) => {
  const employee = await Employee.findById(req.user.id).select(
    "-password"
  );

  if (!employee)
    return res.status(404).json({ message: "Employee not found" });

  res.json(employee);
};

// ====================
// UPDATE MY PROFILE (LIMITED)
// ====================
export const updateMyProfile = async (req, res) => {
  const allowedUpdates = ["phone", "address"];
  const updates = {};

  allowedUpdates.forEach((field) => {
    if (req.body[field]) {
      updates[field] = req.body[field];
    }
  });

  const employee = await Employee.findByIdAndUpdate(
    req.user.id,
    updates,
    { new: true, runValidators: true }
  ).select("-password");

  res.json({
    message: "Profile updated successfully",
    employee,
  });
};
