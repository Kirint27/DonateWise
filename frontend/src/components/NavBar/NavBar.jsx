import React from "react";
import styles from "./Navbar.module.scss";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const navigate = useNavigate();
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

  return (
    <>
      <nav>
      <div className={styles.navbar}>
             <img src={require('../../containers/Login/logo.jpg')} alt="" />
   <ul>
            <li onClick={() => navigate("/dashboard")}>Dashboard </li>
            <li onClick={() => navigate("/tax-reporting")}>Tax-Reporting </li>

            <li onClick={() => navigate("/CharitySearch")}>Charity-Search</li>
            <li className={styles.iconText}>
              <FontAwesomeIcon
                icon={faUser}
                style={{ fontSize: 20 }}
                title="Account"
              />
            </li>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </ul>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
