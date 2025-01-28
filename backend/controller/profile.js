const connection = require("../db/databaseConnection");

const getProfile = (req, res) => {
  const userId = req.userId; // From the verified JWT token

  const query =
    "SELECT id, first_name, last_name, email, preferences FROM users WHERE id = ?";
  connection.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      preferences: user.preferences ? JSON.parse(user.preferences) : {}, // Parse preferences if stored as JSON
    });
  });
};

const putProfile = (req, res) => {
    console.log('putProfile function called');
    const { userId, email, first_name, last_name, preferences } = req.body;

    // Validate input
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }
    if (!email && !first_name && !last_name && !preferences) {
        return res.status(400).json({ error: "At least one field is required" });
    }

    const fieldsToUpdate = [];
    const values = [];

    if (email) {
        fieldsToUpdate.push("email = ?");
        values.push(email);
    }
    if (first_name) {
        fieldsToUpdate.push("first_name = ?");
        values.push(first_name);
    }
    if (last_name) {
        fieldsToUpdate.push("last_name = ?");
        values.push(last_name);
    }
    if (preferences) {
        fieldsToUpdate.push("preferences = ?");
        values.push(JSON.stringify(preferences));
    }

    // Add `userId` to the `values` array as the last parameter
    values.push(userId);

    // If no fields to update, return error
    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ error: "No valid fields to update" });
    }

    // Construct the query
    const query = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;

    // Execute the query
    connection.query(query, values, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        // Check if any rows were affected
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully" });
    });
};

module.exports = putProfile;

module.exports = { getProfile, putProfile };
