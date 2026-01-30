const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["PAID", "SICK", "UNPAID"],
      required: true
    },
    fromDate: {
      type: String, // YYYY-MM-DD
      required: true
    },
    toDate: {
      type: String, // YYYY-MM-DD
      required: true
    },
    reason: {
      type: String
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    },
    adminComment: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", leaveSchema);
