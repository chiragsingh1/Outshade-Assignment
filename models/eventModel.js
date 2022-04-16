const mongoose = require("mongoose");

// Creating event schema
const eventSchema = mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    eventDate: {
      type: String,
      required: true,
    },
    eventCreator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invitedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
