const jwt = require("jsonwebtoken");

const generateToken = (id, role, employeeId) => {
  return jwt.sign({ id, role, employeeId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

module.exports = generateToken;
