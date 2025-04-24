// controller/donation.js
const connection = require('../db/databaseConnection');

const getDonations = (req, res) => {
    const userId = req.user.id;
    const query = 'SELECT * FROM donations WHERE user_id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(results);
        }
    });
};

const addDonation = (req, res) => {
    const { charity_name, donation_amount, donation_date } = req.body;
    const userId = req.user.id;
    if (!charity_name || !donation_amount || !donation_date || !userId) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const query = 'INSERT INTO donations (charity_name, donation_amount, donation_date, user_id) VALUES (?, ?, ?, ?)';
    connection.query(query, [charity_name, donation_amount, donation_date, userId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ message: 'Donation added successfully' });
        }
    });
};

const deleteDonation = (req, res) => {
    const donationId = req.body.id;
    const userId = req.user.id;
    const query = 'DELETE FROM donations WHERE id = ? AND user_id = ?';
    connection.query(query, [donationId, userId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ message: 'Donation deleted successfully' });
        }
    });
};

module.exports = { getDonations, addDonation,deleteDonation };  // Ensure this line is correct!
