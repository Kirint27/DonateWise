import React, { useEffect, useState } from "react";
import styles from "./ResetPassword.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
const ResetPassword = () => {
  const location = useLocation(); // To access the URL query parameters
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get("token"); // Extract token from URL
    if (resetToken) {
      setToken(resetToken); // Set the token
    }
  }, [location]);
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }), // Send token and new password
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResetSuccess(true);
          setSuccessMessage("Your password has been successfully reset!");
        } else {
          setError(data.error || "Something went wrong.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("An error occurred. Please try again.");
      });
  };
  const handleRedirectToLogin = () => {
    navigate(""); // Redirect to login page
  };

  return (
    <div className={styles.formSection}>
      <form onSubmit={handleResetPassword} className={styles.form}>
        <h2>Reset Password</h2>
        <div className={styles.formGroup}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.button}>
            Reset Password
          </button>
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && (
          <>
            <p className={styles.successMessage}>{successMessage}</p>
            <button onClick={handleRedirectToLogin} className={styles.button}>
              Go to Login
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
