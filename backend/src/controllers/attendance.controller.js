const Attendance = require("../models/Attendance");

const today = () => {
  const d = new Date();
  return d.toLocaleDateString("en-CA");
};

exports.checkIn = async (req, res) => {
  try {
    const date = today();

    const exists = await Attendance.findOne({
      user: req.user.id,
      date
    });

    if (exists)
      return res.status(400).json({ message: "Already checked in today" });

    const attendance = await Attendance.create({
      user: req.user.id,
      date,
      checkIn: new Date()
    });

    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const date = today();

    const attendance = await Attendance.findOne({
      user: req.user.id,
      date
    });

    if (!attendance)
      return res.status(400).json({ message: "Check-in required first" });

    if (attendance.checkOut)
      return res.status(400).json({ message: "Already checked out" });

    attendance.checkOut = new Date();

    const hours =
      (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);

    attendance.status = hours >= 6 ? "PRESENT" : "HALF_DAY";

    await attendance.save();

    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ user: req.user.id })
      .sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("user", "name email employeeId")
      .sort({ date: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
