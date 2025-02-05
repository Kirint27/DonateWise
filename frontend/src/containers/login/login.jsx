import React from "react";
import styles from "./Login.module.scss";
import Footer from "../../components/Footer/Footer";

const Login = () => {
  return (
    <div className={styles.pageContainer}>
    <h1 className={styles.title}>CharityTrackr</h1>
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginLogo}>
          <img src="logo.png" alt="Logo" />
        </div>
        <div className={styles.loginForm}>
          <h2>Login</h2>
          <form>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" placeholder="Enter email" />
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input type="password" placeholder="Enter password" />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );

};

export default Login;
