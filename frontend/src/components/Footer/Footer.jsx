import React from "react";
import styles from "./Footer.module.scss";

const Footer = () => {
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <>
      <footer>
        <p>Copyright by Kirin Thapar &#169; {getCurrentYear()}</p>


<ul>
  <li>Privacy Policy</li>
</ul>
    </footer>

    </>
  );
};

export default Footer;
