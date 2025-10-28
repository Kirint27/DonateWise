import React, { useState, useEffect } from "react";
import styles from "./Charts.module.scss";
import { Chart } from "chart.js/auto";

import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

const Charts = ({ donations }) => {
  console.log("Donations prop:", donations);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [breakdown, setBreakdown] = useState({});

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

  const isSectionSmall =
    loading || donations.length === 0 || sortedCauses.length === 0;
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
    <div
      className={`${styles.sectionCauses} ${
        isSectionSmall ? styles.sectionSmall : ""
      }`}
    >
      <h3> Your Donations by Cause (last 12 months)</h3>
      {loading ? (
        <p>Loading...</p>
      ) : donations.length > 0 &&
        (!sortedCauses || sortedCauses.length === 0) ? (
        <p className={styles.noCauses}>No causes recorded for your donations.</p>
      ) : donations.length === 0 ? (
        <p className={styles.noCauses}>No donations have been made yet.</p>
      ) : (
        <div className={styles.chartContainer}>
          <canvas className={styles.causesChart}></canvas>
        </div>
      )}{" "}
    </div>
  );
};

export default Charts;
