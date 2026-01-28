import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
  updateAnnouncement,
} from "../controllers/announcementController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// HR ONLY
router.post("/", protect, authorize("hr"), createAnnouncement);
router.delete("/:id", protect, authorize("hr"), deleteAnnouncement);
router.put("/:id", protect, authorize("hr"), updateAnnouncement);
// EMPLOYEE + HR
router.get("/", protect, authorize("employee", "hr"), getAnnouncements);

export default router;