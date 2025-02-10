import React, { useState } from "react";
import styles from "./CharitySearch.module.scss";
import Navbar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";

const graphQl = "https://charitybase.uk/api/graphql";
export const fetchCharities = async (search, setCharities, setError, setLoading, skip = 0) => {
  setLoading(true);

  const query = `
    query CBWEB_LIST_CHARITIES($filters: FilterCHCInput!, $skip: Int, $sort: SortCHC) {
      CHC {
        getCharities(filters: $filters) {
          count
          list(limit: 30 skip: $skip, sort: "default") {
            id
            names { value primary }
            activities
            geo { latitude longitude }
            contact { social { platform handle } }
            image { logo { small } }
            website
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://charitybase.uk/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Apikey c2fa6fe8-e9b9-421a-b9de-37f4a12275da`
      },
      body: JSON.stringify({ query, variables: { filters: { search }, skip, sort: "default" } }),
    });

    const result = await response.json();

    if (result.data?.CHC?.getCharities?.list.length > 0) {
      // ✅ Transform response to match expected output
      const transformedData = result.data.CHC.getCharities.list.map((charity) => ({
        id: charity.id,
        name: charity.names?.find((n) => n.primary)?.value || charity.names[0]?.value || "Unknown",
        activities: charity.activities,
        location: {
          latitude: charity.geo?.latitude,
          longitude: charity.geo?.longitude,
        },
        social: charity.contact?.social || [],
        logo: charity.image?.logo?.small || "",
        website: charity.website || "",
      }));

      setCharities(transformedData);
      setError(null);
    } else {
      setCharities([]);
      setError("No charities found");
    }
  } catch (error) {
    setError("Failed to fetch charities.");
  } finally {
    setLoading(false);
  }
};


;
const CharitySearch = () => {
  const [searchTerm, setSearchTerm] = useState(""); // For search term input (charity name or location)
  const [charities, setCharities] = useState([]); // Charity data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state



  // Handle Search Trigger
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (searchTerm && searchTerm.trim() !== '') {
      fetchCharities(searchTerm); // Pass search term
    } else {
      console.log('Please enter a search term');
    }
  };
  return (      <div>      <Navbar />

    <h2>Find a Charity to Support</h2>

    <div className={styles.container}>
      <div className={styles.mainContent}>
        <h3>Search for a Charity</h3>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a charity"
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