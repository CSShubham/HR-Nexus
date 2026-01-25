import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// EMPLOYEE
router.post("/apply", protect, authorize("employee", "hr"), applyLeave);
router.get("/me", protect, authorize("employee", "hr"), getMyLeaves);

// HR
router.get("/", protect, authorize("hr"), getAllLeaves);
router.put("/:id", protect, authorize("hr"), updateLeaveStatus);

export default router;
