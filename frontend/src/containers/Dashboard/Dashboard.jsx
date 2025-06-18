import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.scss";
import Navbar from "../../components/NavBar/NavBar";
import Donations from "../../components/Donations";
import CustomProgressBar from "../../components/CustomProgressBar";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../../components/Footer";
import { Chart } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

const Dashboard = ({ user }) => {


  // Rest of the code...
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalAmount, setGoalAmount] = useState(0);
  const [donations, setDonations] = useState([]);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [causes, setCauses] = useState([]);
  const [log, setLog] = useState("");
  const [charityToShow, setCharityToShow] = useState(null);
  const [randomCharity, setRandomCharity] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breakdown, setBreakdown] = useState({});

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

    fetch(`http://localhost:3001/api/donations/goal-amount`, {
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

    fetch(`http://localhost:3001/api/donations/current-amount`, {
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
        setError(err.message);
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

  useEffect(() => {
    const canvases = document.querySelector(`.${styles.causesChart}`);
    let chart;

    if (canvases) {
      // Destroy any existing chart
      Chart.getChart(canvases)?.destroy();

      if (sortedCauses && sortedCauses.length > 0) {
        const totalAmount = sortedCauses.reduce(
          (acc, [, amount]) => acc + amount,
          0
        );
        const causesData = sortedCauses.map(([cause, amount]) => ({
          cause,
          percentage: (amount / totalAmount) * 100,
        }));

        chart = new Chart(canvases, {
          type: "pie",
          data: {
            labels: causesData.map(({ cause }) => cause),
            datasets: [
              {
                data: causesData.map(({ percentage }) => percentage),
                backgroundColor: [
                  "#8B9467", // a muted green, evoking growth and harmony
                  "#6495ED", // a soft blue, conveying trust and stability
                  "#F7DC6F", // a warm yellow, symbolizing hope and optimism
                  "#C9E4CA", // a pale green, representing nature and renewal
                  "#7A288A", // a deep purple, signifying luxury and creativity
                  "#FFC499", // a soft orange, conveying warmth and energy
                ],
                borderColor: [
                  "#f", // black border for contrast
              
                ],

                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  font: {
                    size: 14,
                  },
                  padding: 10,
                },
              },
              title: {
                display: true,
                text: ` Total Donations: ${totalAmount.toFixed(2)} `,
              font: {
                    size: 18,
                    weight: "bold",
                  
                },
                position: "top",
                padding: {
                    top: 10,
                    bottom: 30
                },
                padding: {
                    top: 10,
                    bottom: 40
                },
              },
              datalabels: {
                color: "#000",
                font: {
                  weight: "bold",
                  size: 14,
                },
                formatter: (value, context) => {
                  return `${value.toFixed(1)}%`;
                },
              },
            },
          },
        });
      }
    }
  }, [sortedCauses]);


  return (
    <div className={styles.dashboard}>
      <Navbar />
      <h2>Dashboard</h2>
      <div className={styles.buttonContainer}>
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
      <section className={styles.sectionCauses}>
        <h3> Your Donations by Cause (last 12 months)</h3>
        {loading ? (
          <p>Loading...</p>
        ) : donations.length > 0 &&
          (!sortedCauses || sortedCauses.length === 0) ? (
          <p>No causes recorded for your donations.</p>
        ) : donations.length === 0 ? (
          <p>No donations have been made yet.</p>
        ) : (
          <div className={styles.chartContainer}>
            <canvas className={styles.causesChart}></canvas>
          </div>
        )}
      </section>
      {/* Recent Donations Section */}
      <section className={styles.section}>
        <h3>Most Recent Donations</h3>
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
