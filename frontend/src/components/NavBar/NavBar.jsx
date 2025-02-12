import React from "react";
import styles from "./Navbar.module.scss";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
window.location.href = "/";
console.log("document.cookie:", document.cookie);
  };
  return (
    <>
      <nav>
        <div className={styles.navbar}>
        <img src="https://picsum.photos/seed/picsum200/300" alt="Logo" />
          <ul>
            <li>Dashboard </li>
            <li>Tax-Report </li>

            <li onClick={() => navigate("/CharitySearch")}>Charity-Search</li>
           <li className={styles.iconText}>
            <FontAwesomeIcon icon={faUser} style={{ fontSize: 20 }} title="Account" />

            </li>
            <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>

          </ul>
        </div>
      </nav>
    </>
  );
};
export default Navbar;