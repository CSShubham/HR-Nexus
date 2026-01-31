import Employee from "../models/Employee.js";
import Candidate from "../models/Candidate.js";
import generateEmployeeId from "../utils/generateEmployeeId.js";
import Offboarding from "../models/offBoarding.js";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";
import sendEmail from "../utils/sendEmail.js";
import generateTempPassword from "../utils/generateTempPassword.js";
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
    const tempPassword = generateTempPassword();

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

    // 📧 SEND EMAIL
    await sendEmail({
      to: employee.email,
      subject: "Welcome to the Company 🎉",
      html: `
  <h2>Welcome ${employee.name}! 🎉</h2>

  <p>
    We are pleased to inform you that you have been successfully onboarded as an employee at <strong>HR Nexus</strong>.
  </p>

  <h3>Login Credentials</h3>
  <p><strong>Employee ID:</strong> ${employee.employeeId}</p>
  <p><strong>Temporary Password:</strong> ${tempPassword}</p>

  <p>
    🔐 Please log in using the above credentials and change your password immediately after your first login.
    Do not share your login details with anyone.
  </p>

  <p>
    📍 <strong>Login URL:</strong><br/>
    <a href="http://localhost:5173/login">http://localhost:5173/login</a>
  </p>

  <br/>

  <p>
    If you face any issues while logging in, feel free to contact the HR team.
  </p>

  <br/>

  <p>
    Regards,<br/>
    <strong>HR Team</strong><br/>
    HR Nexus
  </p>
`,
    });

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
    "employeeId name email department designation address phone status role createdAt",
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
    "employeeId name email department designation phone status role createdAt",
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

  const leaveSet = new Set(leavesToday.map((l) => l.employeeId.toString()));

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
// HR: UPDATE EMPLOYEE
// ====================
export const updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const allowedUpdates = ['name', 'email', 'phone', 'department', 'designation', 'address', 'status'];
    
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({
      message: "Employee updated successfully",
      employee,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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

// ====================
// HR: DELETE OFFBOARDED EMPLOYEE
// ====================
export const deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Only allow deletion of offboarded employees
    if (employee.status !== "offboarded") {
      return res.status(400).json({ 
        message: "Only offboarded employees can be deleted" 
      });
    }

    // Delete employee record
    await Employee.findByIdAndDelete(employeeId);

    // Delete related records (offboarding, attendance, leaves)
    await Offboarding.deleteMany({ employeeId });
    await Attendance.deleteMany({ employeeId });
    await Leave.deleteMany({ employeeId });

    res.json({
      message: "Employee deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};