require("dotenv").config({ path: "../.env" });

const express = require("express");
const router = express.Router();
const moment = require("moment");
const connection = require("../db/databaseConnection");
const { verifyJWT } = require("../middleware/authMiddleware");
const cron = require("node-cron");
// GET donations route
// GET donations route
router.get("/", verifyJWT, (req, res) => {
  console.log("Decoded user:", req.user);
});

// POST add a donation
router.post("/", verifyJWT, async (req, res) => {
  const {
    charityName,
    donationAmount,
    donationType,
    donationDate,
    paymentMethod,
    giftAid,
    charity_cause,
  } = req.body;

  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }

  if (
    !charityName ||
    !donationAmount ||
    !donationType ||
    !paymentMethod ||
    !charity_cause
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const charityCauses = Array.isArray(charity_cause)
    ? JSON.stringify(charity_cause)
    : JSON.stringify([]);

  const query = `
    INSERT INTO donations 
    (charity_name, donation_amount, donation_date, donation_type, payment_method, giftaid, user_id, charity_cause) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [
      charityName,
      parseFloat(donationAmount),
      donationDate,
      donationType,
      paymentMethod,
      Boolean(giftAid),
      userId,
      charityCauses,
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting donation:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      res.status(201).json({ message: "Donation added successfully" });
    }
  );
});

// Function to update monthly donations
const updateMonthlyDonations = () => {
  const today = new Date();
  const todayDay = today.getDate();

  connection.query(
    `SELECT * FROM donations WHERE donation_type = "monthly" AND payment_status != "canceled"`,
    (err, rows) => {
      if (err) {
        console.error("Error fetching donations:", err);
        return;
      }

      rows.forEach((donation) => {
        const originalDate = new Date(donation.donation_date);
        const donationDay = originalDate.getDate();

        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        let nextMonth = currentMonth + 1;
        let nextYear = currentYear;
        if (nextMonth > 11) {
          nextMonth = 0; // Reset to January
          nextYear += 1; // Increment the year
        }
        const lastDayOfNextMonth = new Date(
          nextYear,
          nextMonth + 1,
          0
        ).getDate(); // Get the last day of the next month
        const nextDonationDay = Math.min(donationDay, lastDayOfNextMonth);

        const nextDonationDate = new Date(nextYear, nextMonth, nextDonationDay);

        const todayDateString = today.toISOString().split("T")[0];
        const nextDonationDayString = nextDonationDate
          .toISOString()
          .split("T")[0];
        if (todayDateString !== nextDonationDayString) {
          return; // skip
        }
        const newAmount = parseFloat(donation.donation_amount) * 2;

        connection.query(
          `UPDATE donations SET donation_amount = ?, last_updated = NOW() WHERE id = ?`,
          [newAmount, donation.id],
          (updateErr) => {
            if (updateErr) {
              console.error(
                `Error updating donation ${donation.id}:`,
                updateErr
              );
            } else {
              console.log(
                `Updated donation ${donation.id}: new amount £${newAmount}`
              );
            }
          }
        );
      });
    }
  );
};

cron.schedule("0 0 * * *", () => {
  console.log("Running monthly donation updater at midnight...");
  updateMonthlyDonations();
});

// Test route to manually trigger the monthly donation update (for testing purposes)
router.get("/test-monthly-update", (req, res) => {
  updateMonthlyDonations(); // Trigger the function to simulate the monthly update
  res.send("Monthly donations updated (test run).");
});

router.post("/cancel/:donationId", verifyJWT, (req, res) => {
  const { donationId } = req.params;
  const userId = req.user?.userId; // Ensure userId is defined
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }
  const query = `
    UPDATE donations
    SET donation_status = "canceled"
    WHERE id = ? AND user_id = ? AND donation_type = "monthly"
  `;
  connection.query(query, [donationId, userId], (err, results) => {
    if (err) {
      console.error("Error canceling donation:", err);
      return res.status(500).json({ message: "Error canceling donation" });
    }
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Donation not found or cannot be canceled" });
    }
    res.status(200).json({ message: "Donation canceled successfully" });
  });
});

router.delete("/delete/:donationId", verifyJWT, (req, res) => {
  const { donationId } = req.params;
  const userId = req.user?.userId; // Ensure userId is defined
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }

  const query = `
    DELETE FROM donations 
WHERE id = ? AND (donation_type IS NULL OR donation_type != 'monthly')
  `;
  connection.query(query, [donationId], (err, results) => {
    if (err) {
      console.error("Error deleting donation:", err);
      return res.status(500).json({ message: "Error deleting donation" });
    }
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Donation not found or cannot be deleted" });
    }
    res.status(200).json({ message: "Donation deleted successfully" });
  });
});

router.get("/goal-amount", verifyJWT, async (req, res) => {
  const userId = req.user?.userId; // Ensure userId is defined
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }

  const query = "SELECT goal_amount FROM users WHERE id = ?";

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching goal amount:", err);
      return res.status(500).json({ message: "Error fetching goal amount" });
    }

    const goalAmount = results[0]?.goal_amount || 0; // Ensure safe access
    console.log("Fetched goal amount:", goalAmount);

    res.json({ goalAmount });
  });
});

router.get("/recent-donations", verifyJWT, async (req, res) => {
  const userId = req.user?.userId; // Ensure userId is defined
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }

  const query =
    "SELECT * FROM donations WHERE user_id = ? ORDER BY donation_date DESC LIMIT 3";
  connection.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "No recent donations found" });
    }

    res.json(results);
  });
});

router.get("/current-amount", verifyJWT, async (req, res) => {
  console.log("Received request for /current-amount");

  const userId = req.user?.userId; // Ensure userId is defined
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }

  console.log("Fetching current amount for user:", userId);

  const query =
    "SELECT SUM(donation_amount) AS totalAmount FROM donations WHERE user_id = ?";

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching donations:", err);
      return res.status(500).json({ message: "Error fetching current amount" });
    }

    const totalAmount = results[0]?.totalAmount || 0; // Ensure safe access
    console.log("Current total donation amount:", totalAmount);
    console.log("Response being sent:", { currentAmount: totalAmount });

    res.json({ currentAmount: totalAmount });
  });
});

router.get("/all-donations", verifyJWT, async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }

  try {
    const query = `
      SELECT id,   donation_date, charity_name, donation_amount,  payment_method, donation_type, donation_status
      FROM donations 
      WHERE user_id = ?
      ORDER BY donation_date DESC
    `;

    const results = await connection.promise().query(query, [userId]);

    if (results[0].length === 0) {
      return res.status(200).json({ donations: [] });
    }
    const donations = results[0].map((donation) => ({
      id: donation.id,
      date: donation.donation_date
        ? new Date(donation.donation_date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "N/A",
      charityName: donation.charity_name,
      amount: donation.donation_amount,
      paymentMethod: donation.payment_method,
      type: donation.donation_type, // Used for "monthly" vs "one-time"
      donationStatus: donation.donation_status || "active", // Default to "active" if not set
    }));

    res.json(donations);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Database error" });
  }
});

const MAX_CAUSES = 1;

router.get("/charity-causes/last-12-months", verifyJWT, async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }

  const query = `
    SELECT charity_cause, donation_amount
    FROM donations
WHERE user_id = ? AND donation_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
  `;

  const results = await connection.promise().query(query, [userId]);

  if (results[0].length === 0) {
    return res.status(200).json({ breakdown: {} });
  }

  const categoryTotals = {};

  results[0].forEach(({ charity_cause, donation_amount }) => {
    if (charity_cause && charity_cause !== "") {
      try {
        const causes = JSON.parse(charity_cause);
        causes.slice(0, MAX_CAUSES).forEach((cause) => {
          categoryTotals[cause] =
            (categoryTotals[cause] || 0) + donation_amount;
        });
      } catch (error) {
        console.error("Error parsing charity cause:", error);
      }
    }
  });

  res.json({ breakdown: categoryTotals });
});
module.exports = router;
