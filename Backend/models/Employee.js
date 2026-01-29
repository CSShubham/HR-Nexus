import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true , required: true},
    name: String,
    email: String,
    phone: String,
    department: String,
    designation: String,
    address: { type: String },
    role: {
      type: String,
      enum: ["employee", "hr"],
      default: "employee",
    },
    password: String,
    status: {
      type: String,
      enum: ["active", "inactive", "exiting", "offboarded"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Hash password
employeeSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("Employee", employeeSchema);
