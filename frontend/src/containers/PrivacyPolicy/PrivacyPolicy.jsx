import React from 'react';
import styles from './PrivacyPolicy.module.scss';
import Navbar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
      const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1); // This will navigate the user to the previous page
  };
  return (
    <>
    <Navbar/>  <button className={styles.backButton} onClick={handleGoBack}>
        ← Back to app
      </button> 
    <div className={styles.privacyPolicy}>
      <h1>Privacy Policy</h1>
         <section>
        <h2>1. Introduction</h2>
        <p>
          At CharityTrackr, we value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.
        </p>
      </section>
  
      <section>
        <h2>2. Information Collection and Use</h2>
        <p>
          We collect personal details such as your name, email, payment information, and usage data to provide and improve our services. This information helps us personalize your experience, process donations, and communicate with you.
        </p>
      </section>
  
      <section>
        <h2>3. Data Protection and Sharing</h2>
        <p>
          We implement security measures to protect your data. We may share your information with trusted service providers or as required by law.
        </p>
      </section>
  
      <section>
        <h2>4. Cookies and Third-Party Links</h2>
        <p>
          We use cookies to enhance your experience. Our app may contain links to third-party sites, and we are not responsible for their privacy practices.
        </p>
      </section>
  
      <section>
        <h2>5. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your information. You can also opt-out of marketing communications at any time.
        </p>
      </section>
  
      <section>
        <h2>6. Changes and Contact</h2>
        <p>
          We may update this policy periodically. For questions, contact us at <a href="mailto:contact@charitytrackr.com">contact@charitytrackr.com</a>.
        </p>
      </section>
    </div>
    </>
  );
  
};

export default PrivacyPolicy;
