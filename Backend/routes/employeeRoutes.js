import express from "express";
import {
  onboardEmployee,
  offboardEmployee,
  getOffboardingInfo,
  getAllEmployees,
  getEmployeesWithWorkingStatus
} from "../controllers/employeeController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// HR ONLY
router.get("/", protect, authorize("hr"), getAllEmployees);
router.get("/working-status", protect, authorize("hr"), getEmployeesWithWorkingStatus);
router.post("/onboard/:candidateId", protect, authorize("hr"), onboardEmployee);

router.post(
  "/offboard/:employeeId",
  protect,
  authorize("hr"),
  offboardEmployee,
);

router.get(
  "/offboarding/me",
  protect,
  authorize("employee", "hr"),
  getOffboardingInfo,
);

export default router;
