require("dotenv").config(); // Load environment variables

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require('moment');
const connection = require("../db/databaseConnection");

const router = express.Router();

// Signup Route- includes setting goals 
router.post("/signup", async (req, res) => {
  const { fullName, email, password, annualSalary, location, giftAid } = req.body;
  console.log("Incoming Signup Request:", req.body);
  if (!email || !password || !fullName || !annualSalary) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Hash the password asynchronously
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const query = `INSERT INTO users (email, password, full_name, annual_salary, location, gift_aid) VALUES (?, ?, ?, ?, ?, ?)`;
    const result = await new Promise((resolve, reject) => {
      connection.query(query, [email, hashedPassword, fullName, annualSalary, location, giftAid], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    const userId = result.insertId;
    console.log("User ID:", userId);
    res.status(201).json({ userId });
  } catch (error) {
    console.error("Error inserting user:", error);
    console.error(error.stack); // Add this line to log the error stack
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/users/:id/preferences", (req, res) => {
  console.log('Route called');

  const userId = req.params.userId;
  const { causes } = req.body;

  if (!causes || causes.length === 0) {
    return res.status(400).json({ error: "Causes are required" });
  }

  const query = `INSERT INTO user_preferences (user_id, preference_key, preference_value) VALUES ?`;
  const values = causes.map((cause) => [userId, cause, true]);
  console.log("Values:", values);

  connection.query(query, [values], (err, result) => {
    if (err) {
      console.error("Error inserting preferences:", err);
      return res.status(500).json({ error: "Error inserting preferences" });
    }
    res.status(201).json({ message: "Preferences updated successfully" });
  });
});



// Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const query = "SELECT * FROM users WHERE email = ?";

  connection.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = results[0];

    // Compare passwords
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect password" });
      }

      // Generate JWT using process.env.JWT_SECRET
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ message: "Login successful", token });
    });
  });
});

module.exports = router;
