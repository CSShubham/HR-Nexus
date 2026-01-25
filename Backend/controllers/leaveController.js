import Leave from "../models/Leave.js";

// ====================
// APPLY LEAVE
// ====================
export const applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason } = req.body;

    const leave = await Leave.create({
      employeeId: req.user.id,
      fromDate,
      toDate,
      reason,
    });

    res.status(201).json({
      message: "Leave applied successfully",
      leave,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================
// EMPLOYEE VIEW
// ====================
export const getMyLeaves = async (req, res) => {
  const leaves = await Leave.find({
    employeeId: req.user.id,
  }).sort({ createdAt: -1 });

  res.json(leaves);
};

// ====================
// HR VIEW ALL
// ====================
export const getAllLeaves = async (req, res) => {
  const leaves = await Leave.find()
    .populate("employeeId", "name employeeId department")
    .sort({ createdAt: -1 });

  res.json(leaves);
};

// ====================
// HR APPROVE / REJECT
// ====================
export const updateLeaveStatus = async (req, res) => {
  const { status, remarks } = req.body;

  const leave = await Leave.findById(req.params.id);
  if (!leave)
    return res.status(404).json({ message: "Leave not found" });

  leave.status = status;
  leave.remarks = remarks;

  await leave.save();

  res.json({
    message: `Leave ${status}`,
    leave,
  });
};
