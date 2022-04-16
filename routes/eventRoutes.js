// Event Routes
const express = require("express");
const router = express.Router();

const {
  createEvent,
  inviteUser,
  getEventDetails,
  fetchEvents,
  updateEvent,
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");

// Using authMiddleware to verify bearer token
// before sending the request to controller.
router.route("/create-event").post(protect, createEvent);
router.route("/invite-user").post(protect, inviteUser);
router.route("/get-event-details").get(protect, getEventDetails);
router.route("/fetch-events").get(protect, fetchEvents);
router.route("/update-event").post(protect, updateEvent);

module.exports = router;
