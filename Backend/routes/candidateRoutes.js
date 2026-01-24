import express from "express";
import {
  applyCandidate,
  getAllCandidates,
  updateCandidateStatus,
} from "../controllers/candidateController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Public
router.post("/apply", applyCandidate);

// HR only
router.get("/", protect, authorize("hr"), getAllCandidates);
router.put("/:id/status", protect, authorize("hr"), updateCandidateStatus);

export default router;
