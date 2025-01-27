const express = require('express');
const router = express.Router();
const { getDonations, addDonation } = require('../controller/donation');
const { verifyJWT } = require('../middleware/authMiddleware');


router.get('/donations', verifyJWT, getDonations);      // Fetch donations for a user
router.post('/donations', verifyJWT, addDonation);     // Add a new donation


router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  });
module.exports = router;