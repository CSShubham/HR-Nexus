import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

// Utility: get today's date (YYYY-MM-DD)
const getToday = () => new Date().toISOString().split("T")[0];

// ====================
// PUNCH IN
// ====================
export const punchIn = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const today = getToday();

    const alreadyPunched = await Attendance.findOne({
      employeeId,
      date: today,
    });

    if (alreadyPunched)
      return res.status(400).json({ message: "Already punched in today" });

    const attendance = await Attendance.create({
      employeeId,
      date: today,
      punchIn: new Date(),
    });

    res.status(201).json({
      message: "Punch in successful",
      attendance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================
// PUNCH OUT
// ====================
export const punchOut = async (req, res) => {
  try {
    const employeeId = req.user.id;
    const today = getToday();

    const attendance = await Attendance.findOne({
      employeeId,
      date: today,
    });

    if (!attendance)
      return res.status(400).json({ message: "Punch in first" });

    if (attendance.punchOut)
      return res.status(400).json({ message: "Already punched out" });

    attendance.punchOut = new Date();

    const diffMs = attendance.punchOut - attendance.punchIn;
    attendance.totalHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;

    await attendance.save();

    res.json({
      message: "Punch out successful",
      attendance,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================
// EMPLOYEE VIEW
// ====================
export const getMyAttendance = async (req, res) => {
  const attendance = await Attendance.find({
    employeeId: req.user.id,
  }).sort({ date: -1 });

  res.json(attendance);
};

// ====================
// HR VIEW ALL
// ====================
export const getAllAttendance = async (req, res) => {
  const attendance = await Attendance.find()
    .populate("employeeId", "name employeeId department")
    .sort({ date: -1 });

  res.json(attendance);
};
