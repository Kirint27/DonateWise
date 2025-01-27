const connection = require('../databaseConnection');


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