const Leave = require("../models/Leave");
const Attendance = require("../models/Attendance");

exports.applyLeave = async (req, res) => {
  try {
    const { type, fromDate, toDate, reason } = req.body;

    const leave = await Leave.create({
      user: req.user.id,
      type,
      fromDate,
      toDate,
      reason,
    });

    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate("user", "name email employeeId")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, adminComment } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findById(req.params.leaveId);
    if (!leave)
      return res.status(404).json({ message: "Leave not found" });

    leave.status = status;
    leave.adminComment = adminComment;
    await leave.save();

    // Mark attendance only if approved
    if (status === "APPROVED") {
      let current = new Date(leave.fromDate);
      const end = new Date(leave.toDate);

      while (current <= end) {
        const date = current.toISOString().split("T")[0];
        console.log("🔥 LEAVE APPROVED → creating attendance for:", leave.user, date);

        await Attendance.findOneAndUpdate(
          { user: leave.user, date },
          {
            user: leave.user,
            date,
            status: "LEAVE"
          },
          { upsert: true }
        );

        current.setDate(current.getDate() + 1);
      }
    }
    res.json(leave);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
