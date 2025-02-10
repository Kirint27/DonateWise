import React from "react";
import styles from "./Login.module.scss";
import Footer from "../../components/Footer/Footer";

const Login = () => {
  return (
    <div className={styles.pageContainer}>
    <h1 className="title">ImpactTrack</h1>
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginLogo}>
          <img src="https://picsum.photos/seed/picsum/200/300" alt="Logo" />
          
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
              <a className={styles.forgotten}>Forgot Password</a>
            </div>
            <button  className={styles.primaryButton}type="submit">Login</button>
          </form>
          <button onClick={() => window.location.href = '/register'} className="secondaryButton">
  Create Account
</button>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
  );
};

export default Login;