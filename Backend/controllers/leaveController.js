import Leave from "../models/Leave.js";

// ====================
// APPLY LEAVE
// ====================
export const applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason, leaveType } = req.body;
    if (!fromDate || !toDate || !reason || !leaveType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({
        message: "From date cannot be after To date",
      });
    }

    const leave = await Leave.create({
      employeeId: req.user.id,
      leaveType,
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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const leaves = await Leave.find()
    .populate("employeeId", "name employeeId department")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Leave.countDocuments();

  res.json({ leaves, total, page, pages: Math.ceil(total / limit) });
};

// ====================
// HR APPROVE / REJECT
// ====================
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    // ✅ check BEFORE update
    if (leave.status !== "pending") {
      return res.status(400).json({
        message: "Leave already processed",
      });
    }

    leave.status = status;
    leave.remarks = remarks;

    await leave.save();

    res.json({
      message: `Leave ${status} successfully`,
      leave,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
