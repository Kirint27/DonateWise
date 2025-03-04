import React from "react";
import styles from "./CustomProgressBar.module.scss";

const CustomProgressBar = ({ goalAmount, currentAmount }) => {
    const progress = Math.min((currentAmount / goalAmount) * 100, 100);

    return (
        <div className={styles.progressContainer}>
            <h3 className={styles.progressTitle}>Donation Goal Progress</h3>

            <div className={styles.progressBarContainer}>
                <div className={styles.progressText}>
                    {progress.toFixed(2)}% completed
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
                    Goal: £{goalAmount.toFixed(2)}
                </div>
            </div>

            <p className={styles.donationInfo}>
                £{currentAmount.toFixed(2)} of £{goalAmount.toFixed(2)} donated
            </p>
        </div>
    );
};

export default CustomProgressBar;
