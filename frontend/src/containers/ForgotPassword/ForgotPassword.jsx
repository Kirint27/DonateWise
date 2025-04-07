import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import styles from "./ForgotPassword.module.scss";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(""); // Token from reset link
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  const location = useLocation(); // To access the URL

 

  const handleRequestReset = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResetSent(true); 
          setSuccessMessage("A password reset link has been sent to your email.");


        } else {
          setError(data.error || "Something went wrong.");

        }
      })
      .catch((err) => {
        console.error(err);
        setError("An error occurred. Please try again.");
      });
  };
  return (
    <div className={styles.formSection}>
      
        <form onSubmit={handleRequestReset} className={styles.form}>
          <h2>Forgot Password</h2>
          <div className={styles.formGroup}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.button}>
              Send Reset Link
            </button>
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}        </form>
      
      

    </div>
  );
};

export default ForgotPassword;