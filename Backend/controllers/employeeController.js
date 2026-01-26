import Employee from "../models/Employee.js";
import Candidate from "../models/Candidate.js";
import generateEmployeeId from "../utils/generateEmployeeId.js";
import Offboarding from "../models/offBoarding.js";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";
// ====================
// ONBOARD EMPLOYEE
// ====================
export const onboardEmployee = async (req, res) => {
  try {
    const { department, designation } = req.body;
    const { candidateId } = req.params;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

    if (candidate.status !== "interview")
      return res.status(400).json({ message: "Candidate not approved yet" });

    const employeeId = await generateEmployeeId(Employee);
    const tempPassword = "Welcome@123";

    const employee = await Employee.create({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      department,
      designation,
      employeeId,
      password: tempPassword,
    });

    candidate.status = "onboarded";
    await candidate.save();

    res.status(201).json({
      message: "Employee onboarded successfully",
      employeeId,
      tempPassword,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================
// HR: GET ALL EMPLOYEES
// ====================
export const getAllEmployees = async (req, res) => {
  const employees = await Employee.find().select(
    "employeeId name email department designation status role createdAt"
  );

  res.json({
    total: employees.length,
    employees,
  });
};


// ====================
// HR: EMPLOYEE WORKING STATUS (TODAY)
// ====================

export const getEmployeesWithWorkingStatus = async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  // 1️⃣ All employees
  const employees = await Employee.find().select(
    "employeeId name department designation status"
  );

  // 2️⃣ Today's attendance
  const attendanceToday = await Attendance.find({ date: today });

  // 3️⃣ Approved leaves today
  const leavesToday = await Leave.find({
    status: "approved",
    fromDate: { $lte: new Date(today) },
    toDate: { $gte: new Date(today) },
  });

  const attendanceMap = {};
  attendanceToday.forEach((a) => {
    attendanceMap[a.employeeId.toString()] = a;
  });

  const leaveSet = new Set(
    leavesToday.map((l) => l.employeeId.toString())
  );

  const result = employees.map((emp) => {
    let workingStatus = "Not Punched";

    if (leaveSet.has(emp._id.toString())) {
      workingStatus = "On Leave";
    } else if (attendanceMap[emp._id]) {
      workingStatus = attendanceMap[emp._id].punchOut
        ? "Punched Out"
        : "Punched In";
    }

    return {
      ...emp.toObject(),
      workingStatus,
    };
  });

  res.json(result);
};

// ====================
// HR INITIATES OFFBOARDING
// ====================
export const offboardEmployee = async (req, res) => {
  const { reason, lastWorkingDay } = req.body;

  const employee = await Employee.findById(req.params.employeeId);
  if (!employee) return res.status(404).json({ message: "Employee not found" });

  employee.status = "exiting";
  await employee.save();

  const offboarding = await Offboarding.create({
    employeeId: employee._id,
    reason,
    lastWorkingDay,
    initiatedBy: req.user.id,
  });

  res.json({
    message: "Offboarding initiated",
    offboarding,
  });
};

// ====================
// EMPLOYEE VIEW OFFBOARDING
// ====================
export const getOffboardingInfo = async (req, res) => {
  const info = await Offboarding.findOne({
    employeeId: req.user.id,
  });

  res.json(info);
};
