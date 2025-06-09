require("dotenv").config({ path: "../.env" }); // Load environment variables

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const connection = require("../db/databaseConnection");

const router = express.Router();

// Signup Route- includes setting goals
// Signup route
router.post("/signup", (req, res) => {
  const {
    fullName,
    email,
    password,
    annualSalary,
    location,
    giftAid,
    goalType,
    goalAmount,
  } = req.body;

  console.log("Incoming Signup Request:", req.body);

  // Basic validation
  if (!email || !password || !fullName || !annualSalary) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Hash password
  bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
    if (hashErr) {
      console.error("Error hashing password:", hashErr);
      return res.status(500).json({ error: "Internal server error" });
    }

    const query = `
      INSERT INTO users 
      (email, password, full_name, annual_salary, location, giftAid, goaltype, goal_amount) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      email,
      hashedPassword,
      fullName,
      annualSalary,
      location,
      giftAid,
      goalType,
      goalAmount,
    ];

    connection.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Email already exists" });
        }
        return res.status(500).json({ error: "Internal server error" });
      }

      const userId = result.insertId;
      console.log("User ID:", userId);
      res.status(201).json({ userId });
    });
  });
});

// Preferences route with correct parameter name
router.post("/users/:id/preferences", (req, res) => {
  console.log("Route called");

  const userId = req.params.id; // ✅ Updated to match route parameter
  console.log("User ID:", userId);
  const { causes } = req.body;

  if (!causes || causes.length === 0) {
    return res.status(400).json({ error: "Causes are required" });
  }

  // Prepare the values for bulk insert
  const query = `INSERT INTO user_preferences (user_id, preference_key, preference_value) VALUES ?`;
  const values = causes.map((cause) => [userId, cause, true]); 

  console.log("Values being inserted into preferences:", values);

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
  console.log("Login route hit with body:", req.body);

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }
    if (err) {
      console.error("SQL error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    console.log("Login query results:", results);
    if (!results[0]) {
      // Add this check
      return res.status(400).json({ error: "User not found" });
    }
    const user = results[0];

    // Compare passwords
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: "Internal server error" });

      if (!isMatch)
        return res.status(400).json({ error: "Incorrect password" });

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Set token as HTTP-only cookie
      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 3600000,
      });
      

      res.json({ message: "Login successful" });
    });
  });
});

router.get("/auth-status", (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.json({ authenticated: false });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.json({ authenticated: false });
    }
    return res.json({ authenticated: true, userId: decoded.userId });
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logout successful" });
});


const nodemailer = require('nodemailer');
const { verifyJWT } = require("../middleware/authMiddleware");

const transport = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_SERVER,
  port: process.env.BREVO_SMTP_PORT,
  secure: false, // or 'STARTTLS'
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_PASSWORD,
  },
});

router.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const resetToken = jwt.sign(
      { userId: results[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const resetLink = `http://localhost:3001/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Password Reset Request',
      text: `Click the following link to reset your password: ${resetLink}`,
      html: `<p>Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to send reset email" });
      } else {
        console.log(info);
        res.json({ success: true, message: "Password reset link sent to your email" });
      }
    });
  });
});
// Update user info
router.put("/update", verifyJWT, (req, res) => {
  const {
    annualSalary,
    goalAmount,
    fullName,
    email,
    password,
    confirmPassword,
    location,
  } = req.body;

  console.log("req.user:", req.user);

  if (!req.user?.userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }

  const userId = req.user.userId;
  const updates = {};
  if (fullName) updates.full_name = fullName;
  if (email) updates.email = email;
  if (annualSalary) updates.annual_salary = annualSalary;
  if (goalAmount) updates.goal_amount = goalAmount;
  if (location) updates.location = location;
  const updateUser = (hashedPassword = null) => {
    if (hashedPassword) {
      updates.password = hashedPassword;
    }
    const fields = Object.keys(updates);
    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }
    const sql = `UPDATE users SET ${fields
      .map((f) => `${f} = ?`)
      .join(", ")} WHERE id = ?`;
    const values = [...fields.map((f) => updates[f]), userId];

    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error("Error updating user:", err);
        return res.status(500).json({ error: "Database error" });
      }
      return res.json({ message: "User info updated" });
    });
  };


  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      updateUser(hashedPassword);
    });
  } else {
    updateUser();
  }
});

// Update causes
router.put("/update-causes", verifyJWT, (req, res) => {
  const causes = req.body.causes;
  const userId = req.user.userId;

  if (!causes) {
    return res.status(400).json({ message: "Causes is required" });
  }

  const causesQuery = `UPDATE user_preferences SET preference_value = ? WHERE user_id = ? AND preference_key = 'causes'`;
  connection.query(causesQuery, [causes, userId], (err, results) => {
    if (err) {
      console.error("Error updating causes:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.json({ message: "Causes updated" });
  });
});

module.exports = router;
