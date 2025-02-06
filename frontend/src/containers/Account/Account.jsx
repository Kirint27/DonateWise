import React, {useState}from "react";
import styles from "./Account.module.scss";

const Account = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

const handleSubmit = (event) => {
  event.preventDefault();
  setShowConfirmation(true);
}
  const handleContinue = () => {
    setShowConfirmation(false);
    window.location.href = "/";
  };
  return (

    <div className={styles.accountPage}>
      <div className={styles.registerForm}>    <div>
    {showConfirmation ? (
   <div className="confirmation-message">
   <p className="confirmation-text">Registration successful!</p>
   <button className="continue-button" onClick={handleContinue}>
     Continue
   </button>
 </div>
    ) : (
        <form className={styles.regsi} onSubmit={handleSubmit}>
          <h3 className={styles.title}>ImpactTrack</h3>
          <div class={styles.formGroup}>
            <label>First Name</label>
            <input type="text" placeholder="Enter first name" required />
            <label>Last Name</label>
            <input type="text" placeholder="Enter last name" required />
            <label>Email</label>
            <input type="email" placeholder="Enter email"  required/>
            <label>Password</label>
            <input type="password" placeholder="Enter password"  required/>
            <label>Confirm Password</label>
            <input type="password" placeholder="Enter password again" required />
            <label>Annual salary</label>
            <input type="text" placeholder="Enter your Annual salary" required />
            <label>Location (optional)</label>
            <input type="search" placeholder="Search for  your location" />

            <label>
              <input  type="checkbox" name="newsletter"  />
              Gift aid (optional)
            </label>{" "}
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
    <input type="checkbox" name="causes" value="community-local" />
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
            <button>Create Account</button>
          </div>
        </form>
        )}
        </div>
      </div>
</div>
  );
};

export default Account;
