import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    date: String,
    punchIn: Date,
    punchOut: Date,
    totalHours: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
