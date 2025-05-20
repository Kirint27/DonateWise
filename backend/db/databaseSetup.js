// database.setup.js
const db = require('./database.connection');

async function setupDatabase() {
  try {
    console.log('Starting DB setup...');

    // Example: Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        date_joined DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        preferences JSON,
        annual_salary DECIMAL(10, 2) DEFAULT NULL,
        salary_last_updated DATETIME DEFAULT NULL,
        location INT(11) DEFAULT NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        charity_name VARCHAR(50),
        donation_amount DECIMAL(10, 2),
        donation_date DATETIME,
        donor_name VARCHAR(50)
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        preference_key VARCHAR(50),
        preference_value VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS yearly_goals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        goal_type ENUM('fixed_amount', 'percentage_salary') NOT NULL,
        target_amount DECIMAL(10, 2) DEFAULT NULL,
        percentage FLOAT DEFAULT NULL,
        calculated_goal_amount DECIMAL(10, 2) DEFAULT NULL,
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
    `);

    await db.query(`
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
    `);

    console.log('✅ Database setup completed.');
  } catch (err) {
    console.error('❌ Error setting up the database:', err);
  }
}

setupDatabase();
