require("dotenv").config({ path: "../.env" }); // Load environment variables

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const connection = require("../db/databaseConnection");

const router = express.Router();

// Signup Route- includes setting goals
// Signup route
router.post("/signup", async (req, res) => {
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

  if (!email || !password || !fullName || !annualSalary) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Hash the password asynchronously
    const hashedPassword = await bcrypt.hash(password, 10);

    // SQL query to include goalType and goalAmount
    const query = `
      INSERT INTO users 
      (email, password, full_name, annual_salary, location, gift_aid, goal_type, goal_amount) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const result = await new Promise((resolve, reject) => {
      connection.query(
        query,
        [
          email,
          hashedPassword,
          fullName,
          annualSalary,
          location,
          giftAid,
          goalType, // Added goalType
          goalAmount, // Added goalAmount
        ],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    const userId = result.insertId;
    console.log("User ID:", userId);
    res.status(201).json({ userId });
  } catch (error) {
    console.error("Error inserting user:", error);
    console.error(error.stack);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}); // ✅ Correctly closed the signup route

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
  const values = causes.map((cause) => [userId, cause, true]); // ✅ Structure is correct

  console.log("Values being inserted into preferences:", values);

  connection.query(query, [values], (err, result) => {
    if (err) {
      console.error("Error inserting preferences:", err);
      return res.status(500).json({ error: "Error inserting preferences" });
    }
    res.status(201).json({ message: "Preferences updated successfully" });
  });
});



router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
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

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // Set token as HTTP-only cookie
      res.cookie("authToken", token, {
        httpOnly: true, // Now, the token can't be accessed via JavaScript
        secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent over HTTPS in production
        sameSite: "None",  // Allow the cookie to be sent in cross-origin requests
        maxAge: 3600000, // 1 hour expiry
      });

      res.json({ message: "Login successful" });
    });
  });
});


router.get("/auth-status", (req, res) => {
  const token = req.cookies.authToken;
  console.log("Token from cookie:", token);  // Check the token value here
  if (!token) {
    return res.json({ authenticated: false });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verify error:", err);  // Log any error with verification
      return res.json({ authenticated: false });
    }
    console.log("Decoded JWT:", decoded);  // Check if the token was decoded correctly
    return res.json({ authenticated: true, userId: decoded.userId });
  });
});


router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logout successful" });
});

require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/forgot-password", (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const query = "SELECT * FROM users WHERE email = ?";
    connection.query(query, [email], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: "User not found" });
      }

      const resetToken = jwt.sign(
        { userId: results[0].id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      const resetLink = `https://charitytrackr.onrender.com/reset-password?token=${resetToken}`;

      const msg = {
        to: email, // User's email
        from: "kirinthapar86@gmail.com", 
        subject: "Password Reset Request",
        text: `Click the following link to reset your password: ${resetLink}`,
        html: `<p>Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
      };

      sgMail
        .send(msg)
        .then((response) => {
          console.log("Email sent successfully:", response);
          res.json({
            success: true,
            message: "Password reset link sent to your email",
          });
        })
        .catch((error) => {
          console.error("Error sending email:", error);
          res.status(500).json({ error: "Failed to send reset email" });
        });
    });
  } catch (error) {
    console.error("Server-side error:", error);
    res.status(500).json({ error: "Server-side error" });
  }
});
// GET route to validate the reset token
router.get("/reset-password", (req, res) => {
  res.json({
    success: true,
    message: "Token is valid. You can now reset your password.",
    token: req.query.token, // Return token to frontend if needed
  });
});

// POST route to reset the password
router.post("/reset-password", (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ error: "Token and New Password are required" });
  }

  // Verify the token before proceeding
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const userId = decoded.userId; // Extract user ID from token

    // Hash the new password before saving it
    bcrypt.hash(newPassword, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error("Error hashing password:", hashErr);
        return res.status(500).json({ error: "Failed to hash password" });
      }

      // Update the user's password in the database
      const query = "UPDATE users SET password = ? WHERE id = ?";
      connection.query(query, [hashedPassword, userId], (queryErr, result) => {
        if (queryErr) {
          console.error("Database error:", queryErr);
          return res.status(500).json({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
          return res.status(400).json({ error: "User not found" });
        }

        res.json({ success: true, message: "Password reset successfully" });
      });
    });
  });
});

module.exports = router;
