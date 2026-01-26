import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: String,
    message: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
