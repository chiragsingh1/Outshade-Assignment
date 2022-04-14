// User Controller
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// Logic to create a new user and saving it in mongoDB
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({
      error: "Please send all the fields.",
    });
    throw new Error("Please send all the fields.");
  }

  // If the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ error: "User already exists." });
    throw new Error("User already exists.");
  }

  // Else Create a new user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400).json({ error: "Failed to create user." });
    throw new Error("Failed to create user.");
  }
});

module.exports = { registerUser };
