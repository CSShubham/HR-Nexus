// import dotenv from "dotenv";
// dotenv.config();


import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import morgan from "morgan";
import autoOffboardJobs from "./jobs/autoOffboardJobs.js";
import autoOffBoard from "./utils/autoOffBoard.js";


connectDB();


const app = express();
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173", // Dev frontend
   process.env.FRONTEND_URL,// Production frontend (later)
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

(async () => {
  // Safety execution (runs if server was down earlier)
  await autoOffBoard();

  // Schedule future runs while server stays alive
  autoOffboardJobs();
})();
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 HR Nexus backend running on port ${PORT}`),
);
