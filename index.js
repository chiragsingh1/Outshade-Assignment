const express = require("express");
const dotenv = require("dotenv");

const userRoute = require("./routes/userRoutes");
const eventRoute = require("./routes/eventRoutes");

// Load .env file contents into process.env
dotenv.config();

// DB connection
const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/api/user", userRoute);
app.use("/api/event", eventRoute);

// Server Setup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server running on port: ${PORT}`));
