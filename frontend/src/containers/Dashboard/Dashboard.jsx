import React, { useState } from "react";
import styles from "./Dashboard.module.scss";
import Navbar from "../../components/NavBar/NavBar";
import Donations from "../../components/Donations";
import CustomProgressBar from "../../components/CustomProgressBar";
const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const goalAmount = 900.0;
  const currentAmount = 30.0; // Example: Small progress towards the goal


  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleDonationSubmit = (donationData) => {
    console.log("Donation Data Submitted:", donationData);
    // Add logic here to handle the donation submission (e.g., save to backend)
    closeModal(); // Close the modal after submission
  };
  return (
    <>
    <Navbar/>
<h2>Dashboard</h2>
<button onClick={openModal} className={styles.addDonation}>
        Add Donation
      </button>
      {isModalOpen ? (
  <Donations
    isOpen={isModalOpen}
    onClose={closeModal}
    onSubmit={handleDonationSubmit}
  >
  </Donations>
) : null}
<section className={styles.section}>
        <CustomProgressBar goalAmount={goalAmount} currentAmount={currentAmount} />
    </section>

    <div className={styles.divider}></div>

    {/* Recent Donations Section */}
    <section className={styles.section}>
        <h3>Recent Donations</h3>
        <ul>
            <li>£100 to Cancer Research UK</li>
            <li>£50 to Save the Children</li>
            <li>£200 to Mind UK</li>
        </ul>
        </section>
        
    </>
  );
};

export default Dashboard;
