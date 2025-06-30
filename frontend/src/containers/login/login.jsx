import React, { useState } from "react";
import styles from "./login.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Footer from "../../components/Footer/Footer";
import { useNavigate, Link } from "react-router-dom";
const Login = ({ onLogin }) => {
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

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("Sending login request with:");
    console.log(email);
    console.log(password);

    fetch('https://charitytrackr.onrender.com/api/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Include cookies
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        console.log("Navigation triggered");

        setLoading(false);
        navigate("/dashboard", { replace: true }); // Add { replace: true } to navigate correctly
      })
      .catch((err) => {
        setLoading(false);
        if (err.message.includes("Account locked")) {
          setError(err.message);
        } else {
          setError("Wrong email or password");
        }
      });
  };
  return (
    <div className="mainWrapper">
      <div className={styles.pageContainer}>
        <div className={styles.loginContainer}>
          <div className={`${styles.loginBox} ${styles.mobile}`}>
            <div className={styles.loginLogo}>
              <h1 className="title">DonateWise</h1>
              <br />
              <p className={styles.slogan}>
                "Track Your Giving, Amplify Your Impact".
              </p>
            </div>

            <div className={styles.loginForm}>
              <h2 className={styles.formTitle}>Login</h2>
              <form onSubmit={handleLogin}>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                    {/* <span
                        onClick={togglePasswordVisibility}
                        className={styles.passwordVisibilityIcon}
                      >
                        <FontAwesomeIcon
                          icon={isPasswordVisible ? faEye : faEyeSlash}
                        />
                      </span> */}
                  </div>
                  <a className={styles.forgotten}>
                    <Link to="/forgot-password">Forgot Password</Link>
                  </a>
                </div>
                <button className={styles.primaryButton} type="submit">
                  Login
                </button>
                {error && (
                  <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
                )}
              </form>
              <button
                onClick={() => navigate("/register")}
                className="secondaryButton"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
        <p className={styles.learn}>
          New to DoanteWise: <Link to="/LearnMore">Learn more</Link>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
