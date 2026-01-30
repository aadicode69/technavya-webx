const PayrollConfig = require("../models/PayrollConfig");

exports.setPayroll = async (req, res) => {
  try {
    const {
      employeeId,
      monthlyWage,
      basicPercent,
      hraPercent,
      performancePercent,
      ltaPercent,
      standardAllowance,
      pfRate,
      professionalTax
    } = req.body;

    const yearlyWage = monthlyWage * 12;

    const basic = (monthlyWage * basicPercent) / 100;
    const hra = (basic * hraPercent) / 100;
    const performanceBonus = (basic * performancePercent) / 100;
    const lta = (basic * ltaPercent) / 100;

    const used =
      basic + hra + performanceBonus + lta + standardAllowance;

    const fixedAllowance = monthlyWage - used;

    if (fixedAllowance < 0)
      return res.status(400).json({ message: "Invalid salary breakup" });

    const pfEmployee = (basic * pfRate) / 100;
    const pfEmployer = (basic * pfRate) / 100;

    const netSalary =
      monthlyWage - pfEmployee - professionalTax;

    const data = {
      employeeId,
      monthlyWage,
      yearlyWage,
      components: {
        basicPercent,
        hraPercent,
        performancePercent,
        ltaPercent,
        standardAllowance
      },
      deductions: {
        pfRate,
        professionalTax
      },
      computed: {
        basic,
        hra,
        performanceBonus,
        lta,
        fixedAllowance,
        pfEmployee,
        pfEmployer,
        netSalary
      }
    };

    const payroll = await PayrollConfig.findOneAndUpdate(
      { employeeId },
      data,
      { upsert: true, new: true }
    );

    res.json(payroll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPayrollByEmployeeId = async (req, res) => {
  const payroll = await PayrollConfig.findOne({
    employeeId: req.params.employeeId
  });

  if (!payroll)
    return res.status(404).json({ message: "Payroll not found" });

  res.json(payroll);
};

exports.getMyPayroll = async (req, res) => {
  const payroll = await PayrollConfig.findOne({
    employeeId: req.user.employeeId
  });

  if (!payroll)
    return res.status(404).json({ message: "Payroll not found" });

  res.json({
    monthlyWage: payroll.monthlyWage,
    netSalary: payroll.computed.netSalary,
    components: payroll.computed
  });
};

