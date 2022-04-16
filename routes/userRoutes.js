// User Routes
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  changePassword,
  resetPassword,
  updatePassword,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// Using authMiddleware to verify bearer token
// before sending the request to controller.
router.route("/changepassword").post(protect, changePassword);

router.route("/resetpassword").get(resetPassword);
router.route("/updatepassword").post(updatePassword);

module.exports = router;
