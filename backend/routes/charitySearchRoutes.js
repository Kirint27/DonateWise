require("dotenv").config({ path: "../.env" }); // Load environment variables

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const connection = require("../db/databaseConnection"); // Correct the db reference
const router = express.Router();

// Search by postcode
router.get('/searchByPostcode', (req, res) => {
    const { postcodes } = req.query;
    if (!postcodes) {
        return res.status(400).send('Postcodes are required');
    }

    const postcodesArray = postcodes.split(',');

    const query = 'SELECT * FROM charities WHERE postcode IN (?)';
    connection.query(query, [postcodesArray], (err, results) => {
        if (err) {
            console.error('Error searching charities by postcode:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

// Search by charity name
router.get('/searchByName', (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const query = 'SELECT * FROM charities WHERE charity_name LIKE ?';
    connection.query(query, [`%${name}%`], (err, results) => {
        if (err) {
            console.error('Error searching charities by name:', err);
            return res.status(500).send('Internal server error');
        }
        res.json(results);
    });
});

module.exports = router;
