// Event Routes
const express = require("express");
const router = express.Router();

const {
  createEvent,
  inviteUser,
  getEventDetails,
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");

// Using authMiddleware to verify bearer token
// before sending the request to controller.
router.route("/create-event").post(protect, createEvent);
router.route("/invite-user").post(protect, inviteUser);
router.route("/get-event-details").get(protect, getEventDetails);

module.exports = router;
