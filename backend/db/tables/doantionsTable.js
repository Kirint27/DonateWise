const connection = require('../databaseConnection');

const createDonationsTable = `
  CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    charity_name VARCHAR(50),
    donation_amount DECIMAL(10, 2),
    donation_date DATETIME,
    donor_name VARCHAR(50)
  );
`;

connection.query(createDonationsTable, (err, results) => {
  if (err) {
    console.error('Error creating donations table:', err);
    return;
  }
  console.log('Donations table created!');

});