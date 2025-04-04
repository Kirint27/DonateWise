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
        <p>Copyright by Kirin Thapar &#169; {getCurrentYear()}</p>

        <ul className={styles.links}>
          <li onClick={() => navigate("/privacy-policy")}>Privacy Policy</li>
        </ul>
      </footer>
    </>
  );
};

export default Footer;
