const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const { getEmployeeByEmployeeId } = require("../controllers/admin.controller");

const {
  getEmployeeFullRecord
} = require("../controllers/admin.controller");

router.get(
  "/employees/by-employee-id/:employeeId",
  auth,
  role("ADMIN"),
  getEmployeeByEmployeeId
);

module.exports = router;
