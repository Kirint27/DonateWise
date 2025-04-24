

const createYearlyGoalsTable = `
  CREATE TABLE IF NOT EXISTS yearly_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    goal_type ENUM('fixed_amount', 'percentage_salary') NOT NULL,
    target_amount DECIMAL(10, 2) DEFAULT NULL,
    percentage FLOAT DEFAULT NULL,
    calculated_goal_amount DECIMAL(10, 2) DEFAULT NULL, -- New column to store calculated value

    year INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'achieved', 'expired') NOT NULL DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX (user_id),
    CHECK (start_date <= end_date)
  );
`;

connection.query(createYearlyGoalsTable, (err, results) => {
  if (err) {
    console.error('Error creating Yearly Goals table:', err.message);
    return;
  }
  console.log('Yearly Goals table created or already exists!');
});
