import React from "react";
import styles from "./TaxReporting.module.scss";
import Navbar from "../../components/NavBar";
const taxReporting = () => {
  return (
    <div className="main-wrapper">
        <Navbar/>

    <h2>Tax Reporting & Gift Aid Summary</h2>
    <p className={styles.info}>View and download your donation history for tax reporting and Gift Aid claims.</p>
    <ul>
      <li>Gift Aid amount:</li>
      <li>Potential tax relief:  </li>
    </ul>

   <div className={styles.downloadContainer}>
    <label for="download-options">Download: </label>
    <select className={styles.downloadOptions}>
        <option value="">Select an option</option>
        <option value="pdf">Download PDF</option>
        <option value="csv">Download CSV</option>
    </select>
    </div>    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Charity Name</th>
                <th>Amount</th>
                <th>Gift Aid</th>
                <th>Payment</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr >
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
 <div className={styles.taxRelief}>
<h4>How to claim Gift Aid tax relief</h4>
<a href="https://www.gov.uk/donating-to-charity/gift-aid">Learn More on the HMRC website</a>
 </div> 
   </div>

  );
};

export default taxReporting;
