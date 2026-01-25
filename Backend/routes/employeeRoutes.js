import express from "express";
import {
  onboardEmployee,
  offboardEmployee,
  getOffboardingInfo,
  getAllEmployees,
} from "../controllers/employeeController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// HR ONLY
router.get("/", protect, authorize("hr"), getAllEmployees);

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
