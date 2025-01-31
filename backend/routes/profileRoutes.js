// routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const { getProfile, putProfile } = require('../controller/profile'); // Ensure correct path
const { verifyJWT } = require('../middleware/authMiddleware');

router.get('/profile', verifyJWT, (req, res) => {
  getProfile(req, res);  // Call getDonations directly
});

router.put('/', verifyJWT, putProfile);  // Call addDonation directly

module.exports = router;
