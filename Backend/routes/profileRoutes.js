import express from "express";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profileController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, authorize("employee"), getMyProfile);
router.put("/me", protect, authorize("employee"), updateMyProfile);

export default router;
