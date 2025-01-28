const connection = require("../db/databaseConnection");

const getGoals = (req, res) => {
  const userId = req.userId; // From the verified JWT token
  const year = req.query.year || new Date().getFullYear();

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  const query = `
      SELECT 
        goal_type, 
        target_amount, 
        percentage 
      FROM yearly_goals 
      WHERE user_id = ? AND year = ?
    `;

  connection.query(query, [userId, year], (err, results) => {
    if (err) {
      console.error("Error fetching donation goal:", err.message);
      return res.status(500).json({ error: "Failed to fetch donation goal." });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No donation goal found for this user and year." });
    }
    const goal = results[0];
    let goalAmount = null;
    if (goal.goal_type === "fixed_amount") {
      goalAmount = goal.target_amount;
    } else if (goal.goal_type === "percentage_salary") {
      const salaryQuery = `SELECT annual_salary FROM users WHERE id = ?`;
      connection.query(salaryQuery, [userId], (err, results) => {
        if (err) {
          console.error("Error fetching user salary:", err.message);
          return res
            .status(500)
            .json({ error: "Failed to fetch user salary." });
        }
        if (salaryResults.length === 0) {
          return res.status(404).json({ error: "User salary not found." });
        }
        const salary = results[0].annual_salary;
        if (salary) {
          goalAmount = (salary * goal.target_amount) / 100;

          // percentage
          res.json({
            goal_type: goal.goal_type,
            target_amount: goalAmount,
            percentage: goal.target_amount,
          });
          return;
        } else {
          return res.status(400).json({ error: "Invalid goal type." });
        }
      });
    }
    res.json({
      goal_type: goal.goal_type,
      target_amount: goalAmount,
      percentage: goal.target_amount,
    });
  });
};
