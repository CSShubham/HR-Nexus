import express from "express";
import {
  punchIn,
  punchOut,
  getMyAttendance,
  getAllAttendance,
} from "../controllers/attendanceController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// EMPLOYEE
router.post("/punch-in", protect, authorize("employee", "hr"), punchIn);
router.post("/punch-out", protect, authorize("employee", "hr"), punchOut);
router.get("/me", protect, authorize("employee", "hr"), getMyAttendance);

// HR
router.get("/", protect, authorize("hr"), getAllAttendance);

export default router;
