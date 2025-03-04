import React,{ useState} from "react";
import styles from "./Donations.module.scss";

const Donations = ({ isOpen, onClose, onSubmit}) => {
  const [charityName, setCharityName] = useState("");
  const [donationAmount, setDonationAmount] = useState("")
  const [donationType, setDonationType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");




  const handleSubmit = (event) => {
    event.preventDefault();
    
    const charityName = event.target.elements.charityName.value;
    const donationAmount = event.target.elements.donationAmount.value;
    const donationType = event.target.elements.donationType.value;
    const donationDate = event.target.elements.donationDate.value;
    const paymentMethod = event.target.elements.paymentMethod.value;
    const goFundMe =  event.target.elements["goFundMe"].checked ? 1 : 0;
   
    if (isNaN(donationAmount) || donationAmount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }
    const url = new URL("http://localhost:3001/api/donations"); // Adjust based on your backend
    const headers = { "Content-Type": "application/json"  };
    const body = JSON.stringify({
      charityName,
      donationAmount,
      donationType,
      paymentMethod,
      donationDate,
goFundMe
    });
  

fetch(url, { method: "POST", headers, body , credentials: "include" })
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
}

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
    <input name="goFundMe" type="checkbox" />Via GoFundME
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
