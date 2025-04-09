const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json()); // Middleware to parse JSON in requests
app.use(cookieParser()); // Enable cookie parsing

// Ensure correct CORS settings for frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Default to localhost during local development
    credentials: true 
}));

// Register your routes
app.use("/api", authRouter);
app.use("/api/donations", donationRouter);
app.use("/api/profile", profileRouter);
app.use("/api/goals", goalRouter);
app.use("/api/charities", charityRouter);

// Welcome route
app.get("/", (req, res) => {
    res.send("Welcome to the Charity Tracker API!");
});

module.exports = app;
