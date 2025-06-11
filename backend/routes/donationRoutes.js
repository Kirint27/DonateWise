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
});


// POST add a donation
router.post('/', verifyJWT, async (req, res) => {
  const { charityName, donationAmount, donationType, donationDate, paymentMethod, giftAid, charity_cause } = req.body;
  console.log('req.user:', req.user);
  
  const userId = req.user.userId; // Ensure consistent userId access
  console.log('userId:', userId);
  
  // Validate required fields
  if (!charityName || !donationAmount || !donationType || !paymentMethod  || !charity_cause) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Ensure charity_cause is an array and convert it to JSON if it's not already
  const charityCauses = Array.isArray(charity_cause) && charity_cause.length > 0 ? JSON.stringify(charity_cause) : JSON.stringify([]);

  // Updated query
  const query = `
  INSERT INTO donations 
  (charity_name, donation_amount, donation_date, payment_method, giftAid,charity_cause,  user_id) 
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

connection.query(query, [
  charityName,
  donationAmount,
  donationDate,
  paymentMethod,   
  giftAid,
  charityCauses,
  userId
], (err, results) => {
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

router.get('/all-donations', verifyJWT, async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }

  try {
    const query = `
      SELECT donation_date, charity_name, donation_amount,  payment_method
      FROM donations 
      WHERE user_id = ?
      ORDER BY donation_date DESC
    `;

    const results = await connection.promise().query(query, [userId]);

    if (results[0].length === 0) {
      return res.status(200).json({ donations: [] });
    }

    const donations = results[0].map(donation => ({
      date: donation.donation_date
        ? new Date(donation.donation_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'N/A',
      charityName: donation.charity_name,
      amount: donation.donation_amount, 
      paymentMethod: donation.payment_method, 
    }));

    res.json(donations);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

const MAX_CAUSES = 2;

router.get('/charity-causes/last-12-months', verifyJWT, async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: User ID missing' });
  }

  const query = `
    SELECT charity_cause, donation_amount
    FROM donations
WHERE user_id = ? AND donation_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
  `;

  const results = await connection.promise().query(query, [userId]);

  if (results[0].length === 0) {
    return res.status(200).json({ breakdown: {} });
  }

  const categoryTotals = {};

  results[0].forEach(({ charity_cause, donation_amount }) => {
    if (charity_cause) {
      const causes = JSON.parse(charity_cause);

      causes.slice(0, MAX_CAUSES).forEach((cause) => {
        categoryTotals[cause] = (categoryTotals[cause] || 0) + donation_amount;
      });
    }
  });

  res.json({ breakdown: categoryTotals });
});
module.exports = router;