
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

// VIEW ALL
export const getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find()
    .sort({ createdAt: -1 })
    .populate("createdBy", "name");

  res.json(announcements);
};
