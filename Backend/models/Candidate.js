import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    resumeUrl: String,
    status: {
      type: String,
      enum: ["applied", "interview", "rejected", "onboarded"],
      default: "applied",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);
