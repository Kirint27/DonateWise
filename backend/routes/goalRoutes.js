require("dotenv").config({ path: "../.env" }); // Load environment variables

// routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const { getGoals,updateGoal,deleteGoal } = require('../controller/goals'); // Ensure correct path
const { verifyJWT } = require('../middleware/authMiddleware');
const connection = require("../db/databaseConnection");


router.get('/', verifyJWT, (req, res) => {
    getGoals(req, res);  // Call getDonations directly
  });


  router.put('/', verifyJWT, (req, res) => {
    updateGoal(req, res);  // Call getDonations directly
  });
  router.delete('/', verifyJWT, (req, res) => {
    deleteGoal(req, res);  // Call getDonations directly
  });

  router.get('/goal-info', verifyJWT, (req, res) => {
    console.log("req.user:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
    }
  
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }
  
    const query = 'SELECT goalType FROM users WHERE id = ?';
    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching goal info:", err);
        return res.status(500).json({ error: "Database error" });
      }
      const goalType = results[0].goalType;
      res.json({ goalType });
    });
  });
    module.exports = router;
