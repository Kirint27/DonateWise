// routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const { getDonations, addDonation } = require('../controller/donation'); // Ensure correct path
const { verifyJWT } = require('../middleware/authMiddleware');


// Route to get donations
router.get('/', verifyJWT, (req, res) => {
  getDonations(req, res);  // Call getDonations directly
});

// // Route to add a donation
router.post('/', verifyJWT, addDonation);  // Call addDonation directly

module.exports = router;
