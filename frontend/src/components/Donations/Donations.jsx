import React,{ useState} from "react";
import styles from "./Donations.module.scss";

const Donations = ({ isOpen, onClose, onSubmit}) => {
  const [charityName, setCharityName] = useState("");
  const [donationAmount, setDonationAmount] = useState("")
  const [donationType, setDonationType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const API_KEY = process.env.REACT_APP_CHARITY_BASE_API_KEY;
  const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL;
  console.log(API_KEY, GRAPHQL_URL); // Check if the variables are correctly loaded

  const fetchCharityCauses = (charityName) => {
    const query = `
      query CBWEB_LIST_CHARITIES($filters: FilterCHCInput!, $skip: Int, $sort: SortCHC) {
        CHC {
          getCharities(filters: $filters) {
            count
            list(limit: 30 skip: $skip, sort: $sort) {
              id
              names {
                value
                primary
              }
              causes {
                id
                name
              }
            }
          }
        }
      }
    `;
    
    const variables = {
      filters: { search: charityName },
      skip: 0,
      sort: "default",
    };
    
    return fetch("https://charitybase.uk/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Apikey ${API_KEY}`, // API Key
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Debugging: print the entire data response to check causes
        console.log("GraphQL Response:", data);
  
        const charities = data?.data?.CHC?.getCharities?.list || [];
        const matchingCharities = charities.filter((charity) =>
          charity.names.some((name) =>
            name.value.toLowerCase().includes(charityName.toLowerCase())
          )
        );
  
        // Debugging: Check if we have matching charities
        console.log("Matching Charities:", matchingCharities);
  
        if (matchingCharities.length > 0) {
          // Debugging: print the causes for the matched charity
          console.log("Charity Causes:", matchingCharities[0].causes);
  
          return matchingCharities[0].causes.map((cause) => cause.name);
        } else {
          return [];
        }
      })
      .catch((error) => {
        console.error("Error fetching charity causes:", error);
        return [];
      });
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
  
    const charityName = event.target.elements.charityName.value;
    const donationAmount = event.target.elements.donationAmount.value;
    const donationType = event.target.elements.donationType.value;
    const donationDate = event.target.elements.donationDate.value;
    const paymentMethod = event.target.elements.paymentMethod.value;
    const giftAid = event.target.elements["giftAid"].checked ? 1 : 0;
  
    if (isNaN(donationAmount) || donationAmount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }
  
    fetchCharityCauses(charityName)
      .then((causes) => {
        // Ensure causes is an array and not a string
        const charityCauses = causes.length > 0 ? causes : []; // Default to empty array if no causes
  
        console.log("Causes to be submitted:", charityCauses); // Verify causes before submission
  
        const url = new URL("http://localhost:3001/api/donations");
        const headers = { "Content-Type": "application/json" };
        const body = JSON.stringify({
          charityName,
          donationAmount,
          donationType,
          paymentMethod,
          donationDate,
          giftAid,
          charity_cause: charityCauses, // Pass the causes as an array directly
        });
  
        return fetch(url, { method: "POST", headers, body, credentials: "include" });
      })
      .then((response) => {
        if (!response.ok) {
          if (response.headers.get('Content-Type').includes('application/json')) {
            return response.json().then((errorData) => {
              throw new Error(errorData.message || "Donation failed");
            });
          } else {
            throw new Error("Server error");
          }
        }
        return response.json();
      })
      .then((data) => {
        console.log("Donation successful:", data);
        onClose();
      })
      .catch((error) => {
        console.error("Error during donation process:", error);
        alert(error.message);
      });
  };
  
  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>Add Donation</h2>
          <form action="/" method="post" onSubmit={handleSubmit}>
  <label>Charity Name</label>
  <input name="charityName" type="text" />
  <label>Donation Amount (£)</label>
  <input name="donationAmount" type="number" />
  <label>Donation Date</label>
  <input name="donationDate" type="date" />
  <label>Donation Type</label>
  <select name="donationType">
    <option value="">Select Type</option>
    <option value="one-time">One-time</option>
    <option value="monthly">Monthly</option>
    <option value="annually">Annually</option>
  </select>
  <label>Payment Method (Optional)</label>
  <select name="paymentMethod">
    <option value="">Select Payment Method</option>
    <option value="credit-card">Credit Card</option>
    <option value="direct-debit">Direct Debit</option>
    <option value="bank-transfer">Bank Transfer</option>
    <option value="cash">Cash</option>
    <option value="other">Other</option>
  </select>

  <label>
    <input name="giftAid" type="checkbox" />Gift Aid
  </label>
  
  <div className="buttonGroup">
    <button type="submit">Add Donation</button>
    <button onClick={onClose} type="button">Cancel</button>
  </div>
</form>
        </div>
      </div>
    </>
  );
};

export default Donations;
