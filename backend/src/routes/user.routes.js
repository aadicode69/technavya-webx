const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const {
  getMe,
  updateMe,
  getAllUsers,
  updateUserByAdmin
} = require("../controllers/user.controller");

router.get("/me", auth, getMe);
router.put("/me", auth, updateMe);

router.get("/", auth, role("ADMIN"), getAllUsers);
router.put("/:id", auth, role("ADMIN"), updateUserByAdmin);

module.exports = router;
