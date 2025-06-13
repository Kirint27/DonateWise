import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.scss";
import Navbar from "../../components/NavBar/NavBar";
import Donations from "../../components/Donations";
import CustomProgressBar from "../../components/CustomProgressBar";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../../components/Footer";
const Dashboard = ({ user }) => {
  console.log("Cookie:", document.cookie);

  // Rest of the code...
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalAmount, setGoalAmount] = useState(0);
  const [donations, setDonations] = useState([]);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [causes, setCauses] = useState([]);
  const [log, setLog] = useState("");
  const [charityToShow, setCharityToShow] = useState(null);
  const [randomCharity, setRandomCharity] = useState(null);

  const [loading,setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breakdown, setBreakdown] = useState({});

  useEffect(() => {
    fetch("{process.env.REACT_APP_API_URL}/api/donations/recent-donations ", {
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

      fetch(`${process.env.REACT_APP_API_URL}/api/donations/recent-donations`, {
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
      .catch((error) => console.error("Error fetching goal amount:", error));

    fetch(`{process.env.REACT_APP_API_URL}api/donations/current-amount`, {
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
      .catch((error) => console.error("Error fetching current amount:", error));
  }, []);

  console.log('Current amount:', currentAmount);


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDonationSubmit = (donationData) => {
    closeModal();
  };




  useEffect(() => {
    console.log("Fetching breakdown data...");  
    fetch("{process.env.REACT_APP_API_URL}/api/donations/charity-causes/last-12-months", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch breakdown");
        }
        return res.json();
      })
      .then((data) => {
        setBreakdown(data.breakdown);
        
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const sortedCauses = Object.entries(breakdown)
  .map(([cause, amount]) => [cause, parseFloat(amount)])
  .sort((a, b) => b[1] - a[1]);

  console.log("Sorted causes:", sortedCauses);



  const totalDonations = donations.reduce((acc, donation) => acc + donation.donation_amount, 0);
  return (
    <div className={styles.dashboard}>
      <Navbar />
      <h2>Dashboard</h2>
      <div className={styles.buttonContainer}>
        <button
          onClick={openModal}
          className={styles.addDonation}
          aria-label="Add a new donation"
        >
          Add Donation
        </button>
      </div>
      {isModalOpen ? (
        <Donations
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleDonationSubmit}
        ></Donations>
      ) : null}
      <section  className={styles.section}>
        <CustomProgressBar
          goalAmount={goalAmount}
          currentAmount={currentAmount ?? 0}
        />
      </section>
      <section  className={styles.sectionCauses}>
  <h3> Your Donations by Cause (last 12 months)</h3>  
  {loading ? (
    <p>Loading...</p>
  ) : donations.length > 0 && (!sortedCauses || sortedCauses.length === 0) ? (
    <p>No causes recorded for your donations.</p>
  ) : donations.length === 0 ? (
    <p>No donations recorded.</p>
  ) : (
    <ul className={styles.causesList}>
      {sortedCauses.map(([cause, amount]) => (
        <li key={cause} className={styles.causeItem}>
          <span className={styles.causeName}>{cause}</span>
          <span className={styles.causeAmount}>£{amount.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  )}
</section>
      {/* Recent Donations Section */}
      <section className={styles.section}>
        <h3>Recent Donations</h3>
        <ul className={styles.donationList}>
          {donations.length > 0 ? (
            donations.map((donation) => (
              <li className={styles.donationItem} key={donation.id}>
                <div className={styles.donationCard}>
                  <p className={styles.donationText}>
                    <span className={styles.amount}>
                      £{donation.donation_amount}
                    </span>{" "}
                    <br />
                    Donated to
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
            ))
          ) : (
            <p
              className={styles.noDonations}
              aria-label="No donations have been made yet"
            >
              No donations have been made yet.
            </p>
          )}
        </ul>
      </section>

      <section className={styles.showcase}>

      <h3> Charity Showcase</h3>
        <p>Coming soon...</p>
        <p>AI-powered recommendations coming soon!</p>
      </section>
      <Footer />
    </div>
  );
};

export default Dashboard;
