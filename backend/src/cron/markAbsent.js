const cron = require("node-cron");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");

const today = () => {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d.toLocaleDateString("en-CA"); // local YYYY-MM-DD
};

cron.schedule("59 23 * * *", async () => {
  const date = today();

  console.log("🕒 CRON running for date:", date);

  const users = await User.find();

  for (const user of users) {

    const hasAttendance = await Attendance.findOne({
      user: user._id,
      date
    });

    if (hasAttendance) continue;

    const onLeave = await Leave.findOne({
      user: user._id,
      status: "APPROVED",
      fromDate: { $lte: date },
      toDate: { $gte: date }
    });

    if (onLeave) continue;

    await Attendance.findOneAndUpdate(
      { user: user._id, date },
      { user: user._id, date, status: "ABSENT" },
      { upsert: true }
    );

    console.log("🚨 ABSENT MARKED:", user.employeeId, date);
  }

  console.log("✅ Absent marked for date:", date);
});
