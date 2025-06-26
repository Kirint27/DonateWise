import React, { useState } from "react";
import styles from "./Account.module.scss";
import { Link } from "react-router-dom";

const Account = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [goalType, setGoalType] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [annualSalary, setAnnualSalary] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleGoalChange = (e) => {
    setGoalType(e.target.value);
    setGoalAmount(""); // Reset goal input when switching types
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    // Collect selected causes
    const causes = Array.from(event.target.elements.causes)
      .filter((cause) => cause.checked)
      .map((cause) => cause.value);

    // Ensure goal type is selected
    if (!goalType) {
      alert("Please select a goal type before submitting.");
      return;
    }

    // Validate salary
    const salary = parseFloat(annualSalary);
    if (isNaN(salary) || salary < 0) {
      alert("Please enter a valid annual salary.");
      return;
    }

    // Calculate goal amount based on salary or manual entry
    let goalAmountValue = null;
    if (goalType === "manual") {
      goalAmountValue = parseFloat(goalAmount);
      if (isNaN(goalAmountValue) || goalAmountValue <= 0) {
        alert("Please enter a valid goal amount.");
        return;
      }
    } else if (goalType === "percentage") {
      const percentage = parseFloat(goalAmount);
      if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
        alert("Please enter a valid percentage (1-100).");
        return;
      }
      goalAmountValue = (salary * percentage) / 100;
    }

    console.log("Goal Amount:", goalAmountValue);

    setGoalAmount(goalAmountValue);
    const url = new URL(`http://localhost:3001/api/signup`);
    const headers = { "Content-Type": "application/json" };

    const body = JSON.stringify({
      fullName: event.target.elements["fullName"].value.trim() || null,
      email: event.target.elements["email"].value.trim() || null,
      password: event.target.elements["password"].value || null,
      annualSalary: salary,
      location: event.target.elements["location"].value.trim() || "",
      giftAid: event.target.elements["giftAid"].checked ? 1 : 0,
      goalType: goalType,
      goalAmount: goalAmountValue,
    });

    console.log("Payload being sent to backend:", body);

    fetch(url, { method: "POST", headers, body })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || "Registration failed");
          });
        }
        return response.json();
      })
      .then((data) => {
        const userId = data.userId;

        return fetch(`http://localhost:3001/api/users/${userId}/preferences`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ causes: causes }),
        });
      })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to save preferences.");
        return response.json();
      })
      .then(() => {
        setTimeout(() => {
          setShowConfirmation(true);
          handleContinue();
        }, 100);
      })
      .catch((error) => {
        console.error("Error during signup process:", error);
        alert(error.message);
      });
  };

  const handleContinue = () => {
    setShowConfirmation(false);

    setTimeout(() => {
      window.location.href = "/";
    }, 100);
  };

  return (
    <div className={styles.accountPage}>
      {showConfirmation ? (
        <div className={styles.confirmationMessage}>
          <h3>Success</h3>
          <p className={styles.confirmationText}>
            Thank you for setting up your account, Your account is now ready to
            use. Explore our features and get started!
          </p>
          <button className="continue-button" onClick={handleContinue}>
            Continue
          </button>
        </div>
      ) : (
        <div className={styles.registerForm}>
          {" "}
          <form onSubmit={handleSubmit} className={styles.regsi}>
            <h3 className="title">CharityTrackr</h3>
            <Link to="/" className={styles.backLink}>
  &larr; Back to Login
</Link>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter Full name"
                required
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                required
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                required
              />

              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Enter password again"
                required
              />

              <label>Annual Salary</label>
              <input
                type="number"
                name="annualSalary"
                onChange={(e) => setAnnualSalary(e.target.valueAsNumber)}
                placeholder="Enter your Annual salary"
                required
                pattern="[0-9]*"
              />

              <label htmlFor="goal-type">
                How do you want to set your yearly donation goal?
              </label>
              {!goalType && (
                <select
                  id="goal-type"
                  name="goalType"
                  value={goalType}
                  onChange={handleGoalChange}
                  required
                >
                  <option value="">Select an option</option>
                  <option value="manual">Enter a Specific Amount</option>
                  <option value="percentage">% of Salary</option>
                </select>
              )}

              {/* Show the input field only when a goal type is selected */}
              {goalType === "manual" && (
                <input
                  type="number"
                  name="goalAmount"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="Enter goal amount (£)"
                  min="1"
                  required
                  pattern="[0-9]*"
                />
              )}

              {goalType === "percentage" && (
                <input
                  type="number"
                  name="goalPercentage"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="Enter % of salary"
                  min="1"
                  max="100"
                  required
                  pattern="[0-9]*"
                />
              )}

              <label>City you live in</label>
              <input
                type="text"
                name="location"
                placeholder="Enter ciy you live in"
                required
              />

              <label>
                <input type="checkbox" name="giftAid"  />
                Gift aid (optional)
              </label>

              <p>Select Causes You Care About:</p>
              <div className={styles.causes}>
                <label>
                  Health & Medical
                  <input type="checkbox" name="causes" value="health-medical" />
                </label>

                <label>
                  Children & Education
                  <input
                    type="checkbox"
                    name="causes"
                    value="children-education"
                  />
                </label>

                <label>
                  Animal Welfare
                  <input type="checkbox" name="causes" value="animal-welfare" />
                </label>

                <label>
                  Environment & Sustainability
                  <input
                    type="checkbox"
                    name="causes"
                    value="environment-sustainability"
                  />
                </label>

                <label>
                  Human Rights & Social Justice
                  <input type="checkbox" name="causes" value="human-rights" />
                </label>

                <label>
                  Community & Local Causes
                  <input
                    type="checkbox"
                    name="causes"
                    value="community-local"
                  />
                </label>

                <label>
                  International Aid & Development
                  <input
                    type="checkbox"
                    name="causes"
                    value="international-aid"
                  />
                </label>

                <label>
                  Arts, Culture & Heritage
                  <input type="checkbox" name="causes" value="arts-culture" />
                </label>
              </div>

              <button type="submit">Create Account</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Account;
