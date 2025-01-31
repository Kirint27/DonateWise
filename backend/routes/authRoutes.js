require("dotenv").config(); // Load environment variables
console.log("JWT Secret:", process.env.JWT_SECRET); // Should print the JWT secret key

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../db/databaseSetup"); // Import the connection object
const moment = require('moment');

const router = express.Router();

// Signup Route- includes setting goals 
router.post("/signup", (req, res) => {
    const {
        email,
        password,
        first_name,
        last_name,
        preferences,
        goalType, // 'fixed_amount' or 'percentage_salary'
        targetAmount, // Amount if goalType is 'fixed_amount'
        percentage, // Percentage if goalType is 'percentage_salary'
        annualSalary: annualSalary, // Salary if goalType is 'percentage_salary'
    } = req.body;
    // Validate input
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    const hashedPassword = bcrypt.hashSync(password, 10);
    const preferencesJson = JSON.stringify(preferences || {});
  
    if (goalType === "percentage_salary" && (!percentage || !annualSalary)) {
      return res
        .status(400)
        .json({
          error:
            "Percentage and annual salary are required for percentage-based goal",
        });
    }
    if (goalType === "fixed_amount" && !targetAmount) {
      return res
        .status(400)
        .json({ error: "Target amount is required for fixed-amount goal" });
    }
  
    // Insert user into users table
    const query = `INSERT INTO users (email, password, first_name, last_name, annual_salary, preferences) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
  
    connection.query(
      query,
      [email, hashedPassword, first_name, last_name, annualSalary, preferencesJson],
      (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Email already exists" });
          }
          return res.status(500).json({ error: "Internal server error" });
        }
  
        // Debugging: Check the userId (result.insertId)
        console.log("User created with ID: ", result.insertId);
  
        const goalQuery = `INSERT INTO yearly_goals (user_id, goal_type, target_amount, percentage, year, start_date, end_date, calculated_goal_amount) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        // Set current year
        const currentYear = new Date().getFullYear();
        const startDate = `${currentYear}-01-01`;
        const endDate = `${currentYear}-12-31`;
  
        let goalData = [
            result.insertId, // userId
            goalType,
            null,
            null,
            currentYear,
            startDate,
            endDate,
            null
          ];
          
          if (goalType === "fixed_amount") {
            goalData[2] = targetAmount;
          } else if (goalType === "percentage_salary") {
           
            goalData[3] = percentage;
            const calculatedGoalAmount = (annualSalary * percentage) / 100; // Percentage calculation
            goalData[7] = calculatedGoalAmount;
          }

        // Debugging: Check goalData before insertion
        console.log("Goal Data:", goalData);
  
        connection.query(goalQuery, goalData, (err, result) => {
          if (err) {
            console.error("Error inserting goal into yearly_goals:", err);
            return res.status(500).json({ error: "Error inserting goal" });
          }
  
          const token = jwt.sign(
            { userId: result.insertId },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
  
          res.status(201).json({ message: "User created successfully", token });
        });
      }
    );
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
