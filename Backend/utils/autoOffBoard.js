import Employee from "../models/Employee.js";
import Offboarding from "../models/offBoarding.js";

const autoOffboard = async () => {
  const today = new Date();

  const exits = await Offboarding.find({
    lastWorkingDay: { $lt: today },
  });

  for (let exit of exits) {
    await Employee.findByIdAndUpdate(exit.employeeId, {
      status: "offboarded",
    });
  }
};

export default autoOffboard;
