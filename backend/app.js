const express = require('express');
const authRouter = require('./routes/authRoutes'); // Auth routes
const donationRouter = require('./routes/donationRoutes'); // Donation routes
const profileRouter = require('./routes/profileRoutes'); // Profile route
const goalRouter = require('./routes/goalRoutes');
const app = express();
const cors = require("cors");

app.use(express.json()); // Middleware to parse JSON in requests
app.use(cors()); // Allow all origins

app.use('/', profileRouter);

// Set up route handlers for each resource
app.use('/api', authRouter); // <--- Updated route definition
app.use('/api/donations', donationRouter); // Donation routes under '/donations'
app.use('/api/profile', profileRouter);
app.use('/api/goals',goalRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Charity Tracker API!');
  });
// Add a catch-all route for the root path

module.exports = app;