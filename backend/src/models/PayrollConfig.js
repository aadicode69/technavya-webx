const mongoose = require("mongoose");

const payrollConfigSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true
    },

    monthlyWage: {
      type: Number,
      required: true
    },

    yearlyWage: {
      type: Number,
      required: true
    },

    components: {
      basicPercent: Number,
      hraPercent: Number,
      standardAllowance: Number,
      performancePercent: Number,
      ltaPercent: Number
    },

    deductions: {
      pfRate: Number,
      professionalTax: Number
    },

    computed: {
      basic: Number,
      hra: Number,
      performanceBonus: Number,
      lta: Number,
      fixedAllowance: Number,
      pfEmployee: Number,
      pfEmployer: Number,
      netSalary: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("PayrollConfig", payrollConfigSchema);
