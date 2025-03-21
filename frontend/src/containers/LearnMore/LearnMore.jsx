import React from "react";
import { Link } from "react-router-dom";
import styles from "./LearnMore.module.scss"; // Update with the correct path to your styles

const LearnMorePage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>Welcome to GivingTracker</h1>
        <p className={styles.description}>
          GivingTracker is your personal donation tracker to help you stay on top of your charitable giving. 
          Our goal is to encourage more donations to charitable causes while providing users with useful information
          for tax reporting, yearly goals, and charity recommendations.
        </p>
        <h2 className={styles.sectionTitle}>Why GivingTracker?</h2>
        <p className={styles.description}>
          We believe in making charitable giving easy and transparent. With GivingTracker, you can set donation goals,
          track your progress, and receive personalized charity recommendations based on your interests.
        </p>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <p className={styles.description}>
          By connecting with charities, you can track all your donations in one place. Get insights into your
          donation history, see your total giving amount, and manage your goals.
        </p>
        <div className={styles.learnMoreLink}>
          <Link to="/" className={styles.backLink}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default LearnMorePage;
