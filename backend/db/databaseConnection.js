const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,             // Railway DB host
  port: parseInt(process.env.DB_PORT) || 3306,  // Parse port to number, fallback to 3306
  user: process.env.DB_USER,             // Railway DB username
  password: process.env.DB_PASSWORD,     // Railway DB password
  database: process.env.DB_NAME,         // Railway DB database name
});

connection.connect((err) => {
  if (err) {
    console.error(' Error connecting to MySQL database:', err);
    return;
  }
  console.log(' Connected to MySQL database');
});

module.exports = connection;
