require("dotenv").config({ path: "../.env" });

const express = require("express");
const router = express.Router();
const moment = require("moment");
const connection = require("../db/databaseConnection");
const { verifyJWT } = require("../middleware/authMiddleware");

// GET donations route
// GET donations route
router.get('/', verifyJWT, (req, res) => {
  console.log('Decoded user:', req.user);
  getDonations(req, res); // Ensure getDonations is defined elsewhere
});


// POST add a donation
router.post('/', verifyJWT, async (req, res) => {
  const { charityName, donationAmount, donationType, donationDate, paymentMethod, goFundMe, charity_cause } = req.body;
  console.log('req.user:', req.user);
  
  const userId = req.user.userId; // Ensure consistent userId access
  console.log('userId:', userId);
  
  // Validate required fields
  if (!charityName || !donationAmount || !donationType || !paymentMethod || !goFundMe || !charity_cause) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Ensure charity_cause is an array and convert it to JSON if it's not already
  const charityCauses = Array.isArray(charity_cause) && charity_cause.length > 0 ? JSON.stringify(charity_cause) : JSON.stringify([]);

  // Updated query
  const query = `
    INSERT INTO donations 
    (charity_name, donation_amount, donation_type, donation_date, payment_method, goFundMe, user_id, charity_cause) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  connection.query(query, [charityName, donationAmount, donationType, donationDate, paymentMethod, goFundMe, userId, charityCauses], (err, results) => {
    if (err) {
      console.error('Error inserting donation:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ message: 'Donation added successfully' });
  });
});






router.get('/goal-amount', verifyJWT, async (req, res) => {


  const userId = req.user?.userId; // Ensure userId is defined
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }

  const query = 'SELECT goal_amount FROM users WHERE id = ?';

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching goal amount:', err);
      return res.status(500).json({ message: 'Error fetching goal amount' });
    }

    const goalAmount = results[0]?.goal_amount || 0; // Ensure safe access
    console.log('Fetched goal amount:', goalAmount);

    res.json({ goalAmount });
  });
});


router.get('/recent-donations', verifyJWT, async (req, res) => {
  const userId = req.user?.userId; // Ensure userId is defined
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }

const query = 'SELECT * FROM donations WHERE user_id = ? ORDER BY donation_date DESC LIMIT 3';
connection.query(query, [userId], (err, results) => {
  if (err) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }

  if (results.length === 0) {
    return res.status(404).json({ message: 'No recent donations found' });
  }

  res.json(results);
});
});




router.get('/current-amount', verifyJWT, async (req, res) => {
  console.log('Received request for /current-amount');

  const userId = req.user?.userId; // Ensure userId is defined
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }

  console.log('Fetching current amount for user:', userId);

  const query = 'SELECT SUM(donation_amount) AS totalAmount FROM donations WHERE user_id = ?';

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching donations:', err);
      return res.status(500).json({ message: 'Error fetching current amount' });
    }

    const totalAmount = results[0]?.totalAmount || 0; // Ensure safe access
    console.log('Current total donation amount:', totalAmount);
    console.log('Response being sent:', { currentAmount: totalAmount });

    res.json({ currentAmount: totalAmount });
  });
});

module.exports = router;