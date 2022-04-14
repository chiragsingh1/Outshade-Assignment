const express = require("express");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoutes");

// Load .env file contents into process.env
dotenv.config();

// DB connection
const connectDB = require("./config/db");
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/api/user", userRoute);

// Server Setup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server running on port: ${PORT}`));
