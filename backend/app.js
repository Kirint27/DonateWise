const express = require("express");
const authRouter = require("./routes/authRoutes"); // ✅ Make sure the path is correct
const donationRouter = require("./routes/donationRoutes");
const profileRouter = require("./routes/profileRoutes");
const charityRouter = require("./routes/charitySearchRoutes");
const goalRouter = require("./routes/goalRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json()); // Middleware to parse JSON in requests
app.use(cookieParser()); // Enable cookie parsing

// ✅ Ensure correct CORS settings for frontend
app.use(cors({
    origin: "http://localhost:3000", 
    credentials: true 
}));

// ✅ Register auth routes under `/api`
app.use("/api", authRouter); // This must match frontend requests
app.use("/api/donations", donationRouter);
app.use("/api/profile", profileRouter);
app.use("/api/goals", goalRouter);
app.use("/api/charities", charityRouter);

// Welcome route
app.get("/", (req, res) => {
    res.send("Welcome to the Charity Tracker API!");
});

module.exports = app;
