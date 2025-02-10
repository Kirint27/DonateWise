import React, { useState } from "react";
import styles from "./Account.module.scss";

const Account = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const giftAid = event.target.elements.giftAid.checked; // true if checked, false if not

    const causes = [];
    event.target.elements.causes.forEach((cause) => {
      if (cause.checked) {
        causes.push(cause.value);
      }
    });

    const url = new URL("http://localhost:3001/api/signup");
    const headers = {
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      fullName: event.target[0].value,
      email: event.target[1].value,
      password: event.target[2].value,
      annualSalary: event.target[4].value,
      location: event.target[5].value,
      giftAid: event.target[6].checked,
    });
    const email = event.target[1].value;
    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }
    const password = event.target[2].value;

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    const confirmPassword = event.target[3].value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const annualSalary = event.target[5].value;

    if (isNaN(annualSalary) || annualSalary < 0) {
      alert("Please enter a valid annual salary");
      return;
    }

    fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const userId = data.userId;
        console.log("User ID:", userId);
        try {
          const preferencesUrl = new URL(
            `http://localhost:3001/api/users/${userId}/preferences`
          );
          fetch(preferencesUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              causes: causes,
            }),
          })
            .then((response) => {
              console.log("Response:", response);
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              console.log("Data:", data);
              setShowConfirmation(true);
            })
            .catch((error) => {
              console.error("Error creating user preferences:", error);
            });
        } catch (error) {
          console.error("Error creating user preferences:", error);
        }
      })
      .catch((error) => {
        console.error("Error creating user:", error);
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
              <h3 className="title">ImpactTrack</h3>
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
                  placeholder="Enter your Annual salary"
                  required
                />
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
