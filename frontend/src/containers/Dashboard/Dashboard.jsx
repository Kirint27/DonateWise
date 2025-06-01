import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.scss";
import Navbar from "../../components/NavBar/NavBar";
import Donations from "../../components/Donations";
import CustomProgressBar from "../../components/CustomProgressBar";
import Footer from "../../components/Footer";
const Dashboard = ({ user }) => {
  console.log("Cookie:", document.cookie);

  // Rest of the code...
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalAmount, setGoalAmount] = useState(0);
  const [donations, setDonations] = useState([]);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [causes, setCauses] = useState([]);
  const [log, setLog] = useState("");
  const [charityToShow, setCharityToShow] = useState(null);
  const [randomCharity, setRandomCharity] = useState(null);
  const charities = {
    "health-medical": [
      {
        name: "British Heart Foundation",
        description:
          "Funding research into heart and circulatory disease, and providing support to those affected.",
        logo: "https://www.bhf.org.uk/-/media/images/bhf-logo.png",
      },
      {
        name: "Cancer Research UK",
        description:
          "Funding research into cancer, and providing information and support to those affected.",
        logo: "https://www.cancerresearchuk.org/-/media/images/cruk-logo.png",
      },
      {
        name: "Great Ormond Street Hospital Charity",
        description:
          "Raising money to support the work of Great Ormond Street Hospital, a leading children's hospital in the UK.",
        logo: "https://www.gosh.org/-/media/images/gosh-logo.png",
      },
      {
        name: "Macmillan Cancer Support",
        description:
          "Providing emotional, financial, and practical support to people affected by cancer.",
        logo: "https://www.macmillan.org.uk/-/media/images/macmillan-logo.png",
      },
    ],
    "children-education": [
      {
        name: "Barnardo's",
        description:
          "Supporting vulnerable children and young people in the UK, through a range of services and programmes.",
        logo: "https://www.barnardos.org.uk/-/media/images/barnardos-logo.png",
      },
      {
        name: "Save the Children UK",
        description:
          "Working to promote children's rights and provide aid to children in need around the world.",
        logo: "https://www.savethechildren.org.uk/-/media/images/save-the-children-logo.png",
      },
      {
        name: "The Children's Society",
        description:
          "Working to support vulnerable children and young people in the UK, through a range of services and programmes.",
        logo: "https://www.childrenssociety.org.uk/-/media/images/the-childrens-society-logo.png",
      },
      {
        name: "NSPCC",
        description:
          "Working to prevent child abuse and neglect, and to support children and families in need.",
        logo: "https://www.nspcc.org.uk/-/media/images/nspcc-logo.png",
      },
    ],
    "animal-welfare": [
      {
        name: "RSPCA",
        description:
          "Working to prevent animal cruelty and promote animal welfare through advocacy and education.",
        logo: "https://www.rspca.org.uk/-/media/images/rspca-logo.png",
      },
      {
        name: "Blue Cross",
        description:
          "Providing care and support to animals in need, through a range of services and programmes.",
        logo: "https://www.bluecross.org.uk/-/media/images/blue-cross-logo.png",
      },
      {
        name: "PDSA",
        description:
          "Providing veterinary care and support to animals in need, through a range of services and programmes.",
        logo: "https://www.pdsa.org.uk/-/media/images/pdsa-logo.png",
      },
      {
        name: "Wood Green, The Animals Charity",
        description:
          "Providing care and support to animals in need, through a range of services and programmes.",
        logo: "https://www.woodgreen.org.uk/-/media/images/wood-green-logo.png",
      },
    ],
    "environment-sustainability": [
      {
        name: "The Wildlife Trusts",
        description:
          "Working to protect and preserve wildlife and wild places in the UK.",
      },
      {
        name: "Friends of the Earth",
        description:
          "Working to promote environmental protection and sustainability through advocacy and education.",
        logo: "https://www.foe.co.uk/-/media/images/foe-logo.png",
      },
      {
        name: "Greenpeace UK",
        description:
          "Working to promote environmental protection and sustainability through advocacy and direct action.",
        logo: "https://www.greenpeace.org.uk/-/media/images/greenpeace-logo.png",
      },
      {
        name: "The National Trust",
        description:
          "Working to protect and preserve historic sites and green spaces in the UK.",
        logo: "https://www.nationaltrust.org.uk/-/media/images/national-trust-logo.png",
      },
    ],
    "human-rights-social-justice": [
      {
        name: "Amnesty International UK",
        description:
          "Working to promote human rights and social justice through advocacy and education.",
        logo: "https://www.amnesty.org.uk/-/media/images/amnesty-logo.png",
      },
      {
        name: "Oxfam GB",
        description:
          "Working to overcome poverty and inequality through sustainable development and humanitarian response.",
        logo: "https://www.oxfam.org.uk/-/media/images/oxfam-logo.png",
      },
      {
        name: "Refugee Action",
        description:
          "Working to support refugees and asylum seekers in the UK, and to promote their rights and interests.",
        logo: "https://www.refugee-action.org.uk/-/media/images/refugee-action-logo.png",
      },
      {
        name: "Shelter",
        description:
          "Working to provide support and advocacy for people who are homeless or at risk of homelessness in the UK.",
        logo: "https://www.shelter.org.uk/-/media/images/shelter-logo.png",
      },
    ],
    "community-local": [
      {
        name: "Age UK",
        description:
          "Working to support older people in the UK, through a range of services and programmes.",
        logo: "https://www.ageuk.org.uk/-/media/images/age-uk-logo.png",
      },
      {
        name: "British Red Cross",
        description:
          "Providing humanitarian support and care to people in crisis, both in the UK and around the world.",
        logo: "https://www.redcross.org.uk/-/media/images/red-cross-logo.png",
      },
      {
        name: "Community Foundation Network",
        description:
          "Supporting community-led initiatives and projects across the UK, through a network of community foundations.",
        logo: "https://www.communityfoundation.org.uk/-/media/images/community-foundation-logo.png",
      },
      {
        name: "Volunteering Matters",
        description:
          "Working to promote volunteering and community engagement, and to support people who are disadvantaged or vulnerable.",
        logo: "https://www.volunteeringmatters.org.uk/-/media/images/volunteering-matters-logo.png",
      },
    ],
    "international-aid": [
      {
        name: "ActionAid UK",
        description:
          "Working to support people living in poverty and inequality around the world, through sustainable development and humanitarian response.",
        logo: "https://www.actionaid.org.uk/-/media/images/actionaid-logo.png",
      },
      {
        name: "CARE International UK",
        description:
          "Working to support people living in poverty and inequality around the world, through sustainable development and humanitarian response.",
        logo: "https://www.careinternational.org.uk/-/media/images/care-logo.png",
      },
      {
        name: "Christian Aid",
        description:
          "Working to support people living in poverty and inequality around the world, through sustainable development and humanitarian response.",
        logo: "https://www.christianaid.org.uk/-/media/images/christian-aid-logo.png",
      },
      {
        name: "Tearfund",
        description:
          "Working to support people living in poverty and inequality around the world, through sustainable development and humanitarian response.",
        logo: "https://www.tearfund.org/-/media/images/tearfund-logo.png",
      },
    ],
    "arts-culture": [
      {
        name: "Arts Council England",
        description:
          "Working to promote and support the arts in England, through funding and advocacy.",
        logo: "https://www.artscouncil.org.uk/-/media/images/arts-council-logo.png",
      },
      {
        name: "British Museum",
        description:
          "Working to promote and preserve the cultural heritage of the UK, through exhibitions and education.",
        logo: "https://www.britishmuseum.org/-/media/images/british-museum-logo.png",
      },
      {
        name: "National Theatre",
        description:
          "Working to promote and support the performing arts in the UK, through productions and education.",
        logo: "https://www.nationaltheatre.org.uk/-/media/images/national-theatre-logo.png",
      },
      {
        name: "Tate",
        description:
          "Working to promote and preserve the visual arts in the UK, through exhibitions and education.",
        logo: "https://www.tate.org.uk/-/media/images/tate-logo.png",
      },
    ],
  };
  const causeMapping = {
    health: "health-medical",
    children: "children-education",
    animal: "animal-welfare",
    "Environment/conservation/heritage": "environment-sustainability",
    humanRights: "human-rights-social-justice",
    community: "community-local",
    international: "international-aid",
    arts: "arts-culture",
  };

  useEffect(() => {
    const storedCharity = localStorage.getItem("featuredCharity");
    const charityGenerated = localStorage.getItem("charityGenerated");
    if (!storedCharity && !charityGenerated) {
      fetch(`${process.env.REACT_APP_API_URL}/api/donations/causes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Data:", data);

          if (data.length === 0) return;

          // Find the cause with the highest donation count
          const highestCountCause = data.reduce((max, current) => {
            return current.donation_count > max.donation_count ? current : max;
          }, data[0]);

          console.log("Cause with highest count:", highestCountCause);

          // Map the cause name to your internal key
          const causeKey =
            causeMapping[highestCountCause.charity_cause] ||
            highestCountCause.charity_cause;

          // Get the array of charities for that cause
          const charitiesForCause = charities[causeKey];

          if (charitiesForCause && charitiesForCause.length > 0) {
            // Pick a random charity
            const randomIndex = Math.floor(
              Math.random() * charitiesForCause.length
            );
            const randomCharity = charitiesForCause[randomIndex];
            localStorage.setItem(
              "featuredCharity",
              JSON.stringify(randomCharity)
            );
            localStorage.setItem("charityGenerated", "true");
            setCharityToShow(randomCharity);
          }
          setCauses([highestCountCause]);
          setLog(
            `Highest count cause: ${highestCountCause.charity_cause} (${highestCountCause.donation_count} donations)`
          );
        })
        .catch((error) => {
          console.error("Error fetching causes:", error);
        });
    } else {
      const storedCharity = JSON.parse(localStorage.getItem("featuredCharity"));
      setCharityToShow(storedCharity);
    }

    // Optional: set causes state or log
  }, []);
  console.log("causes", causes);
  console.log("Selected charity:", randomCharity);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/donations/recent-donations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Recent donations failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setDonations(data))
      .catch((error) =>
        console.error("Error fetching recent donations:", error)
      );

    fetch(`${process.env.REACT_APP_API_URL}/api/donations/goal-amount`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Goal amount failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setGoalAmount(parseFloat(data.goalAmount) || 0))
      .catch((error) => console.error("Error fetching goal amount:", error));

    fetch(`${process.env.REACT_APP_API_URL}/api/donations/current-amount`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Current amount failed: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setCurrentAmount(parseFloat(data.currentAmount) || 0))
      .catch((error) => console.error("Error fetching current amount:", error));
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDonationSubmit = (donationData) => {
    closeModal();
  };

  return (
    <div className={styles.dashboard}>
      <Navbar />
      <h2>Dashboard</h2>
      <div className={styles.buttonContainer}>
        <button
          onClick={openModal}
          className={styles.addDonation}
          aria-label="Add a new donation"
        >
          Add Donation
        </button>
      </div>
      {isModalOpen ? (
        <Donations
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleDonationSubmit}
        ></Donations>
      ) : null}
      <section style={{ marginBottom: "150px" }} className={styles.section}>
        <CustomProgressBar
          goalAmount={goalAmount}
          currentAmount={currentAmount ?? 0}
        />
      </section>

      {/* Recent Donations Section */}
      <section className={styles.section}>
        <h3>Recent Donations</h3>
        <ul className={styles.donationList}>
          {donations.length > 0 ? (
            donations.map((donation) => (
              <li className={styles.donationItem} key={donation.id}>
                <div className={styles.donationCard}>
                  <p className={styles.donationText}>
                    <span className={styles.amount}>
                      £{donation.donation_amount}
                    </span>{" "}
                    <br />
                    Donated to
                    <span className={styles.charityName}>
                      {" "}
                      {donation.charity_name}
                    </span>{" "}
                    on
                    <span className={styles.date}>
                      {" "}
                      {new Date(donation.donation_date).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p
              className={styles.noDonations}
              aria-label="No donations have been made yet"
            >
              No donations have been made yet.
            </p>
          )}
        </ul>
      </section>

      <section className={styles.showcase}>

        {donations.length > 0 ? (
          <div>
            {charityToShow && (
              <div className={styles.featuredCharity}>
                <h3>Featured Charity</h3>
                <h4>{charityToShow.name}</h4>
                {/* <img src={wildlifeLogo} alt={charityToShow.name} /> */}
                <p>{charityToShow.description}</p>
              </div>
            )}
          </div>
        ) : (
          <p
            className="noDonations"
            aria-label="Need at least one donation to be made to show the charity"
          >
            Need at least one donation to be made to show the charity.
          </p>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Dashboard;
