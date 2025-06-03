import React, { useEffect } from "react";
import styles from "./UpdateAccount.module.scss";
import Footer from "../../components/Footer";
import Navbar from "../../components/NavBar";

const UpdateAccount = () => {
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}api/goals/goal-info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched goal info:", data);
      })
      .catch((error) => {
        console.error("Error fetching goal info:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formElements = e.target.elements;

    const causes = Array.from(formElements.causes || [])
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    const formData = {
      fullName: formElements.fullName.value.trim(),
      email: formElements.email.value.trim(),
      password: formElements.password.value,
      confirmPassword: formElements.confirmPassword.value,
      annualSalary: formElements.annualSalary.value,
      goalAmount: formElements.goalAmount?.value,
      location: formElements.location.value.trim(),
      causes,
    };

    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, v]) => v !== "" && v !== null && v !== undefined
      )
    );
    // Process the form data here
    fetch(`${process.env.REACT_APP_API_URL}/api/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filteredData),
      credentials: "include", // Include cookies in the request
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Update successful:", data);
        // Send a separate request to update the causes
        fetch(`${process.env.REACT_APP_API_URL}/api/update-causes`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ causes }),
          credentials: "include", // Include cookies in the request
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            console.log("Causes updated:", data);
            window.location.href = "/dashboard";
          })
          .catch((error) => {
            console.error("Error updating causes:", error);
          });
      })
      .catch((error) => {
        console.error("There was a problem with the update:", error);
      });
  };

  return (
    <div className={styles.updateAccount}>
      <Navbar />
      <h2>Update Account Information</h2>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label> Update Name</label>
          <input type="text" name="fullName" />

          <label> Update your Email</label>
          <input type="email" name="email" />

          <label> Change your Password</label>
          <input type="password" name="password" minLength="8" />

          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" minLength="8" />

          <label> Update your Annual Salary</label>
          <input type="number" name="annualSalary" />

          <label>Update Donation Goal</label>
          <input
            type="number"
            name="goalAmount"
            placeholder="Enter new donation amount (£)"
            min="1"
            pattern="[0-9]*"
          />

          <label>City you live in</label>
          <input type="text" name="location" />

          <p style={{ fontWeight: "bold", marginTop: "10px" }}>
            Update Causes You Care About:
          </p>
          <div className={styles.causesCheckbox}>
            {[
              ["health-medical", "Health & Medical"],
              ["children-education", "Children & Education"],
              ["animal-welfare", "Animal Welfare"],
              ["environment-sustainability", "Environment & Sustainability"],
              ["human-rights", "Human Rights & Social Justice"],
              ["community-local", "Community & Local Causes"],
              ["international-aid", "International Aid & Development"],
              ["arts-culture", "Arts, Culture & Heritage"],
            ].map(([value, label]) => (
              <label key={value} style={{ marginBottom: "10px" }}>
                <input
                  type="checkbox"
                  name="causes"
                  value={value}
                  style={{ marginRight: "8px" }}
                />
                {label}
              </label>
            ))}
          </div>

          <button type="submit">Save Changes</button>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default UpdateAccount;
