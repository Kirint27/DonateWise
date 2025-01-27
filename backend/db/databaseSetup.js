
require('dotenv').config()

const express = require('express')
const app = express()
const mysql = require('mysql2');


const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,     // Default MySQL port
    user: 'root',   // Your MySQL username
    password: '',   // Empty string since no password is set
    database: 'charity_tracker'       // Replace with your database name
  });
  
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      date_joined DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME,
      preferences JSON
    );
  `;

  connection.query(createUsersTable, (err, results) => {
    if (err) {
      console.error('Error creating users table:', err);
      return;
    }
    console.log('Users table created or already exists!');
  });
  const createDoantationsTable = `
  CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    charity_name VARCHAR(50),
    donation_amount DECIMAL(10, 2),
    donation_date DATETIME,
    donor_name VARCHAR(50)
   
  );
`;

  connection.query(createDoantationsTable, (err, results) => {
    if (err) {
      console.error('Error creating users table:', err);
      return;
    }
    console.log('Users table created or already exists!');
  });



const createNotificationsTable = `
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    notification_type ENUM('email', 'sms', 'push') NOT NULL DEFAULT 'email',
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_sent TINYINT(1) NOT NULL DEFAULT 0,
    sent_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
  `;
  connection.query(createNotificationsTable, (err, results) => {    
    if (err) {
      console.error('Error creating notifications table:', err);
      return;
    }
    console.log('Notifications table created or already exists!');  
  });

const createUserPreferencesTable = `
  CREATE TABLE IF NOT EXISTS user_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    preference_key VARCHAR(50),
    preference_value VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`;

connection.query(createUserPreferencesTable, (err, results) => {
  if (err) {
    console.error('Error creating user preferences table:', err);    
    return;                     
  }
  console.log('User preferences table created or already exists!');
})
// Start the Express server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});