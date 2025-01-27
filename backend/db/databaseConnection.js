const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,  // Default MySQL port
  user: 'root', // Database username
  password: '', // Database password (empty if no password)
  database: 'charity_tracker', // Replace with your database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;
