import React from "react";
import styles from "./Navbar.module.scss";
import logo from "./logo.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <>
      <nav>
        <div className={styles.navbar}>
         <img  alt="logo" />
          <ul>
            <li>Dashboard </li>
            <li>Tax-Report </li>

            <li>Charity-Search</li>
            <li className={styles.iconText}>
            <FontAwesomeIcon icon={faUser} style={{ fontSize: 20 }} title="Account" />
            </li>

          </ul>
        </div>
      </nav>
    </>
  );
};
export default Navbar;