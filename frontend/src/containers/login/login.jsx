import React, { useState } from "react";
import styles from "./login.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../Context/authContext";

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../components/Footer/Footer";
import { useNavigate, Link } from "react-router-dom";
const Login = ({ onLogin }) => {
  const { login } = useAuth()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    console.log("Updated Email:", e.target.value);
  };
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    console.log("Updated Password:", e.target.value);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    const url = "http://localhost:3001/api/login";
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
  
      const data = await response.json();
      console.log("Login response:", data); // debug
  
      if (data.error) {
        throw new Error(data.error);
      }
  
      // Update user in context
      login(data.user);
  
      // Navigate in a microtask to ensure context state updates first
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 0);
  
    } catch (err) {
      if (err.message.includes("Account locked")) {
        setError(err.message);
      } else {
        setError("Wrong email or password");
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  
  return (
    <div className="mainWrapper">
<div className={styles.pageContainer}>
  <div className={styles.loginBox}>
    {/* Left panel */}
    <div className={styles.loginLogo}>
      <h1>DonateWise</h1>
      <p className={styles.slogan}>
        "Track Your Giving, Amplify Your Impact".
      </p>

      <div className={styles.appDescription}>
        With DonateWise you can view your donation dashboard with progress and insights, review your full history by tax year, and search for charities by name, location, or cause.
      </div>
    </div>

    {/* Right panel / form */}
    <div className={styles.loginForm}>
      <p className={styles.formTitle}>Login To DonateWise</p>
      <form onSubmit={handleLogin}>
        {/* Email */}
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>

        {/* Password */}
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {/* Optional: toggle password visibility */}
            {/* <span
              onClick={togglePasswordVisibility}
              className={styles.passwordVisibilityIcon}
            >
              <FontAwesomeIcon
                icon={isPasswordVisible ? faEye : faEyeSlash}
              />
            </span> */}
          </div>
          <Link to="/forgot-password" className={styles.forgotten}>
            Forgot Password
          </Link>
        </div>

        {/* Submit button */}
        <button className={styles.primaryButton} type="submit">
          Login
        </button>

        {/* Error message */}
        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
        )}
      </form>

      {/* Create Account */}
      <button
        onClick={() => navigate("/register")}
        className={`secondaryButton ${styles.createAccountButton}`}
      >
        Create Account
      </button>
    </div>
  </div>

  {/* Learn more link */}
  <p className={styles.learn}>
    New to DonateWise: <Link to="/LearnMore">Learn more</Link>
  </p>
</div>

      <Footer />
    </div>
  );
};

export default Login;
