import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.scss";
import Navbar from "../../components/NavBar/NavBar";
import Donations from "../../components/Donations";
import CustomProgressBar from "../../components/CustomProgressBar";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../../components/Footer";
import { useAuth } from "../Context/authContext";
import GoalPopup from "../../components/GoalPopup/GoalPopup";
import Chart from "../../components/Charts/Charts";
import TaxReporting from "../TaxReporting";


const Dashboard = ({ user }) => {
  const [goalAmount, setGoalAmount] = useState(0);
  const [donations, setDonations] = useState([]);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [causes, setCauses] = useState([]);
  const [breakdown, setBreakdown] = useState({});
  const [truelayerCheckDone, setTruelayerCheckDone] = useState(false);
  const [canShowSyncButton, setCanShowSyncButton] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [ isModalOpen, setIsModalOpen ] = useState(false);

  const [loading, setLoading] = useState(true);

  const { user: currentUser } = useAuth();

  const [salary, setSalary] = useState(0)
  useEffect(() => {
    setLoading(true);

    fetch("http://localhost:3001/api/donations/goal-amount", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((goalData) => {
        const needsGoal =
          goalData.needsGoal ||
          isNaN(goalData.goalAmount) ||
          goalData.goalAmount <= 0;

        if (needsGoal) {
          setShowGoalModal(true);
        }

        setGoalAmount(parseFloat(goalData.goalAmount));

        // Fetch current donation total
        return fetch("http://localhost:3001/api/donations/current-amount", {
          method: "GET",
          credentials: "include",
        });
      })
      .then((res) => res.json())
      .then((currentData) => {
        setCurrentAmount(parseFloat(currentData.currentAmount) || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching goal or current amount:", err);
        setLoading(false);
      });
  }, []);



  // Remove the duplicated goal/current amount fetch useEffect

  useEffect(() => {
    fetch("http://localhost:3001/api/donations/truelayer/status", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user info");
        return res.json();
      })
      .then((data) => {
        const { truelayer_connected, showModal } = data;

        // Only show modal if user is not connected or if showModal is true
        if (truelayer_connected && !showModal) {
          setCanShowSyncButton(false); // Don't show modal if connected and no need to show
        } else {
          setCanShowSyncButton(true); // Force modal to show if not connected or showModal is true
        }

        setTruelayerCheckDone(true);
      })
      .catch((err) => {
        console.error("Failed to check TrueLayer status:", err);
        setTruelayerCheckDone(true);
      });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:3001/api/donations/recent-donations`, {
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
  }, []);

  console.log("Current amount:", currentAmount);

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
    fetch(`http://localhost:3001/api/donations/charity-causes/last-12-months`, {
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

        setLoading(false);
      });
  }, []);

  const sortedCauses = Object.entries(breakdown)
    .map(([cause, amount]) => [cause, parseFloat(amount)])
    .sort((a, b) => b[1] - a[1]);

  console.log("Sorted causes:", sortedCauses);

  const totalDonations = donations.reduce(
    (acc, donation) => acc + donation.donation_amount,
    0
  );

  const isSectionSmall =
    loading || donations.length === 0 || sortedCauses.length === 0;



  const renderDonationType = (donation) => {
    return donation.donation_type ? (
      donation.donation_type === "donation" ? (
        <span>One-time</span>
      ) : donation.donation_type === "Monthly" ? (
        <span>Monthly</span>
      ) : (
        <span>
          {donation.donation_type.charAt(0).toUpperCase() +
            donation.donation_type.slice(1)}
        </span>
      )
    ) : (
      ""
    );
  };

  return (
    <div className="pageContainer">
      <Navbar renderDonationType={renderDonationType} />
      <h2>Dashboard</h2>

      {/* Goal Reset Modal */}
      <GoalPopup

  needsGoal={showGoalModal}
  showGoalModal={showGoalModal}
  setShowGoalModal={setShowGoalModal}
  setGoalAmount={setGoalAmount}
  salary={salary}
/>

      <div className={styles.buttonContainer}>
        {truelayerCheckDone && canShowSyncButton && (
          <button
            className={styles.addDonation}
            aria-label="Sync a previous donation"
          >
            🔄 Sync Donations from your Bank
          </button>
        )}

        <button
          onClick={openModal}
          className={styles.addDonation}
          aria-label="Add a previous donation"
        >
          Add a Previous Donation
        </button>
      </div>
      {isModalOpen ? (
        <Donations
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleDonationSubmit}
        ></Donations>
      ) : null}
      <section className={styles.section}>
        <CustomProgressBar
          goalAmount={goalAmount}
          currentAmount={currentAmount ?? 0}
        />
      </section>
      <section
        className={`${styles.sectionCauses} ${
          isSectionSmall ? styles.sectionSmall : ""
        }`}
      >
        <Chart sortedCauses={sortedCauses} donations={donations} />
      </section>
      {/* Recent Donations Section */}
      <section
        className={`${styles.section} ${
          donations.length === 0 ? styles.sectionSmall : ""
        }`}
      >
        <h3>Most Recent Donations</h3>

        {donations.length > 0 ? (
          <ul className={styles.donationList}>
            {donations.map((donation) => (
              <li className={styles.donationItem} key={donation.id}>
                <div className={styles.donationCard}>
                  <p className={styles.donationText}>
                    <span className={styles.amount}>
                      £{donation.donation_amount}
                    </span>{" "}
                    <br />
                    Donated by
                    <span className={styles.donorName}>
                      {" "}
                      {donation.donor_name}
                    </span>{" "}
                    to
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
                  <p className={styles.donationType}>
                    {" "}
                    Donation Type : {renderDonationType(donation)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p
            className={styles.noDonations}
            aria-label="No donations have been made yet"
            style={{ marginTop: "30px" }} // optional spacing
          >
            No donations have been made yet.
          </p>
        )}
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
