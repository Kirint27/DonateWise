import React, { useState } from "react";
import styles from "./Account.module.scss";

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
    const causes = [];
    event.target.elements.causes.forEach((cause) => {
      if (cause.checked) {
        causes.push(cause.value);
      }
    });
  
    // Ensure goal type is selected
    if (!goalType) {
      alert("Please select a goal type before submitting.");
      return;
    }
  
    // Validate salary
const salary = parseFloat(annualSalary)
    if (isNaN(salary) || salary < 0) {
      alert("Please enter a valid annual salary.");
      return;
    }
  
    // Calculate goal amount based on salary or manual entry
    const goalAmount =
      goalType === "percentage" ? (salary * parseFloat(goalAmount)) / 100 : goalAmount;
  
    if (!goalAmount || goalAmount <= 0) {
      alert("Please enter a valid goal amount.");
      return;
    }
  
    // API request setup
    const url = new URL("http://localhost:3001/api/signup");
    const headers = { "Content-Type": "application/json" };
  
    const body = JSON.stringify({
      fullName: event.target.elements["fullName"].value,
      email: event.target.elements["email"].value,
      password: event.target.elements["password"].value,
      annualSalary: annualSalary,
      location: event.target.elements["location"].value,
      giftAid: event.target.elements["giftAid"].checked,
      goalType: goalType,
      goalAmount: goalAmount
    });
  
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
  
        // Save user preferences (causes)
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
        setShowConfirmation(true);
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  

  const handleContinue = () => {
    setShowConfirmation(false);
    window.location.href = "/";
  };
  return (
    <div className={styles.accountPage}>
      <div className={styles.registerForm}>
        {" "}
        <div>
          {showConfirmation ? (
            <div className="confirmation-message">
              <p className="confirmation-text">Registration successful!</p>
              <button className="continue-button" onClick={handleContinue}>
                Continue
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.regsi}>
              <h3 className="title">GivingTacker</h3>
              <div class={styles.formGroup}>
                <label>Full Name</label>
                <input type="text" placeholder="Enter Full name" required />
                <label>Email</label>
                <input type="email" placeholder="Enter email" required />
                <label>Password</label>
                <input type="password" placeholder="Enter password" required />
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Enter password again"
                  required
                />
                <label>Annual salary</label>
                <input
  type="text"
  onChange={(e) => setAnnualSalary(e.target.value ? parseFloat(e.target.value) : "")}
  placeholder="Enter your Annual salary"
  required
  pattern="[0-9]*"

/>
<label>How do you want to set your yearly donation goal?</label>
{!goalType && (
  <select value={goalType} onChange={handleGoalChange}>
    <option value="">Select an option</option>
    <option value="manual">Enter a Specific Amount</option>
    <option value="percentage">% of Salary</option>
  </select>
)}

{/* Show the input field only when a goal type is selected */}
{goalType === "manual" && (
  <input
    type="number"
    value={goalAmount}
    onChange={(e) => setGoalAmount(parseFloat(e.target.value) || "")} // Ensures it's a number
    placeholder="Enter goal amount (£)"
    min="1"
    required
  />
)}

{goalType === "percentage" && (
  <input
    type="number"
    value={goalAmount}
    onChange={(e) => setGoalAmount(parseFloat(e.target.value) || "")} // Ensures it's a number
    placeholder="Enter % of salary"
    min="1"
    max="100"
    required
  />
)}

                <label>Location (optional)</label>
                <input
                  style={{ height: "40px" }}
                  type="text"
                  placeholder="Search for  your location"
                />
                <label>
                  <input type="checkbox" name="gift aid " />
                  Gift aid (optional)
                </label>{" "}
                <p>Select Causes You Care About:</p>
                <div className={styles.causes}>
                  <label>
                    Health & Medical
                    <input
                      type="checkbox"
                      name="causes"
                      value="health-medical"
                    />
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
                    <input
                      type="checkbox"
                      name="causes"
                      value="animal-welfare"
                    />
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
