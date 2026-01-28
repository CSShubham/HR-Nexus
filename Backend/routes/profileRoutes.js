import express from "express";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/me", protect, authorize("employee", "hr"), getMyProfile);
router.put("/me", protect, authorize("employee", "hr"), updateMyProfile);

export default router;
