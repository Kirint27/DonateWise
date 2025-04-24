import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.scss";
import Navbar from "../../components/NavBar/NavBar";
import Donations from "../../components/Donations";
import CustomProgressBar from "../../components/CustomProgressBar";
import Footer from "../../components/Footer";

const Dashboard = ({ user }) => {
  console.log("Cookie:", document.cookie);

  // Rest of the code...
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalAmount, setGoalAmount] = useState(0);
  const [donations, setDonations] = useState([]);
  const [currentAmount, setCurrentAmount] = useState(0);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/donations/recent-donations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Recent donations failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setDonations(data))
      .catch((error) =>
        console.error("Error fetching recent donations:", error)
      );
  
    fetch(`${process.env.REACT_APP_API_URL}/api/donations/goal-amount`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Goal amount failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setGoalAmount(parseFloat(data.goalAmount) || 0))
      .catch((error) =>
        console.error("Error fetching goal amount:", error)
      );
  
    fetch(`${process.env.REACT_APP_API_URL}/api/donations/current-amount`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Current amount failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setCurrentAmount(parseFloat(data.currentAmount) || 0))
      .catch((error) =>
        console.error("Error fetching current amount:", error)
      );
  }, []);
  
  
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDonationSubmit = (donationData) => {
    closeModal();
  };



  return (
    <div className={styles.dashboard}>
      <Navbar />
      <h2>Dashboard</h2>
      <button onClick={openModal} className={styles.addDonation}>
        Add Donation
      </button>
      {isModalOpen ? (
        <Donations
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleDonationSubmit}
        ></Donations>
      ) : null}
      <section className={styles.section} >
        <CustomProgressBar
          goalAmount={goalAmount}
          currentAmount={currentAmount ?? 0}
        />
      </section>

      {/* Recent Donations Section */}
      <section className={styles.section}>
        <h3>Recent Donations</h3>
        <ul className={styles.donationList}>
          {donations.map((donation) => (
            <li className={styles.donationItem} key={donation.id}>
              <div className={styles.donationCard}>
                <p className={styles.donationText}>
                  <span className={styles.amount}>
                    £{donation.donation_amount}
                  </span>{" "}
                  <br />
                  donated to
                  <span className={styles.charityName}>
                    {" "}
                    {donation.charity_name}
                  </span>{" "}
                  on
                  <span className={styles.date}>
                    {" "}
                    {new Date(donation.donation_date).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.showcase}>
        <h3> Charity Showcase</h3>
        <p>Coming soon...</p>
        <p>We're working on showcasing some amazing charities here.</p>
      </section>
      <Footer />
    </div>
  );
};

export default Dashboard;
