const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const PayrollConfig = require("../models/PayrollConfig");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    // ✅ use ObjectId
    const attendance = await Attendance.find({ user: user._id });
    const leaves = await Leave.find({ user: user._id });

    let present = 0, halfDay = 0, absent = 0, leaveDays = 0;

    attendance.forEach(a => {
      if (a.status === "PRESENT") present++;
      else if (a.status === "HALF_DAY") halfDay++;
      else if (a.status === "ABSENT") absent++;
      else if (a.status === "LEAVE") leaveDays++;
    });

    let paidUsed = 0, unpaidUsed = 0, pending = 0;

    leaves.forEach(l => {
      const days =
        (new Date(l.toDate) - new Date(l.fromDate)) /
          (1000 * 60 * 60 * 24) +
        1;

      if (l.status === "PENDING") pending++;
      else if (l.type === "PAID") paidUsed += days;
      else unpaidUsed += days;
    });

    const payroll = await PayrollConfig.findOne({
      employeeId: user.employeeId
    });

    res.json({
      profile: user,

      attendance: {
        present,
        halfDay,
        absent,
        leave: leaveDays
      },

      leaves: {
        paidUsed,
        unpaidUsed,
        pending
      },

      payroll: payroll
        ? {
            monthlyWage: payroll.monthlyWage,
            netSalary: payroll.computed.netSalary
          }
        : null
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateUserByAdmin = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
