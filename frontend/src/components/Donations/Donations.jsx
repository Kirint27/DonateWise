import React,{ useState} from "react";
import styles from "./Donations.module.scss";

const Donations = ({ isOpen, onClose, onSubmit}) => {
  const [charityName, setCharityName] = useState("");
  const [donationAmount, setDonationAmount] = useState("")
  const [donationType, setDonationType] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [giftAid, setGiftAid] = useState(false);
  const [notes, setNotes] = useState("");
  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>Add Donation</h2>
          <form>
            <label>Charity Name</label>
            <input type="text" />
            <label>Donation Amount (£)</label>
            <input type="number" />
            <label>Donation Date</label>
            <input type="date" />
            <label>Donation Type</label>
            <select>
              <option value="">Select Type</option>
              <option value="one-time">One-time</option>
              <option value="monthly">Monthly</option>
              <option value="annually">Annually</option>
            </select>
            <label>Payment Method (Optional)</label>
            <select>
              <option value="">Select Payment Method</option>
              <option value="credit-card">Credit Card</option>
              <option value="direct-debit">Direct Debit</option>
              <option value="bank-transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="other">Other</option>
            </select>
            <label>
              <input type="checkbox" />I am eligible for Gift Aid (UK only)
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
