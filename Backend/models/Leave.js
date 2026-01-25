import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    fromDate: Date,
    toDate: Date,
    reason: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    remarks: String,
  },
  { timestamps: true }
);

export default mongoose.model("Leave", leaveSchema);
