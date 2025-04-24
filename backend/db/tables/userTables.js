
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
