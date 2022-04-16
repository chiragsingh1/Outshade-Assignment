// Event Controller
const asyncHandler = require("express-async-handler");
const Event = require("../models/eventModel");

// Logic to fetch only logged in user's created Events and invited Events
const fetchEvents = asyncHandler(async (req, res) => {
  const { userID } = req.body;
  if (!userID) {
    return res.status(400).json({ error: "Send a correct User ID." });
  }

  try {
    // Find events created by userID
    var eventsCreatedByUser = await Event.find({ eventCreator: userID })
      .populate("eventCreator", "-password -ansToSecurityQuestion")
      .populate("invitedUsers", "-password -ansToSecurityQuestion");
    // Find events in which userID is invited
    var eventsInvitedTo = await Event.find({ invitedUsers: userID })
      .populate("eventCreator", "-password -ansToSecurityQuestion")
      .populate("invitedUsers", "-password -ansToSecurityQuestion");

    return res.status(200).json({ eventsCreatedByUser, eventsInvitedTo });
  } catch (err) {
    res.status(400).json({ error: "Error in fetching an event." });
    throw new Error(err.message);
  }
});

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
    const updatedEvent = await Event.findByIdAndUpdate(
      eventID,
      {
        $push: { invitedUsers: userToInvite },
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

// Logic to update an Event's Details like name, date, type.
const updateEvent = asyncHandler(async (req, res) => {
  const { eventID, eventName, eventDate, eventType } = req.body;
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventID,
      {
        eventName,
        eventDate,
        eventType,
      },
      {
        new: true,
      }
    )
      .populate("eventCreator", "-password -ansToSecurityQuestion")
      .populate("invitedUsers", "-password -ansToSecurityQuestion");

    if (!updateEvent) {
      return res.status(404).json({ error: "Event not found." });
    }

    return res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(400).json({ error: "Error in updating an event." });
    throw new Error(err.message);
  }
});

module.exports = {
  createEvent,
  inviteUser,
  getEventDetails,
  fetchEvents,
  updateEvent,
};
