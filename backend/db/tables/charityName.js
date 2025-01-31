const connection = require('../databaseConnection');

const createCharityNameTable = `
  CREATE TABLE IF NOT EXISTS charity_name (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );
`;

connection.query(createCharityNameTable, (err, results) => {
  if (err) {
    console.error('Error creating charity name table:', err);
    process.exit(1);
  }
  console.log('Charity name table created or already exists!');
  process.exit(0);
});