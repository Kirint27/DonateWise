import React from "react";
import styles from "./CustomProgressBar.module.scss";

const CustomProgressBar = ({ goalAmount, currentAmount, user }) => {
  let progress = 0;
  if (goalAmount > 0) {
    progress = Math.min((currentAmount / goalAmount) * 100, 100);
  }

  return (
    <div className={styles.progressContainer}>
      <h3 className={styles.progressTitle}>Donation Goal Progress</h3>

      <div className={styles.progressBarContainer}>
        <div className={styles.progressText}>
          {progress.toFixed(1)}% completed
        </div>

        <div className={styles.progressBar}>
          <div
            className={`${styles.progressFill} ${
              progress < 50 ? styles.lowProgress : styles.highProgress
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className={styles.goalAmount}>
          Goal: £{goalAmount !== undefined ? goalAmount.toFixed(2) : "N/A"}
        </div>
      </div>
      <p className={styles.donationInfo}>
        £{currentAmount !== undefined ? currentAmount.toFixed(2) : "N/A"} of £
        {goalAmount !== undefined ? goalAmount.toFixed(2) : "N/A"} donated
      </p>
    </div>
  );
};
export default CustomProgressBar;
