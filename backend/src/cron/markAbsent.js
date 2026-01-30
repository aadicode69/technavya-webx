const cron = require("node-cron");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");

const today = () => new Date().toISOString().split("T")[0];

cron.schedule("59 23 * * *", async () => {
  const date = today();

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

    await Attendance.create({
      user: user._id,
      date,
      status: "ABSENT"
    });
  }

  console.log("✅ Absent marked for date:", date);
});
