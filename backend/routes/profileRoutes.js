// routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const { getProfile, putProfile } = require('../controller/profile'); // Ensure correct path
const { verifyJWT } = require('../middleware/authMiddleware');

// Log the imported functions to ensure they are correct


// // Route to get donations
router.get('/profile', verifyJWT, (req, res) => {
  getProfile(req, res);  // Call getDonations directly
});

// // Route to add a donation

router.put('/', verifyJWT, putProfile);  // Call addDonation directly
module.exports = router;
