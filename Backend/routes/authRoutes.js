import express from "express";
import {
  registerHR,
  loginHR,
  loginEmployee,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register-hr", registerHR);   // one-time or protected later
router.post("/login-hr", loginHR);
router.post("/login-employee", loginEmployee);

export default router;
