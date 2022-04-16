// Event Controller
const asyncHandler = require("express-async-handler");
const Event = require("../models/eventModel");

// Logic to create a new event.
const createEvent = asyncHandler(async (req, res) => {
  const { eventType, eventName, eventDate, invitedUsers, eventCreator } =
    req.body;

  if (!eventType || !eventName || !eventDate || !invitedUsers) {
    return res.status(400).json({
      error: "Please send all the fields.",
    });
  }

  var invitedUsersList = JSON.parse(invitedUsers);

  if (invitedUsersList.length < 1) {
    return res.status(400).json({
      error: "Atleast invite 1 guest.",
    });
  }

  try {
    const newEvent = await Event.create({
      eventName: eventName,
      eventType: eventType,
      eventDate: eventDate,
      eventCreator: eventCreator,
      invitedUsers: invitedUsersList,
    });
    const fullEventDetails = await Event.findOne({ _id: newEvent._id })
      .populate("eventCreator", "-password -ansToSecurityQuestion")
      .populate("invitedUsers", "-password -ansToSecurityQuestion");

    res.status(200).json(fullEventDetails);
  } catch (err) {
    res.status(400).json({ error: "Error in creating an event." });
    throw new Error(err.message);
  }
});

// Logic to invite a single user to an existing event.
const inviteUser = asyncHandler(async (req, res) => {
  const { eventID, userToInvite } = req.body;
  try {
    const event = await Event.findById(eventID);

    const invitedUsersUpdated = event.invitedUsers;
    invitedUsersUpdated.push(userToInvite);

    const updatedEvent = await Event.findByIdAndUpdate(
      eventID,
      {
        invitedUsers: invitedUsersUpdated,
      },
      {
        new: true,
      }
    )
      .populate("eventCreator", "-password -ansToSecurityQuestion")
      .populate("invitedUsers", "-password -ansToSecurityQuestion");

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(400).json({ error: "Error in updating an event." });
    throw new Error(err.message);
  }
});

// Logic to get any event details using event ID
const getEventDetails = asyncHandler(async (req, res) => {
  const { eventID } = req.body;
  try {
    const event = await Event.findById(eventID)
      .populate("eventCreator", "-password -ansToSecurityQuestion")
      .populate("invitedUsers", "-password -ansToSecurityQuestion");

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    return res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ error: "Error in returning an event." });
    throw new Error(err.message);
  }
});

module.exports = {
  createEvent,
  inviteUser,
  getEventDetails,
};
