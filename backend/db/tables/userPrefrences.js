


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