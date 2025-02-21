import React, { useState } from "react";
import styles from "./Dashboard.module.scss";
import Navbar from "../../components/NavBar/NavBar";
import Donations from "../../components/Donations";
const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  

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
      <p>Dashboard works</p>
      <button onClick={openModal} className="add-donation-button">
        Add Donation
      </button>
      {isModalOpen ? (
  <Donations
    isOpen={isModalOpen}
    onClose={closeModal}
    onSubmit={handleDonationSubmit}
  >
    // Modal content here
  </Donations>
) : null}
    </>
  );
};

export default Dashboard;
