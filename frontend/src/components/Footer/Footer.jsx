import React from "react";
import styles from "./Footer.module.scss";
import PrivacyPolicy from "../../containers/PrivacyPolicy";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
  
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <>
      <footer>
  <p className={styles.copyright}> Copyright by Kirin Thapar &#169; {getCurrentYear()}</p>
  <p className={styles.privacyPolicy} onClick={() => navigate("/privacy-policy")}>Privacy Policy</p>
</footer>
    </>
  );
};

export default Footer;
