const express = require('express');
const authRouter = require('./routes/authRoutes'); // Auth routes
const donationRouter = require('./routes/donationRoutes'); // Donation routes
const profileRouter = require('./routes/profileRoutes'); // Profile route
const goalRouter = require('./routes/goalRoutes');
const app = express();

app.use(express.json()); // Middleware to parse JSON in requests

app.use('/', profileRouter);

// Set up route handlers for each resource
app.use('/auth', authRouter); 
// Auth routes under '/auth'
app.use('/donations', donationRouter); // Donation routes under '/donations'


app.use('/profile', profileRouter);


app.use('/goals',goalRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Charity Tracker API!');
  });
// Add a catch-all route for the root path

module.exports = app;
