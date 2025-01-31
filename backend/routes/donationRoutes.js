// routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const { getDonations, addDonation, deleteDonation } = require('../controller/donation'); // Ensure correct path
const { verifyJWT } = require('../middleware/authMiddleware');


// Route to get donations
router.get('/', verifyJWT, (req, res) => {
  getDonations(req, res);  // Call getDonations directly
});

// // Route to add a donation
router.post('/', verifyJWT, addDonation);  // Call addDonation directly

router.delete('/', verifyJWT, (req, res) => {
  deleteDonation(req, res);  // Call getDonations directly
});
module.exports = router;
