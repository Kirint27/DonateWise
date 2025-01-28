
// routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const { getGoals } = require('../controller/goals'); // Ensure correct path
const { verifyJWT } = require('../middleware/authMiddleware');


router.get('/', verifyJWT, (req, res) => {
    getGoals(req, res);  // Call getDonations directly
  });
  module.exports = router;
