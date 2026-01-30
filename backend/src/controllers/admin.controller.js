const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");

exports.getEmployeeByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const user = await User.findOne({ employeeId }).select("-password");
    if (!user)
      return res.status(404).json({ message: "Employee not found" });

    const attendance = await Attendance.find({ user: user._id })
      .sort({ date: -1 });

    const leaves = await Leave.find({ user: user._id })
      .sort({ createdAt: -1 });

    res.json({
      profile: user,
      attendance,
      leaves
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

