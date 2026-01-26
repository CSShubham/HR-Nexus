import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
} from "../controllers/announcementController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// HR ONLY
router.post("/", protect, authorize("hr"), createAnnouncement);

// EMPLOYEE + HR
router.get("/", protect, authorize("employee", "hr"), getAnnouncements);

export default router;