import Employee from "../models/Employee.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// =====================
// HR REGISTER (Admin)
// =====================
export const registerHR = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await Employee.findOne({ email });
    if (exists) return res.status(400).json({ message: "HR already exists" });

    const hr = await Employee.create({
      name,
      email,
      password,
      role: "hr",
      employeeId: "HR001",
    });

    res.status(201).json({
      message: "HR registered",
      token: generateToken(hr),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// HR LOGIN
// =====================
export const loginHR = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hr = await Employee.findOne({ email, role: "hr" });
    if (!hr) return res.status(404).json({ message: "HR not found" });

    const isMatch = await bcrypt.compare(password, hr.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      token: generateToken(hr),
      role: hr.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================
// EMPLOYEE LOGIN
// =====================
export const loginEmployee = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    const employee = await Employee.findOne({ employeeId });
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });
    if (employee.status === "offboarded")
      return res.status(403).json({ message: "Access Revoked. Employee is offboarded" });

    res.json({
      token: generateToken(employee),
      role: employee.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
