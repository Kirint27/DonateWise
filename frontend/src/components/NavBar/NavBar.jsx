import React, { useState } from "react";
import styles from "./Navbar.module.scss";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import logo from "../../containers/login/logo.jpg";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";

const Navbar = () => {
  const navigate = useNavigate();
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);

  const handleLogout = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/logout`, {
      method: "POST",
      credentials: "include", // ✅ Ensures cookies are included in the request
    })
      .then((response) => response.json())
      .then(() => {
        navigate("/");
      })
      .catch((error) => console.error("Logout error:", error));
  };
  const handleHamburgerClick = () => {
    setShowHamburgerMenu(!showHamburgerMenu);
  };
  return (
    <>
      <nav>
        <div className={styles.navbar}>
          <h3 style={{ fontSize: "25px" }} className="title">
            DonateWise
          </h3>
          <div className={styles.hamburger}>
            <div
              className={styles.hamburgerIcon}
              onClick={handleHamburgerClick}
            >
              <FontAwesomeIcon icon={faBars} size="lg" />
            </div>
            {showHamburgerMenu && (
              <ul className={styles.hamburgerList}>
                <li>
                  <a href="/dashboard">Dashboard</a>
                </li>
                <li>
                  <a href="/tax-reporting">Tax Reporting</a>
                </li>
                <li>
                  <a href="/charity-search">Charity Search</a>
                </li>
                <li>
                  <a href="/update-account">Account</a>
                </li>
                <li>
                  <button
                    className={styles.logoutButton}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
          <ul className={styles.navbarList}>
            <li onClick={() => navigate("/dashboard")}>Dashboard </li>
            <li onClick={() => navigate("/tax-reporting")}>Tax-Reporting </li>

            <li onClick={() => navigate("/CharitySearch")}>Charity-Search</li>
            <li className={styles.iconText}>
              <FontAwesomeIcon
                icon={faUser}
                style={{ fontSize: 20, cursor: "pointer" }}
                data-tooltip-id="account-tooltip"
                data-tooltip-content="Update your account information"
                onClick={() => navigate("/update-account")}
              />
              <Tooltip id="account-tooltip" place="top" />
            </li>
            <button
              className={`${styles.logoutButton}  ${styles.hamburgerButton}`}
              onClick={handleLogout}
            >
              Logout
            </button>
          </ul>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
