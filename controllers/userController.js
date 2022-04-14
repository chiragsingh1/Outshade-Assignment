// User Controller
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const generateToken = require("../config/generateToken");

/* Logic to create a new user and saving it in mongoDB:
The user will also send the answer to a security question 
and that answer will be used to reset password in future if the user forgets it.
By default the security question is:
"Your favorite city + Last 4 digits of your mobile number?"
For example, if a user's favorite city is 'Mumbai' and the last 4 digits
of it's mobile number is '9899', the answer becomes: 'Mumbai9899'.
*/
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, ansToSecurityQuestion } = req.body;

  if (!name || !email || !password || !ansToSecurityQuestion) {
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
    ansToSecurityQuestion,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ error: "Failed to create user." });
    throw new Error("Failed to create user.");
  }
});

// Login User Logic
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // Finding the user in the database
  const user = await User.findOne({ email });

  if (user && user.password == password) {
    // If the password is correct and the user is found return it and the token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ error: "Invalid Email or Password." });
    throw new Error("Invalid Email or Password.");
  }
});

// Logic to change password:
// The bearer token is sent along with the request,
// and if the token is verified then only the password will be changed.
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findOne({ _id: req.user._id });

  if (!user) {
    res.status(404).json({ error: "User not found." });
    throw new Error("User not found.");
  }

  if (user.password == oldPassword) {
    // Old password is correct, now update it.
    const updateUser = await User.findByIdAndUpdate(user._id, {
      password: newPassword,
    });
    res.status(200).json({
      message: "Password changed successfully.",
    });
  } else {
    res.status(403).json({ error: "Old Password is incorrect." });
  }
});

// Logic to reset a password:
// The user forgot the password and now wants to update it with a new password.
// The user will send the emailID in the request query.
const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ error: "User not found." });
    throw new Error("User not found.");
  }

  res.status(200).json({
    message:
      "Go to the following URL and send the answer to the security question and the new password to update your password.",
    url: "http://localhost:5000/api/user/updatepassword",
  });
});
// Logic to update password.
const updatePassword = asyncHandler(async (req, res) => {
  const { email, ansToSecurityQuestion, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ error: "User not found." });
    throw new Error("User not found.");
  }
  // If the security answer does not match.
  if (ansToSecurityQuestion != user.ansToSecurityQuestion) {
    res.status(403).json({ error: "Forbidden." });
    throw new Error("Forbidden.");
  }

  const updateUserPassword = await User.findByIdAndUpdate(user._id, {
    password: newPassword,
  });
  res.status(200).json({
    message: "Password changed successfully.",
  });
});

module.exports = {
  registerUser,
  loginUser,
  changePassword,
  resetPassword,
  updatePassword,
};
