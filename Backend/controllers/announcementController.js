
import Announcement from "../models/Announcement.js";

// HR CREATE
export const createAnnouncement = async (req, res) => {
  const { title, message } = req.body;

  const announcement = await Announcement.create({
    title,
    message,
    createdBy: req.user.id,
  });

  res.status(201).json({
    message: "Announcement created",
    announcement,
  });
};
// HR DELETE
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Optional: Check if user is the creator
    if (announcement.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Announcement.findByIdAndDelete(req.params.id);

    res.json({ message: "Announcement deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// HR UPDATE
export const updateAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;
    
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, message },
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({
      message: "Announcement updated",
      announcement,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// VIEW ALL
export const getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find()
    .sort({ createdAt: -1 })
    .populate("createdBy", "name");

  res.json(announcements);
};

