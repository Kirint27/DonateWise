const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db/databaseSetup'); // Adjust the path based on your folder structure

const router = express.Router();
require('dotenv').config();

// Signup Route
router.post('/signup', (req, res) => {
    const { email, password, first_name, last_name, preferences } = req.body;

    // Validate input
    if (!email || !password || !first_name || !last_name) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const preferencesJson = JSON.stringify(preferences || {});

    const query = `INSERT INTO users (email, password, first_name, last_name, preferences) 
                   VALUES (?, ?, ?, ?, ?)`;

    connection.query(query, [email, hashedPassword, first_name, last_name, preferencesJson], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Generate JWT after successful signup
        const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User created successfully', token });
    });
});

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user exists
    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const user = results[0];

        // Compare passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (!isMatch) {
                return res.status(400).json({ error: 'Incorrect password' });
            }

            // Generate JWT
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Login successful', token });
        });
    });
});

module.exports = router;
