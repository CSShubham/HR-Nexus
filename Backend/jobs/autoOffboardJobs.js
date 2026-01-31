import cron from "node-cron";
import autoOffBoard from "../utils/autoOffBoard.js";

const autoOffboardJobs = () => {
  // Runs every day at 00:05 AM
  cron.schedule("5 0 * * *", async () => {
    console.log("Auto-offboarding started");
    await autoOffBoard();
  });
};

export default autoOffboardJobs;
