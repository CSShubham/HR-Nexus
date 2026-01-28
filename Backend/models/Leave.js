import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    leaveType: {
      type: String,
      enum: ["casual", "sick", "earned", "unpaid"],
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
    },
    reason: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    remarks: String,
  },
  { timestamps: true },
);

export default mongoose.model("Leave", leaveSchema);
