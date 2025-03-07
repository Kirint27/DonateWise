import React, { useState } from "react";
import styles from "./CharitySearch.module.scss";
import Navbar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";

const graphQl = "https://charitybase.uk/api/graphql";

const CharitySearch = () => {
  const [searchTerm, setSearchTerm] = useState(""); // For search term input (charity name or location)
  const [charities, setCharities] = useState([]); // Charity data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const fetchCharities = (search, skip = 0, charities = []) => {
    const query = `
      query CBWEB_LIST_CHARITIES($filters: FilterCHCInput!, $skip: Int, $sort: SortCHC) {
        CHC {
          getCharities(filters: $filters) {
            count
            list(limit: 30 skip: $skip, sort: $sort) {
              id
              names(all: true) {
                value
                primary
                __typename
              }
              activities
              geo {
                latitude
                longitude
                __typename
              }
              
              contact {
                social {
                  platform
                  handle
                  __typename
                }
                __typename
              }
              image {
                logo {
                  small
                  __typename
                }
                __typename
              }
              website
              __typename
            }
            __typename
          }
          __typename
        }
      }
    `;
    const variables = {
      filters: {
        search: search
      },
      skip: 0,
      sort: "default"
    };
  
    fetch("https://charitybase.uk/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Apikey c2fa6fe8-e9b9-421a-b9de-37f4a12275da	`
      },
      body: JSON.stringify({
        query,
        variables
      }),
    })
    .then(response => response.json())
    .then(result => {
      if (result.data?.CHC?.getCharities?.list.length > 0) {
        setCharities(result.data.CHC.getCharities.list);
      } else {
        console.warn("⚠️ No charities found for:", searchTerm);
        setCharities([]);
      }
    })
    .catch(err => {
      setError("Failed to fetch charities.");
    })
    .finally(() => {
      setLoading(false);
    });
  };


  // Handle Search Trigger
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (searchTerm && searchTerm.trim() !== '') {
      fetchCharities(searchTerm); // Pass search term
    } else {
      console.log('Please enter a search term');
    }
  };
  return (            <div className="main-wrapper">

     <Navbar />

    <h2>Find a Charity to Support</h2>

    <div className={styles.container}>
      <div className={styles.mainContent}>

        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by charity, cause, area..."
            className={styles.searchInput}
          />
          <button type="submit" disabled={loading} className={styles.searchButton}>
            Search
          </button>
        </form>
  
        {loading && <p className={styles.loading}>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}
  
        <div className={styles.resultsContainer}>
        {
            charities.map((charity) => (
              
              <div key={charity.id} className={styles.charityCard}>
<h3 className={styles.charityName}>{charity.names[0].value}</h3>                {charity.image?.logo?.small && (
                  <img
                    src={charity.image.logo.small}
                    alt={charity.names[0].value}
                    className={styles.charityLogo}
                  />
                )}
                <p className={styles.charityDescription}>{charity.activities}</p>
                <a href={charity.website} target="_blank" rel="noopener noreferrer">
                  <button className={styles.websiteButton}>Website</button>
                </a>
              </div>
            ))
        
          }
        </div>
      </div>
<Footer />
    </div>
    </div>
  );
};

export default CharitySearch;