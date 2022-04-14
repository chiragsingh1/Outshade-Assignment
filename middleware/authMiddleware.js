const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

// Middleware to authorize the user before making the request to the server.
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decode token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      //   console.log(req.user);
      next();
    } catch (error) {
      res.status(401).json({ error: "Not authorized, token failed." });
      throw new Error("Not authorized, token failed.");
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token." });
    throw new Error("Not authorized, no token.");
  }
});

module.exports = { protect };
