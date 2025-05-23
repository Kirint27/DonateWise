import React from "react";
import styles from "./UpdateAccount.module.scss";
import Footer from "../../components/Footer";
import Navbar from "../../components/NavBar";

const UpdateAccount = ( setGoalAmount, goalAmount, goalType , annualSalary, handleGoalChange) => {


  return (
    <>      
    <Navbar />
     <div className={styles.updateAccount}>

  <h2>Update Account Information</h2>
  <form>
  <div className={styles.formGroup}>

    <label htmlFor="fullName">Update Full Name</label>
    <input type="text" name="fullName" placeholder="Enter your new full name" />

    <label htmlFor="email">Update Email</label>
    <input type="email" name="email" placeholder="Enter your new email" />

    <label htmlFor="password">Set New Password</label>
    <input type="password" name="password" placeholder="Enter your new password" />

    <label htmlFor="confirmPassword">Confirm New Password</label>
    <input type="password" name="confirmPassword" placeholder="Re-enter your new password" />

    <label htmlFor="annualSalary">Update Annual Salary</label>
    <input type="number" name="annualSalary" placeholder="Enter your new salary" pattern="[0-9]*" />

    <label>Update Donation Goal</label>

    {goalType === "manual" && (
      <input
        type="number"
        name="goalAmount"
        value={goalAmount}
        onChange={(e) => setGoalAmount(e.target.value)}
        placeholder="Enter new donation amount (£)"
        min="1"
        pattern="[0-9]*"
      />
    )}

    {goalType === "percentage" && (
      <input
        type="number"
        name="goalPercentage"
        value={goalAmount}
        onChange={(e) => setGoalAmount(e.target.value)}
        placeholder="Enter new percentage of salary"
        min="1"
        max="100"
        pattern="[0-9]*"
      />
    )}

    <label htmlFor="location">Update City</label>
    <input type="text" name="location" placeholder="Enter your new city" />

    <p style={{ fontWeight: 'bold', marginTop: '10px' }}>Update Causes You Care About:</p>
    <div className="formGroup">
      {[
        ["health-medical", "Health & Medical"],
        ["children-education", "Children & Education"],
        ["animal-welfare", "Animal Welfare"],
        ["environment-sustainability", "Environment & Sustainability"],
        ["human-rights", "Human Rights & Social Justice"],
        ["community-local", "Community & Local Causes"],
        ["international-aid", "International Aid & Development"],
        ["arts-culture", "Arts, Culture & Heritage"],
      ].map(([value, label]) => (
        <label key={value} style={{ marginBottom: "10px" }}>
          <input type="checkbox" name="causes" value={value} style={{ marginRight: "8px" }} />
          {label}
        </label>
      ))}
    </div>

    <button type="submit" className="short">Save Changes</button>
  </div>
</form>

  <Footer />
</div>

    </>
  );
};

export default UpdateAccount;
