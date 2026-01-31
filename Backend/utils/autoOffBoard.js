import Employee from "../models/Employee.js";
import Offboarding from "../models/offBoarding.js";

const autoOffBoard = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exits = await Offboarding.find({
    lastWorkingDay: { $lt: today },
  });

  for (let exit of exits) {
    await Employee.findByIdAndUpdate(exit.employeeId, {
      status: "offboarded",
    });
  }
};

export default autoOffBoard;
