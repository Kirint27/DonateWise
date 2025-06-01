import React, { useEffect, useState } from "react";
import styles from "./TaxReporting.module.scss";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import jsPDF from "jspdf";
import "jspdf-autotable";

const getTaxYearBoundaries = () => {
  const today = new Date();
  const year = today.getFullYear();
  const taxYearStart = new Date(`${year}-04-06`);

  if (today < taxYearStart) {
    return {
      currentStart: new Date(`${year - 1}-04-06`),
      currentEnd: new Date(`${year}-04-05`),
      currentLabel: `${year - 1}-${year}`,
      previousStart: new Date(`${year - 2}-04-06`),
      previousEnd: new Date(`${year - 1}-04-05`),
      previousLabel: `${year - 2}-${year - 1}`,
    };
  } else {
    return {
      currentStart: new Date(`${year}-04-06`),
      currentEnd: new Date(`${year + 1}-04-05`),
      currentLabel: `${year}-${year + 1}`,
      previousStart: new Date(`${year - 1}-04-06`),
      previousEnd: new Date(`${year}-04-05`),
      previousLabel: `${year - 1}-${year}`,
    };
  }
};

const TaxReporting = () => {
  const [donations, setDonations] = useState([]);
  const [currentTaxYearDonations, setCurrentTaxYearDonations] = useState([]);
  const [previousTaxYearDonations, setPreviousTaxYearDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const {
    currentStart,
    currentEnd,
    previousStart,
    previousEnd,
    currentLabel,
    previousLabel,
  } = getTaxYearBoundaries();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/donations/all-donations`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setDonations(data);
        const current = data.filter((donation) => {
          const date = new Date(donation.date);
          return date >= currentStart && date <= currentEnd;
        });

        const previous = data.filter((donation) => {
          const date = new Date(donation.date);
          return date >= previousStart && date <= previousEnd;
        });

        setCurrentTaxYearDonations(current);
        setPreviousTaxYearDonations(previous);
        setIsLoading(false); // Set loading to false once data is fetched
      })
      .catch((err) => {
        console.error("Failed to fetch donations:", err);
        setIsLoading(false); // Stop loading even if there's an error
      });
  }, []);

  const generatePdf = (donations, yearLabel) => {
    const doc = new jsPDF();
    doc.text(`Donations for Tax Year ${yearLabel}`, 10, 10);

    const tableData = donations.map((d) => [
      d.charityName,
      d.date,
      `£${parseFloat(d.amount).toFixed(2)}`,
      d.paymentMethod,
      d.paymentStatus,
    ]);

    doc.autoTable({
      head: [["Charity Name", "Date", "Amount", "Payment", "Status"]],
      body: tableData,
      startY: 20,
    });

    doc.save(`donations-${yearLabel}.pdf`);
  };

  const renderDonationTable = (donations) => (
    <table>
      <thead>
        <tr>
          <th>Charity Name</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Payment</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {donations.map((donation, index) => (
          <tr key={index}>
            <td>{donation.charityName}</td>
            <td>{donation.date}</td>
            <td>£{parseFloat(donation.amount).toFixed(2)}</td>
            <td>{donation.paymentMethod}</td>
            <td>{donation.paymentStatus}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={styles.mainWrapper}>
      <Navbar />
      <h2>Donation History by Financial Year</h2>
  
 
      {isLoading ? (
        ""
      ) : (
        <>
        {console.log('donations:', donations)}

          {(currentTaxYearDonations.length === 0 && previousTaxYearDonations.length === 0) ? (
             <p className="noDonations">
No donations have been made yet.</p>
          ) : (
            <>
              {currentTaxYearDonations.length > 0 && (
                <div className={styles.section}>
                  <h3>Current Financial Year ({currentLabel})</h3>
                  <p className={styles.totalDonated}>
                    Total Donated: £
                    {currentTaxYearDonations
                      .reduce((sum, d) => sum + parseFloat(d.amount), 0)
                      .toFixed(2)}
                  </p>
                  <div className={styles.downloadContainer}>
                    <button
                      className={styles.downloadButton}
                      onClick={() => generatePdf(currentTaxYearDonations, currentLabel)}
                    >
                      Download PDF
                    </button>
                  </div>
                  {renderDonationTable(currentTaxYearDonations)}
                </div>
              )}
  
              {previousTaxYearDonations.length > 0 && (
                <div className={styles.previousTaxYear}>
                  <h3>Previous Financial Year ({previousLabel})</h3>
                  <p className={styles.totalDonated}>
                    Total Donated: £
                    {previousTaxYearDonations
                      .reduce((sum, d) => sum + parseFloat(d.amount), 0)
                      .toFixed(2)}
                  </p>
                  <div className={styles.downloadContainer}>
                    <button
                      className={styles.downloadButton}
                      onClick={() =>
                        generatePdf(previousTaxYearDonations, previousLabel)
                      }
                    >
                      Download PDF
                    </button>
                  </div>
                  {renderDonationTable(previousTaxYearDonations)}
                </div>
              )}
            </>
          )}
        </>
      )}
      <Footer />
    </div>
  );
};

export default TaxReporting;
