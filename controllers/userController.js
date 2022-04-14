// User Controller
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "User Registered",
  });
});

module.exports = { registerUser };
