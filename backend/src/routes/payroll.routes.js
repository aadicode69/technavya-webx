const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const {
  setPayroll,
  getPayrollByEmployeeId,
  getMyPayroll
} = require("../controllers/payroll.controller");

router.post("/", auth, role("ADMIN"), setPayroll);
router.get("/employee/:employeeId", auth, role("ADMIN"), getPayrollByEmployeeId);

router.get("/me/view", auth, getMyPayroll);

module.exports = router;
